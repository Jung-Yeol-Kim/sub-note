"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const categories = ["보안", "클라우드", "데이터베이스", "네트워크", "아키텍처", "소프트웨어공학"];
const statuses = [
  { value: "draft", label: "Draft" },
  { value: "in_review", label: "In Review" },
  { value: "completed", label: "Completed" },
];

export default function NewSubNotePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    status: "draft",
    difficulty: 3,
    tags: "",
    content: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save logic with server action
    console.log("Saving sub-note:", formData);
    // router.push("/sub-notes");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/sub-notes">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sub-notes
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Create Sub-note</h1>
          <p className="text-muted-foreground mt-1">
            Write your study notes following the ITPE exam format
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the title and select a category for your sub-note
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., OAuth 2.0 Grant Types"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="Separate with commas (e.g., OAuth, Security, API)"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Add tags to help organize and find your notes
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">
                    Difficulty: {formData.difficulty}/5
                  </Label>
                  <input
                    id="difficulty"
                    type="range"
                    min="1"
                    max="5"
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        difficulty: Number.parseInt(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 w-full rounded ${
                          i < formData.difficulty ? "bg-accent" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
                <CardDescription>
                  Write your sub-note content in markdown format
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Textarea
                    id="content"
                    placeholder="# Title

## 1. 정의
Enter definition here...

## 2. Explanation
Enter detailed explanation...

## 3. Additional Notes
..."
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="min-h-[500px] font-mono text-sm"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Use markdown syntax for formatting. Follow the ITPE exam format structure.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  <Save className="mr-2 h-4 w-4" />
                  Save Sub-note
                </Button>
                <Link href="/sub-notes" className="block">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* AI Assistance */}
            <Card className="border-accent/30 bg-accent/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  AI Assistance
                </CardTitle>
                <CardDescription>Get help with your sub-note</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-sm"
                >
                  Generate from Topic
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-sm"
                >
                  Improve Structure
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-sm"
                >
                  Add Examples
                </Button>
              </CardContent>
            </Card>

            {/* Format Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Format Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Structure:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Definition (정의)</li>
                  <li>Explanation with diagrams</li>
                  <li>Classification/Types</li>
                  <li>Additional notes</li>
                </ul>
                <p className="font-medium text-foreground mt-4">Tips:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Be concise</li>
                  <li>Use technical terms</li>
                  <li>Include diagrams</li>
                  <li>Add 3-column tables</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
