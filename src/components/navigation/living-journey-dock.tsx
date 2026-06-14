"use client";

import { useReducedMotion } from "framer-motion";
import { journeySections } from "@/components/navigation/journey-sections";
import { useActiveSection } from "@/components/navigation/use-active-section";
import { cn } from "@/lib/utils";

const sectionIds = journeySections.map((section) => section.id);

export function LivingJourneyDock() {
  const reduce = useReducedMotion();
  const active = useActiveSection(sectionIds);
  const activeIndex = Math.max(journeySections.findIndex((section) => section.id === active), 0);
  const progress = journeySections.length > 1 ? (activeIndex / (journeySections.length - 1)) * 100 : 0;

  const goToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <nav aria-label="Portfolio section navigation" className="journey-dock-shell">
      <div className="journey-dock">
        <div className="journey-dock-line" aria-hidden="true">
          <span className="journey-dock-line-track" />
          <span className="journey-dock-line-progress" style={{ width: `${progress}%` }} />
          <span className="journey-dock-pulse" style={{ left: `${progress}%` }} />
        </div>
        <div className="relative flex min-w-max items-center justify-between gap-2 px-2 sm:gap-3">
          {journeySections.map((section, index) => {
            const Icon = section.icon;
            const isActive = section.id === active;
            const isComplete = index < activeIndex;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => goToSection(section.id)}
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
