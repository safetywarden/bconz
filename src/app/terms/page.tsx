import { PageShell } from "@/components/layout/page-shell";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Terms | BCONZ",
  description: "BCONZ terms of use for corporate data partnerships and enterprise website access.",
});

export default function TermsPage() {
  return (
    <PageShell title="Terms" description="Terms of use for BCONZ corporate website visitors and enterprise partners.">
      <div className="mx-auto max-w-6xl px-6 pb-24 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Terms of use</p>
          <h2 className="mt-4 text-2xl font-semibold text-slate-950">Use of the BCONZ website</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            This website provides corporate information about BCONZ and does not create any contractual obligations or data service access.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
