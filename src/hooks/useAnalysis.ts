"use client";

import { useState, useCallback } from "react";
import type {
  AnalysisState,
  AnalysisResult,
  StockDataResponse,
  NewsResponse,
  PriceReactionItem,
} from "@/lib/types";
import { calculatePriceReactions } from "@/lib/price-reaction";

const initialState: AnalysisState = {
  status: "idle",
  analysis: null,
  stockData: null,
  news: null,
  priceReactions: [],
  error: null,
};

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>(initialState);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const analyze = useCallback(async (file: File, ticker?: string) => {
    setState((prev) => ({
      ...prev,
      status: "uploading",
      error: null,
    }));

    try {
      // Step 1: PDF解析 + Claude分析
      setState((prev) => ({ ...prev, status: "analyzing" }));
      const formData = new FormData();
      formData.append("pdf", file);
      if (ticker) formData.append("ticker", ticker);

      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!analyzeRes.ok) {
        let errorMessage = "分析に失敗しました";
        try {
          const err = await analyzeRes.json();
          errorMessage = err.error || errorMessage;
        } catch {
          const text = await analyzeRes.text().catch(() => "");
          if (text) errorMessage = text;
        }
        throw new Error(errorMessage);
      }

      let analysis: AnalysisResult;
      try {
        analysis = await analyzeRes.json();
      } catch {
        throw new Error("サーバーからの応答を解析できませんでした。もう一度お試しください。");
      }
      setState((prev) => ({ ...prev, analysis }));

      const resolvedTicker = analysis.ticker || ticker;

      // Step 2 & 3: 株価データ + ニュースを並行取得
      setState((prev) => ({ ...prev, status: "fetching_stock" }));

      const [stockData, newsData] = await Promise.all([
        resolvedTicker ? fetchStockData(resolvedTicker) : null,
        analysis.companyName
          ? fetchNewsData(analysis.companyName, resolvedTicker)
          : null,
      ]);

      // Step 4: 株価反応分析
      let priceReactions: PriceReactionItem[] = [];
      if (stockData && stockData.events.length > 0) {
        priceReactions = calculatePriceReactions(
          stockData.candles,
          stockData.events
        );
      }

      setState({
        status: "complete",
        analysis,
        stockData,
        news: newsData,
        priceReactions,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        status: "error",
        error:
          error instanceof Error ? error.message : "予期しないエラーが発生しました",
      }));
    }
  }, []);

  return { state, analyze, reset };
}

async function fetchStockData(
  ticker: string
): Promise<StockDataResponse | null> {
  try {
    const res = await fetch(`/api/stock?ticker=${encodeURIComponent(ticker)}&years=5`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchNewsData(
  companyName: string,
  ticker?: string
): Promise<NewsResponse | null> {
  try {
    const params = new URLSearchParams({ query: companyName });
    if (ticker) params.set("ticker", ticker);
    const res = await fetch(`/api/news?${params.toString()}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
