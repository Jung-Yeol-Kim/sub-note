"use client";

import { useMemo } from "react";
import { FileText, Hash, Table as TableIcon } from "lucide-react";

interface ReportViewerProps {
  content: string;
}

interface CategorySection {
  category: string;
  count: number;
  questions: string[];
}

export function ReportViewer({ content }: ReportViewerProps) {
  const sections = useMemo(() => {
    const lines = content.split("\n");
    const parsedSections: {
      header?: { round: string; date: string; total: string };
      frequencyTable?: string[][];
      categories: CategorySection[];
    } = { categories: [] };

    let currentSection: CategorySection | null = null;
    let inFrequencyTable = false;
    const tableRows: string[][] = [];

    lines.forEach((line) => {
      // Parse header metadata
      if (line.includes("**분석일자**")) {
        const match = line.match(/\*\*분석일자\*\*:\s*(.+)/);
        if (match) {
          parsedSections.header = parsedSections.header || {
            round: "",
            date: "",
            total: "",
          };
          parsedSections.header.date = match[1];
        }
      }

      if (line.includes("**시험회차**")) {
        const match = line.match(/\*\*시험회차\*\*:\s*(.+)/);
        if (match) {
          parsedSections.header = parsedSections.header || {
            round: "",
            date: "",
            total: "",
          };
          parsedSections.header.round = match[1];
        }
      }

      if (line.includes("**총 문제 수**")) {
        const match = line.match(/\*\*총 문제 수\*\*:\s*(.+)/);
        if (match) {
          parsedSections.header = parsedSections.header || {
            round: "",
            date: "",
            total: "",
          };
          parsedSections.header.total = match[1];
        }
      }

      // Parse frequency table
      if (line.includes("주요항목별 출제 빈도")) {
        inFrequencyTable = true;
      }

      if (inFrequencyTable && line.startsWith("|") && !line.includes("---")) {
        const cells = line
          .split("|")
          .map((cell) => cell.trim())
          .filter((cell) => cell);
        if (cells.length > 0 && !cells[0].includes("주요항목")) {
          tableRows.push(cells);
        }
      }

      if (
        inFrequencyTable &&
        line.includes("카테고리별 출제 문제 상세")
      ) {
        inFrequencyTable = false;
        parsedSections.frequencyTable = tableRows;
      }

      // Parse category sections
      const categoryMatch = line.match(/###\s*(\d+)\.\s*([^(]+)\s*\((\d+)문제\)/);
      if (categoryMatch) {
        if (currentSection) {
          parsedSections.categories.push(currentSection);
        }
        currentSection = {
          category: categoryMatch[2].trim(),
          count: parseInt(categoryMatch[3]),
          questions: [],
        };
      }

      // Parse questions
      if (currentSection && line.startsWith("-")) {
        const question = line.replace(/^-\s*/, "").trim();
        if (question) {
          currentSection.questions.push(question);
        }
      }
    });

    if (currentSection) {
      parsedSections.categories.push(currentSection);
    }

    return parsedSections;
  }, [content]);

  return (
    <div className="space-y-6">
      {/* Frequency Table */}
      {sections.frequencyTable && sections.frequencyTable.length > 0 && (
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div className="flex items-center gap-2 mb-4">
            <TableIcon className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground font-crimson">
              주요항목별 출제 빈도
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="text-left py-3 px-4 text-sm font-bold text-foreground">
                    주요항목
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-foreground">
                    문제수
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-foreground">
                    비율
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-foreground">
                    출제율
                  </th>
                </tr>
              </thead>
              <tbody>
                {sections.frequencyTable.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-foreground">
                      {row[0]}
                    </td>
                    <td className="py-3 px-4 text-sm text-center font-medium text-foreground">
                      {row[1]}
                    </td>
                    <td className="py-3 px-4 text-sm text-center text-muted-foreground">
                      {row[2]}
                    </td>
                    <td className="py-3 px-4 text-sm text-secondary font-medium">
                      {row[3]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Category Details */}
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
        <div className="flex items-center gap-2 mb-6">
          <Hash className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground font-crimson">
            카테고리별 출제 문제 상세
          </h2>
        </div>

        <div className="space-y-8">
          {sections.categories.map((section, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-sm font-bold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {section.category}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {section.count}문제 출제
                  </p>
                </div>
              </div>

              <div className="ml-11 space-y-2">
                {section.questions.map((question, qIndex) => (
                  <div
                    key={qIndex}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary/20 text-secondary text-xs font-medium flex-shrink-0 mt-0.5">
                      {qIndex + 1}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {question}
                    </p>
                  </div>
                ))}
              </div>

              {index < sections.categories.length - 1 && (
                <div className="mt-6 border-b border-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
