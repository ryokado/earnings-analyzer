"use client";

import { TrendingUp, TrendingDown, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AnalysisResult } from "@/lib/types";

interface EarningsSummaryProps {
  analysis: AnalysisResult;
}

export function EarningsSummary({ analysis }: EarningsSummaryProps) {
  return (
    <div className="space-y-4">
      {/* 要約 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            決算要約
            <Badge variant="outline" className="ml-auto text-xs">
              AI分析
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {analysis.summary}
          </p>
        </CardContent>
      </Card>

      {/* ポジティブ / ネガティブ / 注視点 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ポジティブ */}
        <Card className="border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-green-700">
              <TrendingUp className="h-4 w-4" />
              ポジティブ要因
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5">
              {analysis.positiveFactors.map((factor, i) => (
                <li key={i} className="text-sm text-gray-700 flex gap-2">
                  <span className="text-green-500 shrink-0">+</span>
                  {factor}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* ネガティブ */}
        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-red-700">
              <TrendingDown className="h-4 w-4" />
              ネガティブ要因
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5">
              {analysis.negativeFactors.map((factor, i) => (
                <li key={i} className="text-sm text-gray-700 flex gap-2">
                  <span className="text-red-500 shrink-0">-</span>
                  {factor}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* 注視点 */}
        <Card className="border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-amber-700">
              <Eye className="h-4 w-4" />
              注視すべき論点
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5">
              {analysis.watchPoints.map((point, i) => (
                <li key={i} className="text-sm text-gray-700 flex gap-2">
                  <span className="text-amber-500 shrink-0">!</span>
                  {point}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
