"use client";

import { AlertTriangle } from "lucide-react";

export function Disclaimer() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-800">
      <div className="flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold mb-1">免責事項</p>
          <p>
            本サービスは情報整理・分析補助を目的としており、投資助言を行うものではありません。
            表示される分析結果はAIによる自動生成であり、正確性・完全性を保証するものではありません。
            投資判断は必ずご自身の責任で行ってください。
          </p>
        </div>
      </div>
    </div>
  );
}
