import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { FeaturedInsight } from "@/content/featured";

export function FeaturedArticle({ article }: { article: FeaturedInsight }) {
  return (
    <Card className="overflow-hidden p-0 lg:flex lg:items-stretch">
      <div className="relative h-72 w-full lg:h-auto lg:w-1/2">
        <Image src={article.image} alt={article.imageAlt} fill className="object-cover" />
      </div>
      <div className="flex flex-col gap-4 p-8 lg:w-1/2">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span>{article.category}</span>
          <span>•</span>
          <span>{article.readingTime}</span>
        </div>
        <h2 className="text-3xl font-semibold text-slate-950">{article.title}</h2>
        <p className="text-sm leading-7 text-slate-600">{article.summary}</p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span>{article.author}</span>
          <span>{article.date}</span>
        </div>
        <Button variant="primary" size="large" as="a" href="#">
          Read Article
        </Button>
      </div>
    </Card>
  );
}
