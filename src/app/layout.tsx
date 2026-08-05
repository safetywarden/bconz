import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Header } from "@/components/navigation/header";
import { Footer } from "@/components/layout/footer";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { BackToTopButton } from "@/components/layout/back-to-top";
import { createMetadata } from "@/lib/metadata";
import { metadataBase } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = createMetadata();

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-50 text-slate-950">
        <ThemeProvider>
          <AnnouncementBar />
          <a href="#content" className="sr-only focus:not-sr-only absolute left-4 top-4 z-50 rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:outline focus:outline-2 focus:outline-teal-400">
            Skip to content
          </a>
          <Header />
          <script
            id="ld-org"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Bconz International (OPC) Pvt Ltd",
                url: metadataBase.toString(),
                logo: new URL("/images/brand/bconz-logo-horizontal.png", metadataBase).toString(),
                contactPoint: [
                  {
                    "@type": "ContactPoint",
                    telephone: "+91 7624841555",
                    contactType: "customer service",
                    areaServed: "IN",
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
              }),
            }}
          />
          <div id="content" className="flex min-h-[calc(100vh-5rem)] flex-col">{children}</div>
          <Footer />
          <BackToTopButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
