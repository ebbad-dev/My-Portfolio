"use client";

import { useReducedMotion } from "framer-motion";
import { PORTFOLIO_SECTIONS } from "@/data/portfolioSections";
import { useActiveSection } from "@/hooks/useActiveSection";
import { scrollToSection } from "@/lib/scroll-to-section";
import { cn } from "@/lib/utils";

export function LivingJourneyDock() {
  const reduce = useReducedMotion();
  const { activeId, activeIndex, progress } = useActiveSection();
  const progressPercent = progress * 100;

  return (
    <nav aria-label="Portfolio section navigation" className="journey-dock-shell">
      <div className="journey-dock">
        <div className="journey-dock-line" aria-hidden="true">
          <span className="journey-dock-line-track" />
          <span className="journey-dock-line-progress" style={{ width: `${progressPercent}%` }} />
          <span className="journey-dock-pulse" style={{ left: `${progressPercent}%` }} />
        </div>
        <div className="relative flex min-w-max items-center justify-between gap-2 px-2 sm:gap-3">
          {PORTFOLIO_SECTIONS.map((section, index) => {
            const Icon = section.icon;
            const isActive = section.id === activeId;
            const isComplete = index < activeIndex;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id, Boolean(reduce))}
                aria-label={`Go to ${section.label} section`}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "group relative z-10 grid min-w-[4.35rem] place-items-center gap-1 rounded-2xl px-2 py-2 text-center transition duration-300",
                  isActive ? "text-cyan-50" : isComplete ? "text-blue-100" : "text-slate-500 hover:text-slate-200",
                )}
                data-cursor-label={section.shortLabel}
              >
                <span
                  className={cn(
                    "relative grid h-11 w-11 place-items-center rounded-full border bg-slate-950/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-300",
                    isActive
                      ? "scale-110 border-cyan-200/70 text-cyan-100 shadow-[0_0_26px_rgba(34,211,238,0.42)]"
                      : isComplete
                        ? "border-blue-300/45 text-blue-100 shadow-[0_0_18px_rgba(59,130,246,0.24)]"
                        : "border-white/10 group-hover:border-cyan-300/35",
                  )}
                >
                  {isActive ? <span className="absolute inset-[-5px] rounded-full border border-cyan-300/25" /> : null}
                  <Icon size={17} aria-hidden="true" />
                </span>
                <span className="hidden max-w-[5.2rem] truncate font-mono text-[10px] uppercase tracking-[0.08em] sm:block">{section.shortLabel}</span>
                <span className="pointer-events-none absolute -top-9 hidden whitespace-nowrap rounded-full border border-cyan-300/20 bg-slate-950/92 px-3 py-1 text-xs font-semibold text-cyan-50 opacity-0 shadow-[0_0_24px_rgba(34,211,238,0.12)] transition group-hover:opacity-100 group-focus-visible:opacity-100 lg:block">
                  {section.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
