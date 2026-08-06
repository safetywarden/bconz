import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InsightArticle } from "@/content/articles";

export function ArticleCard({ article }: { article: InsightArticle }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="relative h-52 w-full">
        <Image src={article.image} alt={article.imageAlt} fill className="object-cover" />
      </div>
      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span>{article.category}</span>
          <span>•</span>
          <span>Unpublished planning topic</span>
        </div>
        <h3 className="text-xl font-semibold text-slate-950">{article.title}</h3>
        <p className="text-sm leading-6 text-slate-600">{article.summary}</p>
        <Button variant="secondary" size="normal" as="a" href="/contact">
          Discuss Your Research
        </Button>
      </div>
    </Card>
  );
}
