"use client";

import type { StockEvent } from "@/lib/types";

interface EventMarkersProps {
  events: StockEvent[];
}

export function EventMarkers({ events }: EventMarkersProps) {
  if (events.length === 0) return null;

  const typeLabels: Record<StockEvent["type"], string> = {
    earnings: "決算",
    dividend: "配当",
    news: "ニュース",
  };

  const typeColors: Record<StockEvent["type"], string> = {
    earnings: "bg-amber-100 text-amber-800",
    dividend: "bg-emerald-100 text-emerald-800",
    news: "bg-indigo-100 text-indigo-800",
  };

  return (
    <div className="mt-3 space-y-1">
      <p className="text-xs font-medium text-gray-500">イベント一覧</p>
      <div className="flex flex-wrap gap-1.5">
        {events.slice(0, 10).map((event, i) => (
          <span
            key={`${event.date}-${i}`}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${typeColors[event.type]}`}
            title={event.description}
          >
            <span className="font-medium">{typeLabels[event.type]}</span>
            <span className="opacity-70">{event.date}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
