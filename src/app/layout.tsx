import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Header } from "@/components/navigation/header";
import { Footer } from "@/components/layout/footer";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { BackToTopButton } from "@/components/layout/back-to-top";
import { createMetadata } from "@/lib/metadata";

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
          <Header />
          <div className="flex min-h-[calc(100vh-5rem)] flex-col">{children}</div>
          <Footer />
          <BackToTopButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
