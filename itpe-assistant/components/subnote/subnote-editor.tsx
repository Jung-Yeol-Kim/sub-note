"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, GripVertical, Table, Image as ImageIcon, List, AlertCircle } from "lucide-react";
import { StandardSubNote, AnswerSection, calculateEstimatedLines, validateSubNote } from "@/lib/types/subnote";
import { SyllabusSelector } from "@/components/syllabus/syllabus-browser";
import syllabusData from "@/lib/data/syllabus.json";

interface SubNoteEditorProps {
  initialData?: Partial<StandardSubNote>;
  onChange?: (data: Partial<StandardSubNote>) => void;
  onSave?: (data: StandardSubNote) => void;
}

export function SubNoteEditor({ initialData, onChange, onSave }: SubNoteEditorProps) {
  const [formData, setFormData] = useState<Partial<StandardSubNote>>(
    initialData || {
      title: "",
      tags: [],
      difficulty: 3,
      syllabusMapping: undefined,
      sections: {
        definition: {
          content: "",
          keywords: [],
        },
        explanation: {
          title: "",
          subsections: [],
        },
      },
      format: {
        estimatedLines: 30,
        pageCount: 1,
        hasEmoji: false,
        particlesOmitted: true,
      },
      study: {
        status: "draft",
        practiceCount: 0,
        confidenceLevel: 3,
      },
    }
  );

  const [tagInput, setTagInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    onChange?.(formData);

    // Update estimated lines
    if (formData.sections) {
      const estimatedLines = calculateEstimatedLines(formData as StandardSubNote);
      setFormData(prev => ({
        ...prev,
        format: {
          ...prev.format!,
          estimatedLines,
          pageCount: estimatedLines > 25 ? 2 : 1,
        },
      }));
    }
  }, [formData, onChange]);

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(t => t !== tag) || [],
    });
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formData.sections?.definition.keywords.includes(keywordInput.trim())) {
      setFormData({
        ...formData,
        sections: {
          ...formData.sections!,
          definition: {
            ...formData.sections!.definition,
            keywords: [...formData.sections!.definition.keywords, keywordInput.trim()],
          },
        },
      });
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      sections: {
        ...formData.sections!,
        definition: {
          ...formData.sections!.definition,
          keywords: formData.sections!.definition.keywords.filter(k => k !== keyword),
        },
      },
    });
  };

  const handleAddSection = (type: "diagram" | "table" | "text" | "process") => {
    const newSection: AnswerSection = type === "diagram"
      ? { type: "diagram", title: "", content: "" }
      : type === "table"
      ? { type: "table", title: "", headers: ["항목", "내용", "비고"], rows: [["", "", ""]] }
      : type === "process"
      ? { type: "process", title: "", steps: [{ number: 1, title: "", description: "" }] }
      : { type: "text", content: "" };

    setFormData({
      ...formData,
      sections: {
        ...formData.sections!,
        explanation: {
          ...formData.sections!.explanation,
          subsections: [...formData.sections!.explanation.subsections, newSection],
        },
      },
    });
  };

  const handleRemoveSection = (index: number) => {
    setFormData({
      ...formData,
      sections: {
        ...formData.sections!,
        explanation: {
          ...formData.sections!.explanation,
          subsections: formData.sections!.explanation.subsections.filter((_, i) => i !== index),
        },
      },
    });
  };

  const handleUpdateSection = (index: number, updatedSection: AnswerSection) => {
    const updatedSubsections = [...formData.sections!.explanation.subsections];
    updatedSubsections[index] = updatedSection;

    setFormData({
      ...formData,
      sections: {
        ...formData.sections!,
        explanation: {
          ...formData.sections!.explanation,
          subsections: updatedSubsections,
        },
      },
    });
  };

  const handleSave = () => {
    const validation = validateSubNote(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);
    onSave?.(formData as StandardSubNote);
  };

  return (
    <div className="space-y-6">
      {/* Validation Errors */}
      {errors.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              입력 오류
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
          <CardDescription>제목, 출제기준, 태그 등을 입력하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              placeholder="예: OAuth 2.0 Grant Types"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>출제기준 매핑 *</Label>
            <SyllabusSelector
              value={formData.syllabusMapping ? {
                categoryId: formData.syllabusMapping.categoryId,
                topicId: formData.syllabusMapping.subCategoryId || "",
              } : undefined}
              onChange={(categoryId, topicId) => {
                const category = syllabusData.categories.find(c => c.id === categoryId);
                const topic = category?.mainTopics.find(t => t.id === topicId);

                setFormData({
                  ...formData,
                  syllabusMapping: {
                    categoryId: categoryId as any,
                    categoryName: category?.name || "",
                    subCategoryId: topicId,
                    subCategoryName: topic?.name,
                  },
                });
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>난이도: {formData.difficulty}/5</Label>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({ ...formData, difficulty: Number.parseInt(e.target.value) as any })
                }
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
              />
            </div>

            <div className="space-y-2">
              <Label>예상 페이지</Label>
              <div className="flex items-center gap-2 h-10">
                <Badge variant={formData.format?.pageCount === 1 ? "default" : "outline"}>
                  {formData.format?.pageCount || 1}페이지
                </Badge>
                <span className="text-sm text-muted-foreground">
                  (약 {formData.format?.estimatedLines || 0}줄)
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>태그</Label>
            <div className="flex gap-2">
              <Input
                placeholder="태그 입력 후 Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags?.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Definition Section */}
      <Card>
        <CardHeader>
          <CardTitle>1. 정의</CardTitle>
          <CardDescription>명확하고 간결한 정의를 작성하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="definition">정의 내용 *</Label>
            <Textarea
              id="definition"
              placeholder="예: OAuth 2.0은 인증 및 권한 부여를 위한 개방형 표준 프로토콜로, 리소스 소유자의 승인 하에 클라이언트가 보호된 리소스에 접근할 수 있도록 하는 프레임워크이다."
              value={formData.sections?.definition.content}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  sections: {
                    ...formData.sections!,
                    definition: {
                      ...formData.sections!.definition,
                      content: e.target.value,
                    },
                  },
                })
              }
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>핵심 키워드 *</Label>
            <div className="flex gap-2">
              <Input
                placeholder="키워드 입력 후 Enter"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddKeyword())}
              />
              <Button type="button" onClick={handleAddKeyword} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.sections?.definition.keywords.map((keyword) => (
                <Badge key={keyword} variant="default">
                  {keyword}
                  <button
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="context">배경/맥락 (선택)</Label>
            <Textarea
              id="context"
              placeholder="출제 배경, 필요성 등..."
              value={formData.sections?.definition.context || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  sections: {
                    ...formData.sections!,
                    definition: {
                      ...formData.sections!.definition,
                      context: e.target.value,
                    },
                  },
                })
              }
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Explanation Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>2. 설명</CardTitle>
              <CardDescription>다이어그램, 표, 텍스트 등을 추가하세요</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddSection("diagram")}
              >
                <ImageIcon className="h-4 w-4 mr-1" />
                다이어그램
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddSection("table")}
              >
                <Table className="h-4 w-4 mr-1" />
                표
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddSection("text")}
              >
                <List className="h-4 w-4 mr-1" />
                텍스트
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="explanation-title">설명 제목 *</Label>
            <Input
              id="explanation-title"
              placeholder="예: OAuth 2.0 설명"
              value={formData.sections?.explanation.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  sections: {
                    ...formData.sections!,
                    explanation: {
                      ...formData.sections!.explanation,
                      title: e.target.value,
                    },
                  },
                })
              }
            />
          </div>

          <div className="space-y-4">
            {formData.sections?.explanation.subsections.map((section, index) => (
              <SectionEditor
                key={index}
                section={section}
                index={index}
                onUpdate={(updated) => handleUpdateSection(index, updated)}
                onRemove={() => handleRemoveSection(index)}
              />
            ))}

            {formData.sections?.explanation.subsections.length === 0 && (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                <p>섹션을 추가하여 내용을 작성하세요</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-2">
        <Button onClick={handleSave} size="lg">
          저장
        </Button>
      </div>
    </div>
  );
}

