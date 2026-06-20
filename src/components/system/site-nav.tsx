"use client";

import { useState } from "react";
import Link from "next/link";
import { Command, Github, Menu, X } from "lucide-react";
import { siteConfig, socials } from "@/data/site";
import { isUsableHref } from "@/lib/utils";
import { ThemeToggle } from "@/components/system/theme-toggle";

const nav = [
  ["Home", "/#hero"],
  ["For Recruiters", "/#recruiters"],
  ["Projects", "/#projects"],
  ["Skills", "/#skills"],
  ["Demos", "/#demos"],
  ["Contact", "/#contact"],
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const visibleSocials = socials.filter((social) => social.kind !== "resume" && isUsableHref(social.href));

  return (
    <header className="site-nav-header fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#05070d]/75 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 w-[min(1100px,calc(100%-2rem))] items-center justify-between" aria-label="Main navigation">
        <Link href="/#hero" className="group flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-cyan-300/30 bg-cyan-300/10 font-heading font-bold text-cyan-200">E</span>
          <span className="hidden font-heading text-sm font-semibold text-white sm:block">{siteConfig.shortName}</span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white">
              {label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-300/35 hover:text-white md:inline-flex"
            onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))}
            aria-label="Open command palette"
            data-cursor-label="Search"
          >
            <Command size={14} /> Ctrl K
          </button>
          <ThemeToggle />
          {isUsableHref(siteConfig.portfolioRepositoryUrl) ? (
            <a
              href={siteConfig.portfolioRepositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full border border-cyan-300/15 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:border-cyan-300/45 hover:bg-cyan-300/10 hover:text-white md:inline-flex"
              data-cursor-label="Open"
            >
              <Github size={14} /> Star Repository
            </a>
          ) : null}
          <button className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-slate-100 md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      {open ? (
        <div className="site-nav-mobile border-t border-white/10 bg-[#05070d] p-4 md:hidden">
          <div className="grid gap-2">
            {nav.map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-slate-200 hover:bg-white/5">
                {label}
              </Link>
            ))}
            {visibleSocials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="rounded-2xl px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
