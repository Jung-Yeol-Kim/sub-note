import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  FileText,
  Lightbulb,
  CheckCircle2,
  TrendingUp,
  Clock,
} from "lucide-react";
import Link from "next/link";
import {
  SAMPLE_ANSWERS,
  getSampleAnswersByCategory,
} from "@/lib/data/sample-answers";
import {
  KKAKDUGI_19_LINES_GUIDE,
  KKAKDUGI_EXAMPLES,
  ANSWER_WRITING_CHECKLIST,
  SCORE_IMPROVEMENT_STRATEGIES,
} from "@/lib/data/answer-templates";
import { SYLLABUS_CATEGORIES } from "@/lib/types/subnote";

export default function ExamplesPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">샘플 답안 및 작성 가이드</h1>
        <p className="text-muted-foreground">
          고득점 샘플 답안 예시와 깍두기 작성 전략
        </p>
      </div>

      <Tabs defaultValue="samples" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="samples">
            <FileText className="mr-2 h-4 w-4" />
            샘플 답안
          </TabsTrigger>
          <TabsTrigger value="kkakdugi">
            <BookOpen className="mr-2 h-4 w-4" />
            깍두기 가이드
          </TabsTrigger>
          <TabsTrigger value="checklist">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            체크리스트
          </TabsTrigger>
          <TabsTrigger value="strategies">
            <TrendingUp className="mr-2 h-4 w-4" />
            점수 향상
          </TabsTrigger>
        </TabsList>

        {/* 샘플 답안 탭 */}
        <TabsContent value="samples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>고품질 샘플 답안 (6개)</CardTitle>
              <CardDescription>
                실제 시험 형식을 따르는 우수 답안 예시 - data/샘플_답안 기반
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {SAMPLE_ANSWERS.map((answer, idx) => (
                  <Card key={idx} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{answer.title}</CardTitle>
                        <Badge variant="outline">
                          난이도 {answer.difficulty}
                        </Badge>
                      </div>
                      <CardDescription>
                        {answer.syllabusMapping?.categoryName}
                        {answer.syllabusMapping?.subCategoryName &&
                          ` > ${answer.syllabusMapping.subCategoryName}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {answer.tags?.slice(0, 4).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {answer.sections?.definition.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {answer.format?.estimatedLines || 0}줄
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {answer.sections?.explanation.subsections.length || 0}개 섹션
                        </span>
                      </div>
                      <Link href={`/examples/${idx}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          상세 보기
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 카테고리별 분류 */}
          <Card>
            <CardHeader>
              <CardTitle>출제기준별 분류</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(SYLLABUS_CATEGORIES).map(([id, name]) => {
                const answers = getSampleAnswersByCategory(id);
                if (answers.length === 0) return null;
                return (
                  <div key={id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{name}</p>
                      <p className="text-sm text-muted-foreground">
                        {answers.map((a) => a.title).join(", ")}
                      </p>
                    </div>
                    <Badge>{answers.length}개</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 깍두기 가이드 탭 */}
        <TabsContent value="kkakdugi" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>깍두기 (19칸) 작성 가이드</CardTitle>
              <CardDescription>
                {KKAKDUGI_19_LINES_GUIDE.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 구조 가이드 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">답안지 구조 (19줄 배분)</h3>
                <div className="space-y-3">
                  {KKAKDUGI_19_LINES_GUIDE.structure.map((item, idx) => (
                    <div key={idx} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{item.lines}줄</Badge>
                          <span className="font-medium">{item.section}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.content}</p>
                      <div className="bg-muted p-3 rounded text-sm font-mono whitespace-pre-wrap">
                        {item.example}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 작성 팁 */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  작성 팁
                </h3>
                <ul className="space-y-2">
                  {KKAKDUGI_19_LINES_GUIDE.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 흔한 실수 */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-red-600">흔한 실수</h3>
                <ul className="space-y-2">
                  {KKAKDUGI_19_LINES_GUIDE.commonMistakes.map((mistake, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-red-500">✗</span>
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 템플릿 예시 */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">템플릿 예시</h3>
                <div className="grid gap-4">
                  {KKAKDUGI_EXAMPLES.map((example, idx) => (
                    <Card key={idx}>
                      <CardHeader>
                        <CardTitle className="text-base">{example.topic}</CardTitle>
                        <CardDescription>
                          총 {example.linesUsed}줄 사용
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <pre className="bg-muted p-4 rounded text-xs overflow-x-auto whitespace-pre-wrap font-mono">
                          {example.template}
                        </pre>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 체크리스트 탭 */}
        <TabsContent value="checklist" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>답안 작성 체크리스트</CardTitle>
              <CardDescription>
                제출 전 반드시 확인해야 할 항목들
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">구조 (Structure)</h3>
                  <ul className="space-y-2">
                    {ANSWER_WRITING_CHECKLIST.structure.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <input type="checkbox" className="mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">내용 (Content)</h3>
                  <ul className="space-y-2">
                    {ANSWER_WRITING_CHECKLIST.content.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <input type="checkbox" className="mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">형식 (Format)</h3>
                  <ul className="space-y-2">
                    {ANSWER_WRITING_CHECKLIST.format.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <input type="checkbox" className="mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">키워드 (Keywords)</h3>
                  <ul className="space-y-2">
                    {ANSWER_WRITING_CHECKLIST.keywords.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <input type="checkbox" className="mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 점수 향상 전략 탭 */}
        <TabsContent value="strategies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>점수 향상 전략</CardTitle>
              <CardDescription>
                3점 → 4점, 4점 → 5점 상승을 위한 구체적 액션 플랜
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 3점 → 4점 */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-blue-600">
                  {SCORE_IMPROVEMENT_STRATEGIES.from3to4.title}
                </h3>
                <div className="space-y-4">
                  {SCORE_IMPROVEMENT_STRATEGIES.from3to4.strategies.map(
                    (strategy, idx) => (
                      <Card key={idx}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">{strategy.area}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {strategy.actions.map((action, aidx) => (
                              <li
                                key={aidx}
                                className="flex items-start gap-2 text-sm"
                              >
                                <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                                <span>{action}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              </div>

              {/* 4점 → 5점 */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-purple-600">
                  {SCORE_IMPROVEMENT_STRATEGIES.from4to5.title}
                </h3>
                <div className="space-y-4">
                  {SCORE_IMPROVEMENT_STRATEGIES.from4to5.strategies.map(
                    (strategy, idx) => (
                      <Card key={idx}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">{strategy.area}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {strategy.actions.map((action, aidx) => (
                              <li
                                key={aidx}
                                className="flex items-start gap-2 text-sm"
                              >
                                <TrendingUp className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                                <span>{action}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
