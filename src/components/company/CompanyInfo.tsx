"use client";

import { Building2, Calendar, Hash, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AnalysisResult } from "@/lib/types";

interface CompanyInfoProps {
  analysis: AnalysisResult;
}

export function CompanyInfo({ analysis }: CompanyInfoProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building2 className="h-5 w-5" />
          企業情報
          <Badge variant="outline" className="ml-auto text-xs">
            PDF由来
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-gray-500 text-xs">企業名</p>
              <p className="font-medium">{analysis.companyName || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-gray-500 text-xs">証券コード</p>
              <p className="font-medium">{analysis.ticker || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-gray-500 text-xs">決算期</p>
              <p className="font-medium">{analysis.fiscalPeriod || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-gray-500 text-xs">発行日</p>
              <p className="font-medium">{analysis.issueDate || "—"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
