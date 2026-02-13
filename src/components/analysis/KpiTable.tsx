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
import type { KpiItem } from "@/lib/types";

interface KpiTableProps {
  kpis: KpiItem[];
}

export function KpiTable({ kpis }: KpiTableProps) {
  if (kpis.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          主要KPI
          <Badge variant="outline" className="ml-auto text-xs">
            AI分析
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>指標</TableHead>
              <TableHead className="text-right">今期</TableHead>
              <TableHead className="text-right">前期</TableHead>
              <TableHead className="text-right">変化率</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {kpis.map((kpi, i) => {
              const isPositive = kpi.changeRate.startsWith("+");
              const isNegative = kpi.changeRate.startsWith("-");
              return (
                <TableRow key={i}>
                  <TableCell className="font-medium">{kpi.name}</TableCell>
                  <TableCell className="text-right">{kpi.currentValue}</TableCell>
                  <TableCell className="text-right text-gray-500">
                    {kpi.previousValue}
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      isPositive
                        ? "text-green-600"
                        : isNegative
                          ? "text-red-600"
                          : ""
                    }`}
                  >
                    {kpi.changeRate}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
