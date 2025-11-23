"use client";

import { useState } from "react";
import { AnswerSheetEditor } from "@/components/answer-sheet/answer-sheet-editor";
import type { AnswerSheet } from "@/lib/types/answer-sheet";

export default function AnswerSheetTestPage() {
  const [answerSheet, setAnswerSheet] = useState<AnswerSheet | null>(null);

  const sampleAnswer = `가. OAuth의 정의

1. OAuth 2.0의 개념
- 제3자 애플리케이션 접근 권한 위임
- 리소스 소유자 동의하 접근 허용
- 비밀번호 노출 없이 인증 제공

2. OAuth 2.0 구조 및 프로세스

[다이어그램]
Client -> Auth Server -> Resource

3. OAuth 2.0 주요 특징
| 구분 | 항목 | 설명 |
| 인증 | Token | 시간 제한 |
| 보안 | Refresh | 재발급 |`;

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          답안지 규격 에디터 테스트
        </h1>
        <p className="text-muted-foreground">
          22줄 × 19칸 규격을 준수하는 답안 작성 시스템
        </p>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => {
            const editor = document.querySelector('textarea');
            if (editor) {
              const event = new Event('input', { bubbles: true });
              editor.value = sampleAnswer;
              editor.dispatchEvent(event);
            }
          }}
          className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
        >
          샘플 답안 불러오기
        </button>
        <button
          onClick={() => {
            const editor = document.querySelector('textarea');
            if (editor) {
              const event = new Event('input', { bubbles: true });
              editor.value = '';
              editor.dispatchEvent(event);
            }
          }}
          className="px-4 py-2 border border-accent/30 text-accent rounded-md hover:bg-accent/5 transition-colors"
        >
          초기화
        </button>
      </div>

      <AnswerSheetEditor
        initialContent=""
        onChange={(content, sheet) => {
          setAnswerSheet(sheet);
          console.log('Answer sheet updated:', sheet);
        }}
        showGridPreview={true}
        showStatistics={true}
      />

      {/* Debug info */}
      <details className="mt-8 p-4 border rounded-lg">
        <summary className="cursor-pointer font-semibold">
          디버그 정보 (개발용)
        </summary>
        {answerSheet && (
          <pre className="mt-4 p-4 bg-gray-100 rounded text-xs overflow-auto max-h-96">
            {JSON.stringify(answerSheet, null, 2)}
          </pre>
        )}
      </details>
    </div>
  );
}
