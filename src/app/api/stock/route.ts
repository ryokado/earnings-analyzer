import { NextRequest, NextResponse } from "next/server";
import { getStockData } from "@/lib/stock-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get("ticker");
    const years = parseInt(searchParams.get("years") || "5", 10);

    if (!ticker) {
      return NextResponse.json(
        { error: "証券コードが指定されていません" },
        { status: 400 }
      );
    }

    const data = await getStockData(ticker, years);

    return NextResponse.json(data);
  } catch (error) {
    console.error("株価データ取得エラー:", error);
    return NextResponse.json(
      { error: "株価データの取得に失敗しました" },
      { status: 500 }
    );
  }
}
