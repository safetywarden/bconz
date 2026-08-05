import Link from "next/link";
import Image from "next/image";
import { footerLinks, socialLinks, siteName, logoConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-slate-950 text-slate-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-16 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
          <div className="flex items-start gap-4">
              <div className="relative h-12 w-12 flex-shrink-0">
                <Image
                  src={logoConfig.markPath}
                  alt={logoConfig.markAltText}
                  width={56}
                  height={56}
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.26em] text-teal-300">{siteName}</p>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
                  BCONZ builds governance-forward healthcare data partnerships that deliver clinical, research, and AI-ready datasets for enterprise-grade scientific programs.
                </p>
              </div>
            </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">Explore</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                {footerLinks.slice(0, 4).map((link) => (
                  <li key={link.title}>
                    <Link href={link.href} className="transition-colors hover:text-white">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">Compliance</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                {footerLinks.slice(4).map((link) => (
                  <li key={link.title}>
                    <Link href={link.href} className="transition-colors hover:text-white">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 border-t border-slate-800/80 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Newsletter</p>
            <p className="max-w-2xl text-sm leading-7 text-slate-300">
              Subscribe for company updates and enterprise healthcare insights. Coming soon.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
            {socialLinks.map((item) => (
              <Link key={item.title} href={item.href} className="transition-colors hover:text-white">
                {item.title}
              </Link>
            ))}
          </div>
        </div>

        <p className="text-sm text-slate-500">© {new Date().getFullYear()} {siteName}. Trusted healthcare data partnerships for regulated research.</p>
      </div>
    </footer>
  );
}
