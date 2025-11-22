"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Heart, Trophy, Zap } from "lucide-react";

interface EncouragementMessageProps {
  message: string;
  type: "motivation" | "celebration" | "support" | "reminder";
}

const typeConfig = {
  motivation: {
    icon: Zap,
    gradient: "from-blue-500/20 to-purple-500/20",
    borderColor: "border-blue-500/30",
    iconColor: "text-blue-500",
  },
  celebration: {
    icon: Trophy,
    gradient: "from-yellow-500/20 to-orange-500/20",
    borderColor: "border-yellow-500/30",
    iconColor: "text-yellow-500",
  },
  support: {
    icon: Heart,
    gradient: "from-pink-500/20 to-red-500/20",
    borderColor: "border-pink-500/30",
    iconColor: "text-pink-500",
  },
  reminder: {
    icon: Sparkles,
    gradient: "from-green-500/20 to-teal-500/20",
    borderColor: "border-green-500/30",
    iconColor: "text-green-500",
  },
};

export function EncouragementMessage({ message, type }: EncouragementMessageProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Card className={`shadow-sm border-2 ${config.borderColor} bg-gradient-to-br ${config.gradient}`}>
      <CardContent className="pt-6">
        <div className="flex gap-3">
          <Icon className={`h-6 w-6 ${config.iconColor} flex-shrink-0 mt-0.5`} />
          <div>
            <p className="text-sm font-medium leading-relaxed">{message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
