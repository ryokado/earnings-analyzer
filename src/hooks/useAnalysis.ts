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

  const analyze = useCallback(async (companyName: string, ticker: string) => {
    setState({
      ...initialState,
      status: "analyzing",
    });

    try {
      // Step 1: Claude AI 分析（サーバー側で株価・ニュースも取得）
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, ticker }),
      });

      const responseText = await analyzeRes.text();

      if (!analyzeRes.ok) {
        let errorMessage = `分析に失敗しました (HTTP ${analyzeRes.status})`;
        try {
          const err = JSON.parse(responseText);
          errorMessage = err.error || errorMessage;
        } catch {
          if (responseText) errorMessage = responseText.slice(0, 200);
        }
        throw new Error(errorMessage);
      }

      let analysis: AnalysisResult;
      try {
        analysis = JSON.parse(responseText);
      } catch {
        throw new Error(`サーバーからの応答を解析できませんでした: ${responseText.slice(0, 100)}`);
      }

      setState((prev) => ({ ...prev, analysis }));

      const resolvedTicker = analysis.ticker || ticker;

      // Step 2: 株価データ + ニュースを並行取得（チャート・タイムライン用）
      setState((prev) => ({ ...prev, status: "fetching_stock" }));

      const [stockData, newsData] = await Promise.all([
        resolvedTicker ? fetchStockData(resolvedTicker) : null,
        analysis.companyName
          ? fetchNewsData(analysis.companyName, resolvedTicker)
          : null,
      ]);

      // Step 3: 株価反応分析
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
