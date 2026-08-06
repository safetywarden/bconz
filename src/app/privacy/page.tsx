import { JsonLd } from "@/components/seo/JsonLd";
import { PageShell } from "@/components/layout/page-shell";
import { createMetadata } from "@/lib/metadata";
import { getPageSeo } from "@/lib/seo";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo/json-ld";

const seo = getPageSeo("/privacy");

export const metadata = createMetadata(seo);

const privacySections = [
  {
    title: "Scope",
    content:
      "This Privacy Policy explains how BCONZ handles personal information collected through this public website, including information submitted through enquiry and research request forms. It does not govern separate healthcare data collaborations, which are handled through dedicated contractual arrangements.",
  },
  {
    title: "Information collected through the website",
    content:
      "When you browse the website, standard technical information may be processed by hosting and security systems, such as IP address, browser type, device information, pages requested, timestamps and basic diagnostic logs.",
  },
  {
    title: "Business enquiry information",
    content:
      "If you submit a form, BCONZ may receive your name, organisation, role, business email, phone number, country, organisation type, area of interest, preferred contact method and message. Research data request forms may also include disease area, data modalities, study objective, estimated timeline and additional context you choose to provide.",
  },
  {
    title: "Website analytics",
    content:
      "BCONZ does not currently use a dedicated website analytics product on this site. If analytics are introduced, this policy should be updated to describe the provider and the information collected.",
  },
  {
    title: "Cookies",
    content:
      "The website may use essential cookies or similar technologies required for basic website delivery, security or platform operation. BCONZ does not currently use advertising cookies on this website.",
  },
  {
    title: "Third-party services actually used",
    content:
      "BCONZ uses Web3Forms to process public enquiry submissions, Vercel to host and deliver the website, and GoDaddy Professional Email for business email communication. These providers may process information as needed to deliver their services to BCONZ.",
  },
  {
    title: "Security",
    content:
      "BCONZ uses reasonable administrative, technical and organisational measures to protect website enquiry information. No public website or email system can be guaranteed to be completely secure.",
  },
  {
    title: "Data retention",
    content:
      "BCONZ retains website enquiry information for as long as reasonably necessary to review, respond to and manage the enquiry, maintain business records, resolve issues and meet applicable legal or operational requirements.",
  },
  {
    title: "Digital Personal Data Protection Act, 2023",
    content:
      "BCONZ is committed to handling personal information in accordance with applicable privacy and data protection laws, including the Digital Personal Data Protection Act, 2023 (India), where applicable.",
  },
  {
    title: "Contacting BCONZ",
    content:
      "For privacy questions or requests relating to information submitted through this website, contact BCONZ through the website contact form. Please include enough business context for BCONZ to identify and review your request.",
  },
  {
    title: "Updates to this policy",
    content:
      "BCONZ may update this Privacy Policy as the website, services or business processes evolve. The updated version will be posted on this page.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <JsonLd id="ld-privacy-page" data={webPageJsonLd("/privacy")} />
      <JsonLd id="ld-privacy-breadcrumb" data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Privacy", path: "/privacy" }])} />
      <PageShell title="Privacy Policy" description="How BCONZ handles website and business enquiry information.">
        <div className="mx-auto max-w-5xl px-6 pb-24 lg:px-8">
          <div className="space-y-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <section>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Important healthcare notice</p>
              <h2 className="mt-4 text-2xl font-semibold text-slate-950">Healthcare Data and Patient Information</h2>
              <div className="mt-4 space-y-4 text-base leading-7 text-slate-600">
                <p>
                  The public BCONZ website is not intended for submission of patient information.
                  Visitors must not submit patient names, medical records, genomic files, pathology reports,
                  medical images or other identifiable health information through website forms or general email channels.
                </p>
                <p>
                  Healthcare data collaborations are governed separately through contractual agreements that define scope,
                  responsibilities, permitted use, safeguards and project-specific review processes.
                </p>
              </div>
            </section>

            {privacySections.map((section) => (
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
