"use client";

import { useEffect, useRef, useState } from "react";

const TRAIL_COUNT = 7;

export function HolographicCursor() {
  const root = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLDivElement>(null);
  const aura = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const trailRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;

    const enableTimer = window.setTimeout(() => setEnabled(true), 0);
    document.body.classList.add("cursor-enabled");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { x: target.x, y: target.y };
    const auraPos = { x: target.x, y: target.y };
    const trail = Array.from({ length: TRAIL_COUNT }, () => ({ x: target.x, y: target.y }));
    let lastMove = performance.now();
    let raf = 0;
    let currentLabel = "";
    let hidden = false;

    const applyTargetState = (eventTarget: EventTarget | null) => {
      const element = eventTarget instanceof Element ? eventTarget : null;
      const native = element?.closest("input, textarea, select, [contenteditable='true'], p, li, code, pre");
      const interactive = element?.closest<HTMLElement>("[data-cursor-label], a, button, [role='button']");
      const nextLabel = interactive?.dataset.cursorLabel || (interactive ? "Open" : document.body.dataset.cursor || "");
      const nextHidden = Boolean(native);

      if (nextHidden !== hidden) {
        hidden = nextHidden;
        if (root.current) root.current.style.opacity = hidden ? "0" : "1";
      }

      if (nextLabel !== currentLabel) {
        currentLabel = nextLabel;
        if (label.current) {
          label.current.textContent = currentLabel;
          label.current.style.opacity = currentLabel ? "1" : "0";
          label.current.style.transform = currentLabel ? "translateX(0) scale(1)" : "translateX(-6px) scale(0.96)";
        }
      }
    };

    const move = (event: MouseEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      lastMove = performance.now();
      applyTargetState(event.target);
    };

    const down = () => {
      if (plane.current) plane.current.style.transform += " scale(0.9)";
      if (aura.current) aura.current.style.scale = "0.82";
    };

    const up = () => {
      if (aura.current) aura.current.style.scale = "1";
    };

    const over = (event: PointerEvent) => applyTargetState(event.target);

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.34;
      pos.y += (target.y - pos.y) * 0.34;
      auraPos.x += (target.x - auraPos.x) * 0.13;
      auraPos.y += (target.y - auraPos.y) * 0.13;

      trail[0].x += (pos.x - trail[0].x) * 0.2;
      trail[0].y += (pos.y - trail[0].y) * 0.2;
      for (let index = 1; index < trail.length; index += 1) {
        trail[index].x += (trail[index - 1].x - trail[index].x) * 0.24;
        trail[index].y += (trail[index - 1].y - trail[index].y) * 0.24;
      }

      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const moving = performance.now() - lastMove < 180;

      if (plane.current) {
        plane.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-5px, -5px) rotate(${Number.isFinite(angle) ? angle + 42 : 0}deg)`;
      }
      if (aura.current) {
        aura.current.style.transform = `translate3d(${auraPos.x}px, ${auraPos.y}px, 0) translate(-50%, -50%)`;
      }
      if (label.current) {
        label.current.style.left = `${pos.x + 26}px`;
        label.current.style.top = `${pos.y + 18}px`;
      }
      trailRefs.current.forEach((node, index) => {
        if (!node) return;
        const opacity = moving ? Math.max(0.08, 0.38 - index * 0.045) : 0;
        const size = Math.max(4, 12 - index);
        node.style.transform = `translate3d(${trail[index].x}px, ${trail[index].y}px, 0) translate(-50%, -50%) scale(${moving ? 1 : 0.4})`;
        node.style.opacity = String(opacity);
        node.style.width = `${size}px`;
        node.style.height = `${size}px`;
      });

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointerover", over);
    raf = requestAnimationFrame(tick);

    return () => {
      window.clearTimeout(enableTimer);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointerover", over);
      cancelAnimationFrame(raf);
      document.body.classList.remove("cursor-enabled");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div ref={root} className="pointer-events-none fixed inset-0 z-[140] opacity-100 transition-opacity duration-150">
      <div
        ref={aura}
        className="fixed left-0 top-0 h-16 w-16 rounded-full border border-cyan-300/15 bg-[radial-gradient(circle,rgba(34,211,238,0.2),rgba(59,130,246,0.12)_48%,rgba(139,92,246,0.08)_72%,transparent)] blur-[1px] transition-transform duration-150"
      />
      {Array.from({ length: TRAIL_COUNT }).map((_, index) => (
        <span
          key={index}
          ref={(node) => {
            trailRefs.current[index] = node;
          }}
          className="fixed left-0 top-0 rounded-full bg-cyan-200/70 shadow-[0_0_18px_rgba(34,211,238,0.55)] transition-opacity duration-150"
        />
      ))}
      <div ref={plane} className="fixed left-0 top-0 transition-[filter] duration-150">
        <svg width="38" height="38" viewBox="0 0 48 48" fill="none" aria-hidden="true" className="drop-shadow-[0_0_18px_rgba(34,211,238,0.58)]">
          <path
            d="M6.8 7.6C6.1 6.4 7.4 5.1 8.7 5.8l33 17.1c1.1.6 1.1 2.2 0 2.8l-33 17c-1.3.7-2.6-.6-1.9-1.9l8.1-15.5L6.8 7.6Z"
            fill="url(#planeBody)"
            stroke="url(#planeStroke)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M15.2 25.3 39.8 24 18.5 29.7 15.2 25.3Z" fill="rgba(224,247,255,0.42)" />
          <path d="M15.2 25.3 8.7 6.5l14.8 16.8" stroke="rgba(224,247,255,0.72)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M18.5 29.7 8.7 41.5l14.8-16.1" stroke="rgba(139,92,246,0.62)" strokeWidth="1.5" strokeLinecap="round" />
          <defs>
            <linearGradient id="planeBody" x1="7" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="rgba(224,247,255,0.78)" />
              <stop offset="0.42" stopColor="rgba(34,211,238,0.64)" />
              <stop offset="0.72" stopColor="rgba(59,130,246,0.58)" />
              <stop offset="1" stopColor="rgba(139,92,246,0.54)" />
            </linearGradient>
            <linearGradient id="planeStroke" x1="6" y1="6" x2="42" y2="41" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E0F7FF" />
              <stop offset="0.5" stopColor="#22D3EE" />
              <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span
        ref={label}
        className="fixed rounded-full border border-cyan-300/25 bg-slate-950/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-cyan-100 opacity-0 shadow-[0_0_24px_rgba(34,211,238,0.18)] backdrop-blur transition duration-150"
      />
    </div>
  );
}
