import Anthropic from "@anthropic-ai/sdk";
import type { AnalysisResult } from "./types";

const ANALYSIS_PROMPT = `あなたは日本企業の決算分析の専門家です。以下の決算説明資料のテキストを分析し、JSON形式で結果を返してください。

必ず以下の構造でJSONを返してください（JSON以外のテキストは含めないでください）:

{
  "companyName": "会社名",
  "ticker": "証券コード（4桁の数字。特定できない場合は空文字列）",
  "fiscalPeriod": "決算期（例: 2024年3月期 第3四半期）",
  "issueDate": "資料の発行日（YYYY-MM-DD形式、不明の場合は空文字列）",
  "summary": "決算の要約（3〜7行程度）",
  "positiveFactors": ["ポジティブ要因1", "ポジティブ要因2", ...],
  "negativeFactors": ["ネガティブ要因1", "ネガティブ要因2", ...],
  "watchPoints": ["注視すべき論点1", "注視すべき論点2", ...],
  "kpis": [
    {
      "name": "KPI名（例: 売上高）",
      "currentValue": "今期の値（単位付き）",
      "previousValue": "前期の値（単位付き）",
      "changeRate": "変化率（例: +5.2%）"
    }
  ],
  "scenarios": {
    "bull": {
      "label": "強気シナリオ",
      "assumptions": "前提条件",
      "rationale": "根拠",
      "risks": "リスク"
    },
    "neutral": {
      "label": "中立シナリオ",
      "assumptions": "前提条件",
      "rationale": "根拠",
      "risks": "リスク"
    },
    "bear": {
      "label": "弱気シナリオ",
      "assumptions": "前提条件",
      "rationale": "根拠",
      "risks": "リスク"
    }
  }
}

注意事項:
- ポジティブ要因・ネガティブ要因はそれぞれ3〜5個抽出してください
- KPIは売上高、営業利益、経常利益、純利益、利益率など主要指標を含めてください
- シナリオ分析は資料の内容に基づいて、現実的な分析をしてください
- 投資助言ではなく、情報の整理・分析であることを意識してください
- 証券コードが資料から特定できない場合、会社名から推測しないでください`;

export async function analyzeEarnings(
  pdfText: string,
  userTicker?: string
): Promise<AnalysisResult> {
  const userContext = userTicker
    ? `\n\nユーザーが入力した証券コード: ${userTicker}`
    : "";

  const client = new Anthropic();
  const message = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `${ANALYSIS_PROMPT}${userContext}\n\n--- 決算説明資料テキスト ---\n${pdfText.slice(0, 100000)}`,
      },
    ],
  });

  const responseText =
    message.content[0].type === "text" ? message.content[0].text : "";

  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Claude APIからのレスポンスをパースできませんでした");
  }

  const result: AnalysisResult = JSON.parse(jsonMatch[0]);

  if (userTicker && !result.ticker) {
    result.ticker = userTicker;
  }

  return result;
}
