import { metadataBase, siteDescription, siteName } from "@/lib/site";
import { seoSiteConfig } from "@/lib/seo/site-config";

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
    title: "Research-Ready Clinical, Genomic and Imaging Data",
    description:
      "Explore research-ready clinical, genomic, imaging, biospecimen and real-world healthcare data for enterprise life sciences and AI research.",
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
    title: "Healthcare Data Partnerships for Hospitals and Labs",
    description:
      "Explore responsible data partnership models for hospitals, health systems, labs, biobanks, genomics companies and research institutes.",
    keywords: [
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
    title: "Terms of Use",
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
