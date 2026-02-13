import Parser from "rss-parser";
import type { NewsArticle } from "./types";

const parser = new Parser();

export async function fetchNews(
  query: string,
  _ticker?: string
): Promise<NewsArticle[]> {
  const encodedQuery = encodeURIComponent(query);
  const url = `https://news.google.com/rss/search?q=${encodedQuery}&hl=ja&gl=JP&ceid=JP:ja`;

  const feed = await parser.parseURL(url);

  const articles: NewsArticle[] = (feed.items || []).slice(0, 20).map((item) => {
    const source = item.creator || item["dc:creator"] || extractSource(item.title || "");
    return {
      title: cleanTitle(item.title || ""),
      url: item.link || "",
      date: item.pubDate
        ? new Date(item.pubDate).toISOString().split("T")[0]
        : "",
      source,
      snippet: item.contentSnippet || item.content || "",
    };
  });

  return articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

function extractSource(title: string): string {
  const match = title.match(/ - ([^-]+)$/);
  return match ? match[1].trim() : "";
}

function cleanTitle(title: string): string {
  return title.replace(/ - [^-]+$/, "").trim();
}
