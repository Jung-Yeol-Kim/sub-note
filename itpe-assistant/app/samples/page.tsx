"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, BookOpen } from "lucide-react";
import Link from "next/link";
import { AnswerSheetViewer } from "@/components/answer-sheet/answer-sheet-viewer";
import {
  type AnswerSheetDocument,
  createTextBlock,
  createTableBlock,
  validateDocument,
} from "@/lib/types/answer-sheet-block";

// Sample answer data
interface SampleAnswer {
  id: string;
  title: string;
  category: string;
  examPeriod: string;
  subject: string;
  document: AnswerSheetDocument;
  fileName: string;
}

// Helper function to create and validate document
const createSampleDocument = (blocks: AnswerSheetDocument["blocks"]): AnswerSheetDocument => {
  const doc: AnswerSheetDocument = {
    blocks,
    totalLines: blocks.length > 0 ? Math.max(...blocks.map(b => b.lineEnd)) : 0,
    metadata: {
      isValid: true,
      validationErrors: [],
      validationWarnings: [],
    },
  };

  const validation = validateDocument(doc);
  doc.metadata = {
    isValid: validation.isValid,
    validationErrors: validation.errors,
    validationWarnings: validation.warnings,
  };

  return doc;
};

const sampleAnswers: SampleAnswer[] = [
  {
    id: "1",
    title: "Purdue 모델",
    category: "보안",
    examPeriod: "1교시",
    subject: "정보보안",
    fileName: "1교시_보안_Purdue모델.pdf",
    document: createSampleDocument([
      createTextBlock(["Purdue - 샘플 답안", "", "(데이터 변환 예정)"], 1),
    ]),
  },
  {
    id: "2",
    title: "디지털 포렌식",
    category: "보안",
    examPeriod: "2교시",
    subject: "정보보안",
    fileName: "2교시_보안_디지털포렌식.pdf",
    document: createSampleDocument([
      createTextBlock(["디지털 포렌식 - 샘플 답안", "", "(데이터 변환 예정)"], 1),
    ]),
  },
  {
    id: "3",
    title: "옵티마이저",
    category: "데이터베이스",
    examPeriod: "1교시",
    subject: "데이터베이스",
    fileName: "1교시_DB_옵티마이저.pdf",
    document: createSampleDocument([
      createTextBlock(["옵티마이저 - 샘플 답안", "", "(데이터 변환 예정)"], 1),
    ]),
  },
  {
    id: "4",
    title: "NoSQL",
    category: "데이터베이스",
    examPeriod: "2교시",
    subject: "데이터베이스",
    fileName: "2교시_DB_NoSQL.pdf",
    document: createSampleDocument([
      createTextBlock(["NoSQL - 샘플 답안", "", "(데이터 변환 예정)"], 1),
    ]),
  },
  {
    id: "5",
    title: "QoS (Quality of Service)",
    category: "네트워크",
    examPeriod: "2교시",
    subject: "네트워크",
    fileName: "2교시_네트워크_QoS.pdf",
    document: createSampleDocument([
      createTextBlock(["QoS - 샘플 답안", "", "(데이터 변환 예정)"], 1),
    ]),
  },
  {
    id: "6",
    title: "ISO 21500",
    category: "소프트웨어공학",
    examPeriod: "1교시",
    subject: "프로젝트관리",
    fileName: "1교시_SW_ISO21500.pdf",
    document: createSampleDocument([
      createTextBlock(["ISO 21500 - 샘플 답안", "", "(데이터 변환 예정)"], 1),
    ]),
  },
];

export default function SamplesPage() {
  const [selectedSample, setSelectedSample] = useState<SampleAnswer | null>(
    sampleAnswers[0]
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/sub-notes">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              서브노트 목록으로
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">샘플 답안</h1>
          <p className="text-muted-foreground mt-1">
            합격 답안 샘플을 답안지 형식으로 학습하세요
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar - Sample List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                샘플 목록
              </CardTitle>
              <CardDescription>
                {sampleAnswers.length}개의 합격 답안
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {sampleAnswers.map((sample) => (
                <Button
                  key={sample.id}
                  variant={selectedSample?.id === sample.id ? "default" : "outline"}
                  className="w-full justify-start h-auto py-3 px-3"
                  onClick={() => setSelectedSample(sample)}
                >
                  <div className="flex flex-col items-start gap-1 w-full">
                    <div className="flex items-center gap-2 w-full">
                      <FileText className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm font-semibold truncate">
                        {sample.title}
                      </span>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {sample.examPeriod}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {sample.category}
                      </Badge>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="border-accent/30 bg-accent/5">
            <CardHeader>
              <CardTitle className="text-sm">학습 가이드</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <p>✓ 정의 → 구조/표 → 고려사항 형식</p>
              <p>✓ 간결한 문장, 조사 생략</p>
              <p>✓ 다이어그램과 3단 표 활용</p>
              <p>✓ 핵심 키워드 강조</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Answer Sheet Viewer */}
        <div className="lg:col-span-3">
          {selectedSample ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">
                      {selectedSample.title}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{selectedSample.examPeriod}</Badge>
                      <Badge variant="outline">{selectedSample.category}</Badge>
                      <Badge variant="outline">{selectedSample.subject}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      파일: {selectedSample.fileName}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <AnswerSheetViewer
                  document={selectedSample.document}
                  showHeader={false}
                  showPrintButton={true}
                  title={selectedSample.title}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>왼쪽에서 샘플 답안을 선택하세요</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
