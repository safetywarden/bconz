import { PageShell } from "@/components/layout/page-shell";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Insights | BCONZ",
  description: "Insights for healthcare data strategy, life sciences analytics, and enterprise research operations.",
});

export default function InsightsPage() {
  return (
    <PageShell title="Insights" description="Thought leadership and enterprise perspectives on healthcare data and scientific research.">
      <div className="mx-auto max-w-6xl px-6 pb-24 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Enterprise narratives</p>
          <h2 className="mt-4 text-2xl font-semibold text-slate-950">Perspectives on data governance, clinical research, and AI adoption</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Insights and updates for decision makers in life sciences, healthcare AI, and regulated research environments.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
