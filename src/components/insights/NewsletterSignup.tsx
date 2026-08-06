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
        <Button variant="primary" size="large" as="a" href="/contact" className="mt-8">
          Request insight updates
        </Button>
      </div>
    </div>
  );
}
