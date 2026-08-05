export type InsightArticle = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  author: string;
  category: string;
  date: string;
  readingTime: string;
  image: string;
  imageAlt: string;
  tags: string[];
  featured?: boolean;
};

export const articles: InsightArticle[] = [
  {
    id: "governance-in-healthcare-data-partnerships",
    title: "Governance in Healthcare Data Partnerships",
    slug: "governance-in-healthcare-data-partnerships",
    summary:
      "A guide to maintaining institutional oversight and research purpose in healthcare data collaborations.",
    author: "BCONZ Insights Team",
    category: "Governance",
    date: "June 20, 2026",
    readingTime: "6 min read",
    image: "/file.svg",
    imageAlt: "Governance framework illustration",
    tags: ["Governance", "Research", "Partnerships"],
  },
  {
    id: "healthcare-ai-and-multi-modal-innovation",
    title: "Healthcare AI and Multi-modal Innovation",
    slug: "healthcare-ai-and-multi-modal-innovation",
    summary:
      "Exploring how clinical, imaging and molecular data support AI innovation in healthcare research.",
    author: "BCONZ Insights Team",
    category: "Healthcare AI",
    date: "June 15, 2026",
    readingTime: "7 min read",
    image: "/globe.svg",
    imageAlt: "AI and data illustration",
    tags: ["AI", "Imaging", "Research"],
  },
  {
    id: "real-world-data-for-life-sciences",
    title: "Real World Data for Life Sciences Research",
    slug: "real-world-data-for-life-sciences",
    summary:
      "How real-world healthcare insights help institutions support research-ready studies and clinical discovery.",
    author: "BCONZ Insights Team",
    category: "Real World Data",
    date: "June 8, 2026",
    readingTime: "5 min read",
    image: "/window.svg",
    imageAlt: "Data analysis illustration",
    tags: ["Real World Data", "Clinical", "Outcomes"],
  },
  {
    id: "clinical-research-collaboration-best-practices",
    title: "Clinical Research Collaboration Best Practices",
    slug: "clinical-research-collaboration-best-practices",
    summary:
      "Practical guidance for healthcare organizations partnering with research and life sciences teams.",
    author: "BCONZ Insights Team",
    category: "Clinical Research",
    date: "June 2, 2026",
    readingTime: "6 min read",
    image: "/globe.svg",
    imageAlt: "Collaboration illustration",
    tags: ["Clinical Research", "Partnerships", "Data"],
  },
];
