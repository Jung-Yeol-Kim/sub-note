import { createAnthropic } from '@ai-sdk/anthropic'

export const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Claude 3.5 Sonnet model
export const model = anthropic('claude-3-5-sonnet-20241022')
