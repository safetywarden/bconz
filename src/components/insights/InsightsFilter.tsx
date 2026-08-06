"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { ArticleCard } from "@/components/insights/ArticleCard";
import type { InsightArticle } from "@/content/articles";

const initialTags = [
  "Governance",
  "AI",
  "Clinical",
  "Research",
  "Partnerships",
  "Data",
];

export function InsightsFilter({ articles }: { articles: InsightArticle[] }) {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredArticles = useMemo(() => {
    const query = search.toLowerCase();

    return articles.filter((article) => {
      const searchText = `${article.title} ${article.summary} ${article.category} ${article.tags.join(" ")}`.toLowerCase();
      const matchesSearch = searchText.includes(query);
      const matchesTag = selectedTag ? article.tags.includes(selectedTag) : true;
      return matchesSearch && matchesTag;
    });
  }, [articles, search, selectedTag]);

  return (
    <>
      <Card className="border border-slate-200 bg-slate-50 p-8 shadow-none">
        <label htmlFor="insights-search" className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          Search insights
        </label>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            id="insights-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by topic or keyword"
            className="min-h-12 w-full rounded-3xl border border-slate-300 bg-white px-5 py-4 text-sm text-slate-950 outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-200"
          />
        </div>
        <fieldset className="mt-6">
          <legend className="sr-only">Filter insights by topic</legend>
          <div className="flex flex-wrap gap-3">
            {initialTags.map((tag) => {
              const isSelected = selectedTag === tag;

              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(isSelected ? null : tag)}
                  aria-pressed={isSelected}
                  className={`min-h-11 rounded-full border px-4 py-2 text-sm transition ${
                    isSelected
                      ? "border-cyan-500 bg-cyan-500 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </fieldset>
      </Card>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3" aria-live="polite">
        {filteredArticles.length ? (
          filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <Card className="p-6 md:col-span-2 xl:col-span-3">
            <p className="text-sm leading-6 text-slate-600">
              No planned insight topics match your search. Contact BCONZ to discuss your research question directly.
            </p>
          </Card>
        )}
      </div>
    </>
  );
}
