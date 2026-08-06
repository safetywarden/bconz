import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Header } from "@/components/navigation/header";
import { Footer } from "@/components/layout/footer";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { BackToTopButton } from "@/components/layout/back-to-top";
import { JsonLd } from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/metadata";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = createMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
  colorScheme: "light",
};

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
          <JsonLd id="ld-org" data={organizationJsonLd()} />
          <JsonLd id="ld-website" data={websiteJsonLd()} />
          <div id="content" className="flex min-h-[calc(100vh-5rem)] flex-col">{children}</div>
          <Footer />
          <BackToTopButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
