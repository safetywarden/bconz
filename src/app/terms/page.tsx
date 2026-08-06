import { JsonLd } from "@/components/seo/JsonLd";
import { PageShell } from "@/components/layout/page-shell";
import { createMetadata } from "@/lib/metadata";
import { getPageSeo } from "@/lib/seo";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo/json-ld";

const seo = getPageSeo("/terms");

export const metadata = createMetadata(seo);

const termsSections = [
  {
    title: "Website purpose",
    content:
      "The BCONZ website provides general business information about healthcare data partnerships, research data pathways, data partner engagement and related corporate topics. The website does not itself create a data access right, research collaboration or service commitment.",
  },
  {
    title: "Acceptable use",
    content:
      "You may use the website for lawful business and informational purposes. You must not attempt to disrupt the website, misuse forms, submit harmful code, scrape the site at unreasonable volume, impersonate another person or submit information that you are not authorised to provide.",
  },
  {
    title: "Intellectual property",
    content:
      "Website content, branding, design elements, text, graphics and other materials are owned by or licensed to BCONZ unless otherwise stated. You may not copy, reuse or modify website materials for commercial purposes without written permission.",
  },
  {
    title: "No medical advice",
    content:
      "The website is not medical advice and should not be used to diagnose, treat, prevent or manage any disease or health condition. Healthcare decisions should be made with qualified clinical professionals.",
  },
  {
    title: "No legal advice",
    content:
      "The website is not legal advice. Information about privacy, governance, partnerships or research processes is provided for general business understanding only.",
  },
  {
    title: "No patient submissions",
    content:
      "Do not submit patient names, medical records, genomic files, pathology reports, medical images or other identifiable health information through this public website. Any healthcare data collaboration must be governed separately through appropriate contractual arrangements.",
  },
  {
    title: "External links",
    content:
      "The website may link to third-party websites or services. BCONZ is not responsible for the content, availability, security or privacy practices of third-party websites.",
  },
  {
    title: "Limitation of liability",
    content:
      "The website is provided for general informational use. To the extent permitted by applicable law, BCONZ is not liable for losses arising from use of, reliance on or inability to access the website.",
  },
  {
    title: "Governing law",
    content:
      "These Terms of Use are governed by the laws of India, unless a different governing law is required by applicable law or agreed in a separate written contract with BCONZ.",
  },
  {
    title: "Contact",
    content:
      "For questions about these Terms of Use, contact BCONZ through the website contact form.",
  },
];

export default function TermsPage() {
  return (
    <>
      <JsonLd id="ld-terms-page" data={webPageJsonLd("/terms")} />
      <JsonLd id="ld-terms-breadcrumb" data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Terms", path: "/terms" }])} />
      <PageShell title="Terms of Use" description="Terms for using the BCONZ public website and enquiry pathways.">
        <div className="mx-auto max-w-5xl px-6 pb-24 lg:px-8">
          <div className="space-y-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            {termsSections.map((section) => (
              <section key={section.title}>
                <h2 className="text-2xl font-semibold text-slate-950">{section.title}</h2>
                <p className="mt-3 text-base leading-7 text-slate-600">{section.content}</p>
              </section>
            ))}

            <p className="border-t border-slate-200 pt-6 text-sm text-slate-500">
              Last updated: August 6, 2026
            </p>
          </div>
        </div>
      </PageShell>
    </>
  );
}
