import { createMetadata } from "@/lib/metadata";
import { InsightsPage } from "@/components/insights/InsightsPage";

export const metadata = createMetadata({
  title: "Insights | BCONZ",
  description: "Insights for healthcare data strategy, life sciences analytics, and enterprise research operations.",
});

export default function InsightsRoute() {
  return <InsightsPage />;
}
