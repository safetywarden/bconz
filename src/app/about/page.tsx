import { PageShell } from "@/components/layout/page-shell";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "About | BCONZ",
  description: "BCONZ is a healthcare data partnership company providing governance-ready datasets for life sciences and research collaborations.",
});

export default function AboutPage() {
  return (
    <PageShell title="About" description="Trusted partnerships at the intersection of healthcare, research, and data governance.">
      <div className="mx-auto max-w-6xl px-6 pb-24 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Company overview</p>
          <h2 className="mt-4 text-2xl font-semibold text-slate-950">Creating a secure data ecosystem for regulated research</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            BCONZ partners with healthcare organizations and life sciences teams to enable research-ready analytics without compromising patient privacy or data governance.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
