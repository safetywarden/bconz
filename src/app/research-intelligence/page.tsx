import type { Metadata } from "next";
import { ResearchIntelligenceDashboard } from "./research-intelligence-dashboard";

export const metadata: Metadata = {
  title: "Research Intelligence | BCONZ",
  description: "Internal BCONZ RDIA/DRA research intelligence console.",
  robots: { index: false, follow: false },
};

export default function ResearchIntelligencePage() {
  return <ResearchIntelligenceDashboard />;
}
