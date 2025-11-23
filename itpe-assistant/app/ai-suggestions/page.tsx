"use client";

import { useChat } from "@ai-sdk/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Send, Loader2, TrendingUp, Calendar, Target, Lightbulb } from "lucide-react";
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
  MessageBranch,
  MessageBranchContent,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTools,
  PromptInputButton,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

// Quick prompt suggestions
const QUICK_PROMPTS = [
  {
    icon: TrendingUp,
    label: "최신 트렌드 분석",
    prompt: "2026년 2월 시험을 대비하여 현재 시점에서 가장 출제 가능성이 높은 최신 기술 트렌드 5가지를 분석해주세요.",
  },
  {
    icon: Target,
    label: "약점 보완 전략",
    prompt: "정보보안 분야에서 자주 출제되지만 학습이 부족한 주제들을 추천해주세요.",
  },
  {
    icon: Calendar,
    label: "3개월 학습 계획",
    prompt: "시험까지 3개월 남았습니다. 효율적인 학습 계획을 세워주세요.",
  },
  {
    icon: Lightbulb,
    label: "고득점 전략",
    prompt: "최근 출제 경향을 분석하여 고득점을 위한 전략적 학습 주제를 추천해주세요.",
  },
];

export default function AISuggestionsPage() {
  const [selectedModel, setSelectedModel] = useState<string>("claude-sonnet-4-20250514");
  const [input, setInput] = useState("");

  const { messages, status, sendMessage } = useChat({
    api: "/api/ai-recommendations",
  });

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(
      {
        text: prompt,
      },
      {
        body: {
          model: selectedModel,
        },
      }
    );
  };

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    sendMessage(
      {
        text: message.text || "Sent with attachments",
        files: message.files,
      },
      {
        body: {
          model: selectedModel,
        },
      }
    );
    setInput("");
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-6 pb-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent/70">
            <Sparkles className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              AI 추천
            </h1>
            <p className="text-sm text-muted-foreground">
              시사성 분석 기반 학습 주제 추천 및 전략 수립
            </p>
          </div>
        </div>
      </div>

      {/* Model Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">AI 모델:</span>
          <Select
            value={selectedModel}
            onValueChange={(value) => setSelectedModel(value)}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="모델 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="claude-sonnet-4-20250514">
                <div className="flex items-center gap-2">
                  <span>Claude Sonnet 4</span>
                  <Badge variant="secondary" className="text-xs">최신</Badge>
                </div>
              </SelectItem>
              <SelectItem value="claude-haiku-4-5">
                <div className="flex items-center gap-2">
                  <span>Claude Haiku 4.5</span>
                  <Badge variant="secondary" className="text-xs">빠름</Badge>
                </div>
              </SelectItem>
              <SelectItem value="gpt-4o">
                <div className="flex items-center gap-2">
                  <span>GPT-4o</span>
                </div>
              </SelectItem>
              <SelectItem value="gpt-5-mini">
                <div className="flex items-center gap-2">
                  <span>GPT-5 Mini</span>
                  <Badge variant="secondary" className="text-xs">저렴</Badge>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Badge variant="outline" className="text-xs">
          Trend Analysis Engine v2.0
        </Badge>
      </div>

      {/* Chat Container */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-border bg-card">
        <Conversation className="flex-1">
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<Sparkles className="h-12 w-12" />}
                title="AI 추천을 시작하세요"
                description="아래 빠른 질문을 선택하거나 직접 질문을 입력하세요"
              >
                {/* Quick Prompts */}
                <div className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
                  {QUICK_PROMPTS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Card
                        key={item.label}
                        className="group cursor-pointer border-accent/20 transition-all hover:border-accent hover:shadow-md"
                        onClick={() => handleQuickPrompt(item.prompt)}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-sm">
                            <Icon className="h-4 w-4 text-accent" />
                            {item.label}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="line-clamp-2 text-xs">
                            {item.prompt}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ConversationEmptyState>
            ) : (
              <>
                {messages.map((message) => (
                  <MessageBranch key={message.id} defaultBranch={0}>
                    <MessageBranchContent>
                      <Message from={message.role}>
                        <MessageContent>
                          <MessageResponse>
                            {message.content}
                          </MessageResponse>
                        </MessageContent>
                      </Message>
                    </MessageBranchContent>
                  </MessageBranch>
                ))}
                {status === "streaming" && (
                  <MessageBranch defaultBranch={0}>
                    <MessageBranchContent>
                      <Message from="assistant">
                        <MessageContent>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">AI가 분석 중입니다...</span>
                          </div>
                        </MessageContent>
                      </Message>
                    </MessageBranchContent>
                  </MessageBranch>
                )}
              </>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* Input Area */}
        <div className="border-t border-border bg-card p-4">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputBody>
              <PromptInputTextarea
                placeholder="학습하고 싶은 주제나 질문을 입력하세요..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools>
                <span className="text-xs text-muted-foreground">
                  Enter로 전송 • Shift+Enter로 줄바꿈
                </span>
              </PromptInputTools>
              <PromptInputSubmit
                disabled={!input.trim() && !status}
                status={status}
              >
                {status === "streaming" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </PromptInputSubmit>
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-accent/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">분석 패턴</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>• 신기술: 3~6개월 리드타임</p>
              <p>• 보안사건: 6~12개월</p>
              <p>• 정부정책: 3~9개월</p>
              <p>• 학술성과: 6~18개월</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">출제 비중</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>• 최신기술/법규: 26.7%</p>
              <p>• 정보보안: 13.3%</p>
              <p>• 시스템/통신: 20%</p>
              <p>• 기타 영역: 40%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">추천 기준</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>• 영향력 (Impact)</p>
              <p>• 화제성 (Buzz)</p>
              <p>• 국내 관련성</p>
              <p>• 출제기준 정합성</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
