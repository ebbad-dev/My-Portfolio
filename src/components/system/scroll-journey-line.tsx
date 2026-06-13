"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

const nodes = [
  ["Hero", "home", 8],
  ["Recruiters", "recruiters", 18],
  ["Projects", "projects", 30],
  ["Skills", "skills", 42],
  ["Demos", "demos", 54],
  ["Journey", "journey", 67],
  ["Testimonials", "testimonials", 78],
  ["Resume", "resume", 88],
  ["Contact", "contact", 96],
] as const;

export function ScrollJourneyLine() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(useTransform(scrollYProgress, [0, 1], [0.02, 1]), { stiffness: 90, damping: 28 });
  const [active, setActive] = useState("home");

  useEffect(() => {
    const observers = nodes.map(([, id]) => {
      const element = document.getElementById(id);
      if (!element) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-35% 0px -55% 0px" },
      );
      observer.observe(element);
      return observer;
    });
    return () => observers.forEach((observer) => observer?.disconnect());
  }, []);

  return (
    <div className="pointer-events-none fixed left-[max(1.25rem,calc((100vw-1180px)/2-4rem))] top-24 z-10 hidden h-[calc(100vh-7rem)] w-16 lg:block" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 64 720" preserveAspectRatio="none">
        <path d="M32 4 C10 95 54 160 32 245 C9 335 54 430 32 520 C14 594 48 660 32 716" stroke="rgba(148,163,184,0.18)" strokeWidth="2" fill="none" />
        <motion.path
          d="M32 4 C10 95 54 160 32 245 C9 335 54 430 32 520 C14 594 48 660 32 716"
          stroke="url(#journey)"
          strokeWidth="3"
          fill="none"
          pathLength={1}
          style={reduce ? undefined : { pathLength: scaleY }}
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
        {nodes.map(([label, id, top]) => (
          <a
            key={id}
            href={`#${id}`}
            className="pointer-events-auto absolute left-1/2 flex -translate-x-1/2 items-center gap-2"
            style={{ top: `${top}%` }}
            title={label}
          >
            <span className={`h-3 w-3 rounded-full border ${active === id ? "border-cyan-200 bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.9)]" : "border-slate-500 bg-slate-700"}`} />
            <span className="sr-only">{label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
