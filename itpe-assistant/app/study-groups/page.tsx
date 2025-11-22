import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Target, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function StudyGroupsPage() {
  // Mock data
  const myGroups = [
    {
      id: "1",
      name: "2025년 상반기 합격 도전반",
      description: "2025년 5월 시험 목표, 주 3회 온라인 스터디",
      memberCount: 8,
      maxMembers: 10,
      targetExamDate: new Date("2025-05-15"),
      focusAreas: ["클라우드", "보안", "네트워크"],
      role: "member",
    },
  ];

  const availableGroups = [
    {
      id: "2",
      name: "클라우드 기술 집중 스터디",
      description: "AWS, Azure, GCP 등 클라우드 기술 중점 학습",
      memberCount: 5,
      maxMembers: 8,
      focusAreas: ["클라우드", "DevOps"],
      difficulty: "intermediate",
    },
    {
      id: "3",
      name: "보안 전문가 양성 그룹",
      description: "Zero Trust, IAM, 암호화 등 보안 도메인 완벽 정복",
      memberCount: 6,
      maxMembers: 10,
      focusAreas: ["보안", "네트워크"],
      difficulty: "advanced",
    },
    {
      id: "4",
      name: "초보자 환영 스터디",
      description: "기초부터 차근차근, 서로 도우며 성장하는 그룹",
      memberCount: 7,
      maxMembers: 12,
      focusAreas: ["전분야"],
      difficulty: "beginner",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          스터디 그룹
        </h1>
        <p className="text-lg text-muted-foreground">
          함께 공부하며 동기부여를 받으세요
        </p>
      </div>

      {/* Create Group Button */}
      <Card className="shadow-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">
                새로운 스터디 그룹을 만들어보세요
              </h3>
              <p className="text-muted-foreground">
                같은 목표를 가진 동료들과 함께 학습하세요
              </p>
            </div>
            <Link href="/study-groups/new">
              <Button size="lg">
                그룹 만들기
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* My Groups */}
      {myGroups.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">내 스터디 그룹</h2>
          {myGroups.map((group) => (
            <Card key={group.id} className="shadow-sm border-primary/30">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{group.name}</CardTitle>
                    <CardDescription>{group.description}</CardDescription>
                  </div>
                  <Badge>{group.role === "member" ? "멤버" : "리더"}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {group.focusAreas.map((area, index) => (
                    <Badge key={index} variant="outline">
                      {area}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 py-4 border-t border-b">
                  <div className="text-center">
                    <Users className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                    <div className="font-semibold">
                      {group.memberCount} / {group.maxMembers}
                    </div>
                    <div className="text-xs text-muted-foreground">멤버</div>
                  </div>
                  <div className="text-center border-x">
                    <Calendar className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                    <div className="font-semibold">
                      {group.targetExamDate.toLocaleDateString("ko-KR", {
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground">목표 시험일</div>
                  </div>
                  <div className="text-center">
                    <Target className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                    <div className="font-semibold">주 3회</div>
                    <div className="text-xs text-muted-foreground">모임</div>
                  </div>
                </div>

                <Link href={`/study-groups/${group.id}`}>
                  <Button className="w-full">
                    그룹 활동 보기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Available Groups */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">참여 가능한 그룹</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {availableGroups.map((group) => (
            <Card key={group.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <Badge
                    variant={
                      group.difficulty === "beginner"
                        ? "default"
                        : group.difficulty === "intermediate"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {group.difficulty === "beginner"
                      ? "초급"
                      : group.difficulty === "intermediate"
                        ? "중급"
                        : "고급"}
                  </Badge>
                </div>
                <CardDescription>{group.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {group.focusAreas.map((area, index) => (
                    <Badge key={index} variant="outline">
                      {area}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>
                      {group.memberCount} / {group.maxMembers} 명
                    </span>
                  </div>
                  <Link href={`/study-groups/${group.id}`}>
                    <Button variant="outline" size="sm">
                      자세히 보기
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Mentoring Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>멘토-멘티 프로그램</CardTitle>
          <CardDescription>
            경험있는 선배의 도움을 받거나, 후배를 도와주세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg border bg-card/50">
              <TrendingUp className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">멘토 찾기</h3>
              <p className="text-sm text-muted-foreground mb-4">
                합격 경험이 있거나 실력있는 멘토의 1:1 지도를 받으세요
              </p>
              <Link href="/mentoring/find-mentor">
                <Button variant="outline" className="w-full">
                  멘토 찾기
                </Button>
              </Link>
            </div>

            <div className="p-4 rounded-lg border bg-card/50">
              <Users className="h-8 w-8 text-accent mb-3" />
              <h3 className="font-semibold mb-2">멘티 모집</h3>
              <p className="text-sm text-muted-foreground mb-4">
                후배들에게 경험과 지식을 공유하며 함께 성장하세요
              </p>
              <Link href="/mentoring/be-mentor">
                <Button variant="outline" className="w-full">
                  멘토 되기
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
