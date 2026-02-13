"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  type IChartApi,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type ISeriesApi,
  ColorType,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
  type CandlestickData,
  type SingleValueData,
  type Time,
} from "lightweight-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CandleData, StockEvent } from "@/lib/types";
import { EventMarkers } from "./EventMarkers";

interface StockChartProps {
  candles: CandleData[];
  events: StockEvent[];
  companyName: string;
}

function calcSMA(data: CandleData[], period: number): SingleValueData<Time>[] {
  const result: SingleValueData<Time>[] = [];
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    result.push({
      time: data[i].date as Time,
      value: sum / period,
    });
  }
  return result;
}

export function StockChart({ candles, events, companyName }: StockChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const candleSeriesRef = useRef<ISeriesApi<any> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || candles.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#ffffff" },
        textColor: "#333",
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      grid: {
        vertLines: { color: "#f0f0f0" },
        horzLines: { color: "#f0f0f0" },
      },
      crosshair: {
        mode: 0,
      },
      rightPriceScale: {
        borderColor: "#e0e0e0",
      },
      timeScale: {
        borderColor: "#e0e0e0",
        timeVisible: false,
      },
    });

    chartRef.current = chart;

    // ロウソク足
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#ef4444",
      downColor: "#3b82f6",
      borderUpColor: "#ef4444",
      borderDownColor: "#3b82f6",
      wickUpColor: "#ef4444",
      wickDownColor: "#3b82f6",
    });

    const candleData: CandlestickData<Time>[] = candles.map((c) => ({
      time: c.date as Time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));
    candleSeries.setData(candleData);
    candleSeriesRef.current = candleSeries;

    // 出来高
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });

    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    const volumeData = candles.map((c) => ({
      time: c.date as Time,
      value: c.volume,
      color: c.close >= c.open ? "rgba(239,68,68,0.3)" : "rgba(59,130,246,0.3)",
    }));
    volumeSeries.setData(volumeData);

    // 移動平均線
    const sma5 = calcSMA(candles, 5);
    const sma25 = calcSMA(candles, 25);
    const sma75 = calcSMA(candles, 75);

    const sma5Series = chart.addSeries(LineSeries, {
      color: "#f59e0b",
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    sma5Series.setData(sma5);

    const sma25Series = chart.addSeries(LineSeries, {
      color: "#10b981",
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    sma25Series.setData(sma25);

    const sma75Series = chart.addSeries(LineSeries, {
      color: "#8b5cf6",
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    sma75Series.setData(sma75);

    // イベントマーカー
    if (events.length > 0) {
      const markers = events.map((event) => ({
        time: event.date as Time,
        position: "aboveBar" as const,
        color: event.type === "earnings" ? "#f59e0b" : event.type === "dividend" ? "#10b981" : "#6366f1",
        shape: "circle" as const,
        text: event.type === "earnings" ? "E" : event.type === "dividend" ? "D" : "N",
      }));

      markers.sort((a, b) => (a.time > b.time ? 1 : -1));
      // lightweight-charts v5: setMarkers still works at runtime
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (candleSeries as any).setMarkers(markers);
    }

    chart.timeScale().fitContent();

    // リサイズ対応
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [candles, events]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          株価チャート — {companyName}
          <Badge variant="secondary" className="ml-auto text-xs">
            外部データ
          </Badge>
        </CardTitle>
        <div className="flex gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-0.5 bg-amber-500" /> SMA5
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-0.5 bg-emerald-500" /> SMA25
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-0.5 bg-violet-500" /> SMA75
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={chartContainerRef} />
        <EventMarkers events={events} />
      </CardContent>
    </Card>
  );
}
