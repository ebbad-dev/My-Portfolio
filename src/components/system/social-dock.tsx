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

const socialOrder: Record<keyof typeof icons, number> = {
  linkedin: 1,
  github: 2,
  instagram: 3,
  email: 4,
  resume: 5,
};

function shouldOpenNewTab(kind: keyof typeof icons, href: string) {
  return kind === "resume" || href.startsWith("http");
}

export function SocialDock() {
  const [open, setOpen] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);
  const visible = socials
    .filter((social) => isUsableHref(social.href))
    .sort((a, b) => socialOrder[a.kind] - socialOrder[b.kind]);

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
    <div ref={dockRef} className="fixed left-0 top-1/2 z-50 hidden -translate-y-1/2 md:block" aria-label="Social drawer">
      <div
        className={cn(
          "flex flex-col items-start gap-1.5 rounded-r-[1.35rem] transition duration-300",
          open && "border border-cyan-300/18 bg-slate-950/72 p-1.5 pr-2 shadow-[0_0_34px_rgba(34,211,238,0.12)] backdrop-blur-xl",
        )}
      >
        <button
          onClick={() => setOpen((value) => !value)}
          className={cn(
            "group relative flex h-32 w-10 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-r-2xl border border-cyan-300/16 bg-slate-950/78 text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.1)] backdrop-blur-xl transition duration-300 hover:border-cyan-300/38 hover:bg-cyan-300/10 hover:shadow-[0_0_34px_rgba(34,211,238,0.17)]",
            open && "border-cyan-300/42 bg-cyan-300/10",
          )}
          aria-label={open ? "Close social links" : "Open social links"}
          aria-expanded={open}
          data-cursor-label={open ? "Close" : "Socials"}
        >
          <span className="absolute inset-y-4 right-0 w-px bg-gradient-to-b from-transparent via-cyan-300/45 to-transparent" />
          <span className="flex flex-col items-center gap-0.5 font-mono text-[10px] font-bold uppercase leading-none tracking-[0.18em] text-slate-100">
            {"SOCIALS".split("").map((letter) => (
              <span key={letter} className="drop-shadow-[0_0_10px_rgba(34,211,238,0.28)]">
                {letter}
              </span>
            ))}
          </span>
          <ChevronRight size={15} className={cn("text-cyan-200 transition duration-300", open && "rotate-180")} aria-hidden="true" />
        </button>
        <div className={cn("overflow-visible transition-all duration-300", open ? "max-h-[17rem] opacity-100" : "max-h-0 opacity-0")}>
          <div className="flex w-10 flex-col gap-1.5">
            {visible.map((social) => {
              const Icon = icons[social.kind];
              const newTab = shouldOpenNewTab(social.kind, social.href);
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target={newTab ? "_blank" : undefined}
                  rel={newTab ? "noopener noreferrer" : undefined}
                  className="group relative grid h-10 w-10 place-items-center rounded-full border border-cyan-300/12 bg-cyan-300/[0.045] text-slate-300 backdrop-blur transition hover:-translate-y-0.5 hover:border-cyan-300/42 hover:text-white hover:shadow-[0_0_24px_rgba(34,211,238,0.16)] focus-visible:border-cyan-200"
                  aria-label={social.label}
                  data-cursor-label={social.kind === "email" ? "Email" : social.kind === "resume" ? "Resume" : "Open"}
                >
                  <Icon size={17} />
                  <span className="pointer-events-none absolute left-full ml-2 hidden rounded-full border border-cyan-300/20 bg-slate-950/92 px-3 py-1 text-xs font-semibold text-cyan-50 opacity-0 shadow-[0_0_24px_rgba(34,211,238,0.12)] transition group-hover:opacity-100 group-focus-visible:opacity-100 md:block">
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
