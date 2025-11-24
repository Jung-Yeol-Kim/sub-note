"use client";

interface AnswerSheetLine {
  col1?: string; // 문1), 답) 등
  col2?: string; // 1., 2. 등
  col3?: string; // 1), 2) 등
  content: string; // 실제 답안 내용
}

interface SimpleAnswerSheetProps {
  lines: AnswerSheetLine[];
  maxLines?: number;
}

/**
 * 실제 시험 답안지 렌더러
 * 왼쪽 3칼럼 (번호/목차) + 오른쪽 메인 영역 (답안 내용)
 * 22줄 고정
 */
export function SimpleAnswerSheet({
  lines,
  maxLines = 22
}: SimpleAnswerSheetProps) {
  // 22줄로 패딩
  const paddedLines: AnswerSheetLine[] = [...lines];
  while (paddedLines.length < maxLines) {
    paddedLines.push({ content: "" });
  }

  return (
    <div className="w-full max-w-[210mm] mx-auto bg-card border-2 border-border">
      <div className="flex flex-col">
        {paddedLines.slice(0, maxLines).map((line, index) => (
          <div
            key={index}
            className="flex border-b border-border/30 last:border-b-0"
            style={{
              minHeight: "calc(297mm / 22)", // A4 높이 / 22줄
            }}
          >
            {/* 왼쪽 3개 칼럼 */}
            <div className="flex border-r-2 border-border">
              {/* 칼럼 1: 문1), 답) */}
              <div
                className="border-r border-border/30 flex items-start justify-center pt-2 px-1"
                style={{
                  width: "2.5rem",
                  fontFamily: "'D2Coding', 'Nanum Gothic Coding', 'Courier New', monospace",
                  fontSize: "0.9rem",
                }}
              >
                {line.col1 || ""}
              </div>

              {/* 칼럼 2: 1., 2. */}
              <div
                className="border-r border-border/30 flex items-start justify-center pt-2 px-1"
                style={{
                  width: "2rem",
                  fontFamily: "'D2Coding', 'Nanum Gothic Coding', 'Courier New', monospace",
                  fontSize: "0.9rem",
                }}
              >
                {line.col2 || ""}
              </div>

              {/* 칼럼 3: 1), 2) */}
              <div
                className="flex items-start justify-center pt-2 px-1"
                style={{
                  width: "2rem",
                  fontFamily: "'D2Coding', 'Nanum Gothic Coding', 'Courier New', monospace",
                  fontSize: "0.9rem",
                }}
              >
                {line.col3 || ""}
              </div>
            </div>

            {/* 오른쪽 메인 영역: 답안 내용 */}
            <div
              className="flex-1 px-3 pt-2"
              style={{
                fontFamily: "'D2Coding', 'Nanum Gothic Coding', 'Courier New', monospace",
                fontSize: "0.95rem",
                lineHeight: "1.4",
                whiteSpace: "pre-wrap",
                wordBreak: "keep-all",
              }}
            >
              {line.content || "\u00A0"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
