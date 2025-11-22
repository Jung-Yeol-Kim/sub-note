# useChat Hook - Correct Implementation Guide

## ❌ WRONG Pattern (What you had)

```typescript
// INCORRECT - These properties don't exist!
const { messages, sendMessage, status, regenerate } = useChat();

const handleSubmit = (message: PromptInputMessage) => {
  sendMessage(  // ❌ sendMessage doesn't exist
    { text: message.text, files: message.files },
    { body: { model: model, webSearch: webSearch } }
  );
};

// API Route - INCORRECT
return result.toUIMessageStreamResponse({  // ❌ This method doesn't exist
  sendSources: true,
  sendReasoning: true,
});
```

## ✅ CORRECT Pattern

### Client-Side (React Component)

```typescript
'use client';

import { useChat } from '@ai-sdk/react';
import type { Message } from 'ai';

export default function ChatComponent() {
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [webSearch, setWebSearch] = useState(false);

  // ✅ CORRECT: These are the actual properties returned by useChat
  const {
    messages,      // ✅ Array of messages
    input,         // ✅ Current input value
    setInput,      // ✅ Function to set input
    append,        // ✅ Function to add a message (NOT sendMessage)
    reload,        // ✅ Function to regenerate last response (NOT regenerate)
    isLoading,     // ✅ Boolean loading state (NOT status)
    error,         // ✅ Error object if any
    stop,          // ✅ Function to stop generation
  } = useChat({
    api: '/api/chat',
    // Body is sent with every request
    body: {
      model: selectedModel,
      webSearch: webSearch,
    },
  });

  const handleSubmit = (message: { text: string; files?: File[] }) => {
    if (!message.text.trim()) return;

    // ✅ CORRECT: Use append() to add messages
    append({
      role: 'user',
      content: message.text,
    });

    setInput(''); // Clear input after sending
  };

  const handleRegenerate = () => {
    // ✅ CORRECT: Use reload() to regenerate
    reload();
  };

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <strong>{message.role}:</strong> {message.content}
        </div>
      ))}

      {isLoading && <div>Loading...</div>}

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit({ text: input });
          }
        }}
      />

      <button onClick={() => handleSubmit({ text: input })}>
        Send
      </button>

      <button onClick={handleRegenerate} disabled={isLoading}>
        Regenerate
      </button>
    </div>
  );
}
```

### Server-Side API Route

```typescript
// app/api/chat/route.ts
import { streamText, convertToCoreMessages } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, model = 'gpt-4o', webSearch = false } = await req.json();

    // Select model
    let selectedModel;
    if (model.startsWith('gpt')) {
      selectedModel = openai(model);
    } else if (model.startsWith('claude')) {
      selectedModel = anthropic(model);
    } else {
      selectedModel = openai('gpt-4o');
    }

    const result = streamText({
      model: selectedModel,
      messages: convertToCoreMessages(messages),
      temperature: 0.7,
      maxTokens: 4096,
    });

    // ✅ CORRECT: Use toDataStreamResponse()
    return result.toDataStreamResponse();

  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
```

## Common Mistakes

### 1. ❌ Using non-existent properties
```typescript
const { sendMessage } = useChat(); // ❌ No sendMessage
const { status } = useChat();      // ❌ No status
const { regenerate } = useChat();  // ❌ No regenerate
```

### 2. ❌ Wrong append signature
```typescript
// ❌ WRONG
append({ text: 'hello', files: [] }, { body: { model: 'gpt-4o' } });

// ✅ CORRECT
append({ role: 'user', content: 'hello' });
```

### 3. ❌ Using wrong response method
```typescript
// ❌ WRONG
return result.toUIMessageStreamResponse();

// ✅ CORRECT
return result.toDataStreamResponse();
```

## Working with PromptInput Components

If you're using the ai-elements PromptInput components:

```typescript
import { PromptInput, PromptInputMessage } from '@/components/ai-elements/prompt-input';

const handleSubmit = (message: PromptInputMessage) => {
  const hasText = Boolean(message.text);
  const hasAttachments = Boolean(message.files?.length);

  if (!(hasText || hasAttachments)) return;

  // ✅ CORRECT: Use append with role and content
  append({
    role: 'user',
    content: message.text || 'Sent with attachments',
  });

  setInput(''); // Clear input
};

return (
  <PromptInput onSubmit={handleSubmit}>
    <PromptInputTextarea
      value={input}
      onChange={(e) => setInput(e.target.value)}
    />
    <PromptInputSubmit
      disabled={!input.trim() || isLoading}
      status={isLoading ? 'streaming' : 'ready'}
    />
  </PromptInput>
);
```

## Dynamic Body Values

If you need to send different values with each request:

```typescript
const { append } = useChat({
  api: '/api/chat',
});

// Send different models per message
const sendWithModel = (text: string, model: string) => {
  append(
    { role: 'user', content: text },
    { body: { model } }  // Override body per request
  );
};
```

## Full useChat API

```typescript
const {
  messages,       // Message[] - All messages in the conversation
  input,          // string - Current input value
  setInput,       // (input: string) => void
  handleInputChange, // (e: ChangeEvent) => void
  handleSubmit,   // (e: FormEvent) => void
  append,         // (message: Message, options?) => void
  reload,         // () => void - Regenerate last response
  stop,           // () => void - Stop current generation
  isLoading,      // boolean - Is currently generating
  error,          // Error | undefined
  data,           // JSONValue[] | undefined
  setMessages,    // (messages: Message[]) => void
} = useChat(options);
```

## Debugging Tips

1. **Check versions**: Make sure you have compatible versions:
   ```json
   "@ai-sdk/react": "^2.0.99",
   "ai": "^5.0.99"
   ```

2. **Check API route**: Make sure your API route is at the path you specified:
   ```typescript
   useChat({ api: '/api/chat' }) // Must have app/api/chat/route.ts
   ```

3. **Check console**: Look for network errors in browser DevTools

4. **Test API independently**: Use curl or Postman to test your API route

## References

- [AI SDK Documentation](https://sdk.vercel.ai/docs)
- [useChat API Reference](https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat)
- [streamText API Reference](https://sdk.vercel.ai/docs/reference/ai-sdk-core/stream-text)
