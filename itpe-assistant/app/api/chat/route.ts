import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { streamText, LanguageModel, convertToModelMessages } from "ai";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, model = "claude-sonnet-4-20250514" } = await req.json();

    // Select AI model based on model ID
    let selectedModel: LanguageModel;

    if (model.startsWith("gpt")) {
      selectedModel = openai(model);
    } else if (model.startsWith("claude")) {
      selectedModel = anthropic(model);
    } else {
      // Default to Claude Sonnet 4
      selectedModel = anthropic("claude-sonnet-4-20250514");
    }

    const result = streamText({
      model: selectedModel,
      messages: convertToModelMessages(messages),
      temperature: 0.7,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
