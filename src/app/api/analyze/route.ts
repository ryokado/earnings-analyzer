import { NextRequest, NextResponse } from "next/server";
import { analyzeCompany } from "@/lib/claude-analyzer";
import { getStockData } from "@/lib/stock-data";
import { fetchNews } from "@/lib/news-fetcher";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEYが設定されていません。Vercelの環境変数に設定してください。" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { companyName, ticker } = body as { companyName?: string; ticker?: string };

    if (!companyName && !ticker) {
      return NextResponse.json(
        { error: "企業名または証券コードを入力してください" },
        { status: 400 }
      );
    }

    // 株価データ取得（証券コードがある場合）
    let stockSummary = "";
    if (ticker) {
      try {
        const stockData = await getStockData(ticker, 1);
        if (stockData.candles.length > 0) {
          const latest = stockData.candles[stockData.candles.length - 1];
          const oldest = stockData.candles[0];
          const yearChange = ((latest.close - oldest.close) / oldest.close * 100).toFixed(1);
          stockSummary = `\n\n--- 直近の株価情報 ---\n最新終値: ${latest.close}円 (${latest.date})\n1年前終値: ${oldest.close}円 (${oldest.date})\n1年間変化率: ${yearChange}%\n直近出来高: ${latest.volume.toLocaleString()}株`;
        }
      } catch {
        // 株価取得に失敗しても分析は続行
      }
    }

    // ニュース取得
    let newsSummary = "";
    const searchQuery = companyName || ticker || "";
    if (searchQuery) {
      try {
        const articles = await fetchNews(searchQuery, ticker);
        if (articles.length > 0) {
          const topArticles = articles.slice(0, 5).map(a => `- ${a.title} (${a.date})`).join("\n");
          newsSummary = `\n\n--- 最新ニュース ---\n${topArticles}`;
        }
      } catch {
        // ニュース取得に失敗しても分析は続行
      }
    }

    const analysis = await analyzeCompany(
      companyName || "",
      ticker || "",
      stockSummary,
      newsSummary
    );

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("分析エラー:", error);
    const message = error instanceof Error ? error.message : "分析中にエラーが発生しました";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
