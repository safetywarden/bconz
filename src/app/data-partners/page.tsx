import { PageShell } from "@/components/layout/page-shell";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Data Partners | BCONZ",
  description: "Explore how healthcare organizations can collaborate with life sciences teams through trusted data partnerships.",
});

export default function DataPartnersPage() {
  return (
    <PageShell
      title="Data Partners"
      description="A partnership framework for healthcare providers, laboratories, and research networks to share governed data responsibly."
    >
      <div className="mx-auto max-w-6xl px-6 pb-24 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Healthcare networks</p>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Build secure research collaborations between hospital systems, cancer centers, and diagnostic providers without sacrificing privacy or governance.
            </p>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Research institutions</p>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Enable academic researchers and CROs to access trusted healthcare datasets under a managed data partnership model.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
