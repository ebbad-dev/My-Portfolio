"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PORTFOLIO_SECTIONS } from "@/data/portfolioSections";
import { useActiveSection } from "@/hooks/useActiveSection";
import { scrollToSection } from "@/lib/scroll-to-section";

const VIEWBOX_HEIGHT = 720;
const VIEWBOX_WIDTH = 64;
const pathD = "M32 4 C10 95 54 160 32 245 C9 335 54 430 32 520 C14 594 48 660 32 716";
const dotPositions = [
  { x: 32, y: 18 },
  { x: 22, y: 96 },
  { x: 42, y: 170 },
  { x: 32, y: 246 },
  { x: 20, y: 330 },
  { x: 43, y: 430 },
  { x: 32, y: 520 },
  { x: 23, y: 594 },
  { x: 43, y: 660 },
  { x: 32, y: 704 },
] as const;

function getDotPosition(index: number) {
  return dotPositions[index] ?? dotPositions[dotPositions.length - 1];
}

export function ScrollJourneyLine() {
  const reduce = useReducedMotion();
  const { activeId, activeIndex, progress, foundIds, missingIds, debugEnabled } = useActiveSection();

  return (
    <nav className="pointer-events-none fixed left-[max(1.25rem,calc((100vw-1180px)/2-4rem))] top-24 z-10 hidden h-[calc(100vh-7rem)] w-16 lg:block" aria-label="Vertical portfolio journey navigation">
      <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 64 ${VIEWBOX_HEIGHT}`} preserveAspectRatio="none" aria-hidden="true">
        <path d={pathD} stroke="rgba(148,163,184,0.18)" strokeWidth="2" fill="none" strokeLinecap="round" />
        <motion.path
          d={pathD}
          stroke="url(#journey)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          pathLength={1}
          initial={false}
          animate={{ pathLength: reduce ? progress : progress }}
          transition={{ duration: reduce ? 0 : 0.28, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="journey" x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#22D3EE" />
            <stop offset="0.55" stopColor="#3B82F6" />
            <stop offset="1" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0">
        {PORTFOLIO_SECTIONS.map((section, index) => {
          const position = getDotPosition(index);

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollToSection(section.id, Boolean(reduce))}
              className="group pointer-events-auto absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2"
              style={{
                left: `${(position.x / VIEWBOX_WIDTH) * 100}%`,
                top: `${(position.y / VIEWBOX_HEIGHT) * 100}%`,
              }}
              title={section.label}
              aria-label={`Go to ${section.label} section`}
              aria-current={activeId === section.id ? "step" : undefined}
            >
              <span
                className={`relative h-3 w-3 rounded-full border transition duration-300 ${
                  activeId === section.id
                    ? "scale-125 border-cyan-100 bg-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.9),0_0_34px_rgba(34,211,238,0.35)]"
                    : index < activeIndex
                      ? "border-blue-300/30 bg-blue-400/20 shadow-[0_0_10px_rgba(59,130,246,0.18)]"
                      : "border-slate-500 bg-slate-700"
                }`}
              >
                {activeId === section.id ? <span className="absolute inset-[-7px] rounded-full border border-cyan-200/30 animate-pulse" /> : null}
              </span>
              <span aria-hidden="true" className="pointer-events-none absolute left-5 hidden whitespace-nowrap rounded-full border border-cyan-300/20 bg-slate-950/92 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-cyan-50 opacity-0 shadow-[0_0_24px_rgba(34,211,238,0.12)] transition group-hover:opacity-100 group-focus-visible:opacity-100 xl:block">
                {section.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
      {debugEnabled ? (
        <div className="pointer-events-none absolute left-12 top-0 w-64 rounded-2xl border border-cyan-300/20 bg-slate-950/92 p-3 font-mono text-[11px] leading-5 text-cyan-50 shadow-[0_0_30px_rgba(34,211,238,0.16)]">
          <p>Active ID: {activeId}</p>
          <p>Active Index: {activeIndex}</p>
          <p>Found Sections: {foundIds.length ? foundIds.join(", ") : "none"}</p>
          <p>Missing Sections: {missingIds.length ? missingIds.join(", ") : "none"}</p>
        </div>
      ) : null}
    </nav>
  );
}
