import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/metadata";
import { getPageSeo } from "@/lib/seo";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo/json-ld";

const seo = getPageSeo("/responsible-ai-principles");

export const metadata = createMetadata(seo);

const principles = [
  {
    title: "Human-centred",
    content:
      "Healthcare AI should be designed around people: patients, clinicians, researchers, data partners and the teams responsible for safe implementation. BCONZ supports AI work that is clear about the problem being addressed and realistic about how outputs may be used. AI should support, not replace, clinical judgement and research expertise.",
  },
  {
    title: "Scientifically rigorous",
    content:
      "AI development should be grounded in a sound research question, appropriate data, careful evaluation and honest discussion of limitations. A model is only useful when its intended context is understood. BCONZ supports collaborations that consider study design, cohort definition, data quality, validation needs and interpretation before claims are made.",
  },
  {
    title: "Transparent",
    content:
      "Partners should understand the purpose of an AI project, the data categories involved, the responsibilities of each party and the expected use of results. Transparency also means avoiding unclear claims about model capability, dataset availability or clinical impact. Plain language is important because governance decisions are made by multidisciplinary teams.",
  },
  {
    title: "Privacy-conscious",
    content:
      "Healthcare AI work often involves sensitive data categories. BCONZ expects privacy to be considered before data is shared, linked, transformed or analysed. Public website forms must not be used to submit patient information, medical records, genomic files, pathology reports or medical images. Project-specific safeguards should be addressed through the appropriate agreements.",
  },
  {
    title: "Bias-aware",
    content:
      "AI systems can reflect gaps, imbalances or limitations in the data used to develop them. Responsible AI work should consider whether a dataset is suitable for the intended research question and whether results may vary across populations, sites, devices, care settings or disease subgroups. Bias awareness is a practical part of scientific review.",
  },
  {
    title: "Secure",
    content:
      "AI collaboration should be supported by sensible security controls, access management and clear responsibilities. Security expectations depend on the data, the project and the organisations involved. BCONZ supports structured conversations about permitted users, environments, transfer methods, storage, retention and incident escalation.",
  },
  {
    title: "Developed responsibly",
    content:
      "Responsible development means moving at a pace that allows review, documentation and partner alignment. It also means recognising when a project is not ready. BCONZ supports practical AI development that balances innovation with governance, scientific reliability, institutional trust and appropriate use.",
  },
  {
    title: "Clinical and research context",
    content:
      "AI outputs should be interpreted in context. They may help with research planning, data analysis, cohort discovery, imaging assessment, biomarker exploration or operational insight, but they should not be treated as independent clinical authority. Clinical decisions remain the responsibility of qualified healthcare professionals.",
  },
];

export default function ResponsibleAiPrinciplesPage() {
  return (
    <>
      <JsonLd id="ld-responsible-ai-page" data={webPageJsonLd("/responsible-ai-principles")} />
      <JsonLd
        id="ld-responsible-ai-breadcrumb"
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Responsible AI Principles", path: "/responsible-ai-principles" },
        ])}
      />
      <PageShell
        title="Responsible AI Principles"
        description="BCONZ supports healthcare AI collaboration that is human-centred, privacy-conscious, bias-aware and scientifically grounded."
      >
        <div className="mx-auto max-w-5xl px-6 pb-24 lg:px-8">
          <div className="space-y-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <section className="space-y-4 text-base leading-7 text-slate-600">
              <p>
                BCONZ works with healthcare organisations, life sciences teams and AI companies that need research-ready healthcare data and responsible partnership structures. These principles describe how BCONZ approaches AI-related collaboration at a business and governance level.
              </p>
              <p>
                Teams evaluating an AI research program can review BCONZ <Link href="/data" className="font-semibold text-slate-950 underline underline-offset-4">research data capabilities</Link>, submit a <Link href="/request-data" className="font-semibold text-slate-950 underline underline-offset-4">research data request</Link>, or <Link href="/contact" className="font-semibold text-slate-950 underline underline-offset-4">contact BCONZ</Link> for a focused discussion.
              </p>
            </section>

            {principles.map((principle) => (
              <section key={principle.title}>
                <h2 className="text-2xl font-semibold text-slate-950">{principle.title}</h2>
                <p className="mt-3 text-base leading-7 text-slate-600">{principle.content}</p>
              </section>
            ))}

            <div className="border-t border-slate-200 pt-8">
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button as="a" href="/request-data" variant="primary" size="large">
                  Request Research Data
                </Button>
                <Button as="a" href="/contact" variant="secondary" size="large">
                  Contact BCONZ
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PageShell>
    </>
  );
}
