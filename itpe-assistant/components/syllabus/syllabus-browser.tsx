"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, ChevronDown, ChevronRight, BookOpen, FileText } from "lucide-react";
import syllabusData from "@/lib/data/syllabus.json";

interface SyllabusBrowserProps {
  onSelect?: (categoryId: string, topicId: string) => void;
  selectedCategoryId?: string;
  selectedTopicId?: string;
  compact?: boolean;
}

export function SyllabusBrowser({
  onSelect,
  selectedCategoryId,
  selectedTopicId,
  compact = false,
}: SyllabusBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return syllabusData.categories;

    const query = searchQuery.toLowerCase();
    return syllabusData.categories
      .map(category => ({
        ...category,
        mainTopics: category.mainTopics.filter(
          topic =>
            topic.name.toLowerCase().includes(query) ||
            topic.details.some(detail => detail.toLowerCase().includes(query))
        ),
      }))
      .filter(category =>
        category.name.toLowerCase().includes(query) ||
        category.mainTopics.length > 0
      );
  }, [searchQuery]);

  const handleTopicSelect = (categoryId: string, topicId: string) => {
    onSelect?.(categoryId, topicId);
  };

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="출제기준 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        <ScrollArea className="h-[300px]">
          <div className="space-y-1">
            {filteredCategories.map((category) => (
              <div key={category.id}>
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent rounded-md transition-colors"
                >
                  {expandedCategories.has(category.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <span className="font-medium">{category.id}. {category.name}</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {category.mainTopics.length}
                  </Badge>
                </button>

                {expandedCategories.has(category.id) && (
                  <div className="ml-6 mt-1 space-y-1">
                    {category.mainTopics.map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => handleTopicSelect(category.id, topic.id)}
                        className={`w-full text-left px-2 py-1 text-sm rounded-md transition-colors ${
                          selectedTopicId === topic.id
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent/50"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <FileText className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{topic.name}</div>
                            {topic.details.length > 0 && (
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {topic.details.slice(0, 2).join(", ")}
                                {topic.details.length > 2 && "..."}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <CardTitle>출제기준</CardTitle>
        </div>
        <CardDescription>
          {syllabusData.effectivePeriod}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="출제기준 검색 (카테고리, 주제, 세부항목...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-3">
            {filteredCategories.map((category) => (
              <Collapsible
                key={category.id}
                open={expandedCategories.has(category.id)}
                onOpenChange={() => toggleCategory(category.id)}
              >
                <CollapsibleTrigger className="w-full">
                  <div className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    selectedCategoryId === category.id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-accent"
                  }`}>
                    {expandedCategories.has(category.id) ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-base">
                        {category.id}. {category.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {category.mainTopics.length}개 주제
                      </div>
                    </div>
                    <Badge variant="secondary">{category.id}</Badge>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent className="mt-2 ml-8 space-y-2">
                  {category.mainTopics.map((topic) => (
                    <div
                      key={topic.id}
                      onClick={() => handleTopicSelect(category.id, topic.id)}
                      className={`p-3 rounded-md border cursor-pointer transition-colors ${
                        selectedTopicId === topic.id
                          ? "border-accent bg-accent text-accent-foreground"
                          : "hover:bg-accent/50"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium mb-1">{topic.name}</div>
                          {topic.details.length > 0 && (
                            <ul className="text-sm text-muted-foreground space-y-0.5">
                              {topic.details.map((detail, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <span className="text-xs mt-0.5">•</span>
                                  <span>{detail}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {topic.id}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>검색 결과가 없습니다</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Compact selector for forms
export function SyllabusSelector({
  value,
  onChange,
}: {
  value?: { categoryId: string; topicId: string };
  onChange: (categoryId: string, topicId: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedText = useMemo(() => {
    if (!value) return "출제기준 선택";

    const category = syllabusData.categories.find(c => c.id === value.categoryId);
    if (!category) return "출제기준 선택";

    const topic = category.mainTopics.find(t => t.id === value.topicId);
    return topic ? `${category.name} > ${topic.name}` : category.name;
  }, [value]);

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left border rounded-md hover:bg-accent transition-colors"
      >
        <div className="flex items-center justify-between">
          <span className={value ? "text-foreground" : "text-muted-foreground"}>
            {selectedText}
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </button>

      {isOpen && (
        <div className="border rounded-md p-4">
          <SyllabusBrowser
            compact
            selectedCategoryId={value?.categoryId}
            selectedTopicId={value?.topicId}
            onSelect={(categoryId, topicId) => {
              onChange(categoryId, topicId);
              setIsOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
