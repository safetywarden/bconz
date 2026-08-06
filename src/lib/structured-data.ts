import { metadataBase } from "@/lib/site";
import { absoluteUrl, getPageSeo, type PublicRoute } from "@/lib/seo";
import { seoSiteConfig } from "@/lib/seo/site-config";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: seoSiteConfig.organization.legalName,
    alternateName: seoSiteConfig.organization.name,
    url: metadataBase.toString(),
    logo: absoluteUrl(seoSiteConfig.organization.logo),
    description: seoSiteConfig.defaultDescription,
    industry: "Healthcare data partnerships",
    areaServed: ["India", "Singapore", "Global"],
    knowsAbout: [
      "Healthcare Data Partnerships",
      "Clinical Research Data",
      "Real World Evidence",
      "Healthcare AI Research",
      "Genomics Data Partnerships",
      "Precision Medicine Data",
      "Responsible Data Governance",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: seoSiteConfig.organization.telephone,
        contactType: "business enquiries",
        areaServed: "IN",
        availableLanguage: ["en"],
      },
    ],
    address: seoSiteConfig.organization.addresses.map((address) => ({
      "@type": "PostalAddress",
      ...address,
    })),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: seoSiteConfig.siteName,
    url: metadataBase.toString(),
    description: seoSiteConfig.defaultDescription,
    publisher: {
      "@id": absoluteUrl("/#organization"),
    },
    inLanguage: seoSiteConfig.language,
  };
}

export function webPageJsonLd(path: PublicRoute, type: "WebPage" | "AboutPage" | "ContactPage" = "WebPage") {
  const seo = getPageSeo(path);

  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name: seo.title,
    description: seo.description,
    isPartOf: {
      "@id": absoluteUrl("/#website"),
    },
    about: {
      "@id": absoluteUrl("/#organization"),
    },
    publisher: {
      "@id": absoluteUrl("/#organization"),
    },
    inLanguage: seoSiteConfig.language,
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: PublicRoute }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
