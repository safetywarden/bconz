import { metadataBase, siteDescription, siteName } from "@/lib/site";
import { absoluteUrl, getPageSeo, type PublicRoute } from "@/lib/seo";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: "Bconz International (OPC) Pvt Ltd",
    alternateName: siteName,
    url: metadataBase.toString(),
    logo: absoluteUrl("/Images/brand/bconz-logo-horizontal.png"),
    description: siteDescription,
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
        telephone: "+91 7624841555",
        contactType: "business enquiries",
        areaServed: "IN",
        availableLanguage: ["en"],
      },
    ],
    address: [
      {
        "@type": "PostalAddress",
        streetAddress: "Manipal County Road",
        addressLocality: "Bangalore",
        postalCode: "560068",
        addressCountry: "IN",
      },
      {
        "@type": "PostalAddress",
        streetAddress: "60 Paya Lebar Road #06-53 Paya Lebar Square",
        addressLocality: "Singapore",
        postalCode: "409051",
        addressCountry: "SG",
      },
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: siteName,
    url: metadataBase.toString(),
    description: siteDescription,
    publisher: {
      "@id": absoluteUrl("/#organization"),
    },
    inLanguage: "en",
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
    inLanguage: "en",
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
