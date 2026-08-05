import type { PropsWithChildren } from "react";

export function Heading({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return <h2 className={`text-3xl font-semibold tracking-tight text-slate-950 ${className}`.trim()}>{children}</h2>;
}

export function Subheading({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return <p className={`text-base leading-7 text-slate-600 ${className}`.trim()}>{children}</p>;
}

export function Label({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return <p className={`text-sm font-semibold uppercase tracking-[0.28em] text-teal-600 ${className}`.trim()}>{children}</p>;
}
