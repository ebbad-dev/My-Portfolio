"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export function LazySection({ children, fallback = "Loading system module..." }: { children: ReactNode; fallback?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "420px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {ready ? (
        children
      ) : (
        <div className="glass-panel rounded-3xl p-8 text-sm text-slate-400">
          <div className="mb-4 h-1 w-40 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-cyan-300/70" />
          </div>
          {fallback}
        </div>
      )}
    </div>
  );
}
