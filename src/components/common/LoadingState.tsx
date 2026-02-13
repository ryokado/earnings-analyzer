"use client";

import { Loader2 } from "lucide-react";
import type { AnalysisState } from "@/lib/types";

const statusMessages: Record<AnalysisState["status"], string> = {
  idle: "",
  uploading: "PDFをアップロード中...",
  analyzing: "Claude AIが決算資料を分析中...",
  fetching_stock: "株価データ・ニュースを取得中...",
  fetching_news: "ニュースを取得中...",
  complete: "",
  error: "",
};

interface LoadingStateProps {
  status: AnalysisState["status"];
}

export function LoadingState({ status }: LoadingStateProps) {
  const message = statusMessages[status];
  if (!message) return null;

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
}
