import { Button } from "@/components/ui/button";
import { siteDescription, siteName } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-slate-100 via-white to-white py-24 sm:py-32">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-3xl space-y-8">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-teal-600">Enterprise healthcare data</p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {siteName} delivers governed healthcare datasets for life sciences and AI research.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-700">{siteDescription}</p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button variant="primary" size="large">
                Explore our capabilities
              </Button>
              <Button variant="secondary" size="large">
                Contact the team
              </Button>
            </div>
          </div>

          <div className="grid gap-6 rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-[0_35px_80px_-45px_rgba(15,23,42,0.18)]">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Trusted partnerships</p>
              <p className="text-sm leading-7 text-slate-600">
                Partnerships with hospital networks, genomic labs, life sciences teams, and research institutions built around compliance and scientific trust.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-900">Governance first</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Policy-driven controls for safe healthcare data access.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-900">Research-ready</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Curated data designed for scientific modeling and analytics.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
