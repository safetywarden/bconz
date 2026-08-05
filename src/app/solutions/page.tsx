import { createMetadata } from "@/lib/metadata";
import { SolutionsPage } from "@/components/solutions/SolutionsPage";

export const metadata = createMetadata({
  title: "Solutions | BCONZ",
  description: "Explore how BCONZ supports pharmaceutical, biotechnology, healthcare AI, CRO and research organizations through trusted healthcare data partnerships.",
});

export default function Page() {
  return <SolutionsPage />;
}
