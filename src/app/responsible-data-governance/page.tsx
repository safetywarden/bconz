import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/metadata";
import { getPageSeo } from "@/lib/seo";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo/json-ld";

const seo = getPageSeo("/responsible-data-governance");

export const metadata = createMetadata(seo);

const sections = [
  {
    title: "Our partnership philosophy",
    content:
      "BCONZ works with healthcare organisations, research institutes and life sciences teams through partnership models that begin with purpose, governance and institutional priorities. We do not treat healthcare data as a commodity. A useful collaboration should be clear about the scientific question, the role of each party, the safeguards required and the expected boundaries of use.",
  },
  {
    title: "Responsible healthcare data use",
    content:
      "Healthcare data should be used only for legitimate, defined and reviewed purposes. BCONZ supports data use for research, feasibility assessment, real-world evidence, precision medicine and healthcare AI development where the work is appropriate for the data, the partners and the agreed governance pathway. Public website enquiries are not a substitute for project review.",
  },
  {
    title: "Respect for institutional ownership",
    content:
      "Hospitals, laboratories, biobanks and research organisations have responsibilities to their patients, clinicians, researchers and communities. BCONZ respects that institutional context. Data partner engagement should preserve institutional decision-making and should not pressure organisations into uses that do not align with their governance, policies or research mission.",
  },
  {
    title: "Privacy-first approach",
    content:
      "Privacy is considered from the start of a collaboration. The public website must not be used to submit patient information. Project discussions should focus first on feasibility, cohort definitions, data categories, governance requirements and permitted use rather than exchanging sensitive records through informal channels.",
  },
  {
    title: "De-identification principles",
    content:
      "Where healthcare data is prepared for research collaboration, BCONZ expects appropriate de-identification, minimisation and access controls to be considered. De-identification is not a single checkbox. It depends on context, data type, linkage risk, project purpose and contractual safeguards. Any approach should be reviewed through the relevant governance process.",
  },
  {
    title: "Research governance",
    content:
      "Responsible data collaboration requires review before access. Governance may include scientific review, institutional approvals, data access terms, permitted-use restrictions, role definitions, security requirements and escalation processes. BCONZ supports structured engagement so partners can decide whether a project is suitable before work begins.",
  },
  {
    title: "Ethical collaboration",
    content:
      "Ethical collaboration means being clear about the purpose of the work, who is involved, what data is relevant and how results may be used. It also means avoiding unnecessary data collection, avoiding misleading claims about availability and recognising that research value depends on trust as much as technical readiness.",
  },
  {
    title: "Transparency and long-term partnerships",
    content:
      "BCONZ favours transparent communication about scope, limitations, timelines and responsibilities. Long-term partnerships are built by respecting review processes, documenting decisions and maintaining a practical understanding of institutional priorities. The goal is durable research collaboration, not one-off transactions.",
  },
  {
    title: "Regulatory awareness",
    content:
      "Healthcare data work may involve privacy, data protection, research, contracting, localisation and sector-specific requirements. BCONZ is committed to regulatory awareness and careful project scoping. We do not claim certifications or compliance statuses on this page. Specific obligations should be assessed for each collaboration and documented in the relevant agreement.",
  },
];

export default function ResponsibleDataGovernancePage() {
  return (
    <>
      <JsonLd id="ld-responsible-data-page" data={webPageJsonLd("/responsible-data-governance")} />
      <JsonLd
        id="ld-responsible-data-breadcrumb"
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Responsible Data and Governance", path: "/responsible-data-governance" },
        ])}
      />
      <PageShell
        title="Responsible Data & Governance"
        description="BCONZ supports healthcare data partnerships through purpose-specific use, institutional review, privacy awareness and transparent collaboration."
      >
        <div className="mx-auto max-w-5xl px-6 pb-24 lg:px-8">
          <div className="space-y-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <section className="space-y-4 text-base leading-7 text-slate-600">
              <p>
                This page explains the principles BCONZ applies when discussing healthcare data collaborations.
                It is intended for hospitals, laboratories, research institutes, life sciences companies and healthcare AI organisations considering a structured partnership.
              </p>
              <p>
                For a data partnership discussion, use the <Link href="/data-partners" className="font-semibold text-slate-950 underline underline-offset-4">data partner pathway</Link>. For a research data requirement, use the <Link href="/request-data" className="font-semibold text-slate-950 underline underline-offset-4">research data request form</Link>.
              </p>
            </section>

            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-2xl font-semibold text-slate-950">{section.title}</h2>
                <p className="mt-3 text-base leading-7 text-slate-600">{section.content}</p>
              </section>
            ))}

            <div className="border-t border-slate-200 pt-8">
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button as="a" href="/contact" variant="primary" size="large">
                  Contact BCONZ
                </Button>
                <Button as="a" href="/data-partners" variant="secondary" size="large">
                  Become a Data Partner
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PageShell>
    </>
  );
}
