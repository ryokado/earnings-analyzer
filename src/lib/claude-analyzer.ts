import Anthropic from "@anthropic-ai/sdk";
import type { AnalysisResult } from "./types";

const ANALYSIS_PROMPT = `あなたは日本企業の決算・業績分析の専門家です。与えられた企業情報・株価情報・ニュースをもとに分析し、JSON形式で結果を返してください。

必ず以下の構造でJSONを返してください（JSON以外のテキストは含めないでください）:

{
  "companyName": "会社名（正式名称）",
  "ticker": "証券コード（4桁の数字）",
  "fiscalPeriod": "最新の決算期（例: 2025年3月期）",
  "issueDate": "分析日（今日の日付をYYYY-MM-DD形式で）",
  "summary": "企業の業績・事業状況の要約（3〜7行程度。直近の業績動向、事業環境、成長戦略などを含む）",
  "positiveFactors": ["ポジティブ要因1", "ポジティブ要因2", ...],
  "negativeFactors": ["ネガティブ要因1", "ネガティブ要因2", ...],
  "watchPoints": ["注視すべき論点1", "注視すべき論点2", ...],
  "kpis": [
    {
      "name": "KPI名（例: 売上高）",
      "currentValue": "直近の値（単位付き。不明の場合は「—」）",
      "previousValue": "前期の値（単位付き。不明の場合は「—」）",
      "changeRate": "変化率（例: +5.2%。不明の場合は「—」）"
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
- KPIは売上高、営業利益、経常利益、純利益など主要指標を含めてください（あなたの知識に基づいて）
- シナリオ分析は現実的な分析をしてください
- 投資助言ではなく、情報の整理・分析であることを意識してください
- 知らない情報は無理に埋めず「—」としてください`;

export async function analyzeCompany(
  companyName: string,
  ticker: string,
  stockSummary: string,
  newsSummary: string
): Promise<AnalysisResult> {
  const client = new Anthropic();

  const userMessage = `以下の企業について分析してください。

企業名: ${companyName || "（証券コードから特定してください）"}
証券コード: ${ticker || "（不明）"}
${stockSummary}${newsSummary}`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `${ANALYSIS_PROMPT}\n\n${userMessage}`,
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

  if (ticker && !result.ticker) {
    result.ticker = ticker;
  }

  return result;
}
