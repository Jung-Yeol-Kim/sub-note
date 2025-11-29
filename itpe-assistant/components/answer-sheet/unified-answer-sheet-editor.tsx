"use client";

/**
 * Unified Answer Sheet Editor with AI Assistant
 *
 * 답안지 편집과 AI 어시스턴트를 통합한 인터페이스
 * - 왼쪽: 직접 작성 편집기 (기본 표시)
 * - 오른쪽: AI 대화형 어시스턴트 (현재 문서 상태와 함께 전송)
 * - AI-elements 컴포넌트 최대한 활용
 */

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  ConversationEmptyState,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageAttachments,
  MessageAttachment,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputAttachments,
  PromptInputAttachment,
  PromptInputHeader,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionAddAttachments,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import type { AnswerSheetDocument } from "@/lib/types/answer-sheet-block";
import { validateImageFiles } from "@/lib/utils/vision-helper";
import { Sparkles, Layers, Save } from "lucide-react";
import { BLOCK_CONSTANTS } from "@/lib/types/answer-sheet-block";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { extractStructuredAnswerSheet } from "@/lib/utils/ai-message-parsers";
import { AnswerSheetArtifactCard } from "@/components/answer-sheet/answer-sheet-artifact-card";

// Dynamically import AnswerSheetEditor to avoid SSR issues
const AnswerSheetEditor = dynamic(
  () => import("@/components/answer-sheet/answer-sheet-editor").then((mod) => ({ default: mod.AnswerSheetEditor })),
  { ssr: false }
);

interface UnifiedAnswerSheetEditorProps {
  initialDocument?: AnswerSheetDocument | null;
  initialTitle?: string;
  onSave: (document: AnswerSheetDocument, imageUrls: string[], ocrText: string) => void;
}

const suggestions = [
  "이미지를 업로드해서 손글씨 답안지를 구조화해줘",
  "키워드를 추천해줘",
  "표 구조를 개선해줘",
  "정의 부분을 다듬어줘",
  "고려사항을 추가해줘",
];

