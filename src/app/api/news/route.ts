import { NextRequest, NextResponse } from "next/server";
import { fetchNews } from "@/lib/news-fetcher";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const ticker = searchParams.get("ticker") || undefined;

    if (!query) {
      return NextResponse.json(
        { error: "検索クエリが指定されていません" },
        { status: 400 }
      );
    }

    const articles = await fetchNews(query, ticker);

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("ニュース取得エラー:", error);
    return NextResponse.json(
      { error: "ニュースの取得に失敗しました" },
      { status: 500 }
    );
  }
}
