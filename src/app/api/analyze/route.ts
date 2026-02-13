import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPdf } from "@/lib/pdf-parser";
import { analyzeEarnings } from "@/lib/claude-analyzer";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("pdf") as File | null;
    const ticker = formData.get("ticker") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "PDFファイルが提供されていません" },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { error: "PDFファイルのみ対応しています" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const pdfText = await extractTextFromPdf(buffer);

    if (!pdfText || pdfText.trim().length < 50) {
      return NextResponse.json(
        { error: "PDFからテキストを抽出できませんでした" },
        { status: 422 }
      );
    }

    const analysis = await analyzeEarnings(
      pdfText,
      ticker || undefined
    );

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("分析エラー:", error);
    return NextResponse.json(
      { error: "分析中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
