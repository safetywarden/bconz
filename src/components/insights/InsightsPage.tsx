"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/layout/container";
import { Heading, Subheading } from "@/components/ui/typography";
import { CategoryCard } from "@/components/insights/CategoryCard";
import { EventCard } from "@/components/insights/EventCard";
import { FeaturedArticle } from "@/components/insights/FeaturedArticle";
import { NewsletterSignup } from "@/components/insights/NewsletterSignup";
import { ArticleCard } from "@/components/insights/ArticleCard";
import { ResourceCard } from "@/components/insights/ResourceCard";
import { articles } from "@/content/articles";
import { featuredInsight } from "@/content/featured";
import { insightCategories } from "@/content/categories";
import { resourceCards } from "@/content/resources";
import { upcomingEvents } from "@/content/events";

const initialTags = [
  "Governance",
  "AI",
  "Clinical",
  "Research",
  "Partnerships",
  "Data",
];

export function InsightsPage() {
  const [search, setSearch] = useState("");
 const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const searchText = `${article.title} ${article.summary} ${article.category} ${article.tags.join(" ")}`.toLowerCase();
      const matchesSearch = searchText.includes(search.toLowerCase());
      const matchesTag = selectedTag ? article.tags.includes(selectedTag) : true;
      return matchesSearch && matchesTag;
    });
  }, [search, selectedTag]);

  return (
    <main className="space-y-24 py-16">
      <section className="bg-slate-950 text-white">
        <Container className="space-y-10 py-20 text-center">
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Knowledge centre
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Insights for healthcare data partnerships and enterprise research.
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-8 text-slate-300">
              Discover research perspectives, governance guidance and innovation stories that support trusted healthcare data collaboration.
            </p>
          </div>
          <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:flex-row sm:justify-center">
            <Button as="a" href="#featured" variant="primary" size="large">
              Explore featured insight
            </Button>
            <Button as="a" href="#latest" variant="secondary" size="large">
              Browse latest insights
            </Button>
          </div>
        </Container>
      </section>

      <section id="featured">
        <Container className="space-y-10">
          <div className="space-y-4 text-center">
            <Subheading>Featured insight</Subheading>
            <Heading>Research-ready insights for life sciences and healthcare organizations.</Heading>
          </div>
          <FeaturedArticle article={featuredInsight} />
        </Container>
      </section>

      <section>
        <Container className="space-y-10">
          <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Search insights
                </p>
                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by topic, author, or keyword"
                    className="w-full rounded-3xl border border-slate-300 bg-white px-5 py-4 text-sm text-slate-950 outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-200"
                  />
                  <Button variant="secondary" size="large" as="button">
                    Search
                  </Button>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  {initialTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        selectedTag === tag
                          ? "border-cyan-500 bg-cyan-500 text-white"
                          : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                {insightCategories.slice(0, 4).map((category) => (
                  <CategoryCard key={category} title={category} />
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Insight highlights</p>
                <div className="mt-6 space-y-6">
                  {articles.slice(0, 3).map((article) => (
                    <Card key={article.id} className="border border-slate-200 p-6">
                      <div className="flex flex-col gap-3">
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                          {article.category}
                        </p>
                        <h3 className="text-xl font-semibold text-slate-950">{article.title}</h3>
                        <p className="text-sm leading-6 text-slate-600">{article.summary}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Resources</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {resourceCards.slice(0, 4).map((resource) => (
                    <ResourceCard key={resource.title} {...resource} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="latest">
        <Container className="space-y-10">
          <div className="space-y-4 text-center">
            <Subheading>Latest insights</Subheading>
            <Heading>New research stories, governance guidance and innovation analysis.</Heading>
          </div>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container className="space-y-10">
          <div className="space-y-4 text-center">
            <Subheading>Events & conversations</Subheading>
            <Heading>Live sessions for healthcare leaders and research teams.</Heading>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {upcomingEvents.map((event) => (
              <EventCard key={event.title} {...event} />
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <NewsletterSignup />
        </Container>
      </section>

      <section>
        <Container className="rounded-3xl border border-slate-200 bg-slate-50 p-14">
          <div className="grid gap-10 lg:grid-cols-3 lg:items-start">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Need help?</p>
              <h2 className="text-3xl font-semibold text-slate-950">Talk to our healthcare data strategy team.</h2>
              <p className="text-sm leading-7 text-slate-600">
                Connect with BCONZ to discuss enterprise research programs, governance-led partnerships and data readiness.
              </p>
            </div>
            <div className="space-y-4 text-sm leading-7 text-slate-600 lg:col-span-2">
              <p>
                Our insights are designed for research leaders, healthcare organizations and life sciences teams who need clarity on data partnerships, real world evidence, and secure collaboration.
              </p>
              <p>
                If you would like to discuss a specific program, dataset or governance framework, we can share how BCONZ supports every stage from planning through study execution.
              </p>
              <Button as="a" href="/contact" variant="primary" size="large">
                Contact our team
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
