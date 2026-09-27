import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading, Label } from "@/components/ui/typography";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { areas, type DatasetArea } from "@/content/datasets";

/** A disease-area dataset page under /data. */
export function DatasetAreaPage({ area: a }: { area: DatasetArea }) {
  const others = areas.filter((x) => x.slug !== a.slug);
  return (
    <main>
      <Section className="bg-slate-50">
        <Container>
          <nav aria-label="Breadcrumb" className="text-sm text-slate-600">
            <Link href="/" className="underline-offset-4 hover:underline">Home</Link>
            <span aria-hidden="true"> / </span>
            <Link href="/data" className="underline-offset-4 hover:underline">Research Data</Link>
            <span aria-hidden="true"> / </span>
            <span className="text-slate-950">{a.name}</span>
          </nav>
          <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="max-w-3xl space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">{a.name} datasets</p>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{a.h1}</h1>
              <p className="text-lg leading-8 text-slate-700">{a.intro}</p>
              <p className="rounded-2xl border border-teal-100 bg-white px-4 py-3 text-sm leading-6 text-slate-700">
                <strong className="text-slate-950">Not a free download.</strong> These are governed, research-grade datasets
                licensed for a defined purpose after a feasibility review — built for studies and products that public
                datasets cannot support.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button variant="primary" size="large" as="a" href="/request-data">Request {a.name.toLowerCase()} data</Button>
                <Button variant="secondary" size="large" as="a" href="/contact">Discuss a study</Button>
              </div>
            </div>
            <aside className="grid gap-5 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div>
                <h2 className="text-base font-semibold text-slate-950">Indications and approximate patients</h2>
                <dl className="mt-3 divide-y divide-slate-100 text-sm">
                  {a.diseases.map((d) => (
                    <div key={d.name} className="flex items-baseline justify-between gap-4 py-2">
                      <dt className="leading-6 text-slate-600">{d.name}</dt>
                      <dd className="shrink-0 font-semibold tabular-nums text-slate-950">{d.approx}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-2 text-xs leading-5 text-slate-500">US EMR/EHR data. Approximate, rounded down; a patient may appear in more than one indication.</p>
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-950">Data may include</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-600">
                  {a.dataTypes.map((d) => <li key={d}>{d}</li>)}
                </ul>
                <p className="mt-3 text-xs leading-5 text-slate-500">Availability of data beyond EHR, and the cohort for each study, are confirmed during feasibility.</p>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>Research uses</Label>
            <Heading>What {a.name.toLowerCase()} datasets are used for</Heading>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {a.uses.map((u) => (
              <Card key={u.title} className="p-6">
                <h3 className="text-lg font-semibold text-slate-950">{u.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{u.text}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-slate-50">
        <Container>
          <div className="mx-auto max-w-4xl space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">How access works</h2>
            <ol className="list-decimal space-y-3 pl-6 text-base leading-7 text-slate-700">
              <li>Tell us your research question through the <Link href="/request-data" className="font-semibold text-slate-950 underline underline-offset-4">research data request form</Link>.</li>
              <li>We confirm feasibility: whether a suitable cohort exists, its size, follow-up and available data types.</li>
              <li>Governance review and a data use agreement define the permitted purpose.</li>
              <li>The de-identified dataset is prepared, quality-reviewed and delivered securely.</li>
            </ol>
            <p className="text-sm leading-6 text-slate-600">
              Hold {a.name.toLowerCase()} data yourself? A <Link href="/platform/harm" className="font-semibold text-slate-950 underline underline-offset-4">healthcare data readiness assessment</Link> shows
              what it can support, and <Link href="/platform/dia" className="font-semibold text-slate-950 underline underline-offset-4">DIA</Link> shows who has published a need for it.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>Frequently asked questions</Label>
            <Heading>{a.name} datasets: common questions</Heading>
          </div>
          <div className="mx-auto mt-12 max-w-4xl space-y-4">
            {a.faqs.map((f) => (
              <details key={f.q} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                <summary className="cursor-pointer text-base font-semibold text-slate-950 outline-none">{f.q}</summary>
                <p className="mt-4 text-sm leading-7 text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-slate-50">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h2 className="text-xl font-semibold text-slate-950">Other disease-area datasets</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {others.map((o) => (
                <Link key={o.slug} href={`/data/${o.slug}`}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-slate-100">
                  {o.name} datasets
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
