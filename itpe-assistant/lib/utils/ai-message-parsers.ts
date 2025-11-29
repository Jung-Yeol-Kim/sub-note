import type { UIMessage } from "ai";
import type { AnswerSheetDocument } from "@/lib/types/answer-sheet-block";

const TOOL_NAME = "structure_answer_sheet";

/**
 * Extracts a structured answer sheet document from an AI SDK UIMessage.
 * Supports multiple tool-result shapes (tool-result parts, tool-* events, object/data-document fallbacks).
 */
export function extractStructuredAnswerSheet(message: UIMessage | undefined): AnswerSheetDocument | null {
  if (!message) return null;

  const candidates: any[] = [];

  if (Array.isArray((message as any).parts)) {
    candidates.push(...(message as any).parts);
  }

  if (Array.isArray((message as any).toolInvocations)) {
    candidates.push(...(message as any).toolInvocations);
  }

  if ((message as any).data) {
    candidates.push((message as any).data);
  }

  if ((message as any).output) {
    candidates.push((message as any).output);
  }

  for (const candidate of candidates) {
    if (!candidate) continue;

    // Standard AI SDK tool-result part
    if (
      candidate.type === "tool-result" &&
      candidate.toolName === TOOL_NAME &&
      candidate.result?.blocks
    ) {
      return candidate.result as AnswerSheetDocument;
    }

    // UI stream tool event: type is "tool-<name>" with output
    if (
      typeof candidate.type === "string" &&
      candidate.type.startsWith(`tool-${TOOL_NAME}`) &&
      candidate.output?.blocks
    ) {
      return candidate.output as AnswerSheetDocument;
    }

    // Generic tool invocation shape
    if (candidate.toolName === TOOL_NAME && candidate.output?.blocks) {
      return candidate.output as AnswerSheetDocument;
    }

    // Legacy object/data-document parts
    if (candidate.type === "object" && candidate.data?.blocks) {
      return candidate.data as AnswerSheetDocument;
    }
    if (candidate.type === "data-document" && candidate.data?.blocks) {
      return candidate.data as AnswerSheetDocument;
    }
  }

  return null;
}
