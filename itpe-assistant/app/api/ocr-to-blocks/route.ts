/**
 * OCR to Blocks API Endpoint
 * 손글씨 답안지 이미지를 OCR로 텍스트 추출 후 Vision LLM으로 구조화
 * 
 * Streaming Architecture:
 * 1. FormData로 이미지 받기
 * 2. createUIMessageStream으로 스트림 생성
 * 3. 각 단계별 진행 상황을 custom data로 전송
 * 4. streamText + experimental_output으로 구조화된 답안지 생성
 */

import { put } from "@vercel/blob";
import { anthropic } from "@ai-sdk/anthropic";
import {
  streamText,
  createUIMessageStream,
  createUIMessageStreamResponse,
  Output,
} from "ai";
import {
  AnswerSheetDocumentSchema,
  UpstageOCRResponseSchema,
  createFallbackDocument,
} from "@/lib/schemas/ocr-schemas";
import {
  validateImageFiles,
  sortFilesByName,
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
 * POST /api/ocr-to-blocks
 * 
 * Streaming Flow:
 * 1. Validate & upload images → send progress
 * 2. OCR processing → send progress
 * 3. Vision LLM structuring → stream structured output
 */
export async function POST(req: Request) {
  try {
    // Parse FormData
    const formData = await req.formData();
    const files = formData.getAll("images") as File[];

    if (files.length === 0) {
      return Response.json(
        { error: "이미지 파일이 업로드되지 않았습니다." },
        { status: 400 }
      );
    }

    // Validate files
    const validation = validateImageFiles(files);
    if (!validation.isValid) {
      return Response.json(
        {
          error: "파일 검증 실패",
          details: validation.errors
        },
        { status: 400 }
      );
    }

    // Sort files by name (for correct page order)
    const sortedFiles = sortFilesByName(files);

    // Create streaming response
    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        try {
          // Step 1: Upload to Vercel Blob
          writer.write({
            type: "data-status",
            data: {
              step: "upload",
              message: `이미지 업로드 중... (${sortedFiles.length}개)`,
              progress: 10,
            },
            transient: true,
          });

          console.log(`[OCR-to-Blocks] Uploading ${sortedFiles.length} files...`);

          const uploadPromises = sortedFiles.map(async (file, index) => {
            const filename = `answer-sheet-${Date.now()}-${index}.${file.name.split(".").pop()}`;
            const blob = await put(filename, file, {
              access: "public",
              token: process.env.ITPE_READ_WRITE_TOKEN,
            });
            return {
              url: blob.url,
              filename: file.name,
              index,
            };
          });

          const uploadResults = await Promise.all(uploadPromises);
          const imageUrls = uploadResults.map((r) => r.url);

          console.log(`[OCR-to-Blocks] Uploaded:`, imageUrls);

          // Step 2: OCR Processing
          writer.write({
            type: "data-status",
            data: {
              step: "ocr",
              message: `OCR 처리 중... (${imageUrls.length}장)`,
              progress: 30,
            },
            transient: true,
          });

          console.log(`[OCR-to-Blocks] Starting OCR...`);

          const ocrPromises = sortedFiles.map(async (file, index) => {
            const ocrFormData = new FormData();
            ocrFormData.append("document", file);
            ocrFormData.append("schema", "oac");
            ocrFormData.append("model", "ocr");

            const response = await fetch("https://api.upstage.ai/v1/document-digitization", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${process.env.UPSTAGE_API_KEY}`,
              },
              body: ocrFormData,
            });

            if (!response.ok) {
              const error = await response.text();
              console.error(`[OCR-to-Blocks] OCR failed for image ${index}:`, error);
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

          console.log(`[OCR-to-Blocks] OCR completed`);

          // Calculate confidence
          const allWords = ocrResults.flatMap((r) => r.pageData.words);
          const confidenceStats = calculateOCRConfidence(allWords);

          console.log(`[OCR-to-Blocks] Confidence:`, confidenceStats);

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

          console.log(`[OCR-to-Blocks] Merged text (${mergedText.length} chars)`);

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

          // Step 3: Vision LLM Structuring
          writer.write({
            type: "data-status",
            data: {
              step: "structuring",
              message: "Vision LLM 구조화 중...",
              progress: 60,
            },
            transient: true,
          });

          console.log(`[OCR-to-Blocks] Starting Vision LLM structuring...`);

          const userPrompt = createOCRStructuringPrompt(mergedText, ocrResults.length);

          // Stream structured output
          const result = streamText({
            model: anthropic(RECOMMENDED_MODELS.primary),
            system: OCR_STRUCTURING_SYSTEM_PROMPT,
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: userPrompt },
                  ...imageUrls.map((url) => ({
                    type: "image" as const,
                    image: url,
                  })),
                ],
              },
            ],
            experimental_output: Output.object({
              schema: AnswerSheetDocumentSchema,
            }),
            temperature: OCR_STRUCTURING_TEMPERATURE,
            onFinish: () => {
              console.log(`[OCR-to-Blocks] Structuring completed`);

              // Send completion
              writer.write({
                type: "data-status",
                data: {
                  step: "complete",
                  message: "구조화 완료!",
                  progress: 100,
                },
                transient: true,
              });
            },
          });

          // Merge the structured output stream
          writer.merge(result.toUIMessageStream());

        } catch (error) {
          console.error("[OCR-to-Blocks] Error:", error);

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
    console.error("[OCR-to-Blocks] Fatal error:", error);

    return Response.json(
      {
        error: "답안지 변환 중 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
