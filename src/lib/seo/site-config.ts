export const seoSiteConfig = {
  siteName: "BCONZ",
  siteUrl: "https://www.bconz.com",
  defaultTitle: "Healthcare Data Partnerships for AI & Life Sciences",
  titleTemplate: "%s | BCONZ",
  defaultDescription:
    "BCONZ enables trusted healthcare data partnerships and research-ready clinical, genomic, imaging and longitudinal datasets for life sciences, precision medicine and healthcare AI research.",
  defaultOpenGraphImage: "/Images/brand_canvas/linkedin-header.png",
  locale: "en_US",
  language: "en",
  socialLinks: [
    {
      title: "X",
      label: "BCONZ on X",
      href: "https://x.com/BconzC",
    },
    {
      title: "LinkedIn",
      label: "BCONZ on LinkedIn",
      href: "https://www.linkedin.com/company/bconzinternational",
    },
  ],
  organization: {
    name: "BCONZ",
    legalName: "Bconz International (OPC) Pvt Ltd",
    logo: "/Images/brand/bconz-logo-horizontal.png",
    telephone: "+91 7624841555",
    addresses: [
      {
        streetAddress: "Manipal County Road",
        addressLocality: "Bangalore",
        postalCode: "560068",
        addressCountry: "IN",
      },
      {
        streetAddress: "60 Paya Lebar Road #06-53 Paya Lebar Square",
        addressLocality: "Singapore",
        postalCode: "409051",
        addressCountry: "SG",
      },
    ],
    sameAs: [
      "https://x.com/BconzC",
      "https://www.linkedin.com/company/bconzinternational",
    ],
  },
} as const;
