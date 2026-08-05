import { PageShell } from "@/components/layout/page-shell";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Data | BCONZ",
  description: "Discover healthcare data offerings designed for trusted research, analytics, and enterprise AI adoption.",
});

export default function DataPage() {
  return (
    <PageShell title="Data" description="Healthcare data assets designed for governed research and analytics.">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 pb-24 lg:px-8 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Data Portfolio</p>
          <h2 className="mt-4 text-2xl font-semibold text-slate-950">Clinical and claims data for life sciences programs</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            A curated catalog of longitudinal datasets built for regulatory-ready research, evidence generation, and AI model validation.
          </p>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Governance</p>
          <h2 className="mt-4 text-2xl font-semibold text-slate-950">Privacy and controls in every dataset</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            With structured access policies, provenance tracking, and compliance guardrails, every dataset is optimized for enterprise adoption.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
