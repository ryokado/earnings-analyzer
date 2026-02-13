// ===== 分析結果の型定義 =====

export interface AnalysisResult {
  companyName: string;
  ticker: string;
  fiscalPeriod: string;
  issueDate: string;
  summary: string;
  positiveFactors: string[];
  negativeFactors: string[];
  watchPoints: string[];
  kpis: KpiItem[];
  scenarios: ScenarioSet;
}

export interface KpiItem {
  name: string;
  currentValue: string;
  previousValue: string;
  changeRate: string;
}

export interface ScenarioSet {
  bull: Scenario;
  neutral: Scenario;
  bear: Scenario;
}

export interface Scenario {
  label: string;
  assumptions: string;
  rationale: string;
  risks: string;
}

// ===== 株価データの型定義 =====

export interface CandleData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockEvent {
  date: string;
  type: "earnings" | "news" | "dividend";
  description: string;
}

export interface StockDataResponse {
  candles: CandleData[];
  events: StockEvent[];
}

// ===== ニュースの型定義 =====

export interface NewsArticle {
  title: string;
  url: string;
  date: string;
  source: string;
  snippet: string;
}

export interface NewsResponse {
  articles: NewsArticle[];
}

// ===== 株価反応分析の型定義 =====

export interface PriceReactionItem {
  eventDate: string;
  eventDescription: string;
  eventType: "earnings" | "news" | "dividend";
  priceAtEvent: number;
  change1d: number | null;
  change1w: number | null;
  change1m: number | null;
  isSignificant: boolean;
}

// ===== 分析フロー全体の状態 =====

export interface AnalysisState {
  status: "idle" | "uploading" | "analyzing" | "fetching_stock" | "fetching_news" | "complete" | "error";
  analysis: AnalysisResult | null;
  stockData: StockDataResponse | null;
  news: NewsResponse | null;
  priceReactions: PriceReactionItem[];
  error: string | null;
}
