import { Button } from "@/components/ui/button";

export function NewsletterSignup() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-950 p-10 text-white sm:p-12">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">Stay informed</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight">Insights delivered to your inbox</h2>
        <p className="mt-4 text-sm leading-6 text-slate-300">
          Subscribe to receive curated research perspectives, governance guidance and innovation updates from BCONZ.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            type="email"
            placeholder="Enter your work email"
            className="min-w-0 flex-1 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-slate-300 focus:ring-4 focus:ring-slate-500/20"
          />
          <Button variant="primary" size="large" as="button">
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
}
