import type { PropsWithChildren } from "react";

export function Card({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`rounded-[2rem] border border-slate-200/80 bg-white/90 p-8 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.22)] ${className}`.trim()}>
      {children}
    </div>
  );
}
