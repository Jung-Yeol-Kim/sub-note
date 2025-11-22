import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  TrendingUp,
  Tag,
  FileText,
  Sparkles,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { getExamTopic, getRelatedTopics } from "../actions";

// Mock data - will be replaced with actual database query
const getTopicMock = (id: string) => ({
  id,
  examRound: 137,
  questionNumber: 1,
  title: "Zero Trust Architecture",
  description: "제로 트러스트 보안 모델의 개념, 원칙, 구현 방안에 대해 설명하시오.",
  category: "정보보안",
  tags: ["보안", "네트워크", "인증", "Zero Trust", "ZTNA"],
  difficulty: 4,
  year: 2024,
  season: "fall",
  frequency: 3,
  relatedTopics: [],
  createdAt: "2024-11-01T00:00:00Z",
  updatedAt: "2024-11-20T10:30:00Z",
});

const mockRelatedTopics = [
  {
    id: "2",
    examRound: 136,
    questionNumber: 3,
    title: "OAuth 2.0 Grant Types",
    category: "정보보안",
    difficulty: 3,
  },
  {
    id: "3",
    examRound: 135,
    questionNumber: 5,
    title: "SBOM (Software Bill of Materials)",
    category: "정보보안",
    difficulty: 4,
  },
];

export default async function TopicDetailPage({ params }: { params: { id: string } }) {
  // In production, fetch from database
  // const result = await getExamTopic(params.id);
  // if (!result.success) {
  //   return <div>Topic not found</div>;
  // }
  // const topic = result.data;
  const topic = getTopicMock(params.id);

  // Get related topics
  // const relatedResult = await getRelatedTopics(params.id);
  // const relatedTopics = relatedResult.success ? relatedResult.data : [];
  const relatedTopics = mockRelatedTopics;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/topics">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            주제 목록으로
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            공유
          </Button>
          <Button variant="default" size="sm">
            <BookOpen className="mr-2 h-4 w-4" />
            서브노트 작성
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Topic Header Card */}
          <Card>
            <CardHeader>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <Badge variant="outline" className="text-sm">
                    {topic.examRound}회 #{topic.questionNumber}
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    {topic.season === "spring" ? "상반기" : "하반기"} {topic.year}
                  </Badge>
                </div>
                <CardTitle className="text-3xl">{topic.title}</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-sm">
                    {topic.category}
                  </Badge>
                  {topic.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-sm">
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">문제 설명</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {topic.description}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3">주요 키워드</h3>
                  <div className="flex flex-wrap gap-2">
                    {topic.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Answer Guidelines Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                답안 작성 가이드
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">1. 정의 및 개념</h4>
                  <p className="text-muted-foreground">
                    {topic.title}의 기본 개념과 등장 배경, 필요성을 명확히 설명
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2. 핵심 구성 요소</h4>
                  <p className="text-muted-foreground">
                    주요 구성 요소나 아키텍처를 다이어그램과 함께 설명
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">3. 특징 및 장단점</h4>
                  <p className="text-muted-foreground">
                    기술적 특징, 장점과 단점을 표 형식으로 정리
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">4. 적용 사례 및 고려사항</h4>
                  <p className="text-muted-foreground">
                    실제 적용 사례나 구현 시 고려해야 할 사항 기술
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Topics */}
          {relatedTopics.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">연관 주제</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {relatedTopics.map((related) => (
                    <Link key={related.id} href={`/topics/${related.id}`}>
                      <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/5 hover:border-accent/40 transition-smooth cursor-pointer">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {related.examRound}회 #{related.questionNumber}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {related.category}
                            </Badge>
                          </div>
                          <p className="font-medium text-sm">{related.title}</p>
                        </div>
                        <div className="flex items-center gap-1 ml-4">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-1.5 w-1.5 rounded-full ${
                                i < related.difficulty ? "bg-accent" : "bg-muted"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">상세 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  시험 회차
                </p>
                <p className="text-sm font-medium">
                  {topic.examRound}회 ({topic.season === "spring" ? "상반기" : "하반기"} {topic.year})
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <FileText className="h-3 w-3" />
                  문제 번호
                </p>
                <p className="text-sm font-medium">#{topic.questionNumber}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Tag className="h-3 w-3" />
                  출제 분야
                </p>
                <p className="text-sm font-medium">{topic.category}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">난이도</p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-2 rounded-full ${
                        i < topic.difficulty ? "bg-accent" : "bg-muted"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium">{topic.difficulty}/5</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <TrendingUp className="h-3 w-3" />
                  출제 빈도
                </p>
                <p className="text-sm font-medium">{topic.frequency}회 출제</p>
              </div>
            </CardContent>
          </Card>

          {/* AI Actions */}
          <Card className="border-accent/30 bg-accent/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                AI 도우미
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                답안 작성 시작
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Sparkles className="mr-2 h-4 w-4" />
                AI 답안 생성
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="mr-2 h-4 w-4" />
                출제 트렌드 분석
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">학습 통계</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">내 서브노트</span>
                <span className="font-medium">0개</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">커뮤니티 답안</span>
                <span className="font-medium">0개</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">AI 평가</span>
                <span className="font-medium">0개</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
