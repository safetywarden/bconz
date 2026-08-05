import type { IconName } from "@/components/ui/icon";

export type ResourceCardData = {
  title: string;
  description: string;
  icon: IconName;
};

export const resourceCards: ResourceCardData[] = [
  {
    title: "White Papers",
    description: "In-depth perspectives on healthcare data partnerships and research readiness.",
    icon: "research",
  },
  {
    title: "Research Guides",
    description: "Practical resources for life sciences teams and healthcare organizations.",
    icon: "governance",
  },
  {
    title: "Governance Frameworks",
    description: "Templates and principles for purpose-driven data collaboration.",
    icon: "trust",
  },
  {
    title: "Data Dictionaries",
    description: "Reference materials for healthcare data standards and dataset structure.",
    icon: "data",
  },
  {
    title: "Industry Reports",
    description: "Analysis on healthcare innovation, AI adoption and clinical research trends.",
    icon: "clinical",
  },
  {
    title: "Webinars",
    description: "Live and on-demand sessions for research and governance leaders.",
    icon: "partnership",
  },
  {
    title: "Case Studies",
    description: "Examples of institution-led research collaborations and outcomes.",
    icon: "imaging",
  },
  {
    title: "Brochures",
    description: "Executive summaries for partners and research stakeholders.",
    icon: "pathology",
  },
];
