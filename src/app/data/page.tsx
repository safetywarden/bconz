import { createMetadata } from "@/lib/metadata";
import { ResearchDataPage } from "@/components/data/ResearchDataPage";

export const metadata = createMetadata({
  title: "Research Data | BCONZ",
  description:
    "Discover research-ready clinical, molecular, imaging and real-world healthcare data through trusted healthcare data partnerships.",
});

export default function DataPage() {
  return <ResearchDataPage />;
}
