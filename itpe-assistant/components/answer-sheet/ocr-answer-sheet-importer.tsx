"use client";

/**
 * OCR Answer Sheet Importer Component
 * useChat hook을 사용한 스트리밍 기반 답안지 변환
 * 
 * 채팅 입력 없이 이미지만 업로드하는 AI chat interface로 구현
 */

import { useState, useEffect, useRef } from "react";
import { AlertCircle, FileImage, Loader2, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadTrigger,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemProgress,
  FileUploadItemDelete,
} from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { AnswerSheetDocument } from "@/lib/types/answer-sheet-block";
import { validateImageFiles } from "@/lib/utils/vision-helper";
import dynamic from "next/dynamic";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

// Dynamically import AnswerSheetEditor to avoid SSR issues
const AnswerSheetEditor = dynamic(
  () => import("@/components/answer-sheet/answer-sheet-editor").then((mod) => ({ default: mod.AnswerSheetEditor })),
  { ssr: false }
);

type ProcessingStatus = "idle" | "uploading" | "ocr" | "structuring" | "complete" | "error";

interface OcrAnswerSheetImporterProps {
  onComplete: (document: AnswerSheetDocument, imageUrls: string[], ocrText: string) => void;
}

export function OcrAnswerSheetImporter({ onComplete }: OcrAnswerSheetImporterProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [ocrText, setOcrText] = useState("");
  const [document, setDocument] = useState<AnswerSheetDocument | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [warnings, setWarnings] = useState<string[]>([]);
  const [ocrPreviewOpen, setOcrPreviewOpen] = useState(false);

  // useChat hook for handling AI streaming (latest API)
  const { messages, sendMessage, status: chatStatus } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ocr-chat",
    }),
    onFinish: () => {
      console.log("[OcrImporter] Chat finished");
      setStatus("complete");
      setProgress(100);
    },
    onError: (err) => {
      console.error("[OcrImporter] Chat error:", err);
      setError(err.message);
      setStatus("error");
    },
  });

  // Track last processed message ID to avoid infinite loops
  const lastProcessedMessageIdRef = useRef<string | null>(null);

  // Process messages to extract custom data and structured document
  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];

    // Skip if we've already processed this message
    if (lastMessage.id === lastProcessedMessageIdRef.current) {
      return;
    }

    console.log("[OcrImporter] Message update:", lastMessage);

    // Mark this message as processed
    lastProcessedMessageIdRef.current = lastMessage.id;

    // Process custom data parts from message.parts
    if (lastMessage.role === "assistant" && lastMessage.parts) {
      // Extract status updates
      const statusParts = lastMessage.parts.filter(
        (part: any) => part.type === "data-status"
      );
      if (statusParts.length > 0) {
        const latestStatus = statusParts[statusParts.length - 1] as any;
        const { step, progress: progressValue } = latestStatus.data || latestStatus;

        if (step === "upload") setStatus("uploading");
        else if (step === "ocr") setStatus("ocr");
        else if (step === "structuring") setStatus("structuring");
        else if (step === "complete") setStatus("complete");

        if (typeof progressValue === "number") {
          setProgress(progressValue);
        }
      }

      // Extract metadata
      const metadataParts = lastMessage.parts.filter(
        (part: any) => part.type === "data-metadata"
      );
      if (metadataParts.length > 0) {
        const metadata = (metadataParts[metadataParts.length - 1] as any).data;

        if (metadata.imageUrls) setImageUrls(metadata.imageUrls);
        if (metadata.ocrText) setOcrText(metadata.ocrText);
        if (metadata.warnings) setWarnings(metadata.warnings);
      }

      // Extract errors
      const errorParts = lastMessage.parts.filter(
        (part: any) => part.type === "data-error"
      );
      if (errorParts.length > 0) {
        const errorData = (errorParts[errorParts.length - 1] as any).data;
        if (errorData.message) {
          setError(errorData.message);
          setStatus("error");
        }
      }

      // Extract structured document (object output)
      const objectParts = lastMessage.parts.filter(
        (part: any) => part.type === "object"
      );
      if (objectParts.length > 0) {
        const doc = (objectParts[objectParts.length - 1] as any).data;
        setDocument(doc as AnswerSheetDocument);
        console.log("[OcrImporter] Document updated:", doc);
      }
    }
  }, [messages]);

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
    setError("");
    setStatus("idle");
    setProgress(0);
    setDocument(null);
    setOcrText("");
    setWarnings([]);
    setImageUrls([]);
  };

  const handleStartConversion = async () => {
    if (files.length === 0) {
      setError("이미지를 먼저 선택해주세요.");
      return;
    }

    // Validate files
    const validation = validateImageFiles(files);
    if (!validation.isValid) {
      setError(validation.errors.join("\n"));
      setStatus("error");
      return;
    }

    try {
      setError("");
      setProgress(0);
      setStatus("uploading");

      console.log("[OcrImporter] Uploading files...");

      // Step 1: Upload files to get URLs
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

      console.log("[OcrImporter] Uploaded URLs:", urls);

      setImageUrls(urls);
      setProgress(10);

      // Step 2: Send to OCR chat API using parts format
      sendMessage({
        role: "user",
        parts: [
          // Add image URLs as file parts
          ...urls.map((url: string) => ({
            type: "file" as const,
            mediaType: "image/jpeg",
            url,
          })),
          // Add text instruction
          {
            type: "text" as const,
            text: "답안지를 분석하고 구조화해주세요",
          },
        ],
      });

    } catch (err) {
      console.error("[OcrImporter] Error:", err);
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      setStatus("error");
      setProgress(0);
    }
  };

  const handleSave = () => {
    if (document && imageUrls.length > 0) {
      onComplete(document, imageUrls, ocrText);
    }
  };

  const handleDocumentChange = (updatedDocument: AnswerSheetDocument) => {
    setDocument(updatedDocument);
  };

  const isProcessing = chatStatus === "streaming" || ["uploading", "ocr", "structuring"].includes(status);
  const canConvert = files.length > 0 && status === "idle" && chatStatus !== "streaming";
  const canSave = status === "complete" && document !== null;

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>이미지 업로드</CardTitle>
          <CardDescription>
            손글씨 답안지 사진을 업로드하세요 (JPG/PNG, 최대 10개, 각 5MB 이하)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload
            value={files}
            onValueChange={handleFilesChange}
            accept="image/jpeg,image/jpg,image/png"
            maxFiles={10}
            maxSize={5 * 1024 * 1024}
            multiple
            disabled={isProcessing}
          >
            <FileUploadDropzone className="min-h-[200px]">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <FileImage className="h-12 w-12" />
                <p className="text-sm">이미지를 드래그하거나 클릭하여 선택</p>
                <FileUploadTrigger asChild>
                  <Button variant="outline" size="sm" disabled={isProcessing}>
                    파일 선택
                  </Button>
                </FileUploadTrigger>
              </div>
            </FileUploadDropzone>

            {files.length > 0 && (
              <FileUploadList>
                {files.map((file) => (
                  <FileUploadItem key={file.name} value={file}>
                    <FileUploadItemPreview />
                    <FileUploadItemMetadata />
                    <FileUploadItemProgress />
                    {!isProcessing && <FileUploadItemDelete />}
                  </FileUploadItem>
                ))}
              </FileUploadList>
            )}
          </FileUpload>

          <div className="mt-4 flex gap-2">
            <Button
              onClick={handleStartConversion}
              disabled={!canConvert}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  변환 중...
                </>
              ) : (
                "변환 시작"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Processing Progress */}
      {isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle>처리 진행 상황</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progress} />
            <div className="text-sm text-muted-foreground">
              {status === "uploading" && "이미지 업로드 중..."}
              {status === "ocr" && "OCR 텍스트 추출 중..."}
              {status === "structuring" && "구조화 중... (AI 분석)"}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
        </Alert>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc pl-4 space-y-1">
              {warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* OCR Text Preview */}
      {status === "complete" && ocrText && (
        <Card>
          <Collapsible open={ocrPreviewOpen} onOpenChange={setOcrPreviewOpen}>
            <CardHeader>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 hover:bg-transparent">
                  <CardTitle>OCR 추출 텍스트</CardTitle>
                  {ocrPreviewOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CardDescription>
                원본 텍스트를 확인하고 필요시 수동으로 수정할 수 있습니다
              </CardDescription>
            </CardHeader>
            <CollapsibleContent>
              <CardContent>
                <pre className="whitespace-pre-wrap rounded-md bg-muted p-4 text-sm font-mono max-h-96 overflow-y-auto">
                  {ocrText}
                </pre>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}

      {/* Structured Document Preview */}
      {status === "complete" && document && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  변환 완료
                </CardTitle>
                <CardDescription>
                  답안지가 구조화되었습니다. 수정 후 저장해주세요.
                </CardDescription>
              </div>
              <Button onClick={handleSave} disabled={!canSave}>
                저장하기
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Answer Sheet Editor */}
            <div className="border rounded-lg p-4">
              <AnswerSheetEditor
                initialDocument={document}
                onChange={handleDocumentChange}
              />
            </div>

            {/* Metadata Summary */}
            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                총 {document.blocks.length}개 블록, {document.totalLines}줄
              </p>
              {document.metadata.validationErrors.length > 0 && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc pl-4">
                      {document.metadata.validationErrors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
