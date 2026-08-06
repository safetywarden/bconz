import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import Link from "next/link";

const baseStyles =
  "inline-flex items-center justify-center rounded-full border px-6 py-3 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<string, string> = {
  primary: "bg-slate-950 text-white hover:bg-slate-800 border-transparent",
  secondary: "bg-white text-slate-950 border border-slate-200 shadow-sm hover:bg-slate-50",
  ghost: "bg-transparent text-slate-950 hover:bg-slate-100 border-transparent",
};

const sizes: Record<string, string> = {
  normal: "h-12",
  large: "h-14 px-8 text-lg",
};

export type ButtonProps = (ButtonHTMLAttributes<HTMLButtonElement> | AnchorHTMLAttributes<HTMLAnchorElement>) & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "normal" | "large";
  as?: "button" | "a";
};

export function Button({
  className = "",
  variant = "primary",
  size = "normal",
  as = "button",
  ...props
}: ButtonProps) {
  const classNames = [baseStyles, variants[variant] ?? variants.primary, sizes[size] ?? sizes.normal, className]
    .filter(Boolean)
    .join(" ");

  if (as === "a") {
    const anchorProps = props as AnchorHTMLAttributes<HTMLAnchorElement>;
    const href = anchorProps.href ?? "#";
    const isInternal = href.startsWith("/") || href.startsWith("#");

    if (isInternal) {
      const { href: _href, ...rest } = anchorProps;
      void _href;
      return <Link href={href} className={classNames} {...rest} />;
    }

    return <a className={classNames} rel="noopener noreferrer" target="_blank" {...anchorProps} />;
  }

  return <button className={classNames} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)} />;
}
