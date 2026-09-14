import type { Metadata } from "next";
import { PiaNewDiscovery } from "@/components/pia/PiaNewDiscovery";

export const metadata: Metadata = {
  title: "New PIA Discovery — BCONZ",
  description: "Start a new healthcare provider discovery requirement.",
  robots: { index: false, follow: false },
};

export default function NewPiaDiscoveryPage() {
  return <PiaNewDiscovery />;
}
