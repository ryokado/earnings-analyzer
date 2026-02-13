"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CompanySearchProps {
  onSubmit: (companyName: string, ticker: string) => void;
  isLoading: boolean;
}

export function CompanySearch({ onSubmit, isLoading }: CompanySearchProps) {
  const [companyName, setCompanyName] = useState("");
  const [ticker, setTicker] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() && !ticker.trim()) return;
    onSubmit(companyName.trim(), ticker.trim());
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              企業名
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="例: トヨタ自動車"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              証券コード
            </label>
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              placeholder="例: 7203"
              maxLength={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              企業名または証券コードのいずれかを入力してください
            </p>
          </div>

          <Button
            type="submit"
            disabled={(!companyName.trim() && !ticker.trim()) || isLoading}
            className="w-full"
            size="lg"
          >
            <Search className="h-4 w-4 mr-2" />
            {isLoading ? "分析中..." : "分析を開始"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
