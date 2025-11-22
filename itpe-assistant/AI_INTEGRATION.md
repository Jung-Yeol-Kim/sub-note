# AI Integration Guide

## 개요

이 프로젝트는 **Vercel AI SDK**를 사용하여 Anthropic Claude와 OpenAI GPT 모델과 통합됩니다.

## AI Elements MCP 서버란?

AI Elements MCP 서버는 **컴포넌트 문서를 제공하는 역할**만 합니다. 실제 AI 호출 기능은 제공하지 않습니다.

- **역할**: Claude Code, Cursor 등의 AI 어시스턴트가 AI Elements UI 컴포넌트 문서에 접근할 수 있게 함
- **제한**: 실제 AI 모델 호출이나 데이터 처리는 하지 않음
- **용도**: 개발 중 컴포넌트 사용법을 AI 어시스턴트에게 물어볼 때 유용

### MCP 서버 설정 (선택사항)

Claude Code를 사용하는 경우:
```bash
claude mcp add --transport http ai-elements https://registry.ai-sdk.dev/api/mcp
```

일반 MCP 클라이언트:
```json
{
  "mcpServers": {
    "ai-elements": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://registry.ai-sdk.dev/api/mcp"]
    }
  }
}
```

## 실제 AI 호출 구현

### 1. 환경 변수 설정

`.env.local` 파일을 생성하고 API 키를 추가하세요:

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-api03-...
OPENAI_API_KEY=sk-...
```

API 키 받기:
- **Anthropic**: https://console.anthropic.com/
- **OpenAI**: https://platform.openai.com/api-keys

### 2. API Route 구조

프로젝트에는 두 가지 AI API 엔드포인트가 있습니다:

#### `/api/chat` - 범용 채팅 API
```typescript
// app/api/chat/route.ts
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages, model } = await req.json();

  const selectedModel = model.startsWith("gpt")
    ? openai(model)
    : anthropic(model);

  const result = streamText({
    model: selectedModel,
    messages,
  });

  return result.toDataStreamResponse();
}
```

#### `/api/ai-recommendations` - 시험 추천 전용 API
- 정보관리기술사 시험 패턴 분석
- 맞춤형 학습 주제 추천
- 전략적 학습 계획 제시

### 3. 프론트엔드에서 사용하기

#### useChat Hook 사용 (권장)

```typescript
import { useChat } from "@ai-sdk/react";

export default function ChatPage() {
  const { messages, isLoading, append, input, setInput } = useChat({
    api: "/api/chat",
    body: {
      model: "claude-sonnet-4-20250514", // 또는 "gpt-4o"
    },
  });

  const handleSubmit = () => {
    append({
      role: "user",
      content: input,
    });
    setInput("");
  };

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <strong>{message.role}:</strong> {message.content}
        </div>
      ))}
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSubmit} disabled={isLoading}>
        Send
      </button>
    </div>
  );
}
```

### 4. AI Elements 컴포넌트와 함께 사용

AI Elements는 UI 컴포넌트 라이브러리입니다. `useChat`과 결합하여 사용:

```typescript
import { useChat } from "@ai-sdk/react";
import {
  Conversation,
  Message,
  PromptInput
} from "@/components/ai-elements";

export default function Example() {
  const { messages, isLoading, append } = useChat({
    api: "/api/chat",
  });

  return (
    <Conversation>
      {messages.map((message) => (
        <Message key={message.id} from={message.role}>
          {message.content}
        </Message>
      ))}
      <PromptInput
        onSubmit={(msg) => append({ role: "user", content: msg.text })}
      />
    </Conversation>
  );
}
```

## 사용 가능한 모델

### Anthropic Claude
- `claude-opus-4-20250514` - 가장 강력한 모델
- `claude-sonnet-4-20250514` - 균형잡힌 성능 (권장)
- `claude-haiku-4-20250222` - 빠르고 경제적

### OpenAI
- `gpt-4o` - 최신 멀티모달 모델
- `gpt-4o-mini` - 빠르고 저렴한 버전
- `gpt-4-turbo` - 이전 세대 고성능 모델

## 예제 페이지

### `/example`
- AI Elements의 모든 주요 컴포넌트 시연
- 실시간 AI 채팅 기능
- 모델 선택기
- 첨부파일 지원 (UI만, 백엔드 구현 필요)

### `/ai-suggestions`
- 정보관리기술사 시험 맞춤형 추천
- 출제 패턴 분석
- 학습 전략 제시

## 주요 패키지

```json
{
  "@ai-sdk/anthropic": "3.0.0-beta.54",
  "@ai-sdk/openai": "3.0.0-beta.63",
  "@ai-sdk/react": "3.0.0-beta.105",
  "ai": "3.4.33"
}
```

## 비용 최적화 팁

1. **개발 중에는 작은 모델 사용**: `gpt-4o-mini`, `claude-haiku-4`
2. **토큰 제한 설정**: `maxTokens` 파라미터로 응답 길이 제한
3. **스트리밍 사용**: 사용자 경험 개선 + 중단 가능
4. **캐싱 활용**: Anthropic의 Prompt Caching 기능 (향후 구현)

## 문제 해결

### API 키 오류
```
Error: Missing API key
```
→ `.env.local` 파일에 API 키가 올바르게 설정되었는지 확인

### CORS 오류
→ API route는 `/app/api/` 경로에 있어야 함

### 스트리밍이 작동하지 않음
→ `runtime = "edge"` 설정 확인 (API route 파일에)

### 모델을 찾을 수 없음
```
Error: Model not found
```
→ 모델 ID가 정확한지 확인 (대소문자 구분)

## 참고 자료

- [Vercel AI SDK 문서](https://ai-sdk.dev/)
- [AI Elements 컴포넌트](https://ai-sdk.dev/elements)
- [Anthropic API 문서](https://docs.anthropic.com/)
- [OpenAI API 문서](https://platform.openai.com/docs)
- [AI SDK MCP Tools](https://ai-sdk.dev/docs/ai-sdk-core/mcp-tools)

## 다음 단계

1. ✅ API route 생성 (`/api/chat`)
2. ✅ Example 페이지 구현 (`/example`)
3. ✅ 환경 변수 예제 파일 (`.env.example`)
4. ⬜ 파일 첨부 기능 백엔드 구현
5. ⬜ 웹 검색 통합 (MCP를 통한 검색 도구)
6. ⬜ Reasoning 기능 구현 (Claude의 extended thinking)
7. ⬜ Tool calling 예제 추가
