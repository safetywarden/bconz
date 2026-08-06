export type InsightArticle = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  readingTime: string;
  image: string;
  imageAlt: string;
  tags: string[];
  status: "unpublished";
  featured?: boolean;
};

export const articles: InsightArticle[] = [
  {
    id: "governance-in-healthcare-data-partnerships",
    title: "Governance in Healthcare Data Partnerships",
    slug: "governance-in-healthcare-data-partnerships",
    summary:
      "A guide to maintaining institutional oversight and research purpose in healthcare data collaborations.",
    category: "Governance",
    readingTime: "6 min read",
    image: "/file.svg",
    imageAlt: "Governance framework illustration",
    tags: ["Governance", "Research", "Partnerships"],
    status: "unpublished",
  },
  {
    id: "healthcare-ai-and-multi-modal-innovation",
    title: "Healthcare AI and Multi-modal Innovation",
    slug: "healthcare-ai-and-multi-modal-innovation",
    summary:
      "Exploring how clinical, imaging and molecular data support AI innovation in healthcare research.",
    category: "Healthcare AI",
    readingTime: "7 min read",
    image: "/globe.svg",
    imageAlt: "AI and data illustration",
    tags: ["AI", "Imaging", "Research"],
    status: "unpublished",
  },
  {
    id: "real-world-data-for-life-sciences",
    title: "Real World Data for Life Sciences Research",
    slug: "real-world-data-for-life-sciences",
    summary:
      "How real-world healthcare insights help institutions support research-ready studies and clinical discovery.",
    category: "Real World Data",
    readingTime: "5 min read",
    image: "/window.svg",
    imageAlt: "Data analysis illustration",
    tags: ["Real World Data", "Clinical", "Outcomes"],
    status: "unpublished",
  },
  {
    id: "clinical-research-collaboration-best-practices",
    title: "Clinical Research Collaboration Best Practices",
    slug: "clinical-research-collaboration-best-practices",
    summary:
      "Practical guidance for healthcare organizations partnering with research and life sciences teams.",
    category: "Clinical Research",
    readingTime: "6 min read",
    image: "/globe.svg",
    imageAlt: "Collaboration illustration",
    tags: ["Clinical Research", "Partnerships", "Data"],
    status: "unpublished",
  },
];
