export type FeaturedInsight = {
  id: string;
  title: string;
  category: string;
  readingTime: string;
  summary: string;
  image: string;
  imageAlt: string;
  status: "unpublished";
};

export const featuredInsight: FeaturedInsight = {
  id: "trusted-healthcare-data-partnerships",
  title: "Trusted Healthcare Data Partnerships for Enterprise Research",
  category: "Healthcare Data Partnerships",
  readingTime: "8 min read",
  summary:
    "How BCONZ works with healthcare organizations and life sciences teams to create research-ready, governance-aware data collaborations.",
  image: "/globe.svg",
  imageAlt: "Healthcare data insights illustration",
  status: "unpublished",
};
