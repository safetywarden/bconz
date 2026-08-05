"use client";

import Image from "next/image";
import Link from "next/link";
import { logoConfig } from "@/lib/site";

const heroTrust = [
  "Purpose-specific research.",
  "Responsible governance.",
  "Institution-led collaboration.",
];

export function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden bg-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-2xl space-y-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">
              Purpose-driven healthcare data partnerships
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Connecting regulated healthcare data with life sciences and AI discovery
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-700">
              BCONZ connects healthcare organizations with life sciences and AI innovators to deliver research-ready clinical, molecular, imaging and real-world data through trusted, purpose-specific partnerships.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/request-data" className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 sm:w-auto">
                Request Research Data
              </Link>
              <Link href="/data-partners" className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 sm:w-auto">
                Become a Data Partner
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {heroTrust.map((item) => (
                <p key={item} className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="relative isolate overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-glow">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/5 via-white to-white" aria-hidden="true" />
            <div className="relative flex min-h-[320px] items-center justify-center p-10">
              <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.18),_transparent_25%)]" />
              <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-6 text-center">
                <div className="relative h-20 w-full max-w-[320px]
                  rounded-3xl bg-white p-4 shadow-lg">
                  <Image
                    src={logoConfig.logoPath}
                    alt={logoConfig.altText}
                    fill
                    sizes="(max-width: 768px) 240px, 320px"
                    className="object-contain"
                  />
                </div>
                <div className="space-y-4 px-4">
                  <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Brand expression</p>
                  <p className="text-lg font-semibold leading-8 text-slate-950">
                    Purpose-built data partnerships for regulated research programs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
