"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Command, Search, X } from "lucide-react";
import { isUsableHref } from "@/lib/utils";
import { projects, siteConfig, socials } from "@/data/site";

type Action = {
  label: string;
  href: string;
  external?: boolean;
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const github = socials.find((social) => social.kind === "github" && isUsableHref(social.href));
  const linkedin = socials.find((social) => social.kind === "linkedin" && isUsableHref(social.href));
  const email = socials.find((social) => social.kind === "email" && isUsableHref(social.href));

  const actions = useMemo<Action[]>(
    () => [
      { label: "View Featured Projects", href: "/#projects" },
      ...projects.filter((project) => project.featured).map((project) => ({ label: `Open ${project.title}`, href: `/projects/${project.slug}` })),
      { label: "Explore Demos", href: "/#demos" },
      { label: "View Resume", href: siteConfig.resumePath, external: true },
      { label: "Ask Ebbad", href: "/#ask-ebbad" },
      { label: "Contact", href: "/#contact" },
      { label: "For Recruiters", href: "/#recruiters" },
      ...(github ? [{ label: "Open GitHub", href: github.href, external: true }] : []),
      ...(linkedin ? [{ label: "Open LinkedIn", href: linkedin.href, external: true }] : []),
      ...(email ? [{ label: "Email Ebbad", href: email.href, external: true }] : []),
    ],
    [email, github, linkedin],
  );

  const filtered = actions.filter((action) => action.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
      if (open && event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])",
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const select = (action: Action) => {
    setOpen(false);
    if (action.href.startsWith("mailto:")) window.location.assign(action.href);
    else if (action.external) window.open(action.href, "_blank", "noopener,noreferrer");
    else window.location.assign(action.href);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/70 p-4 backdrop-blur" role="dialog" aria-modal="true" aria-label="Command palette" onMouseDown={() => setOpen(false)}>
      <div ref={dialogRef} className="glass-panel mx-auto mt-24 max-w-2xl overflow-hidden rounded-3xl" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <Search className="text-cyan-200" size={18} />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search portfolio actions..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
          <button onClick={() => setOpen(false)} className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Close command palette">
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[420px] overflow-y-auto p-3">
          {filtered.map((action) => (
            <button key={action.label} onClick={() => select(action)} className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm text-slate-200 hover:bg-white/[0.08]">
              <span className="flex items-center gap-3">
                <Command size={16} className="text-slate-500" />
                {action.label}
              </span>
              <ArrowRight size={16} className="text-slate-500" />
            </button>
          ))}
          {!filtered.length ? <p className="px-4 py-8 text-center text-sm text-slate-500">No matching action.</p> : null}
        </div>
      </div>
    </div>
  );
}