// Section Editor Component
function SectionEditor({
  section,
  index,
  onUpdate,
  onRemove,
}: {
  section: AnswerSection;
  index: number;
  onUpdate: (section: AnswerSection) => void;
  onRemove: () => void;
}) {
  if (section.type === "diagram") {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline">다이어그램 {index + 1}</Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={onRemove}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="다이어그램 제목"
            value={section.title}
            onChange={(e) => onUpdate({ ...section, title: e.target.value })}
          />
          <Textarea
            placeholder="ASCII 다이어그램 또는 설명..."
            value={section.content}
            onChange={(e) => onUpdate({ ...section, content: e.target.value })}
            className="min-h-[150px] font-mono text-sm"
          />
          <Input
            placeholder="다이어그램 설명 (선택)"
            value={section.description || ""}
            onChange={(e) => onUpdate({ ...section, description: e.target.value })}
          />
        </CardContent>
      </Card>
    );
  }

  if (section.type === "table") {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline">표 {index + 1}</Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={onRemove}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="표 제목"
            value={section.title}
            onChange={(e) => onUpdate({ ...section, title: e.target.value })}
          />

          {/* Table Headers */}
          <div className="grid grid-cols-3 gap-2">
            {section.headers.map((header, idx) => (
              <Input
                key={idx}
                placeholder={`열 ${idx + 1}`}
                value={header}
                onChange={(e) => {
                  const newHeaders = [...section.headers];
                  newHeaders[idx] = e.target.value;
                  onUpdate({ ...section, headers: newHeaders });
                }}
              />
            ))}
          </div>

          {/* Table Rows */}
          {section.rows.map((row, rowIdx) => (
            <div key={rowIdx} className="grid grid-cols-3 gap-2">
              {row.map((cell, cellIdx) => (
                <Input
                  key={cellIdx}
                  placeholder={`행${rowIdx + 1}-열${cellIdx + 1}`}
                  value={cell}
                  onChange={(e) => {
                    const newRows = [...section.rows];
                    newRows[rowIdx][cellIdx] = e.target.value;
                    onUpdate({ ...section, rows: newRows });
                  }}
                />
              ))}
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const newRows = [...section.rows, ["", "", ""]];
              onUpdate({ ...section, rows: newRows });
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            행 추가
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (section.type === "text") {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline">텍스트 {index + 1}</Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={onRemove}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="내용..."
            value={section.content}
            onChange={(e) => onUpdate({ ...section, content: e.target.value })}
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>
    );
  }

  return null;
}
