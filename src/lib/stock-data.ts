import yahooFinance from "yahoo-finance2";
import type { CandleData, StockDataResponse } from "./types";

export async function getStockData(
  ticker: string,
  years: number = 5
): Promise<StockDataResponse> {
  const suffix = ticker.includes(".") ? "" : ".T";
  const symbol = `${ticker}${suffix}`;

  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - years);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = await yahooFinance.chart(symbol, {
    period1: startDate.toISOString().split("T")[0],
    period2: endDate.toISOString().split("T")[0],
    interval: "1d",
  });

  const quotes = result.quotes || [];
  const candles: CandleData[] = quotes
    .filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (q: any) =>
        q.open != null &&
        q.high != null &&
        q.low != null &&
        q.close != null &&
        q.volume != null
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((q: any) => ({
      date: new Date(q.date).toISOString().split("T")[0],
      open: q.open,
      high: q.high,
      low: q.low,
      close: q.close,
      volume: q.volume,
    }));

  const dividends = result.events?.dividends || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const events = dividends.map((d: any) => ({
    date: new Date(d.date).toISOString().split("T")[0],
    type: "dividend" as const,
    description: `配当: ${d.amount}円`,
  }));

  return { candles, events };
}
