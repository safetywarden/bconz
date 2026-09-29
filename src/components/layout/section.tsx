import type { PropsWithChildren } from "react";

export function Section({ children, className = "", id }: PropsWithChildren<{ className?: string; id?: string }>) {
  return (
    <section id={id} className={`py-20 sm:py-24 ${className}`.trim()}>{children}</section>
  );
}
