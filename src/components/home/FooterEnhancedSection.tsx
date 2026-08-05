import Link from "next/link";
import { footerLinks } from "@/lib/site";

const footerGroups = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Data",
    links: [
      { label: "Clinical Data", href: "/data" },
      { label: "Genomics and Multi-omics", href: "/data" },
      { label: "Imaging and Pathology", href: "/data" },
      { label: "Biospecimen-Linked Data", href: "/data" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Pharmaceutical", href: "/solutions" },
      { label: "Biotechnology", href: "/solutions" },
      { label: "Healthcare AI", href: "/solutions" },
      { label: "CRO and Research", href: "/solutions" },
    ],
  },
  {
    title: "Partnerships",
    links: [
      { label: "Become a Data Partner", href: "/data-partners" },
      { label: "Governance", href: "/data-partners" },
      { label: "Partnership Process", href: "/data-partners#process" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export function FooterEnhancedSection() {
  return (
    <section className="bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-300">{group.title}</p>
              <div className="mt-5 space-y-3 text-sm text-slate-400">
                {group.links.map((link) => (
                  <Link key={link.label} href={link.href} className="block transition hover:text-white">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
