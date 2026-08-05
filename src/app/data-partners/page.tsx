import { createMetadata } from "@/lib/metadata";
import { DataPartnersPage } from "@/components/data-partners/DataPartnersPage";

export const metadata = createMetadata({
  title: "Healthcare Data Partnerships | BCONZ",
  description:
    "Explore how hospitals, laboratories, biobanks and research institutions can partner with BCONZ through responsible healthcare data partnerships that support scientific discovery.",
});

export default function Page() {
  return <DataPartnersPage />;
}
