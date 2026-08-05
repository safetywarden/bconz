import type { PropsWithChildren } from "react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

type PageShellProps = PropsWithChildren<{
  title: string;
  description: string;
}>;

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <main>
      <Section className="pt-24">
        <Container>
          <div className="max-w-3xl space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-teal-600">Enterprise healthcare</p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {title}
            </h1>
            <p className="text-lg leading-8 text-slate-700">{description}</p>
          </div>
        </Container>
      </Section>
      {children}
    </main>
  );
}
