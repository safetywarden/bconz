import type { ReactElement, SVGProps } from "react";

export type IconName =
  | "clinical"
  | "genomics"
  | "multiomics"
  | "imaging"
  | "pathology"
  | "biospecimen"
  | "realworld"
  | "trust"
  | "governance"
  | "partnership"
  | "research"
  | "data";

const iconMap: Record<IconName, (props: SVGProps<SVGSVGElement>) => ReactElement> = {
  clinical: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M10 3h4v4h-4z" />
      <path d="M6 11h12M6 15h12" strokeLinecap="round" />
      <path d="M12 8v8" strokeLinecap="round" />
    </svg>
  ),
  genomics: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M7 4v16M17 4v16" strokeLinecap="round" />
      <path d="M7 9h10M7 15h10" strokeLinecap="round" />
    </svg>
  ),
  multiomics: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="7" cy="7" r="3" />
      <circle cx="17" cy="7" r="3" />
      <circle cx="12" cy="16" r="3" />
      <path d="M9.5 9.5L12 14" strokeLinecap="round" />
      <path d="M14.5 9.5L12 14" strokeLinecap="round" />
    </svg>
  ),
  imaging: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 9h3l2 3 3-4h2" strokeLinecap="round" />
    </svg>
  ),
  pathology: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 20V4" strokeLinecap="round" />
      <path d="M8 6h8M8 10h8" strokeLinecap="round" />
      <circle cx="12" cy="15" r="3" />
    </svg>
  ),
  biospecimen: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M7 4h10l-1 6H8l-1-6z" />
      <path d="M9 10h6" strokeLinecap="round" />
      <path d="M8 14h8v6H8v-6z" />
    </svg>
  ),
  realworld: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 17h16M6 13h12M8 9h8" strokeLinecap="round" />
      <path d="M7 5h10" strokeLinecap="round" />
    </svg>
  ),
  trust: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 21s8-4.5 8-10.5S13.333 3 12 3 4 5.5 4 10.5 12 21 12 21z" />
      <path d="M9.5 12.5l1.75 1.75L15.5 10" strokeLinecap="round" />
    </svg>
  ),
  governance: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M6 5h12M8 5v14M16 5v14M6 19h12" strokeLinecap="round" />
    </svg>
  ),
  partnership: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M7 7h4v4H7zM13 13h4v4h-4zM7 13h4v4H7zM13 7h4v4h-4z" />
    </svg>
  ),
  research: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M7 4h10M7 20h10M8 8l5 5 5-5" strokeLinecap="round" />
    </svg>
  ),
  data: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M5 3h14v18H5z" />
      <path d="M8 7h8M8 11h8M8 15h4" strokeLinecap="round" />
    </svg>
  ),
};

export function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const Svg = iconMap[name];
  return <Svg className={`h-6 w-6 ${className}`} aria-hidden="true" focusable="false" />;
}
