"use client";

import { TrendingUp, Minus, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ScenarioSet } from "@/lib/types";

interface ScenarioAnalysisProps {
  scenarios: ScenarioSet;
}

const scenarioConfig = [
  {
    key: "bull" as const,
    icon: TrendingUp,
    color: "text-green-700",
    borderColor: "border-green-200",
    bgColor: "bg-green-50",
  },
  {
    key: "neutral" as const,
    icon: Minus,
    color: "text-gray-700",
    borderColor: "border-gray-200",
    bgColor: "bg-gray-50",
  },
  {
    key: "bear" as const,
    icon: TrendingDown,
    color: "text-red-700",
    borderColor: "border-red-200",
    bgColor: "bg-red-50",
  },
];

export function ScenarioAnalysis({ scenarios }: ScenarioAnalysisProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          シナリオ分析
          <Badge variant="outline" className="ml-auto text-xs">
            AI分析
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenarioConfig.map(({ key, icon: Icon, color, borderColor, bgColor }) => {
            const scenario = scenarios[key];
            return (
              <div
                key={key}
                className={`rounded-lg border ${borderColor} ${bgColor} p-4 space-y-3`}
              >
                <div className={`flex items-center gap-2 font-semibold ${color}`}>
                  <Icon className="h-4 w-4" />
                  {scenario.label}
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-medium text-gray-600 text-xs mb-0.5">前提条件</p>
                    <p className="text-gray-700">{scenario.assumptions}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600 text-xs mb-0.5">根拠</p>
                    <p className="text-gray-700">{scenario.rationale}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600 text-xs mb-0.5">リスク</p>
                    <p className="text-gray-700">{scenario.risks}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
