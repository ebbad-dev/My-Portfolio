import { Github, Lock, Star } from "lucide-react";
import type { CodeStatus } from "@/data/site";
import { cn, isUsableHref } from "@/lib/utils";

type CodeRepoButtonProps = {
  href?: string;
  status: CodeStatus;
  label?: string;
  unavailableLabel?: string;
  className?: string;
  topNav?: boolean;
};

export function CodeRepoButton({
  href,
  status,
  label = "View Code",
  unavailableLabel = "Code Coming Soon",
  className,
  topNav = false,
}: CodeRepoButtonProps) {
  const base = cn(
    "inline-flex items-center justify-center gap-2 rounded-full border text-sm font-semibold transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300",
    topNav ? "min-h-9 px-3 py-1.5 text-xs" : "min-h-11 px-5 py-2.5",
    className,
  );

  if (status !== "available" || !isUsableHref(href)) {
    if (topNav) return null;
    return (
      <span
        className={cn(
          base,
          "cursor-not-allowed border-white/10 bg-white/[0.035] text-slate-400",
        )}
        aria-label={unavailableLabel}
        title={unavailableLabel}
      >
        <Lock size={16} aria-hidden="true" />
        {unavailableLabel}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        base,
        "border-cyan-300/25 bg-white/[0.045] text-slate-100 shadow-[0_0_24px_rgba(34,211,238,0.08)] backdrop-blur hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-cyan-300/10 hover:text-white hover:shadow-[0_0_34px_rgba(34,211,238,0.16)] active:translate-y-0",
      )}
      aria-label={`${label} on GitHub`}
    >
      <Github size={topNav ? 15 : 17} aria-hidden="true" />
      <span>{label}</span>
      {topNav ? <Star size={14} className="text-cyan-200" aria-hidden="true" /> : null}
    </a>
  );
}
