import type { LogoConfig, NavItem, FooterLink } from "@/types/site";

export const siteName = "BCONZ";
export const siteTagline = "Healthcare Data. Life Sciences Impact.";
export const siteDescription =
  "BCONZ connects healthcare organizations with life sciences companies through trust-driven research-ready healthcare datasets for enterprise analytics and scientific research.";

export const metadataBase = new URL("https://bconz.com");

export const navigation: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "Data", href: "/data" },
  { title: "Solutions", href: "/solutions" },
  { title: "Data Partners", href: "/data-partners" },
  { title: "Insights", href: "/insights" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
];

export const footerLinks: FooterLink[] = [
  { title: "Company", href: "/about" },
  { title: "Data", href: "/data" },
  { title: "Solutions", href: "/solutions" },
  { title: "Insights", href: "/insights" },
  { title: "Privacy", href: "/privacy" },
  { title: "Terms", href: "/terms" },
  { title: "Contact", href: "/contact" },
];

export const logoConfig: LogoConfig = {
  logoPath: "/brand/bconz-logo.svg",
  markPath: "/brand/bconz-mark.svg",
  altText: "BCONZ corporate logo",
};

export const socialLinks = [
  { title: "LinkedIn", href: "#" },
  { title: "Twitter", href: "#" },
  { title: "Research", href: "#" },
];
