"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PORTFOLIO_SECTIONS } from "@/data/portfolioSections";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/utils";

const LINE_LENGTH = 1000;
const LINE_PATH = "M0 12 C70 6 140 6 210 12 S350 18 420 12 S560 6 630 12 S770 18 840 12 S960 6 1000 12";

function getPulseY(progress: number) {
  return 12 + Math.sin(progress * Math.PI * 8) * 3.2;
}

export function LivingJourneyDock() {
  const reduce = useReducedMotion();
  const { activeId, activeIndex, progress, scrollToSection } = useActiveSection();
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const progressX = clampedProgress * LINE_LENGTH;
  const progressY = getPulseY(clampedProgress);

  return (
    <nav aria-label="Portfolio section navigation" className="journey-dock-shell">
      <div className="journey-dock">
        <div className="journey-dock-line" aria-hidden="true">
          <svg className="journey-dock-line-svg" viewBox={`0 0 ${LINE_LENGTH} 24`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="journey-dock-progress-gradient" x1="0" x2="1" y1="0" y2="0">
                <stop stopColor="#22D3EE" />
                <stop offset="0.48" stopColor="#3B82F6" />
                <stop offset="1" stopColor="#8B5CF6" />
              </linearGradient>
              <clipPath id="journey-dock-progress-clip">
                <motion.rect
                  x="0"
                  y="0"
                  height="24"
                  initial={false}
                  animate={{ width: progressX }}
                  transition={{ duration: reduce ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
                />
              </clipPath>
            </defs>
            <path className="journey-dock-svg-track" d={LINE_PATH} />
            <g clipPath="url(#journey-dock-progress-clip)">
              <path className="journey-dock-svg-glow" d={LINE_PATH} />
              <path className="journey-dock-svg-progress" d={LINE_PATH} />
              <path className="journey-dock-svg-shimmer" d={LINE_PATH} />
            </g>
            <motion.circle
              className="journey-dock-svg-pulse"
              r="5.5"
              initial={false}
              animate={{ cx: progressX, cy: progressY }}
              transition={{ duration: reduce ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
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
