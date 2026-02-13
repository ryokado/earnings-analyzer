"use client";

import { useAnalysis } from "@/hooks/useAnalysis";
import { PdfUploader } from "@/components/upload/PdfUploader";
import { CompanyInfo } from "@/components/company/CompanyInfo";
import { StockChart } from "@/components/chart/StockChart";
import { EarningsSummary } from "@/components/analysis/EarningsSummary";
import { KpiTable } from "@/components/analysis/KpiTable";
import { ScenarioAnalysis } from "@/components/analysis/ScenarioAnalysis";
import { PriceReaction } from "@/components/reaction/PriceReaction";
import { NewsTimeline } from "@/components/news/NewsTimeline";
import { Disclaimer } from "@/components/common/Disclaimer";
import { LoadingState } from "@/components/common/LoadingState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, BarChart3 } from "lucide-react";

export default function Home() {
  const { state, analyze, reset } = useAnalysis();
  const { status, analysis, stockData, news, priceReactions, error } = state;

  const isLoading =
    status === "uploading" ||
    status === "analyzing" ||
    status === "fetching_stock" ||
    status === "fetching_news";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* ヘッダー */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-blue-600" />
          決算分析サービス
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          決算説明資料（PDF）をアップロードして、AIによる分析・株価データ・ニュースを統合表示
        </p>
      </header>

      {/* ディスクレーマー */}
      <div className="mb-6">
        <Disclaimer />
      </div>

      {/* アップロード */}
      <div className="mb-8">
        <PdfUploader onSubmit={analyze} isLoading={isLoading} />
      </div>

      {/* ローディング */}
      {isLoading && <LoadingState status={status} />}

      {/* エラー */}
      {status === "error" && error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
          <button
            onClick={reset}
            className="ml-auto text-red-600 underline text-xs"
          >
            リセット
          </button>
        </div>
      )}

      {/* 分析結果 */}
      {status === "complete" && analysis && (
        <div className="space-y-6">
          {/* 企業情報 */}
          <CompanyInfo analysis={analysis} />

          {/* タブ表示 */}
          <Tabs defaultValue="summary">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="summary">要約</TabsTrigger>
              <TabsTrigger value="kpi">KPI</TabsTrigger>
              <TabsTrigger value="scenario">シナリオ</TabsTrigger>
              <TabsTrigger value="chart">株価</TabsTrigger>
              <TabsTrigger value="news">ニュース</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-4">
              <EarningsSummary analysis={analysis} />
            </TabsContent>

            <TabsContent value="kpi" className="mt-4">
              <KpiTable kpis={analysis.kpis} />
            </TabsContent>

            <TabsContent value="scenario" className="mt-4">
              <ScenarioAnalysis scenarios={analysis.scenarios} />
            </TabsContent>

            <TabsContent value="chart" className="mt-4 space-y-4">
              {stockData && stockData.candles.length > 0 ? (
                <>
                  <StockChart
                    candles={stockData.candles}
                    events={stockData.events}
                    companyName={analysis.companyName}
                  />
                  {priceReactions.length > 0 && (
                    <PriceReaction reactions={priceReactions} />
                  )}
                </>
              ) : (
                <div className="text-center py-12 text-gray-500 text-sm">
                  {analysis.ticker
                    ? "株価データを取得できませんでした"
                    : "証券コードが特定できなかったため、株価データを表示できません"}
                </div>
              )}
            </TabsContent>

            <TabsContent value="news" className="mt-4">
              {news && news.articles.length > 0 ? (
                <NewsTimeline articles={news.articles} />
              ) : (
                <div className="text-center py-12 text-gray-500 text-sm">
                  ニュースが見つかりませんでした
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* データ出典 */}
          <div className="border-t pt-4 mt-8">
            <p className="text-xs text-gray-400">
              データ出典: PDF分析 — Claude AI (Anthropic) / 株価データ — Yahoo
              Finance / ニュース — Google News RSS
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700 border border-blue-200">
                PDF由来
              </span>
              <span className="text-xs text-gray-400">
                = 決算資料から抽出した情報
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700 border border-gray-200 ml-2">
                外部データ
              </span>
              <span className="text-xs text-gray-400">
                = 外部サービスから取得した情報
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-purple-50 text-purple-700 border border-purple-200 ml-2">
                AI分析
              </span>
              <span className="text-xs text-gray-400">
                = AIが生成した分析結果
              </span>
            </div>
          </div>

          {/* フッター ディスクレーマー */}
          <Disclaimer />
        </div>
      )}
    </div>
  );
}
