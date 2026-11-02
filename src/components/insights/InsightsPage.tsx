import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/layout/container";
import { NewsletterSignup } from "@/components/insights/NewsletterSignup";
import { formatDate } from "@/components/insights/ArticlePage";
import { posts } from "@/content/posts";

export function InsightsPage() {
  const latest = [...posts].sort((a, b) => b.published.localeCompare(a.published));
  return (
    <main className="space-y-24 py-16">
      <section className="bg-slate-950 text-white">
        <Container className="space-y-6 py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Insights</p>
          <h1 className="mx-auto max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Practical guides to healthcare data for research and AI.
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-8 text-slate-300">
            How to license, de-identify and validate medical data, and what researchers say they need, from the team behind BCONZ&apos;s data platform.
          </p>
        </Container>
      </section>

      <section id="latest">
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            {latest.map((p) => (
              <Card key={p.slug} className="flex flex-col p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600">{p.category}</p>
                <h2 className="mt-3 text-xl font-semibold text-slate-950">
                  <Link href={`/insights/${p.slug}`} className="hover:underline underline-offset-4">{p.title}</Link>
                </h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{p.description}</p>
                <p className="mt-4 text-xs text-slate-500">{formatDate(p.published)} · {p.readingTime}</p>
                <Link href={`/insights/${p.slug}`} className="mt-4 text-sm font-semibold text-slate-950 underline underline-offset-4">
                  Read article
                </Link>
              </Card>
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
              <h2 className="text-3xl font-semibold text-slate-950">Talk to our healthcare data team.</h2>
            </div>
            <div className="space-y-4 text-sm leading-7 text-slate-600 lg:col-span-2">
              <p>
                Looking for data for a study or an AI product? Browse <Link href="/data" className="font-semibold text-slate-950 underline underline-offset-4">research datasets</Link> or tell us what you need.
                Hold data yourself? See the <Link href="/data-partners" className="font-semibold text-slate-950 underline underline-offset-4">Data Collaboration Programme</Link>.
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
