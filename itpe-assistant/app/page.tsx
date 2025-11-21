import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Sparkles, TrendingUp, Clock, Target } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-lg text-muted-foreground">
          Continue your journey to becoming an IT Professional Engineer
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-accent/20 shadow-sm transition-smooth hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Sub-notes</CardTitle>
            <BookOpen className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif">24</div>
            <p className="text-xs text-muted-foreground">+3 this week</p>
          </CardContent>
        </Card>

        <Card className="border-accent/20 shadow-sm transition-smooth hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif">32.5</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="border-accent/20 shadow-sm transition-smooth hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
            <Target className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif">78</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
          </CardContent>
        </Card>

        <Card className="border-accent/20 shadow-sm transition-smooth hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Topics Covered</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif">142</div>
            <p className="text-xs text-muted-foreground">Out of 500+</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Recent Sub-notes</CardTitle>
            <CardDescription>Your latest study materials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "OAuth 2.0 Grant Types", category: "보안", status: "completed" },
              { title: "Kubernetes Architecture", category: "클라우드", status: "in_review" },
              { title: "Zero Trust Security", category: "보안", status: "draft" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50 transition-smooth hover:bg-card hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                </div>
                <Badge
                  variant={
                    item.status === "completed"
                      ? "default"
                      : item.status === "in_review"
                        ? "secondary"
                        : "outline"
                  }
                  className="text-xs"
                >
                  {item.status}
                </Badge>
              </div>
            ))}
            <Link href="/sub-notes">
              <Button variant="outline" className="w-full mt-2">
                View All Sub-notes
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* AI Suggestions */}
        <Card className="shadow-sm border-accent/30">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              AI Suggestions
            </CardTitle>
            <CardDescription>Recommended topics to study next</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                title: "API Gateway Patterns",
                rationale: "Trending in recent exams",
                priority: "high",
              },
              {
                title: "Service Mesh Architecture",
                rationale: "Related to your weak areas",
                priority: "medium",
              },
              {
                title: "Container Security Best Practices",
                rationale: "Complements your recent studies",
                priority: "medium",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-3 rounded-lg border border-accent/20 bg-accent/5 transition-smooth hover:bg-accent/10"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-sm">{item.title}</p>
                  <Badge
                    variant={item.priority === "high" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {item.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{item.rationale}</p>
              </div>
            ))}
            <Link href="/ai-suggestions">
              <Button className="w-full mt-2 bg-primary hover:bg-primary/90">
                Explore All Suggestions
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Quick Actions</CardTitle>
          <CardDescription>Common tasks to help you study efficiently</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/sub-notes/new">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <BookOpen className="h-5 w-5" />
                <span>Create Sub-note</span>
              </Button>
            </Link>
            <Link href="/topics">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <FileText className="h-5 w-5" />
                <span>Browse Topics</span>
              </Button>
            </Link>
            <Link href="/evaluations/new">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <Target className="h-5 w-5" />
                <span>Request Evaluation</span>
              </Button>
            </Link>
            <Link href="/community">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <Sparkles className="h-5 w-5" />
                <span>Community Notes</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
