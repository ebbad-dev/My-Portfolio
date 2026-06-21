"use client";

import { useEffect, useMemo, useRef } from "react";
import { CheckCircle2, Code2, FileText, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AskCoreStatus } from "@/components/ask/types";

const chips = [
  { label: "AI Guide Live", icon: Sparkles },
  { label: "Projects Indexed", icon: CheckCircle2 },
  { label: "Resume Ready", icon: FileText },
  { label: "Code Links Verified", icon: Code2 },
] as const;

const particleCount = 34;

function createParticles() {
  return Array.from({ length: particleCount }, (_, index) => {
    const angle = index * 2.399963229728653;
    const radius = 18 + ((index * 17) % 42);
    return {
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius * 0.72,
      size: 2 + (index % 4) * 0.8,
      speed: 0.42 + (index % 7) * 0.055,
      phase: index * 0.47,
      depth: 0.5 + (index % 5) * 0.14,
    };
  });
}

export function PortfolioIntelligenceCore({ status = "idle" }: { status?: AskCoreStatus }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const particleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const pointer = useRef({ x: 0, y: 0, active: false });
  const smooth = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);
  const visibleRef = useRef(false);
  const reducedRef = useRef(false);
  const particles = useMemo(() => createParticles(), []);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const updateMotion = () => {
      reducedRef.current = reduced.matches || coarse.matches;
    };
    updateMotion();

    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      if (entry.isIntersecting && !frameRef.current) animate(performance.now());
    }, { rootMargin: "160px" });
    observer.observe(shell);

    const move = (event: PointerEvent) => {
      const rect = shell.getBoundingClientRect();
      pointer.current.x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
      pointer.current.y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
      pointer.current.active = true;
    };
    const leave = () => {
      pointer.current.active = false;
    };

    const animate = (time: number) => {
      frameRef.current = null;
      if (!visibleRef.current) return;

      const targetX = pointer.current.active && !reducedRef.current ? pointer.current.x : 0;
      const targetY = pointer.current.active && !reducedRef.current ? pointer.current.y : 0;
      smooth.current.x += (targetX - smooth.current.x) * 0.08;
      smooth.current.y += (targetY - smooth.current.y) * 0.08;

      const x = smooth.current.x;
      const y = smooth.current.y;
      shell.style.setProperty("--core-x", `${50 + x * 12}%`);
      shell.style.setProperty("--core-y", `${48 + y * 10}%`);

      if (!reducedRef.current) {
        if (coreRef.current) {
          coreRef.current.style.transform = `translate3d(${x * 10}px, ${y * 8}px, 0) rotateX(${-y * 5}deg) rotateY(${x * 7}deg)`;
        }
        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${x * 5}px, ${y * 4}px, 0) rotateX(${62 - y * 5}deg) rotateZ(${time * 0.012}deg)`;
        }
        particles.forEach((particle, index) => {
          const node = particleRefs.current[index];
          if (!node) return;
          const driftX = Math.cos(time * 0.001 * particle.speed + particle.phase) * 3.2;
          const driftY = Math.sin(time * 0.0012 * particle.speed + particle.phase) * 3.2;
          const influenceX = x * particle.depth * 10;
          const influenceY = y * particle.depth * 8;
          node.style.transform = `translate3d(calc(${particle.x}% + ${driftX + influenceX}px), calc(${particle.y}% + ${driftY + influenceY}px), 0)`;
          node.style.opacity = `${0.34 + particle.depth * 0.38}`;
        });
      }

      frameRef.current = window.requestAnimationFrame(animate);
    };

    reduced.addEventListener("change", updateMotion);
    coarse.addEventListener("change", updateMotion);
    shell.addEventListener("pointermove", move);
    shell.addEventListener("pointerleave", leave);
    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      reduced.removeEventListener("change", updateMotion);
      coarse.removeEventListener("change", updateMotion);
      shell.removeEventListener("pointermove", move);
      shell.removeEventListener("pointerleave", leave);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, [particles]);

  return (
    <div
      ref={shellRef}
      className={cn(
        "core-panel premium-card relative isolate h-[clamp(20rem,36vw,25rem)] min-w-0 max-w-full overflow-hidden rounded-3xl border border-cyan-300/15 bg-slate-950/72 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.34)]",
        status === "thinking" && "core-panel-thinking",
        status === "success" && "core-panel-success",
      )}
      aria-hidden="true"
    >
      <div className="core-depth-layer absolute inset-0 pointer-events-none" />
      <div className="core-grid-layer absolute inset-0 pointer-events-none" />
      <div className="absolute inset-3 pointer-events-none overflow-hidden rounded-[1.35rem] border border-white/10" />

      <div className="pointer-events-none absolute inset-0">
        {particles.map((particle, index) => (
          <span
            key={index}
            ref={(node) => {
              particleRefs.current[index] = node;
            }}
            className="core-particle absolute left-0 top-0 rounded-full bg-cyan-200"
            style={{ width: particle.size, height: particle.size, transform: `translate3d(${particle.x}%, ${particle.y}%, 0)` }}
          />
        ))}
      </div>

      <div className="relative z-10 flex h-full items-center justify-center">
        <div ref={ringRef} className="core-orbit-stack absolute h-60 w-60 max-[420px]:h-52 max-[420px]:w-52">
          <span className="core-orbit core-orbit-a" />
          <span className="core-orbit core-orbit-b" />
          <span className="core-orbit core-orbit-c" />
        </div>
        <div ref={coreRef} className="core-nucleus relative h-44 w-44 max-[420px]:h-36 max-[420px]:w-36">
          <span className="core-shell" />
          <span className="core-inner" />
          <span className="core-highlight" />
          <span className="core-signal core-signal-a" />
          <span className="core-signal core-signal-b" />
        </div>
      </div>

      <div className="absolute inset-4 z-20 grid pointer-events-none grid-cols-2 content-between gap-2">
        {chips.map((chip, index) => {
          const Icon = chip.icon;
          return (
            <div
              key={chip.label}
              className={cn(
                "core-chip inline-flex min-w-0 items-center gap-2 rounded-2xl border border-cyan-300/18 bg-slate-950/70 px-2.5 py-2 text-[10px] font-bold text-slate-200 shadow-[0_0_24px_rgba(34,211,238,0.1)] backdrop-blur-xl",
                index % 2 === 0 ? "justify-self-start" : "justify-self-end",
                index > 1 && "self-end",
              )}
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
              <Icon size={12} className="shrink-0 text-cyan-100" />
              <span className="truncate">{chip.label}</span>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-4 left-1/2 z-20 flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-center text-xs font-semibold text-slate-300 backdrop-blur">
        <span className="h-2 w-2 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.9)]" />
        <span className="truncate">Portfolio Intelligence Core</span>
      </div>
    </div>
  );
}
