import { PageShell } from "@/components/layout/page-shell";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Contact | BCONZ",
  description: "Contact BCONZ to discuss healthcare data partnerships, governance, and life sciences research programs.",
});

export default function ContactPage() {
  return (
    <PageShell title="Contact" description="Get in touch to explore enterprise healthcare data partnerships and scientific collaboration.">
      <div className="mx-auto max-w-6xl px-6 pb-24 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Reach out</p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">Connect with our enterprise team</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Contact us to discuss data collaboration, clinical research support, or AI readiness for life sciences workflows.
            </p>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Message</p>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Our team is available to support enterprise partners across healthcare, biotech, diagnostics, and academic research.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
