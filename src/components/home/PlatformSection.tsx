import { Icon } from "@/components/ui/icon";
import { products } from "@/content/platform";

/** Home-page summary of HARM, PIA and DIA, linking into /platform. */
export function PlatformSection() {
  return (
    <section id="platform" className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">The BCONZ platform</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Real-world data partnerships, built on evidence
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-700">
            Assess what a dataset can support, find the providers who hold the data, and find the organisations that have
            published a need for it.
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {products.map((p) => (
            <a key={p.slug} href={`/platform/${p.slug}`}
               className="group flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-950 text-white">
                <Icon name={p.icon} className="h-6 w-6" />
              </div>
              <p className="mt-5 text-xl font-semibold text-slate-950">{p.name}</p>
              <p className="text-sm text-slate-500">{p.full}</p>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{p.card}</p>
              <span className="mt-5 text-sm font-semibold text-slate-950 underline underline-offset-4">Learn more about {p.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
