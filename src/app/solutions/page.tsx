import { PageShell } from "@/components/layout/page-shell";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Solutions | BCONZ",
  description: "Solutions for pharmaceutical research, clinical operations, and healthcare AI powered by trusted healthcare data.",
});

export default function SolutionsPage() {
  return (
    <PageShell title="Solutions" description="Enterprise research and AI solutions built on governed healthcare data.">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 pb-24 lg:px-8 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Research Enablement</p>
          <h2 className="mt-4 text-2xl font-semibold text-slate-950">Scientific evidence and cohort discovery</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Gain access to structured datasets, analytics-ready cohorts, and data science workflows tailored to life sciences discovery programs.
          </p>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">AI Adoption</p>
          <h2 className="mt-4 text-2xl font-semibold text-slate-950">Model-ready healthcare data pipelines</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Support AI initiatives with validated data flows, high-quality feature sets, and enterprise monitoring for regulated workflows.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
