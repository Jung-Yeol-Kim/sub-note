"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Save, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import type { ExamQuestion, ExamAnswer } from "@/lib/types/mock-exam";
import { countWords } from "@/lib/types/mock-exam";
import { parseAnswerSheet, formatValidationMessages, type AnswerSheet } from "@/lib/types/answer-sheet";

interface ExamAnswerEditorProps {
  question: ExamQuestion;
  answer: ExamAnswer | null;
  onAnswerChange: (content: string, sheet?: AnswerSheet) => void;
  onAutoSave?: (answer: ExamAnswer) => void;
  autoSaveInterval?: number; // in milliseconds
  readOnly?: boolean;
  showFormatValidation?: boolean; // Show 22×19 format validation
}

export function ExamAnswerEditor({
  question,
  answer,
  onAnswerChange,
  onAutoSave,
  autoSaveInterval = 30000, // 30 seconds
  readOnly = false,
  showFormatValidation = true,
}: ExamAnswerEditorProps) {
  const [content, setContent] = useState(answer?.content || "");
  const [lastSaved, setLastSaved] = useState<Date | null>(
    answer?.lastSavedAt || null
  );
  const [isSaving, setIsSaving] = useState(false);

  // Answer sheet validation
  const [answerSheet, setAnswerSheet] = useState<AnswerSheet>(() =>
    parseAnswerSheet(content)
  );

  const characterCount = content.length;
  const wordCount = countWords(content);
  const hasContent = content.trim().length > 0;

  // Update answer sheet when content changes
  useEffect(() => {
    if (showFormatValidation) {
      const sheet = parseAnswerSheet(content);
      setAnswerSheet(sheet);
    }
  }, [content, showFormatValidation]);

  // Auto-save functionality
  const performAutoSave = useCallback(() => {
    if (!hasContent || readOnly) return;

    setIsSaving(true);

    const updatedAnswer: ExamAnswer = {
      questionId: question.id,
      content,
      startedAt: answer?.startedAt || new Date(),
      timeSpent: answer?.timeSpent || 0,
      characterCount,
      wordCount,
      autoSaved: true,
      lastSavedAt: new Date(),
    };

    onAutoSave?.(updatedAnswer);
    setLastSaved(new Date());

    setTimeout(() => setIsSaving(false), 500);
  }, [
    content,
    hasContent,
    readOnly,
    question.id,
    answer,
    characterCount,
    wordCount,
    onAutoSave,
  ]);

  // Auto-save on interval
  useEffect(() => {
    if (!autoSaveInterval || readOnly) return;

    const interval = setInterval(performAutoSave, autoSaveInterval);
    return () => clearInterval(interval);
  }, [autoSaveInterval, readOnly, performAutoSave]);

  // Handle content change
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onAnswerChange(newContent);
  };

  return (
    <div className="space-y-4">
      {/* Question Card */}
      <Card className="border-accent/30">
        <CardHeader>
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <CardTitle className="text-xl">{question.title}</CardTitle>
              <Badge variant="outline" className="text-xs">
                난이도 {question.difficulty}/5
              </Badge>
            </div>
            {question.description && (
              <p className="text-sm text-muted-foreground">
                {question.description}
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <div className="text-sm">
              <span className="font-medium">분류:</span>{" "}
              <Badge variant="secondary" className="ml-1">
                {question.categoryName}
              </Badge>
              {question.subCategoryName && (
                <Badge variant="outline" className="ml-1">
                  {question.subCategoryName}
                </Badge>
              )}
            </div>
          </div>

          {question.keywords.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                핵심 키워드 (참고용):
              </p>
              <div className="flex flex-wrap gap-1">
                {question.keywords.map((keyword, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="text-xs bg-accent/5"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Answer Editor */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              답안 작성
            </CardTitle>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {lastSaved && (
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-xs">
                    저장됨: {lastSaved.toLocaleTimeString("ko-KR")}
                  </span>
                </div>
              )}
              {isSaving && (
                <div className="flex items-center gap-1">
                  <Save className="h-4 w-4 animate-pulse" />
                  <span className="text-xs">저장 중...</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="답안을 작성하세요. 표준 형식에 따라 작성하면 더 좋은 점수를 받을 수 있습니다.&#10;&#10;1. 정의&#10;- 개념 정의 및 특징&#10;&#10;2. 설명&#10;1) 구조/프로세스 (다이어그램)&#10;   [다이어그램 작성]&#10;   - 설명&#10;&#10;2) 분류/유형/특징 (표)&#10;   | 분류 | 항목 | 설명 |&#10;   - 설명&#10;&#10;3. 추가 고려사항 (선택사항)"
            className="min-h-[500px] font-mono text-sm resize-y"
            disabled={readOnly}
          />

          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-4 text-muted-foreground">
              <span>
                글자 수: <span className="font-semibold">{characterCount}</span>
              </span>
              <span>
                단어 수: <span className="font-semibold">{wordCount}</span>
              </span>
            </div>

            <div className="text-xs text-muted-foreground">
              권장: 1,500-2,000자 (A4 1페이지)
            </div>
          </div>

          {/* Writing Tips */}
          {!hasContent && !readOnly && (
            <Alert className="bg-accent/5 border-accent/30">
              <div className="text-sm">
                <p className="font-semibold mb-2">📝 작성 팁</p>
                <ul className="text-xs space-y-1 ml-4 list-disc">
                  <li>정의부터 시작하세요 (명확하고 간결하게)</li>
                  <li>핵심 키워드를 빠짐없이 포함하세요</li>
                  <li>다이어그램과 표를 활용하여 시각화하세요</li>
                  <li>조사를 생략하여 간결하게 작성하세요</li>
                  <li>A4 1페이지 분량 (1,500-2,000자)이 적당합니다</li>
                </ul>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
