import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, Lock } from "lucide-react";
import { cn, isUsableHref } from "@/lib/utils";

type ButtonLinkProps = {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  unavailableLabel?: string;
  external?: boolean;
  openInNewTab?: boolean;
  available?: boolean;
};

export function ButtonLink({ href, children, variant = "secondary", className, unavailableLabel = "Not added yet", external, openInNewTab, available = true }: ButtonLinkProps) {
  const base =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300";
  const variants = {
    primary: "bg-brand-gradient text-white shadow-[0_0_32px_rgba(34,211,238,0.25)] hover:shadow-glow",
    secondary: "border border-white/12 bg-white/[0.04] text-slate-100 backdrop-blur hover:border-cyan-300/40 hover:bg-white/[0.07]",
    ghost: "text-slate-300 hover:text-white",
  };

  if (!available || !isUsableHref(href)) {
    return (
      <span className={cn(base, variants.secondary, "cursor-not-allowed opacity-70", className)} aria-label={unavailableLabel} title={unavailableLabel}>
        <Lock size={16} />
        {unavailableLabel}
      </span>
    );
  }

  const content = (
    <>
      {children}
      <ArrowUpRight size={16} aria-hidden="true" />
    </>
  );

  const safeHref = href || "#";

  if (external || openInNewTab || safeHref.startsWith("http") || safeHref.startsWith("mailto:")) {
    const shouldOpenNewTab = openInNewTab || safeHref.startsWith("http");
    return (
      <a className={cn(base, variants[variant], className)} href={safeHref} target={shouldOpenNewTab ? "_blank" : undefined} rel={shouldOpenNewTab ? "noopener noreferrer" : undefined}>
        {content}
      </a>
    );
  }

  return (
    <Link className={cn(base, variants[variant], className)} href={safeHref}>
      {content}
    </Link>
  );
}
