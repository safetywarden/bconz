import type { PropsWithChildren } from "react";

export function Section({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return (
    <section className={`py-20 sm:py-24 ${className}`.trim()}>{children}</section>
  );
}
