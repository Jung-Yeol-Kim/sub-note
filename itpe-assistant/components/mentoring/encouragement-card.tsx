"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface EncouragementCardProps {
  message: string;
}

export function EncouragementCard({ message }: EncouragementCardProps) {
  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">오늘의 격려</h3>
            <p className="text-foreground/80">{message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
