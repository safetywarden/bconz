import { metadataBase, siteDescription, siteName } from "@/lib/site";

export type PublicRoute =
  | "/"
  | "/about"
  | "/data"
  | "/request-data"
  | "/data-partners"
  | "/contact"
  | "/privacy"
  | "/terms"
  | "/solutions"
  | "/insights";

export type PageSeo = {
  path: PublicRoute;
  title: string;
  description: string;
  keywords: string[];
};

export const defaultOgImage = "/Images/brand_canvas/linkedin-header.png";

export const pageSeo: Record<PublicRoute, PageSeo> = {
  "/": {
    path: "/",
    title: "Healthcare Data Partnerships for AI-Ready Clinical Research | BCONZ",
    description:
      "BCONZ helps healthcare and life sciences organizations collaborate through trusted clinical, molecular, imaging and real-world data partnerships for regulated research.",
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
    title: "About BCONZ | Healthcare Data Partnership Expertise",
    description:
      "Learn how BCONZ supports responsible healthcare data collaboration for hospitals, research institutes, life sciences teams and healthcare AI organizations.",
    keywords: [
      "healthcare data expertise",
      "life sciences data partnerships",
      "responsible healthcare data",
      "clinical research collaboration",
    ],
  },
  "/data": {
    path: "/data",
    title: "Clinical Research Data and AI-Ready Healthcare Datasets | BCONZ",
    description:
      "Explore research-ready clinical, genomics, imaging, biospecimen and real-world healthcare data modalities for enterprise life sciences and AI research.",
    keywords: [
      "clinical data licensing",
      "longitudinal clinical data",
      "genomics data partnerships",
      "real world evidence",
      "medical research data",
    ],
  },
  "/request-data": {
    path: "/request-data",
    title: "Request Clinical Research Data for Life Sciences Studies | BCONZ",
    description:
      "Request healthcare research data for clinical research, real-world evidence, precision medicine, AI development and enterprise life sciences programs.",
    keywords: [
      "request clinical research data",
      "medical research data",
      "AI healthcare datasets",
      "real world evidence data",
    ],
  },
  "/data-partners": {
    path: "/data-partners",
    title: "Hospital and Genomics Data Partnerships for Research | BCONZ",
    description:
      "Explore responsible data partnership models for hospitals, health systems, laboratories, biobanks, genomics companies and academic research institutes.",
    keywords: [
      "hospital data partnerships",
      "genomics data partnerships",
      "federated healthcare data",
      "healthcare data collaboration",
    ],
  },
  "/contact": {
    path: "/contact",
    title: "Contact BCONZ for Healthcare Data Collaboration",
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
    title: "Privacy Commitments for Healthcare Data Governance | BCONZ",
    description:
      "Review BCONZ privacy commitments for healthcare data governance, research collaboration, enterprise partnerships and responsible data handling.",
    keywords: [
      "healthcare data privacy",
      "data governance",
      "research data privacy",
      "enterprise healthcare privacy",
    ],
  },
  "/terms": {
    path: "/terms",
    title: "Terms of Use for BCONZ Enterprise Website",
    description:
      "Review website terms for BCONZ corporate information, enterprise healthcare data partnerships, research collaboration and public website access.",
    keywords: [
      "BCONZ terms",
      "healthcare data website terms",
      "enterprise research website",
    ],
  },
  "/solutions": {
    path: "/solutions",
    title: "Healthcare Data Solutions for Life Sciences and AI Research | BCONZ",
    description:
      "See how BCONZ supports pharmaceutical, biotechnology, CRO, healthcare AI and research organizations with trusted healthcare data collaboration.",
    keywords: [
      "healthcare data solutions",
      "healthcare AI research",
      "life sciences data",
      "clinical research data platform",
    ],
  },
  "/insights": {
    path: "/insights",
    title: "Healthcare Data Insights for Research and AI Leaders | BCONZ",
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
