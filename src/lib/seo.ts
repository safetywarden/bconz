import { metadataBase, siteDescription, siteName } from "@/lib/site";
import { seoSiteConfig } from "@/lib/seo/site-config";
import { areas, type AreaSlug } from "@/content/datasets";

export type PublicRoute =
  | "/"
  | "/about"
  | "/data"
  | "/request-data"
  | "/data-partners"
  | "/contact"
  | "/privacy"
  | "/terms"
  | "/responsible-data-governance"
  | "/responsible-ai-principles"
  | "/solutions"
  | "/platform"
  | "/platform/harm"
  | "/platform/pia"
  | "/platform/dia"
  | `/data/${AreaSlug}`
  | "/insights";

export type PageSeo = {
  path: PublicRoute;
  title: string;
  description: string;
  keywords: string[];
};

export const defaultOgImage = seoSiteConfig.defaultOpenGraphImage;

export const pageSeo: Record<PublicRoute, PageSeo> = {
  "/": {
    path: "/",
    title: "Healthcare Data Partnerships for AI and Life Sciences",
    description:
      "BCONZ enables trusted healthcare data partnerships for clinical, genomic, imaging and longitudinal research datasets for life sciences and AI.",
    keywords: [
      "healthcare data partnerships",
      "clinical research data",
      "AI-ready clinical data",
      "real world data",
      "precision medicine data",
    ],
  },
  "/about": {
    path: "/about",
    title: "About Healthcare Data Partnerships",
    description:
      "Learn how BCONZ supports responsible healthcare data collaboration for hospitals, research institutes, life sciences and healthcare AI teams.",
    keywords: [
      "healthcare data expertise",
      "life sciences data partnerships",
      "responsible healthcare data",
      "clinical research collaboration",
    ],
  },
  "/data": {
    path: "/data",
    title: "EHR, Imaging and Real-World Datasets",
    description:
      "De-identified EHR datasets, medical imaging and longitudinal real-world data for life sciences and healthcare AI, licensed through governed partnerships.",
    keywords: [
      "ehr datasets",
      "de-identified ehr data",
      "real world data ehr",
      "longitudinal patient data",
      "medical imaging datasets",
      "buy medical data",
    ],
  },
  ...(Object.fromEntries(areas.map((a) => [`/data/${a.slug}`, {
    path: `/data/${a.slug}` as PublicRoute,
    title: a.title,
    description: a.description,
    keywords: a.keywords,
  }])) as Record<`/data/${AreaSlug}`, PageSeo>),
  "/request-data": {
    path: "/request-data",
    title: "Request Healthcare Data for Research and AI",
    description:
      "Request healthcare research data for clinical studies, real-world evidence, precision medicine, AI development and life sciences programs.",
    keywords: [
      "request clinical research data",
      "medical research data",
      "AI healthcare datasets",
      "real world evidence data",
    ],
  },
  "/data-partners": {
    path: "/data-partners",
    title: "Data Collaboration Programme for Hospitals and Labs",
    description:
      "Contribute de-identified real-world data for research: readiness assessment, de-identification, harmonisation, hosting and a share of licensing revenue.",
    keywords: [
      "healthcare data partnership program",
      "monetize healthcare data",
      "real world data collaboration",
      "contribute data for research",
      "hospital data partnerships",
      "genomics data partnerships",
      "federated healthcare data",
      "healthcare data collaboration",
    ],
  },
  "/contact": {
    path: "/contact",
    title: "Contact Healthcare Data Collaboration Team",
    description:
      "Contact BCONZ to discuss healthcare data partnerships, clinical research data, AI-ready datasets, responsible data governance and enterprise collaboration.",
    keywords: [
      "contact healthcare data platform",
      "healthcare data collaboration",
      "clinical research partnership",
      "life sciences data partnership",
    ],
  },
  "/privacy": {
    path: "/privacy",
    title: "Privacy Policy",
    description:
      "Review how BCONZ handles website and business enquiry information for healthcare data partnership discussions.",
    keywords: [
      "healthcare data privacy",
      "data governance",
      "research data privacy",
      "enterprise healthcare privacy",
    ],
  },
  "/terms": {
    path: "/terms",
    title: "Terms of Use",
    description:
      "Review the terms that apply when using the BCONZ website and public business enquiry pathways.",
    keywords: [
      "BCONZ terms",
      "healthcare data website terms",
      "enterprise research website",
    ],
  },
  "/responsible-data-governance": {
    path: "/responsible-data-governance",
    title: "Responsible Data and Governance",
    description:
      "Review BCONZ principles for responsible healthcare data use, institutional ownership, privacy, governance and long-term collaboration.",
    keywords: [
      "responsible healthcare data",
      "healthcare data governance",
      "institution-led data partnerships",
      "de-identification principles",
    ],
  },
  "/responsible-ai-principles": {
    path: "/responsible-ai-principles",
    title: "Responsible AI Principles",
    description:
      "Review BCONZ principles for human-centred, privacy-conscious and scientifically rigorous healthcare AI collaboration.",
    keywords: [
      "responsible healthcare AI",
      "healthcare AI principles",
      "clinical AI governance",
      "bias-aware AI research",
    ],
  },
  "/solutions": {
    path: "/solutions",
    title: "Healthcare Data Solutions for Life Sciences and AI",
    description:
      "See how BCONZ supports pharmaceutical, biotechnology, CRO, healthcare AI and research organizations with trusted healthcare data collaboration.",
    keywords: [
      "healthcare data solutions",
      "healthcare AI research",
      "life sciences data",
      "clinical research data platform",
    ],
  },
  "/platform": {
    path: "/platform",
    title: "Real-World Data Platform for Research and AI",
    description:
      "Real-world data partnerships built on evidence: assess data readiness (HARM), select sites and partners (PIA) and match datasets to research demand (DIA).",
    keywords: [
      "real world data platform",
      "real world data companies",
      "real world data sources",
      "healthcare data for AI",
      "healthcare data partnerships",
    ],
  },
  "/platform/harm": {
    path: "/platform/harm",
    title: "Healthcare Data Readiness Assessment for AI",
    description:
      "Data readiness assessment for hospitals and labs: check patients, follow-up, coding and identifiers for research and AI, read-only, without data leaving.",
    keywords: [
      "data readiness assessment",
      "data readiness assessment for AI",
      "healthcare data readiness",
      "data readiness checklist",
      "data governance readiness assessment",
    ],
  },
  "/platform/pia": {
    path: "/platform/pia",
    title: "Clinical Trial Site Selection & Data Partners",
    description:
      "Evidence-led clinical trial site selection and data partner identification from public trial and publication evidence, with unknowns reported as unknown.",
    keywords: [
      "clinical trial site selection",
      "site selection criteria for clinical trials",
      "clinical trial feasibility assessment",
      "patient cohort identification",
      "clinical trial site networks",
    ],
  },
  "/platform/dia": {
    path: "/platform/dia",
    title: "Healthcare Data Monetization for Data Partners",
    description:
      "Healthcare data monetization: see who has published a need for data like yours and which needs your dataset meets, from papers, grants and trials.",
    keywords: [
      "healthcare data monetization",
      "who buys healthcare data",
      "sell medical data",
      "healthcare data marketplace",
      "real world evidence data sources",
    ],
  },
  "/insights": {
    path: "/insights",
    title: "Healthcare Data and AI Insights",
    description:
      "Read BCONZ insights on healthcare data strategy, real-world evidence, AI-ready clinical data, governance and enterprise research collaboration.",
    keywords: [
      "healthcare data insights",
      "real world evidence strategy",
      "healthcare AI insights",
      "clinical data governance",
    ],
  },
};

export const sitemapRoutes = Object.values(pageSeo);

export function absoluteUrl(path: string) {
  return new URL(path, metadataBase).toString();
}

export function getPageSeo(path: PublicRoute) {
  return pageSeo[path] ?? {
    path,
    title: siteName,
    description: siteDescription,
    keywords: [],
  };
}
