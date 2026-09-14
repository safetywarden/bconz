import type { Metadata } from "next";
import { PiaWorkspace } from "@/components/pia/PiaWorkspace";

export const metadata: Metadata = {
  title: "BCONZ PIA — Provider Intelligence Agent",
  description:
    "Discover, evaluate and prioritize healthcare providers for clinical-data and data-partnership opportunities.",
  robots: { index: false, follow: false },
};

export default function PiaPage() {
  return <PiaWorkspace />;
}
