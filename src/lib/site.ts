import type { LogoConfig, NavItem, FooterLink } from "@/types/site";
import { seoSiteConfig } from "@/lib/seo/site-config";

export const siteName = seoSiteConfig.siteName;
export const siteTagline = "Healthcare Data. Life Sciences Impact.";
export const siteDescription = seoSiteConfig.defaultDescription;

export const metadataBase = new URL(seoSiteConfig.siteUrl);

export const navigation: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "Research Data", href: "/data" },
  { title: "Solutions", href: "/solutions" },
  { title: "Data Partners", href: "/data-partners" },
  { title: "Insights", href: "/insights" },
  { title: "About", href: "/about" },
  // Contact is provided as a primary CTA instead of a navigation item
];

export const footerLinks: FooterLink[] = [
  { title: "Company", href: "/about" },
  { title: "Data", href: "/data" },
  { title: "Request Data", href: "/request-data" },
  { title: "Data Partners", href: "/data-partners" },
  { title: "Solutions", href: "/solutions" },
  { title: "Insights", href: "/insights" },
  { title: "Responsible Data & Governance", href: "/responsible-data-governance" },
  { title: "Responsible AI Principles", href: "/responsible-ai-principles" },
  { title: "Privacy Policy", href: "/privacy" },
  { title: "Terms of Use", href: "/terms" },
  { title: "Contact", href: "/contact" },
];

export const logoConfig: LogoConfig = {
  logoPath: "/Images/brand/bconz-logo.png",
  markPath: "/Images/brand/bconz-icon.png",
  logoAltText: "BCONZ logo",
  markAltText: "BCONZ mark",
};

export const socialLinks: Array<{ title: string; label: string; href: string }> = [
  ...seoSiteConfig.socialLinks,
];
