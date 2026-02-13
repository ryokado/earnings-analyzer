import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPdf } from "@/lib/pdf-parser";
import { analyzeEarnings } from "@/lib/claude-analyzer";

export const maxDuration = 60;

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEYが設定されていません。Vercelの環境変数に設定してください。" },
        { status: 500 }
      );
    }

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

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "ファイルサイズが大きすぎます（上限: 4MB）" },
        { status: 413 }
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
    const message = error instanceof Error ? error.message : "分析中にエラーが発生しました";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
