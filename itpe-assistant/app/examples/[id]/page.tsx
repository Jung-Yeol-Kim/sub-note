import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Clock, FileText, Tag } from "lucide-react";
import Link from "next/link";
import { SAMPLE_ANSWERS } from "@/lib/data/sample-answers";
import { standardSubNoteToMarkdown } from "@/lib/types/subnote";
import { notFound } from "next/navigation";

export default async function SampleAnswerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const answerId = parseInt(id);

  if (isNaN(answerId) || answerId < 0 || answerId >= SAMPLE_ANSWERS.length) {
    notFound();
  }

  const answer = SAMPLE_ANSWERS[answerId];

  if (!answer || !answer.sections) {
    notFound();
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/examples">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1 space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{answer.title}</h1>
          <p className="text-muted-foreground">
            {answer.syllabusMapping?.categoryName}
            {answer.syllabusMapping?.subCategoryName &&
              ` > ${answer.syllabusMapping.subCategoryName}`}
          </p>
        </div>
        <Badge variant="outline" className="text-base">
          난이도 {answer.difficulty}
        </Badge>
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>{answer.format?.estimatedLines || 0}줄</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span>{answer.format?.pageCount || 1}페이지</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>출제 빈도: {answer.examFrequency || 0}회</span>
        </div>
      </div>

      {/* Tags */}
      {answer.tags && answer.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          {answer.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Answer Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Definition */}
          <Card>
            <CardHeader>
              <CardTitle>1. 정의</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-base leading-relaxed">
                {answer.sections.definition.content}
              </p>

              {answer.sections.definition.keywords &&
                answer.sections.definition.keywords.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2">핵심 키워드:</p>
                    <div className="flex flex-wrap gap-2">
                      {answer.sections.definition.keywords.map((keyword) => (
                        <Badge key={keyword} variant="outline">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

              {answer.sections.definition.context && (
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>배경:</strong> {answer.sections.definition.context}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Explanation */}
          <Card>
            <CardHeader>
              <CardTitle>2. {answer.sections.explanation.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {answer.sections.explanation.subsections.map((subsection, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-lg font-semibold">
                    {idx + 1}) {subsection.title || "Untitled"}
                  </h3>

                  {subsection.type === "diagram" && (
                    <div className="space-y-2">
                      <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto whitespace-pre font-mono">
                        {subsection.content}
                      </pre>
                      {subsection.description && (
                        <p className="text-sm text-muted-foreground">
                          {subsection.description}
                        </p>
                      )}
                    </div>
                  )}

                  {subsection.type === "table" && (
                    <div className="space-y-2">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b">
                              {subsection.headers.map((header, hidx) => (
                                <th
                                  key={hidx}
                                  className="text-left p-3 font-semibold bg-muted"
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {subsection.rows.map((row, ridx) => (
                              <tr key={ridx} className="border-b">
                                {row.map((cell, cidx) => (
                                  <td key={cidx} className="p-3 text-sm">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {subsection.description && (
                        <p className="text-sm text-muted-foreground">
                          {subsection.description}
                        </p>
                      )}
                    </div>
                  )}

                  {subsection.type === "text" && (
                    <div className="space-y-2">
                      <p className="text-sm leading-relaxed">{subsection.content}</p>
                      {subsection.bulletPoints &&
                        subsection.bulletPoints.length > 0 && (
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {subsection.bulletPoints.map((point, pidx) => (
                              <li key={pidx}>{point}</li>
                            ))}
                          </ul>
                        )}
                    </div>
                  )}

                  {subsection.type === "process" && (
                    <div className="space-y-3">
                      {subsection.steps.map((step, sidx) => (
                        <div key={sidx} className="border-l-4 border-primary pl-4">
                          <p className="font-semibold text-sm">
                            {step.number}. {step.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Additional */}
          {answer.sections.additional && (
            <Card>
              <CardHeader>
                <CardTitle>3. {answer.sections.additional.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">
                  {answer.sections.additional.content}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Format Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">답안 형식 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">예상 줄 수:</span>
                <span className="font-semibold">
                  {answer.format?.estimatedLines || 0}줄
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">페이지:</span>
                <span className="font-semibold">
                  {answer.format?.pageCount || 1}페이지
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">조사 생략:</span>
                <span className="font-semibold">
                  {answer.format?.particlesOmitted ? "O" : "X"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">섹션 수:</span>
                <span className="font-semibold">
                  {answer.sections.explanation.subsections.length}개
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Study Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">학습 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">난이도:</span>
                <Badge variant="outline">
                  {answer.difficulty}/5
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">출제 빈도:</span>
                <span className="font-semibold">{answer.examFrequency}회</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">활용하기</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/mock-exam/new?topic=${answer.title}`}>
                  <FileText className="mr-2 h-4 w-4" />
                  이 주제로 연습
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/sub-notes/new?template=${answerId}`}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  템플릿으로 사용
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-center pt-4">
        <Link href="/examples">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            목록으로 돌아가기
          </Button>
        </Link>
      </div>
    </div>
  );
}
