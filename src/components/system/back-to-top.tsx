"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function BackToTop() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(window.scrollY > 520);
      setProgress(maxScroll > 0 ? Math.min(1, window.scrollY / maxScroll) : 0);
      frame = 0;
    };
    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
      className={cn(
        "fixed bottom-24 right-5 z-40 grid h-12 w-12 place-items-center rounded-full border border-cyan-300/25 bg-slate-950/78 text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.16)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-200/55 hover:text-white sm:bottom-28",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
      style={{ backgroundImage: `conic-gradient(rgba(34,211,238,0.46) ${progress * 360}deg, rgba(15,23,42,0.78) 0deg)` }}
      data-cursor-label="Top"
    >
      <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-950/92">
        <ArrowUp size={18} />
      </span>
    </button>
  );
}
