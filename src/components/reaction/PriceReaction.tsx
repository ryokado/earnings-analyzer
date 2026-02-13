"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PriceReactionItem } from "@/lib/types";

interface PriceReactionProps {
  reactions: PriceReactionItem[];
}

function formatChange(value: number | null): string {
  if (value === null) return "—";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value}%`;
}

function changeColor(value: number | null): string {
  if (value === null) return "";
  if (value > 0) return "text-green-600";
  if (value < 0) return "text-red-600";
  return "";
}

export function PriceReaction({ reactions }: PriceReactionProps) {
  if (reactions.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          株価反応分析
          <Badge variant="secondary" className="ml-auto text-xs">
            外部データ
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>日付</TableHead>
              <TableHead>イベント</TableHead>
              <TableHead className="text-right">株価</TableHead>
              <TableHead className="text-right">+1日</TableHead>
              <TableHead className="text-right">+1週間</TableHead>
              <TableHead className="text-right">+1ヶ月</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reactions.map((r, i) => (
              <TableRow
                key={i}
                className={r.isSignificant ? "bg-yellow-50" : ""}
              >
                <TableCell className="text-sm">{r.eventDate}</TableCell>
                <TableCell className="text-sm max-w-[200px] truncate">
                  {r.eventDescription}
                  {r.isSignificant && (
                    <Badge variant="outline" className="ml-1 text-xs">
                      大幅変動
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right text-sm">
                  {r.priceAtEvent > 0
                    ? r.priceAtEvent.toLocaleString()
                    : "—"}
                </TableCell>
                <TableCell
                  className={`text-right text-sm font-medium ${changeColor(r.change1d)}`}
                >
                  {formatChange(r.change1d)}
                </TableCell>
                <TableCell
                  className={`text-right text-sm font-medium ${changeColor(r.change1w)}`}
                >
                  {formatChange(r.change1w)}
                </TableCell>
                <TableCell
                  className={`text-right text-sm font-medium ${changeColor(r.change1m)}`}
                >
                  {formatChange(r.change1m)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
