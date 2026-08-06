import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/layout/container";
import { Heading, Subheading } from "@/components/ui/typography";
import { CategoryCard } from "@/components/insights/CategoryCard";
import { EventCard } from "@/components/insights/EventCard";
import { FeaturedArticle } from "@/components/insights/FeaturedArticle";
import { InsightsFilter } from "@/components/insights/InsightsFilter";
import { NewsletterSignup } from "@/components/insights/NewsletterSignup";
import { ResourceCard } from "@/components/insights/ResourceCard";
import { articles } from "@/content/articles";
import { featuredInsight } from "@/content/featured";
import { insightCategories } from "@/content/categories";
import { resourceCards } from "@/content/resources";
import { upcomingEvents } from "@/content/events";

export function InsightsPage() {
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
              Explore planned perspectives on healthcare data partnerships, governance, genomics, real-world evidence and healthcare AI research.
            </p>
            <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-300">
              For active programs, review <Link href="/data" className="font-semibold text-white underline underline-offset-4">research-ready healthcare data</Link>, <Link href="/solutions" className="font-semibold text-white underline underline-offset-4">healthcare data solutions</Link> or <Link href="/data-partners" className="font-semibold text-white underline underline-offset-4">data partner pathways</Link>.
            </p>
          </div>
          <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:flex-row sm:justify-center">
            <Button as="a" href="#featured" variant="primary" size="large">
              Explore Planned Insights
            </Button>
            <Button as="a" href="/contact" variant="secondary" size="large">
              Discuss Your Research
            </Button>
          </div>
        </Container>
      </section>

      <section id="featured">
        <Container className="space-y-10">
          <div className="space-y-4 text-center">
            <Subheading>Featured planning topic</Subheading>
            <Heading>Research-ready insights for life sciences and healthcare organizations.</Heading>
          </div>
          <FeaturedArticle article={featuredInsight} />
        </Container>
      </section>

      <section>
        <Container className="space-y-10">
          <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <Card className="border border-slate-200 bg-slate-50 p-8 shadow-none">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Topic areas
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Planned content will focus on healthcare data partnerships, clinical research, healthcare AI, genomics and responsible governance.
                </p>
              </Card>

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
            <Subheading>Planned insights</Subheading>
            <Heading>Draft topics for research stories, governance guidance and innovation analysis.</Heading>
          </div>
          <InsightsFilter articles={articles} />
        </Container>
      </section>

      <section>
        <Container className="space-y-10">
          <div className="space-y-4 text-center">
            <Subheading>Planned conversations</Subheading>
            <Heading>Discussion topics for healthcare leaders and research teams.</Heading>
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
                Our planned insights are designed for research leaders, healthcare organizations and life sciences teams who need clarity on healthcare data partnerships, real-world evidence and secure collaboration.
              </p>
              <p>
                If you would like to discuss a specific program, dataset or governance framework, we can share how BCONZ supports every stage from planning through study execution.
              </p>
              <Button as="a" href="/contact" variant="primary" size="large">
                Contact BCONZ
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
