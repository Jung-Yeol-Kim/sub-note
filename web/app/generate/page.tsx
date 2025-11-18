'use client'

import { useState } from 'react'
import { useChat } from 'ai'

const QUESTION_TYPES = ['정의형', '설명형', '비교형', '절차형', '분석형'] as const
type QuestionType = typeof QUESTION_TYPES[number]
type Level = 'basic' | 'advanced'

export default function GeneratePage() {
  const [topic, setTopic] = useState('')
  const [questionType, setQuestionType] = useState<QuestionType>('설명형')
  const [level, setLevel] = useState<Level>('advanced')

  const { messages, isLoading, error, reload } = useChat({
    api: '/api/generate',
    body: {
      topic,
      questionType,
      level,
    },
  })

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) return
    reload()
  }

  const lastMessage = messages[messages.length - 1]

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-2">
            답안 생성
          </h1>
          <p className="text-secondary font-body">
            정보관리기술사 시험 답안을 AI로 생성합니다
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 입력 폼 */}
          <div className="bg-white dark:bg-brand-dark border border-muted rounded-lg p-6 shadow-sm">
            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label htmlFor="topic" className="block text-sm font-heading font-medium text-foreground mb-2">
                  주제
                </label>
                <input
                  id="topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="예: Kubernetes, DevOps, 마이크로서비스"
                  className="w-full px-4 py-2 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground font-body"
                  required
                />
              </div>

              <div>
                <label htmlFor="questionType" className="block text-sm font-heading font-medium text-foreground mb-2">
                  문제 유형
                </label>
                <select
                  id="questionType"
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value as QuestionType)}
                  className="w-full px-4 py-2 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground font-body"
                >
                  {QUESTION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-2">
                  난이도
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="level"
                      value="basic"
                      checked={level === 'basic'}
                      onChange={(e) => setLevel(e.target.value as Level)}
                      className="mr-2 accent-primary"
                    />
                    <span className="font-body text-foreground">초보</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="level"
                      value="advanced"
                      checked={level === 'advanced'}
                      onChange={(e) => setLevel(e.target.value as Level)}
                      className="mr-2 accent-primary"
                    />
                    <span className="font-body text-foreground">고득점</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !topic.trim()}
                className="w-full px-6 py-3 bg-primary text-white font-heading font-medium rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {isLoading ? '생성 중...' : '답안 생성'}
              </button>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-600 dark:text-red-400 font-body">
                    오류가 발생했습니다: {error.message}
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* 생성된 답안 */}
          <div className="bg-white dark:bg-brand-dark border border-muted rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
              생성된 답안
            </h2>
            <div className="prose prose-sm max-w-none dark:prose-invert font-body">
              {isLoading && !lastMessage && (
                <div className="flex items-center gap-2 text-secondary">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span>답안을 생성하고 있습니다...</span>
                </div>
              )}

              {lastMessage && (
                <div className="whitespace-pre-wrap text-foreground">
                  {lastMessage.content}
                </div>
              )}

              {!isLoading && !lastMessage && (
                <p className="text-secondary">
                  주제를 입력하고 답안 생성 버튼을 클릭하세요.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
