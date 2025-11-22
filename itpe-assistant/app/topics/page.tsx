import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, FileText, Calendar, TrendingUp, BookOpen } from "lucide-react";
import Link from "next/link";
import { getExamTopics, getTopicStatistics } from "./actions";

// Mock data - will be replaced with actual database queries
const mockTopics = [
  {
    id: "1",
    examRound: 137,
    questionNumber: 1,
    title: "Zero Trust Architecture",
    description: "제로 트러스트 보안 모델의 개념과 구현 방안",
    category: "정보보안",
    tags: ["보안", "네트워크", "인증"],
    difficulty: 4,
    year: 2024,
    season: "fall",
    frequency: 3,
  },
  {
    id: "2",
    examRound: 137,
    questionNumber: 2,
    title: "Kubernetes Service Mesh",
    description: "쿠버네티스 환경에서 서비스 메시의 역할과 구현",
    category: "정보시스템구축관리",
    tags: ["클라우드", "컨테이너", "MSA"],
    difficulty: 5,
    year: 2024,
    season: "fall",
    frequency: 2,
  },
  {
    id: "3",
    examRound: 136,
    questionNumber: 3,
    title: "OAuth 2.0 Grant Types",
    description: "OAuth 2.0의 다양한 인증 방식과 보안 고려사항",
    category: "정보보안",
    tags: ["인증", "보안", "API"],
    difficulty: 3,
    year: 2024,
    season: "spring",
    frequency: 5,
  },
  {
    id: "4",
    examRound: 136,
    questionNumber: 5,
    title: "Database Sharding",
    description: "대용량 데이터베이스 샤딩 전략과 구현 방안",
    category: "데이터베이스",
    tags: ["데이터베이스", "확장성", "분산"],
    difficulty: 4,
    year: 2024,
    season: "spring",
    frequency: 4,
  },
  {
    id: "5",
    examRound: 135,
    questionNumber: 2,
    title: "API Gateway Pattern",
    description: "마이크로서비스 아키텍처에서 API Gateway의 역할",
    category: "정보시스템구축관리",
    tags: ["아키텍처", "MSA", "API"],
    difficulty: 3,
    year: 2023,
    season: "fall",
    frequency: 6,
  },
  {
    id: "6",
    examRound: 135,
    questionNumber: 4,
    title: "SBOM (Software Bill of Materials)",
    description: "소프트웨어 공급망 보안을 위한 SBOM의 활용",
    category: "정보보안",
    tags: ["보안", "공급망", "취약점"],
    difficulty: 4,
    year: 2023,
    season: "fall",
    frequency: 2,
  },
];

const categories = [
  "전체",
  "정보 전략 및 관리",
  "소프트웨어공학",
  "업무 프로세스",
  "정보시스템구축관리",
  "정보보안",
  "최신기술",
];

const difficulties = [
  { value: "all", label: "전체" },
  { value: "1", label: "⭐ 매우 쉬움" },
  { value: "2", label: "⭐⭐ 쉬움" },
  { value: "3", label: "⭐⭐⭐ 보통" },
  { value: "4", label: "⭐⭐⭐⭐ 어려움" },
  { value: "5", label: "⭐⭐⭐⭐⭐ 매우 어려움" },
];

const seasons = [
  { value: "all", label: "전체" },
  { value: "spring", label: "상반기" },
  { value: "fall", label: "하반기" },
];

export default async function TopicsPage() {
  // In production, fetch from database
  // const result = await getExamTopics();
  // const topics = result.success ? result.data : [];
  const topics = mockTopics;

  // Get statistics
  // const statsResult = await getTopicStatistics();
  // const stats = statsResult.success ? statsResult.data : null;

  // Extract unique exam rounds for filter
  const examRounds = Array.from(new Set(topics.map(t => t.examRound)))
    .sort((a, b) => b - a);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">시험 주제</h1>
          <p className="text-muted-foreground">
            정보관리기술사 기출 문제 주제 모음
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="hidden sm:flex">
            <TrendingUp className="mr-2 h-4 w-4" />
            트렌드 분석
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 주제</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topics.length}</div>
            <p className="text-xs text-muted-foreground">
              {examRounds.length}개 회차
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">최신 회차</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{examRounds[0] || "-"}회</div>
            <p className="text-xs text-muted-foreground">
              {topics.filter(t => t.examRound === examRounds[0]).length}개 문제
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">인기 주제</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {topics.reduce((max, t) => t.frequency > max ? t.frequency : max, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              최대 출제 빈도
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">카테고리</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(topics.map(t => t.category)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              출제 분야
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="주제 검색..."
                  className="pl-9"
                />
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="회차" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 회차</SelectItem>
                {examRounds.map((round) => (
                  <SelectItem key={round} value={round.toString()}>
                    {round}회
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="난이도" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((diff) => (
                  <SelectItem key={diff.value} value={diff.value}>
                    {diff.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="시기" />
              </SelectTrigger>
              <SelectContent>
                {seasons.map((season) => (
                  <SelectItem key={season.value} value={season.value}>
                    {season.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Topics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <Link key={topic.id} href={`/topics/${topic.id}`}>
            <Card className="h-full transition-smooth hover:shadow-md hover:border-accent/40 cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">
                    {topic.examRound}회 #{topic.questionNumber}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {topic.season === "spring" ? "상반기" : "하반기"} {topic.year}
                  </Badge>
                </div>
                <CardTitle className="text-lg line-clamp-2 mb-2">
                  {topic.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {topic.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {topic.category}
                    </Badge>
                    {topic.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {topic.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{topic.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>출제 {topic.frequency}회</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 w-1.5 rounded-full ${
                            i < topic.difficulty
                              ? "bg-accent"
                              : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {topics.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">주제가 없습니다</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              아직 등록된 시험 주제가 없습니다.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
