import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { posts, type Block, type Post } from "@/content/posts";

const linkClass = "font-semibold text-slate-950 underline underline-offset-4";

/** Renders [text](href) links inside article text; other text is plain. */
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(<Link key={m.index} href={m[2]} className={linkClass}>{m[1]}</Link>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function BlockView({ block }: { block: Block }) {
  if ("h2" in block) return <h2 className="pt-6 text-2xl font-semibold tracking-tight text-slate-950">{block.h2}</h2>;
  if ("p" in block) return <p>{inline(block.p)}</p>;
  const items = "ul" in block ? block.ul : block.ol;
  const List = "ul" in block ? "ul" : "ol";
  return (
    <List className={`${"ul" in block ? "list-disc" : "list-decimal"} space-y-2 pl-6`}>
      {items.map((t) => <li key={t}>{inline(t)}</li>)}
    </List>
  );
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

/** An article under /insights. */
export function ArticlePage({ post }: { post: Post }) {
  const others = posts.filter((p) => p.slug !== post.slug);
  return (
    <main>
      <Section className="bg-slate-50">
        <Container>
          <nav aria-label="Breadcrumb" className="text-sm text-slate-600">
            <Link href="/" className="underline-offset-4 hover:underline">Home</Link>
            <span aria-hidden="true"> / </span>
            <Link href="/insights" className="underline-offset-4 hover:underline">Insights</Link>
          </nav>
          <article className="mx-auto mt-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">{post.category}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{post.title}</h1>
            <p className="mt-4 text-sm text-slate-500">
              <time dateTime={post.published}>{formatDate(post.published)}</time> · {post.readingTime} · BCONZ
            </p>
            <div className="mt-10 space-y-5 text-lg leading-8 text-slate-700">
              {post.body.map((b, i) => <BlockView key={i} block={b} />)}
            </div>
            <section className="mt-12 border-t border-slate-200 pt-6">
              <h2 className="text-base font-semibold text-slate-950">References</h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                {post.references.map((r) => (
                  <li key={r.text}>
                    {r.url ? <a href={r.url} className="underline underline-offset-4" rel="noopener noreferrer" target="_blank">{r.text}</a> : r.text}
                  </li>
                ))}
              </ul>
            </section>
          </article>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button variant="primary" size="large" as="a" href="/request-data">Request research data</Button>
              <Button variant="secondary" size="large" as="a" href="/contact">Talk to us</Button>
            </div>
            {others.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-slate-950">More insights</h2>
                <ul className="mt-4 space-y-3">
                  {others.map((o) => (
                    <li key={o.slug}>
                      <Link href={`/insights/${o.slug}`} className={linkClass}>{o.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Container>
      </Section>
    </main>
  );
}
