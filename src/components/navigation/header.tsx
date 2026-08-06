"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { logoConfig, navigation } from "@/lib/site";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

    useEffect(() => {
      const onScroll = () => {
        setIsScrolled(window.scrollY > 24);
      };

      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    if (menuOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={`flex items-center justify-between gap-8 border-b border-slate-200/70 px-6 py-5 transition-all backdrop-blur-xl ${
          isScrolled
            ? "bg-white/95 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <Link href="/" className="flex items-center gap-4">
          <div className="relative h-[46px] sm:h-[54px] md:h-[64px] flex-shrink-0 min-w-[240px]">
            <Image
              src={logoConfig.logoPath}
              alt={logoConfig.logoAltText}
              width={420}
              height={120}
              priority
              sizes="(max-width: 640px) 180px, (max-width: 1024px) 260px, 320px"
              className="h-[46px] w-auto object-contain sm:h-[54px] md:h-[64px]"
            />
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.title}
                href={item.href}
                className={`text-sm font-medium transition-colors ${isActive ? "text-slate-900" : "text-slate-700 hover:text-slate-950"}`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:border-slate-300 hover:bg-slate-50 md:inline-flex"
          >
            Contact BCONZ
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 transition-colors hover:border-slate-300 md:hidden"
            aria-label="Toggle mobile menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span className="sr-only">Toggle menu</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 7h16M4 12h16M4 17h16"} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-b border-slate-200/70 bg-white/95 px-6 py-6 shadow-sm md:hidden">
          <div className="space-y-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`block rounded-3xl px-4 py-3 text-sm font-medium transition-colors ${isActive ? "bg-slate-50 text-slate-900" : "text-slate-800 hover:bg-slate-50"}`}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </header>
  );
}
