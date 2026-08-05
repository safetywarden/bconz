import { createMetadata } from "@/lib/metadata";
import { ContactPage } from "@/components/contact/ContactPage";

export const metadata = createMetadata({
  title: "Contact BCONZ",
  description:
    "Contact BCONZ to discuss healthcare data partnerships, research collaborations and scientific initiatives.",
});

export default function Page() {
  return <ContactPage />;
}
