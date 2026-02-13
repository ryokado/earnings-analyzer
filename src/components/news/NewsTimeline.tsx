"use client";

import { ExternalLink, Newspaper } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { NewsArticle } from "@/lib/types";

interface NewsTimelineProps {
  articles: NewsArticle[];
}

export function NewsTimeline({ articles }: NewsTimelineProps) {
  if (articles.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          ニュースタイムライン
          <Badge variant="secondary" className="ml-auto text-xs">
            外部データ
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {articles.map((article, i) => (
            <div
              key={i}
              className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <div className="shrink-0 mt-1">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-900 hover:text-blue-600 flex items-start gap-1"
                >
                  <span className="line-clamp-2">{article.title}</span>
                  <ExternalLink className="h-3 w-3 shrink-0 mt-0.5" />
                </a>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <span>{article.date}</span>
                  {article.source && (
                    <>
                      <span>·</span>
                      <span>{article.source}</span>
                    </>
                  )}
                </div>
                {article.snippet && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {article.snippet}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
