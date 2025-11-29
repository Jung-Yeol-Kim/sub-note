"use client";

/**
 * OCR Answer Sheet Importer Component
 * useChat hook을 사용한 스트리밍 기반 답안지 변환
 * 
 * 채팅 입력 없이 이미지만 업로드하는 AI chat interface
 */

import { useState } from "react";
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

    const handleFilesChange = (newFiles: File[]) => {
        setFiles(newFiles);
        setError("");
        setStatus("idle");
        setProgress(0);
        setDocument(null);
        setOcrText("");
        setWarnings([]);
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

            const formData = new FormData();
            files.forEach((file) => {
                formData.append("images", file);
            });

            console.log("[OcrImporter] Uploading", files.length, "files...");

            // Upload files to get URLs first
            setProgress(10);

            // Call OCR API with FormData
            const response = await fetch("/api/ocr-to-blocks", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: "변환 실패" }));
                throw new Error(errorData.error || "답안지 변환에 실패했습니다.");
            }

            // Read stream using AI SDK patterns
            if (!response.body) {
                throw new Error("응답 스트림을 읽을 수 없습니다.");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                    if (!line.trim() || line.startsWith(":")) continue;

                    try {
                        let jsonStr = line;
                        if (line.startsWith("data: ")) {
                            jsonStr = line.slice(6);
                        } else if (line.startsWith("0:")) {
                            jsonStr = line.slice(2);
                        }

                        const data = JSON.parse(jsonStr);

                        if (Array.isArray(data)) {
                            data.forEach(handleStreamPart);
                        } else {
                            handleStreamPart(data);
                        }
                    } catch (err) {
                        console.warn("[OcrImporter] Parse error:", err);
                    }
                }
            }

        } catch (err) {
            console.error("[OcrImporter] Error:", err);
            setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
            setStatus("error");
            setProgress(0);
        }
    };

    const handleStreamPart = (part: any) => {
        const type = part.type || part[0];
        const content = part.content || part[1];

        switch (type) {
            case "data-status":
            case 3: {
                if (content?.step) {
                    const { step, progress: progressValue } = content;

                    if (step === "upload") setStatus("uploading");
                    else if (step === "ocr") setStatus("ocr");
                    else if (step === "structuring") setStatus("structuring");
                    else if (step === "complete") setStatus("complete");

                    if (typeof progressValue === "number") {
                        setProgress(progressValue);
                    }
                }
                break;
            }

            case "data-metadata": {
                if (content) {
                    if (content.imageUrls) setImageUrls(content.imageUrls);
                    if (content.ocrText) setOcrText(content.ocrText);
                    if (content.warnings) setWarnings(content.warnings);
                }
                break;
            }

            case "data-error": {
                if (content?.message) {
                    setError(content.message);
                    setStatus("error");
                }
                break;
            }

            case "object-delta":
            case "object":
            case 4: {
                if (content) {
                    setDocument(content as AnswerSheetDocument);
                }
                break;
            }

            case "finish":
            case 2: {
                setStatus("complete");
                setProgress(100);
                break;
            }
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

    const isProcessing = ["uploading", "ocr", "structuring"].includes(status);
    const canConvert = files.length > 0 && status === "idle";
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
