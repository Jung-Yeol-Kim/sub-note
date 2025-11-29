/**
 * OCR to Blocks Chat API
 * useChat hook과 호환되는 채팅 API 형식
 * 
 * 이미지 URL을 받아 OCR + 구조화 수행
 */

import { anthropic } from "@ai-sdk/anthropic";
import {
    streamText,
    generateObject,
    createUIMessageStream,
    createUIMessageStreamResponse,
} from "ai";
import { z } from "zod";
import {
    AnswerSheetDocumentSchema,
    UpstageOCRResponseSchema,
} from "@/lib/schemas/ocr-schemas";
import {
    mergeOCRTexts,
    calculateOCRConfidence,
} from "@/lib/utils/vision-helper";
import {
    OCR_STRUCTURING_SYSTEM_PROMPT,
    createOCRStructuringPrompt,
    OCR_STRUCTURING_TEMPERATURE,
    RECOMMENDED_MODELS,
} from "@/lib/prompts/ocr-structuring-prompt";

export const runtime = "edge";
export const maxDuration = 60;

/**
 * POST /api/ocr-chat
 *
 * Request: { message: {...}, context?: { currentDocument, title } } with file parts containing image URLs
 * Response: UI Message Stream with custom data and structured output
 */
export async function POST(req: Request) {
    try {
        const { message, context } = await req.json();

        console.log("[OCR-Chat] Received request");
        console.log("[OCR-Chat] Message:", JSON.stringify(message, null, 2));
        console.log("[OCR-Chat] Context:", JSON.stringify(context, null, 2));

        // Extract image URLs from the message's file parts
        const latestUserMessage = message;

        if (!latestUserMessage) {
            return Response.json(
                { error: "사용자 메시지가 필요합니다." },
                { status: 400 }
            );
        }

        // Extract image URLs from parts
        const imageUrls: string[] = [];
        if (latestUserMessage.parts) {
            for (const part of latestUserMessage.parts) {
                if (part.type === "file" && part.url) {
                    imageUrls.push(part.url);
                }
            }
        }

        console.log("[OCR-Chat] Extracted image URLs:", imageUrls);

        if (imageUrls.length === 0) {
            return Response.json(
                { error: "이미지 파일이 필요합니다." },
                { status: 400 }
            );
        }

        // Create streaming response
        const stream = createUIMessageStream({
            execute: async ({ writer }) => {
                try {
                    // Send start message
                    writer.write({
                        type: "start",
                        messageId: crypto.randomUUID(),
                    });

                    // Step 1: OCR Processing
                    writer.write({
                        type: "data-status",
                        data: {
                            step: "ocr",
                            message: `OCR 처리 중... (${imageUrls.length}장)`,
                            progress: 30,
                        },
                        transient: true,
                    });

                    console.log(`[OCR-Chat] Starting OCR for ${imageUrls.length} images...`);

                    // Download images and run OCR
                    const ocrPromises = imageUrls.map(async (url: string, index: number) => {
                        // Fetch image from URL
                        const imageResponse = await fetch(url);
                        if (!imageResponse.ok) {
                            throw new Error(`Failed to fetch image ${index + 1}`);
                        }

                        const imageBlob = await imageResponse.blob();

                        // Create FormData for OCR API
                        const formData = new FormData();
                        formData.append("document", imageBlob);
                        formData.append("schema", "oac");
                        formData.append("model", "ocr");

                        const response = await fetch("https://api.upstage.ai/v1/document-digitization", {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${process.env.UPSTAGE_API_KEY}`,
                            },
                            body: formData,
                        });

                        if (!response.ok) {
                            const error = await response.text();
                            console.error(`[OCR-Chat] OCR failed for image ${index}:`, error);
                            throw new Error(`OCR failed for image ${index + 1}: ${response.statusText}`);
                        }

                        const data = await response.json();
                        const validatedData = UpstageOCRResponseSchema.parse(data);

                        return {
                            text: validatedData.text,
                            confidence: validatedData.confidence,
                            pageData: validatedData.pages[0],
                            index,
                        };
                    });

                    const ocrResults = await Promise.all(ocrPromises);

                    console.log(`[OCR-Chat] OCR completed`);

                    // Calculate confidence
                    const allWords = ocrResults.flatMap((r) => r.pageData.words);
                    const confidenceStats = calculateOCRConfidence(allWords);

                    console.log(`[OCR-Chat] Confidence:`, confidenceStats);

                    // Generate warnings
                    const warnings: string[] = [];
                    if (confidenceStats.averageConfidence < 0.8) {
                        warnings.push(
                            `OCR 평균 신뢰도가 낮습니다 (${(confidenceStats.averageConfidence * 100).toFixed(1)}%). ` +
                            `결과를 확인하고 필요시 수정해주세요.`
                        );
                    }
                    if (confidenceStats.lowConfidenceCount > confidenceStats.totalWords * 0.2) {
                        warnings.push(
                            `일부 단어의 인식 신뢰도가 낮습니다 (${confidenceStats.lowConfidenceCount}/${confidenceStats.totalWords}개).`
                        );
                    }

                    // Merge OCR texts
                    const ocrTexts = ocrResults.map((r) => r.text);
                    const mergedText = mergeOCRTexts(ocrTexts);

                    console.log(`[OCR-Chat] Merged text (${mergedText.length} chars)`);

                    // Send OCR metadata
                    writer.write({
                        type: "data-metadata",
                        data: {
                            imageUrls,
                            ocrText: mergedText,
                            confidence: confidenceStats,
                            warnings: warnings.length > 0 ? warnings : undefined,
                        },
                    });

                    // Step 2: AI Agent with Tool
                    writer.write({
                        type: "data-status",
                        data: {
                            step: "structuring",
                            message: "AI 분석 중...",
                            progress: 50,
                        },
                        transient: true,
                    });

                    console.log(`[OCR-Chat] Starting AI agent with tools...`);

                    // Define the structure_answer_sheet tool
                    const tools = {
                        structure_answer_sheet: {
                            description: "Analyze handwritten answer sheet images using Vision AI to create a structured document with text blocks, tables, and drawing placeholders",
                            inputSchema: z.object({
                                imageUrls: z.array(z.string())
                                    .min(1)
                                    .max(10)
                                    .describe("URLs of answer sheet images to analyze"),
                                mergedOcrText: z.string()
                                    .min(1)
                                    .describe("Pre-extracted OCR text for additional context"),
                            }),
                            execute: async ({ imageUrls: toolImageUrls, mergedOcrText: toolOcrText }: { imageUrls: string[]; mergedOcrText: string }) => {
                                try {
                                    console.log(`[Tool] Structuring ${toolImageUrls.length} images...`);

                                    const userPrompt = createOCRStructuringPrompt(toolOcrText, toolImageUrls.length);

                                    // Use generateObject for structured output
                                    // Mode 'json' for better compatibility with complex schemas
                                    const { object } = await generateObject({
                                        model: anthropic(RECOMMENDED_MODELS.primary),
                                        schema: AnswerSheetDocumentSchema,
                                        mode: "json", // Explicit JSON mode for Anthropic
                                        schemaName: "AnswerSheetDocument",
                                        schemaDescription: "Structured answer sheet document with text, table, and drawing blocks",
                                        system: OCR_STRUCTURING_SYSTEM_PROMPT,
                                        messages: [
                                            {
                                                role: "user",
                                                content: [
                                                    { type: "text", text: userPrompt },
                                                    ...toolImageUrls.map((url: string) => ({
                                                        type: "image" as const,
                                                        image: url,
                                                    })),
                                                ],
                                            },
                                        ],
                                        temperature: OCR_STRUCTURING_TEMPERATURE,
                                    });

                                    console.log(`[Tool] Structuring completed. Blocks: ${object.blocks.length}, Lines: ${object.totalLines}`);

                                    return object;

                                } catch (error) {
                                    console.error("[Tool] Vision LLM structuring failed:", error);

                                    // Log detailed error information for debugging
                                    if (error && typeof error === 'object') {
                                        console.error("[Tool] Error details:", {
                                            name: (error as any).name,
                                            message: (error as any).message,
                                            cause: (error as any).cause,
                                            text: (error as any).text, // Raw response text if available
                                        });
                                    }

                                    // Return fallback document with single text block
                                    const lines = toolOcrText.split('\n').filter(line => line.trim().length > 0).slice(0, 22);

                                    return {
                                        blocks: [
                                            {
                                                id: "fallback-1",
                                                type: "text" as const,
                                                lineStart: 1,
                                                lineEnd: lines.length,
                                                lines: lines,
                                            }
                                        ],
                                        totalLines: lines.length,
                                        metadata: {
                                            isValid: true,
                                            validationErrors: [],
                                            validationWarnings: [
                                                `Vision LLM 구조화 실패: ${error instanceof Error ? error.message : "Unknown error"}`,
                                                "OCR 텍스트를 기반으로 기본 블록을 생성했습니다.",
                                                "표와 그림 영역을 수동으로 추가해주세요."
                                            ]
                                        }
                                    };
                                }
                            }
                        }
                    };

                    // Stream AI agent response with tools
                    const result = streamText({
                        model: anthropic(RECOMMENDED_MODELS.primary),
                        system: `You are an OCR structuring assistant for Korean IT Professional Examination answer sheets.

When the user uploads answer sheet images:
1. Call the 'structure_answer_sheet' tool with the provided image URLs and OCR text
2. Wait for the tool to return the structured document
3. Summarize the result in a friendly message in Korean

Example response after tool execution:
"✅ 답안지 구조화가 완료되었습니다!

📊 결과:
- 전체 블록: {blocks.length}개
- 사용 줄 수: {totalLines}줄
- 텍스트 블록: {textCount}개
- 표 블록: {tableCount}개
- 그림 블록: {drawingCount}개

왼쪽 편집기에서 확인하고 필요시 수정해주세요."

Keep it concise and informative.`,
                        messages: [
                            {
                                role: "user",
                                content: `${imageUrls.length}장의 답안지 이미지를 업로드했습니다. 구조화해주세요.

이미지 URL:
${imageUrls.map((url, i) => `${i + 1}. ${url}`).join('\n')}

OCR 텍스트 (${mergedText.length}자):
${mergedText.slice(0, 500)}${mergedText.length > 500 ? '...' : ''}

structure_answer_sheet 도구를 사용하여 분석해주세요.`,
                            },
                        ],
                        tools,
                        toolChoice: "required",  // Force tool usage
                    });

                    console.log(`[OCR-Chat] Streaming AI agent response...`);

                    // Merge the AI response stream
                    writer.merge(result.toUIMessageStream({ sendStart: false, sendFinish: true }));

                } catch (error) {
                    console.error("[OCR-Chat] Error:", error);

                    // Send error
                    writer.write({
                        type: "data-error",
                        data: {
                            message: error instanceof Error ? error.message : "처리 실패",
                        },
                    });

                    throw error;
                }
            },
        });

        return createUIMessageStreamResponse({ stream });

    } catch (error) {
        console.error("[OCR-Chat] Fatal error:", error);

        return Response.json(
            {
                error: "답안지 변환 중 오류가 발생했습니다.",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
