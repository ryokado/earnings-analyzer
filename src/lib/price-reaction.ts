import type { CandleData, StockEvent, PriceReactionItem } from "./types";

export function calculatePriceReactions(
  candles: CandleData[],
  events: StockEvent[]
): PriceReactionItem[] {
  if (candles.length === 0 || events.length === 0) return [];

  const dateToIndex = new Map<string, number>();
  candles.forEach((c, i) => dateToIndex.set(c.date, i));

  return events.map((event) => {
    const eventIdx = findNearestTradingDay(candles, event.date, dateToIndex);
    if (eventIdx === -1) {
      return {
        eventDate: event.date,
        eventDescription: event.description,
        eventType: event.type,
        priceAtEvent: 0,
        change1d: null,
        change1w: null,
        change1m: null,
        isSignificant: false,
      };
    }

    const priceAtEvent = candles[eventIdx].close;
    const change1d = calcChange(candles, eventIdx, 1, priceAtEvent);
    const change1w = calcChange(candles, eventIdx, 5, priceAtEvent);
    const change1m = calcChange(candles, eventIdx, 21, priceAtEvent);

    const isSignificant =
      change1d !== null && Math.abs(change1d) > 3;

    return {
      eventDate: event.date,
      eventDescription: event.description,
      eventType: event.type,
      priceAtEvent,
      change1d,
      change1w,
      change1m,
      isSignificant,
    };
  });
}

function findNearestTradingDay(
  candles: CandleData[],
  date: string,
  dateToIndex: Map<string, number>
): number {
  if (dateToIndex.has(date)) return dateToIndex.get(date)!;

  const targetTime = new Date(date).getTime();
  let bestIdx = -1;
  let bestDiff = Infinity;

  for (let i = 0; i < candles.length; i++) {
    const diff = Math.abs(new Date(candles[i].date).getTime() - targetTime);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i;
    }
  }

  // 5営業日以内の最も近い日を使用
  if (bestDiff > 5 * 24 * 60 * 60 * 1000) return -1;
  return bestIdx;
}

function calcChange(
  candles: CandleData[],
  baseIdx: number,
  daysAhead: number,
  basePrice: number
): number | null {
  const targetIdx = baseIdx + daysAhead;
  if (targetIdx >= candles.length) return null;
  const futurePrice = candles[targetIdx].close;
  return Number((((futurePrice - basePrice) / basePrice) * 100).toFixed(2));
}
