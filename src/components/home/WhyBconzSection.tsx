import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

const differentiators = [
  {
    title: "Trusted Partnerships",
    description:
      "Long-term collaboration with healthcare organizations rather than anonymous data sourcing.",
    icon: "partnership" as const,
  },
  {
    title: "Research-Ready Curation",
    description:
      "Cohorts designed around research questions, data completeness and fit-for-purpose quality.",
    icon: "research" as const,
  },
  {
    title: "Responsible Governance",
    description:
      "Purpose-specific access, institutional oversight and documented project controls.",
    icon: "governance" as const,
  },
  {
    title: "Diverse Research Populations",
    description:
      "Greater access to healthcare experiences and populations that are often underrepresented in research.",
    icon: "trust" as const,
  },
];

export function WhyBconzSection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Why BCONZ</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Why BCONZ
          </h2>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {differentiators.map((item) => (
            <Card key={item.title} className="group transition hover:-translate-y-1 hover:shadow-glow focus-within:-translate-y-1 focus-within:shadow-glow">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-950 text-white">
                <Icon name={item.icon} />
              </div>
              <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
