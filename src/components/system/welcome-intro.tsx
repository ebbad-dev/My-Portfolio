"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

export function WelcomeIntro() {
  const [visible, setVisible] = useState(true);
  const reduce = useReducedMotion();
  const enterRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const hasHash = window.location.hash.length > 0;
    let shouldShow = true;
    try {
      if (hasHash || sessionStorage.getItem("ebbad-intro-seen") === "true") {
        shouldShow = false;
      }
    } catch {
      if (hasHash) {
        shouldShow = false;
      }
    }

    if (!shouldShow) {
      const timer = window.setTimeout(() => setVisible(false), 0);
      return () => window.clearTimeout(timer);
    }

    window.requestAnimationFrame(() => enterRef.current?.focus({ preventScroll: true }));
  }, []);

  const enter = () => {
    try {
      sessionStorage.setItem("ebbad-intro-seen", "true");
    } catch {
      // If storage is unavailable, still let the user enter normally.
    }
    setVisible(false);
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
  };

  useEffect(() => {
    if (!visible) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter") {
        event.preventDefault();
        enter();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[110] grid place-items-center overflow-hidden bg-[#05070d] p-4 text-white"
          initial={reduce ? false : { opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.015 }}
          transition={{ duration: reduce ? 0.12 : 0.42, ease: "easeOut" }}
        >
          <div className="welcome-launch-bg absolute inset-0" aria-hidden="true" />
          <div className="welcome-launch-particles absolute inset-0" aria-hidden="true">
            {Array.from({ length: 18 }).map((_, index) => (
              <span key={index} style={{ "--i": index } as CSSProperties} />
            ))}
          </div>
          <motion.div
            className="welcome-launch-card glass-panel relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-cyan-300/20 p-6 text-center shadow-[0_34px_110px_rgba(0,0,0,0.45)] sm:p-8"
            initial={reduce ? false : { opacity: 0.96, y: 10, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.985 }}
            transition={{ duration: reduce ? 0.12 : 0.55, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_44%),radial-gradient(circle_at_75%_70%,rgba(139,92,246,0.16),transparent_42%)]" />
            <div className="relative">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-cyan-300/25 bg-cyan-300/10 shadow-[0_0_38px_rgba(34,211,238,0.22)]">
                <Sparkles className="text-cyan-100" size={24} />
              </div>
              <p className="mono-label mt-5">EbbadOS launch card</p>
              <h2 className="mt-4 font-heading text-[clamp(2.25rem,7vw,4.5rem)] font-bold leading-[0.95] text-white">
                Welcome to Ebbad&apos;s Portfolio
              </h2>
              <p className="mt-4 font-heading text-xl font-semibold text-cyan-100 sm:text-2xl">Full-Stack &bull; AI &bull; Databases &bull; Systems</p>
              <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-300">
                Explore projects, demos, case studies, skills, and Ask Ebbad.
              </p>
              <button
                ref={enterRef}
                onClick={enter}
                className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-gradient px-6 py-3 font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:shadow-[0_0_42px_rgba(34,211,238,0.35)] focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Enter Portfolio <ArrowRight size={17} />
              </button>
              <p className="mt-5 text-xs font-medium text-slate-500">Built with Next.js, TypeScript, Three.js, and curiosity.</p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
