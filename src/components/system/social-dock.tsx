"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, FileText, Github, Instagram, Linkedin, Mail } from "lucide-react";
import { socials } from "@/data/site";
import { cn, isUsableHref } from "@/lib/utils";

const icons = {
  linkedin: Linkedin,
  github: Github,
  instagram: Instagram,
  email: Mail,
  resume: FileText,
};

function shouldOpenNewTab(kind: keyof typeof icons, href: string) {
  return kind === "resume" || href.startsWith("http");
}

export function SocialDock() {
  const [open, setOpen] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);
  const visible = socials.filter((social) => isUsableHref(social.href));

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!dockRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  if (!visible.length) return null;

  return (
    <div ref={dockRef} className="fixed bottom-5 left-4 z-50 md:bottom-auto md:left-0 md:top-1/2 md:-translate-y-1/2" aria-label="Social drawer">
      <div
        className={cn(
          "flex items-center gap-2 rounded-r-3xl rounded-l-2xl transition duration-300 md:rounded-l-none",
          open && "glass-panel border-cyan-300/35 p-2 shadow-[0_0_34px_rgba(34,211,238,0.14)]",
        )}
      >
        <button
          onClick={() => setOpen((value) => !value)}
          className={cn(
            "group relative flex h-36 w-12 flex-col items-center justify-center gap-2 overflow-hidden rounded-r-2xl rounded-l-xl border border-cyan-300/18 bg-slate-950/82 text-cyan-50 shadow-[0_0_28px_rgba(34,211,238,0.12)] backdrop-blur-xl transition duration-300 hover:border-cyan-300/45 hover:bg-cyan-300/10 hover:shadow-[0_0_38px_rgba(34,211,238,0.2)] md:rounded-l-none",
            open && "border-cyan-300/50 bg-cyan-300/10",
          )}
          aria-label={open ? "Close social drawer" : "Open social drawer"}
          aria-expanded={open}
          data-cursor-label={open ? "Close" : "Socials"}
        >
          <span className="absolute inset-y-4 right-0 w-px bg-gradient-to-b from-transparent via-cyan-300/50 to-transparent" />
          <span className="flex flex-col items-center gap-1 font-mono text-[11px] font-bold uppercase leading-none tracking-[0.18em] text-slate-100">
            {"SOCIALS".split("").map((letter) => (
              <span key={letter} className="drop-shadow-[0_0_10px_rgba(34,211,238,0.28)]">
                {letter}
              </span>
            ))}
          </span>
          <ChevronRight size={16} className={cn("text-cyan-200 transition duration-300", open && "rotate-180")} aria-hidden="true" />
        </button>
        <div className={cn("flex overflow-hidden transition-all duration-300", open ? "max-w-[18rem] opacity-100" : "max-w-0 opacity-0")}>
          <div className="flex gap-2 pl-1">
            {visible.map((social) => {
              const Icon = icons[social.kind];
              const newTab = shouldOpenNewTab(social.kind, social.href);
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target={newTab ? "_blank" : undefined}
                  rel={newTab ? "noopener noreferrer" : undefined}
                  className="group relative grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 backdrop-blur transition hover:-translate-y-0.5 hover:border-cyan-300/45 hover:text-white hover:shadow-[0_0_28px_rgba(34,211,238,0.16)]"
                  aria-label={social.label}
                  data-cursor-label={social.kind === "email" ? "Email" : social.kind === "resume" ? "Resume" : "Open"}
                >
                  <Icon size={18} />
                  <span className="pointer-events-none absolute left-full ml-3 hidden rounded-full border border-cyan-300/20 bg-slate-950/90 px-3 py-1 text-xs font-semibold text-cyan-50 opacity-0 shadow-[0_0_24px_rgba(34,211,238,0.12)] transition group-hover:opacity-100 md:block">
                    {social.label}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
