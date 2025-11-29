"use client";

/**
 * Unified Answer Sheet Editor with AI Assistant
 *
 * 답안지 편집과 AI 어시스턴트를 통합한 인터페이스
 * - 왼쪽: 직접 작성 편집기 (기본 표시)
 * - 오른쪽: AI 대화형 어시스턴트 (현재 문서 상태와 함께 전송)
 * - AI-elements 컴포넌트 최대한 활용
 */

import { useState, useCallback, useEffect, useRef } from "react";
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

  // UI state
  const [isProcessing, setIsProcessing] = useState(false);

  // Track last processed message ID to avoid infinite loops
  const lastProcessedMessageIdRef = useRef<string | null>(null);

  // AI Chat - useChat with DefaultChatTransport
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ocr-chat",
      prepareSendMessagesRequest: ({ id, messages }) => {
        // Include current document state in the request
        return {
          body: {
            id,
            message: messages[messages.length - 1],
            context: {
              currentDocument: document,
              title: title,
            },
          },
        };
      },
    }),
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

  // Process messages in real-time to extract custom data
  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];

    // Skip if we've already processed this message
    if (lastMessage.id === lastProcessedMessageIdRef.current) {
      return;
    }

    console.log("[UnifiedEditor] Processing message:", lastMessage);

    // Mark this message as processed
    lastProcessedMessageIdRef.current = lastMessage.id;

    // Process custom data parts from message.parts
    if (lastMessage.role === "assistant" && lastMessage.parts) {
      // Extract tool results (NEW - tool-based approach)
      const toolResults = lastMessage.parts.filter(
        (part: any) => part.type === "tool-result" && part.toolName === "structure_answer_sheet"
      );

      if (toolResults.length > 0) {
        const toolResult = toolResults[0] as any;
        const doc = toolResult.result as AnswerSheetDocument;
        console.log("[UnifiedEditor] Document from tool-result:", doc);
        setDocument(doc);
        toast.success("답안지 구조화 완료", {
          description: `${doc.blocks.length}개 블록, ${doc.totalLines}줄 사용`,
        });
      } else {
        // Fallback: Check for old data-document or object parts (backward compatibility)
        const documentParts = lastMessage.parts.filter(
          (part: any) => part.type === "data-document" || part.type === "object"
        );
        if (documentParts.length > 0) {
          const doc = (documentParts[documentParts.length - 1] as any).data;
          console.log("[UnifiedEditor] Document from legacy format:", doc);
          setDocument(doc as AnswerSheetDocument);
          toast.success("답안지 업데이트 완료", {
            description: "왼쪽 편집기가 업데이트되었습니다.",
          });
        }
      }

      // Extract metadata (OCR stats, warnings)
      const metadataParts = lastMessage.parts.filter(
        (part: any) => part.type === "data-metadata"
      );
      if (metadataParts.length > 0) {
        const metadata = (metadataParts[metadataParts.length - 1] as any).data;
        if (metadata.imageUrls) setImageUrls(metadata.imageUrls);
        if (metadata.ocrText) setOcrText(metadata.ocrText);

        // Show OCR warnings if any
        if (metadata.warnings && metadata.warnings.length > 0) {
          toast.warning("OCR 경고", {
            description: metadata.warnings.join("\n"),
          });
        }
      }
    }
  }, [messages]);

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
      <div className="w-2/5 flex flex-col bg-white relative">
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
        <Conversation className="flex-1">
          <ConversationContent>
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
                    <MessageResponse>
                      {message.parts
                        ?.filter((part: any) => part.type === "text")
                        .map((part: any) => part.text)
                        .join("") || ""}
                    </MessageResponse>
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