export function UnifiedAnswerSheetEditor({
  initialDocument,
  initialTitle = "",
  onSave
}: UnifiedAnswerSheetEditorProps) {
  // Document state
  const [document, setDocument] = useState<AnswerSheetDocument | null>(initialDocument || null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [ocrText, setOcrText] = useState("");
  const [title, setTitle] = useState(initialTitle);
  const [artifactsByMessage, setArtifactsByMessage] = useState<Record<string, AnswerSheetDocument>>({});

  // UI state
  const [isProcessing, setIsProcessing] = useState(false);

  const lastMetadataMessageIdRef = useRef<Set<string>>(new Set());
  const lastProcessedMessageIdRef = useRef<string | null>(null);
  const artifactFingerprintsRef = useRef<Record<string, string>>({});
  const documentFingerprintRef = useRef<string | null>(
    initialDocument ? JSON.stringify(initialDocument) : null
  );
  const requestContextRef = useRef<{ document: AnswerSheetDocument | null; title: string }>({
    document,
    title,
  });

  useEffect(() => {
    requestContextRef.current = { document, title };
  }, [document, title]);

  // Stable transport and request payload builder to avoid re-renders creating new instances
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ocr-chat",
        prepareSendMessagesRequest: ({ id, messages }) => ({
          body: {
            id,
            message: messages[messages.length - 1],
            context: {
              currentDocument: requestContextRef.current.document,
              title: requestContextRef.current.title,
            },
          },
        }),
      }),
    []
  );

  // AI Chat - useChat with DefaultChatTransport
  const { messages, sendMessage, status } = useChat({
    transport,
    onFinish: (result) => {
      console.log("[UnifiedEditor] Chat finished:", result);
      setIsProcessing(false);
    },
    onError: (err) => {
      console.error("[UnifiedEditor] Chat error:", err);
      toast.error("AI 요청 실패", { description: err.message });
      setIsProcessing(false);
    },
  });

  // Process only the newest message to avoid repetitive state updates during streaming
  useEffect(() => {
    if (messages.length === 0) return;

    const latestMessage = messages[messages.length - 1] as any;

    if (latestMessage.id === lastProcessedMessageIdRef.current) {
      return;
    }

    lastProcessedMessageIdRef.current = latestMessage.id;

    let latestDocument: AnswerSheetDocument | null = null;
    const newArtifacts: Record<string, AnswerSheetDocument> = {};
    const metadataSeen = lastMetadataMessageIdRef.current;

    const structuredDoc = extractStructuredAnswerSheet(latestMessage as any);

    if (structuredDoc) {
      latestDocument = structuredDoc;
      const fingerprint = JSON.stringify(structuredDoc);

      if (artifactFingerprintsRef.current[latestMessage.id] !== fingerprint) {
        artifactFingerprintsRef.current[latestMessage.id] = fingerprint;
        newArtifacts[latestMessage.id] = structuredDoc;
        toast.success("답안지 구조화 완료", {
          description: `${structuredDoc.blocks.length}개 블록, ${structuredDoc.totalLines}줄 사용`,
        });
      }
    }

    // Extract metadata (OCR stats, warnings)
    if (latestMessage.role === "assistant" && Array.isArray(latestMessage.parts)) {
      for (const part of latestMessage.parts) {
        const metadataKey = part.toolCallId || latestMessage.id;
        if (part.type === "data-metadata" && metadataKey && !metadataSeen.has(metadataKey)) {
          const metadata = (part as any).data;
          if (metadata.imageUrls) setImageUrls(metadata.imageUrls);
          if (metadata.ocrText) setOcrText(metadata.ocrText);

          if (metadata.warnings && metadata.warnings.length > 0) {
            toast.warning("OCR 경고", {
              description: metadata.warnings.join("\n"),
            });
          }

          metadataSeen.add(metadataKey);
        }
      }
    }

    if (Object.keys(newArtifacts).length > 0) {
      setArtifactsByMessage((prev) => ({ ...prev, ...newArtifacts }));
    }

    if (latestDocument) {
      const nextFingerprint = JSON.stringify(latestDocument);
      if (nextFingerprint !== documentFingerprintRef.current) {
        documentFingerprintRef.current = nextFingerprint;
        setDocument(latestDocument);
      }
    }
  }, [messages]);

  useEffect(() => {
    documentFingerprintRef.current = document ? JSON.stringify(document) : null;
  }, [document]);

  // Handle image upload
  const handleImageUpload = async (files: File[]) => {
    if (files.length === 0) return;

    // Validate files
    const validation = validateImageFiles(files);
    if (!validation.isValid) {
      toast.error("파일 검증 실패", {
        description: validation.errors.join("\n"),
      });
      return;
    }

    try {
      setIsProcessing(true);
      console.log("[UnifiedEditor] Uploading files...");

      // Upload files to get URLs
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const uploadResponse = await fetch("/api/upload-files", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("파일 업로드에 실패했습니다.");
      }

      const { urls } = await uploadResponse.json();
      console.log("[UnifiedEditor] Uploaded URLs:", urls);
      setImageUrls(urls);

      // Send to AI with images
      sendMessage({
        role: "user",
        parts: [
          ...urls.map((url: string) => ({
            type: "file" as const,
            mediaType: "image/jpeg",
            url,
          })),
          {
            type: "text" as const,
            text: "이미지를 분석하고 답안지를 구조화해주세요",
          },
        ],
      });

      toast.success("이미지 업로드 완료", {
        description: `${files.length}개 파일 업로드 완료`,
      });
    } catch (err) {
      console.error("[UnifiedEditor] Error:", err);
      toast.error("업로드 실패", {
        description: err instanceof Error ? err.message : "알 수 없는 오류",
      });
      setIsProcessing(false);
    }
  };

  // Handle AI prompt submission
  const handleAIPromptSubmit = useCallback(
    async (message: PromptInputMessage) => {
      const hasText = Boolean(message.text);
      const hasAttachments = Boolean(message.files?.length);

      if (!(hasText || hasAttachments)) {
        return;
      }

      // If files are attached, upload them first
      if (message.files?.length) {
        const fileList: File[] = [];
        for (const filePart of message.files) {
          if (filePart.url && filePart.url.startsWith("data:")) {
            const response = await fetch(filePart.url);
            const blob = await response.blob();
            const file = new File([blob], filePart.filename || "image.jpg", {
              type: filePart.mediaType,
            });
            fileList.push(file);
          }
        }

        if (fileList.length > 0) {
          await handleImageUpload(fileList);
          return;
        }
      }

      // Regular AI chat (text only)
      if (hasText && message.text) {
        sendMessage({
          role: "user",
          parts: [
            {
              type: "text" as const,
              text: message.text,
            },
          ],
        });
      }
    },
    [sendMessage, handleImageUpload]
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      sendMessage({
        role: "user",
        parts: [
          {
            type: "text" as const,
            text: suggestion,
          },
        ],
      });
    },
    [sendMessage]
  );

  const handleDocumentChange = useCallback((updatedDocument: AnswerSheetDocument) => {
    setDocument(updatedDocument);
  }, []);

  const handleSave = useCallback(() => {
    if (document) {
      onSave(document, imageUrls, ocrText);
    }
  }, [document, imageUrls, ocrText, onSave]);

  // Calculate stats
  const totalLines = document?.totalLines || 0;
  const maxLines = BLOCK_CONSTANTS.MAX_LINES;
  const lineProgress = (totalLines / maxLines) * 100;
  const canSave = document !== null && document.metadata.isValid;

  return (
    <div className="flex h-full bg-[#fcfaf7]">
      {/* Left Panel: Answer Sheet Editor */}
      <div className="w-3/5 flex flex-col border-r border-[#3d5a4c]/20">
        {/* Header */}
        <div className="flex-none px-6 py-4 border-b border-[#3d5a4c]/20 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="답안지 제목을 입력하세요"
                className="w-full text-xl font-semibold text-[#3d5a4c] bg-transparent border-none outline-none placeholder:text-muted-foreground"
              />
            </div>
            <Button
              onClick={handleSave}
              disabled={!canSave}
              className="bg-[#3d5a4c] hover:bg-[#2d4a3c]"
            >
              <Save className="mr-2 h-4 w-4" />
              저장하기
            </Button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex-none px-6 py-2 bg-[#3d5a4c]/5 border-b border-[#3d5a4c]/10">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#3d5a4c]" />
              <span className="text-muted-foreground">줄 수:</span>
              <Badge
                variant="outline"
                className={`${
                  totalLines > maxLines
                    ? "border-red-500 text-red-600"
                    : totalLines > maxLines * 0.9
                    ? "border-[#c49a6c] text-[#c49a6c]"
                    : "border-[#3d5a4c] text-[#3d5a4c]"
                }`}
              >
                {totalLines} / {maxLines}
              </Badge>
            </div>
            <div className="flex-1 h-2 bg-[#3d5a4c]/10 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  totalLines > maxLines
                    ? "bg-red-500"
                    : totalLines > maxLines * 0.9
                    ? "bg-[#c49a6c]"
                    : "bg-[#3d5a4c]"
                }`}
                style={{ width: `${Math.min(lineProgress, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Answer Sheet Editor - Always visible */}
          <div className="border rounded-lg bg-white p-6">
            <AnswerSheetEditor
              initialDocument={document || undefined}
              onChange={handleDocumentChange}
            />
          </div>
        </div>
      </div>

      {/* Right Panel: AI Assistant */}
      <div className="w-2/5 flex flex-col bg-white relative overflow-hidden">
        {/* Header */}
        <div className="flex-none px-6 py-4 border-b border-[#3d5a4c]/20">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#c49a6c]" />
            <h2 className="text-lg font-semibold text-[#3d5a4c]">AI 어시스턴트</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            답안지 작성을 도와드립니다
          </p>
        </div>

        {/* Conversation Area */}
        <Conversation className="flex-1 overflow-hidden">
          <ConversationContent className="p-0 gap-6">
            {messages.length === 0 ? (
              <ConversationEmptyState
                title="AI 어시스턴트와 함께 작성하세요"
                description=""
                icon={<Sparkles className="h-12 w-12 text-[#c49a6c]/40" />}
              >
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2 text-left">
                    <h3 className="font-semibold text-sm text-[#3d5a4c]">💡 활용 방법</h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-[#c49a6c]">📸</span>
                        <span>손글씨 답안지 이미지를 업로드하면 자동으로 구조화해드립니다</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#c49a6c]">💬</span>
                        <span>&quot;키워드 추천해줘&quot;, &quot;표 구조 개선해줘&quot; 등 자연어로 요청하세요</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#c49a6c]">✏️</span>
                        <span>AI 제안을 바탕으로 왼쪽 편집기에서 직접 수정할 수 있습니다</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-4 border-t border-[#3d5a4c]/10">
                    <p className="text-xs text-muted-foreground">
                      💡 Tip: 현재 작성 중인 답안지 상태가 AI에게 자동으로 전달됩니다
                    </p>
                  </div>
                </div>
              </ConversationEmptyState>
            ) : (
              messages.map((message) => (
                <Message key={message.id} from={message.role}>
                  {/* Attachments for user messages */}
                  {message.role === "user" && message.parts && (
                    <MessageAttachments>
                      {message.parts
                        .filter((part: any) => part.type === "file")
                        .map((part: any, idx: number) => (
                          <MessageAttachment key={idx} data={part} />
                        ))}
                    </MessageAttachments>
                  )}

                  {/* Message content */}
                  <MessageContent>
                    {(message.parts?.filter((part: any) => part.type === "data-status") || []).map(
                      (part: any, index: number) => (
                        <div
                          key={`${message.id}-status-${index}`}
                          className="flex items-center gap-2 rounded-md bg-[#3d5a4c]/5 px-3 py-2 text-xs text-[#3d5a4c]"
                        >
                          <span className="font-semibold">
                            {part.data?.step === "ocr" ? "OCR" : "AI"} 진행 중
                          </span>
                          <span className="text-muted-foreground">{part.data?.message}</span>
                        </div>
                      )
                    )}

                    {(message.parts?.filter((part: any) => part.type === "text")?.length ||
                      typeof (message as any).content === "string") && (
                      <MessageResponse>
                        {message.parts
                          ?.filter((part: any) => part.type === "text")
                          .map((part: any) => part.text)
                          .join("") || (message as any).content || ""}
                      </MessageResponse>
                    )}

                    {message.role === "assistant" &&
                      (message.parts?.filter(
                        (part: any) => part.type === "tool-structure_answer_sheet"
                      ) || []).map((part: any, index: number) => {
                        switch (part.state) {
                          case "input-streaming":
                            return (
                              <div
                                key={`${message.id}-tool-${index}`}
                                className="rounded-md bg-[#f5f0e9] px-3 py-2 text-sm text-muted-foreground"
                              >
                                이미지와 OCR 텍스트를 분석 중입니다...
                              </div>
                            );
                          case "input-available":
                            return (
                              <div
                                key={`${message.id}-tool-${index}`}
                                className="rounded-md bg-[#f5f0e9] px-3 py-2 text-sm text-muted-foreground"
                              >
                                구조화 요청을 준비하고 있습니다...
                              </div>
                            );
                          case "output-error":
                            return (
                              <div
                                key={`${message.id}-tool-${index}`}
                                className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800"
                              >
                                구조화 도구 실행 중 오류가 발생했습니다: {part.errorText}
                              </div>
                            );
                          case "output-available": {
                            const doc = (part as any).output as AnswerSheetDocument;
                            return (
                              <AnswerSheetArtifactCard
                                key={`${message.id}-tool-${index}`}
                                document={doc}
                                onApply={(appliedDoc) => {
                                  setDocument(appliedDoc);
                                  toast.success("편집기에 적용했습니다", {
                                    description: `${appliedDoc.blocks.length}개 블록, ${appliedDoc.totalLines}줄 사용`,
                                  });
                                }}
                                title="AI가 구조화한 답안지"
                                description="아래 구조를 바로 편집기에 반영할 수 있습니다."
                              />
                            );
                          }
                          default:
                            return null;
                        }
                      })}

                    {message.role === "assistant" &&
                      !message.parts?.some((part: any) => part.type === "tool-structure_answer_sheet") &&
                      artifactsByMessage[message.id] && (
                        <AnswerSheetArtifactCard
                          document={artifactsByMessage[message.id]}
                          onApply={(doc) => {
                            setDocument(doc);
                            toast.success("편집기에 적용했습니다", {
                              description: `${doc.blocks.length}개 블록, ${doc.totalLines}줄 사용`,
                            });
                          }}
                        />
                      )}
                  </MessageContent>
                </Message>
              ))
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* Suggestions */}
        {messages.length === 0 && (
          <div className="flex-none px-4 py-3 border-t border-[#3d5a4c]/20">
            <Suggestions>
              {suggestions.map((suggestion) => (
                <Suggestion
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  suggestion={suggestion}
                />
              ))}
            </Suggestions>
          </div>
        )}

        {/* Prompt Input */}
        <div className="flex-none px-4 pb-4 border-t border-[#3d5a4c]/20">
          <PromptInput
            accept="image/*"
            multiple
            maxFiles={10}
            maxFileSize={5 * 1024 * 1024}
            onSubmit={handleAIPromptSubmit}
            onError={(err) => toast.error("파일 에러", { description: err.message })}
          >
            <PromptInputHeader>
              <PromptInputAttachments>
                {(attachment) => <PromptInputAttachment data={attachment} />}
              </PromptInputAttachments>
            </PromptInputHeader>
            <PromptInputBody>
              <PromptInputTextarea
                placeholder="AI에게 질문하세요... (예: 키워드 추천해줘, 이미지 분석해줘)"
                disabled={status === "streaming" || isProcessing}
              />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments label="이미지 추가" />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
              <PromptInputSubmit
                status={status}
                disabled={status === "streaming" || isProcessing}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}
