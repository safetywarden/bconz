import { createMetadata } from "@/lib/metadata";
import { AboutPage } from "@/components/about/AboutPage";

export const metadata = createMetadata({
  title: "About BCONZ",
  description:
    "Learn about BCONZ, our mission, vision and commitment to trusted healthcare data partnerships supporting scientific discovery.",
});

export default function Page() {
  return <AboutPage />;
}
