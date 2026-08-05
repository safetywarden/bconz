export type ImageCategory =
  | "Hero"
  | "Healthcare Partnerships"
  | "Clinical Research"
  | "Genomics"
  | "Multiomics"
  | "Medical Imaging"
  | "Digital Pathology"
  | "Biospecimens"
  | "Data Visualization"
  | "Life Sciences"
  | "AI"
  | "Laboratories"
  | "Hospital Networks"
  | "Backgrounds"
  | "Illustrations"
  | "Icons"
  | "Open Graph";

export type ImageLocaleAltText = {
  default: string;
  [locale: string]: string;
};

export type ImageAsset = {
  id: string;
  title: string;
  category: ImageCategory;
  path: string;
  alt: ImageLocaleAltText;
  description: string;
  keywords: string[];
};

export const imageCategories: ImageCategory[] = [
  "Hero",
  "Healthcare Partnerships",
  "Clinical Research",
  "Genomics",
  "Multiomics",
  "Medical Imaging",
  "Digital Pathology",
  "Biospecimens",
  "Data Visualization",
  "Life Sciences",
  "AI",
  "Laboratories",
  "Hospital Networks",
  "Backgrounds",
  "Illustrations",
  "Icons",
  "Open Graph",
];

export const imageLibrary: ImageAsset[] = [
  {
    id: "hero-01",
    title: "Enterprise healthcare collaboration landscape",
    category: "Hero",
    path: "/images/placeholders/hero-01.svg",
    alt: {
      default: "Abstract illustration of healthcare and life sciences collaboration",
      es: "Ilustración abstracta de colaboración en atención médica y ciencias de la vida",
    },
    description: "A hero-style illustration representing enterprise healthcare partnership and data strategy.",
    keywords: ["enterprise", "healthcare", "partnership", "hero"],
  },
  {
    id: "healthcare-partnerships-01",
    title: "Healthcare partnership network",
    category: "Healthcare Partnerships",
    path: "/images/placeholders/healthcare-partnerships-01.svg",
    alt: {
      default: "Diagram of healthcare organizations collaborating across a trusted network",
    },
    description: "A placeholder image for healthcare partnerships and trust-driven data exchange.",
    keywords: ["network", "partnership", "trust", "healthcare"],
  },
  {
    id: "clinical-research-01",
    title: "Clinical research data flow",
    category: "Clinical Research",
    path: "/images/placeholders/clinical-research-01.svg",
    alt: {
      default: "Illustration of clinical research workflow and dataset curation",
    },
    description: "A placeholder image for clinical research use cases and data governance.",
    keywords: ["clinical", "research", "workflow", "data"],
  },
  {
    id: "genomics-01",
    title: "Genomics sequence concept art",
    category: "Genomics",
    path: "/images/placeholders/genomics-01.svg",
    alt: {
      default: "Stylized genomics sequence illustration with data insights",
    },
    description: "A placeholder image for genomics and life science dataset storytelling.",
    keywords: ["genomics", "sequence", "biology", "data"],
  },
  {
    id: "multiomics-01",
    title: "Multiomics integration graphic",
    category: "Multiomics",
    path: "/images/placeholders/multiomics-01.svg",
    alt: {
      default: "Abstract graphic showing multiomics data integration and analysis",
    },
    description: "A placeholder for multiomics analytics and complex biological data integration.",
    keywords: ["multiomics", "integration", "analysis", "biology"],
  },
  {
    id: "medical-imaging-01",
    title: "Medical imaging technology",
    category: "Medical Imaging",
    path: "/images/placeholders/medical-imaging-01.svg",
    alt: {
      default: "Illustration of medical imaging equipment and diagnostic data",
    },
    description: "A placeholder image for medical imaging and clinical diagnostics use cases.",
    keywords: ["medical imaging", "diagnostics", "radiology", "healthcare"],
  },
  {
    id: "digital-pathology-01",
    title: "Digital pathology workflow",
    category: "Digital Pathology",
    path: "/images/placeholders/digital-pathology-01.svg",
    alt: {
      default: "Digital pathology workflow illustration with tissue analysis imagery",
    },
    description: "A placeholder for digital pathology and tissue imaging research streams.",
    keywords: ["pathology", "digital", "tissue", "imaging"],
  },
  {
    id: "biospecimens-01",
    title: "Biospecimen collection and data",
    category: "Biospecimens",
    path: "/images/placeholders/biospecimens-01.svg",
    alt: {
      default: "Illustration of biospecimen collection connecting to research datasets",
    },
    description: "A placeholder image to represent biospecimens and sample data governance.",
    keywords: ["biospecimens", "sample", "research", "governance"],
  },
  {
    id: "data-visualization-01",
    title: "Scientific data visualization dashboard",
    category: "Data Visualization",
    path: "/images/placeholders/data-visualization-01.svg",
    alt: {
      default: "Data visualization dashboard showing research and analytics metrics",
    },
    description: "A placeholder image for data visualization, dashboards, and insights.",
    keywords: ["dashboard", "visualization", "analytics", "insights"],
  },
  {
    id: "life-sciences-01",
    title: "Life sciences research ecosystem",
    category: "Life Sciences",
    path: "/images/placeholders/life-sciences-01.svg",
    alt: {
      default: "Illustration of the life sciences ecosystem and collaborative research",
    },
    description: "A placeholder image for life sciences research, biology, and clinical innovation.",
    keywords: ["life sciences", "research", "biology", "innovation"],
  },
  {
    id: "ai-01",
    title: "AI model for healthcare discovery",
    category: "AI",
    path: "/images/placeholders/ai-01.svg",
    alt: {
      default: "Illustration of artificial intelligence powering healthcare research",
    },
    description: "A placeholder image for AI-driven clinical research and data science workflows.",
    keywords: ["AI", "machine learning", "healthcare", "research"],
  },
  {
    id: "laboratories-01",
    title: "Modern laboratory environment",
    category: "Laboratories",
    path: "/images/placeholders/laboratories-01.svg",
    alt: {
      default: "Illustration of a laboratory setting with research equipment",
    },
    description: "A placeholder image to represent laboratory operations and life science testing.",
    keywords: ["laboratory", "research", "testing", "science"],
  },
  {
    id: "hospital-networks-01",
    title: "Connected hospital network map",
    category: "Hospital Networks",
    path: "/images/placeholders/hospital-networks-01.svg",
    alt: {
      default: "Illustration of connected hospitals and clinical data exchange",
    },
    description: "A placeholder image for hospital networks and collaborative clinical programs.",
    keywords: ["hospital", "network", "clinical", "collaboration"],
  },
  {
    id: "backgrounds-01",
    title: "Abstract healthcare background",
    category: "Backgrounds",
    path: "/images/placeholders/backgrounds-01.svg",
    alt: {
      default: "Soft abstract healthcare background for enterprise web pages",
    },
    description: "A placeholder background asset for website sections and brand compositions.",
    keywords: ["background", "abstract", "enterprise", "brand"],
  },
  {
    id: "illustrations-01",
    title: "Scientific illustration set",
    category: "Illustrations",
    path: "/images/placeholders/illustrations-01.svg",
    alt: {
      default: "Illustration set representing scientific data and healthcare research",
    },
    description: "A placeholder illustration asset for life sciences and clinical content.",
    keywords: ["illustration", "science", "healthcare", "content"],
  },
  {
    id: "icons-01",
    title: "Icon pattern for data services",
    category: "Icons",
    path: "/images/placeholders/icons-01.svg",
    alt: {
      default: "Icon set representing data services and healthcare technology",
    },
    description: "A placeholder icon asset for components, features, and navigation.",
    keywords: ["icons", "data", "services", "technology"],
  },
  {
    id: "open-graph-01",
    title: "Open Graph preview image",
    category: "Open Graph",
    path: "/images/placeholders/open-graph-01.png",
    alt: {
      default: "Open Graph image for BCONZ enterprise healthcare website",
    },
    description: "A placeholder Open Graph image for social sharing and SEO previews.",
    keywords: ["open graph", "social", "preview", "SEO"],
  },
];

