import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Heading, Label } from "@/components/ui/typography";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { productBySlug, type ProductContent } from "@/content/platform";

/** A single platform product page (HARM, PIA or DIA). */
export function ProductPage({ product: p }: { product: ProductContent }) {
  return (
    <main>
      <Section className="bg-slate-50">
        <Container>
          <nav aria-label="Breadcrumb" className="text-sm text-slate-600">
            <Link href="/" className="underline-offset-4 hover:underline">Home</Link>
            <span aria-hidden="true"> / </span>
            <Link href="/platform" className="underline-offset-4 hover:underline">Platform</Link>
            <span aria-hidden="true"> / </span>
            <span className="text-slate-950">{p.name}</span>
          </nav>
          <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="max-w-3xl space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">{p.name} · {p.full}</p>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{p.h1}</h1>
              {p.intro.map((para) => (
                <p key={para.slice(0, 32)} className="text-lg leading-8 text-slate-700">{para}</p>
              ))}
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button variant="primary" size="large" as="a" href={p.cta.href}>{p.cta.label}</Button>
                <Button variant="secondary" size="large" as="a" href="/platform">The BCONZ platform</Button>
              </div>
            </div>
            <aside className="grid gap-5 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950 text-white">
                  <Icon name={p.icon} className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">{p.audience}</p>
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-950">What {p.name} does</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-600">
                  {p.capabilities.map((c) => <li key={c}>{c}</li>)}
                </ul>
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-950">What you get</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.outputs.map((o) => (
                    <span key={o} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">{o}</span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-4xl space-y-12">
            {p.sections.map((s) => (
              <section key={s.heading} className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{s.heading}</h2>
                {s.body && <p className="text-base leading-8 text-slate-700">{s.body}</p>}
                {s.bullets && (
                  <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-slate-700">
                    {s.bullets.map((b) => <li key={b}>{b}</li>)}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-slate-50">
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>Frequently asked questions</Label>
            <Heading>{p.name}: common questions</Heading>
          </div>
          <div className="mx-auto mt-12 max-w-4xl space-y-4">
            {p.faqs.map((f) => (
              <details key={f.q} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                <summary className="cursor-pointer text-base font-semibold text-slate-950 outline-none">{f.q}</summary>
                <p className="mt-4 text-sm leading-7 text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-4xl">
            <h2 className="text-xl font-semibold text-slate-950">Related capabilities</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {p.related.map((slug) => {
                const r = productBySlug(slug);
                return (
                  <Link key={slug} href={`/platform/${slug}`}
                        className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400">
                    <p className="text-lg font-semibold text-slate-950">{r.name} <span className="font-normal text-slate-500">· {r.full}</span></p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{r.card}</p>
                  </Link>
                );
              })}
            </div>
            <div className="mt-10 rounded-[2rem] bg-slate-950 p-8 text-center text-white">
              <p className="text-lg leading-8 text-slate-200">See {p.name} on your own question or dataset.</p>
              <div className="mt-6 flex justify-center">
                <Button variant="secondary" size="large" as="a" href={p.cta.href}>{p.cta.label}</Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