const categoryMap: Record<
  "Hero" | "Healthcare Partnerships" | "Clinical Research" | "Genomics" | "Multiomics" | "Medical Imaging" | "Digital Pathology" | "Biospecimens" | "Data Visualization" | "Life Sciences" | "AI" | "Laboratories" | "Hospital Networks" | "Backgrounds" | "Illustrations" | "Icons" | "Open Graph",
  ImageAsset[]
> = imageCategories.reduce((map, category) => {
  map[category] = imageLibrary.filter((image) => image.category === category);
  return map;
}, {} as Record<ImageCategory, ImageAsset[]>);

export function getImagesByCategory(category: ImageCategory): ImageAsset[] {
  return categoryMap[category] ?? [];
}

export function getHeroImages(): ImageAsset[] {
  return getImagesByCategory("Hero");
}

export function getPartnerImages(): ImageAsset[] {
  return getImagesByCategory("Healthcare Partnerships");
}

export function getSolutionImages(): ImageAsset[] {
  return imageLibrary.filter((image) =>
    ["Clinical Research", "Genomics", "Multiomics", "Medical Imaging", "Digital Pathology", "Biospecimens", "AI"].includes(image.category)
  );
}

export function getBackgroundImages(): ImageAsset[] {
  return getImagesByCategory("Backgrounds");
}

export function getOpenGraphImages(): ImageAsset[] {
  return getImagesByCategory("Open Graph");
}
