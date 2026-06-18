"use client";

import Image from "next/image";
import { useState } from "react";
import { Project } from "@/data/site";
import { cn } from "@/lib/utils";

export function ProjectVisual({ project }: { project: Project }) {
  const [imageMissing, setImageMissing] = useState(false);

  if (project.thumbnail && !imageMissing) {
    return (
      <div className={cn(
        "project-thumbnail group/visual relative h-72 overflow-hidden rounded-3xl border bg-slate-950",
        project.visualAccent === "violet"
          ? "border-violet-300/25 shadow-[0_0_55px_rgba(139,92,246,0.11)]"
          : project.visualAccent === "blue"
            ? "border-blue-300/25 shadow-[0_0_55px_rgba(59,130,246,0.11)]"
            : "border-cyan-300/25 shadow-[0_0_55px_rgba(34,211,238,0.11)]",
      )}>
        <Image
          src={project.thumbnail}
          alt={project.thumbnailAlt || `${project.title} interface visual thumbnail`}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition duration-700 group-hover/visual:scale-[1.035]"
          onError={() => setImageMissing(true)}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_18%,rgba(255,255,255,0.13)_34%,transparent_48%)] opacity-0 transition duration-700 group-hover/visual:translate-x-20 group-hover/visual:opacity-100" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/86 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-cyan-50 backdrop-blur">
            Honest interface preview
          </span>
          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-cyan-100 backdrop-blur">
            {project.demoLabel || "Case Study"}
          </span>
        </div>
      </div>
    );
  }

  if (project.slug === "proctorai") {
    return (
      <div className="relative h-64 overflow-hidden rounded-3xl border border-cyan-300/20 bg-slate-950 p-4">
        <div className="absolute inset-x-8 top-1/2 h-px animate-pulse bg-cyan-200/35 shadow-[0_0_22px_rgba(34,211,238,0.55)]" />
        <div className="absolute right-4 top-4 rounded-full bg-violet-400/15 px-3 py-1 font-mono text-xs text-violet-100">Risk 72</div>
        <div className="grid h-full grid-cols-[1.2fr_0.8fr] gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <div className="mb-3 h-28 rounded-xl border border-cyan-300/20 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.26),transparent_58%)]" />
            {["Face active", "Eye warning", "Head deviation"].map((item) => (
            <div key={item} className="mb-2 h-7 rounded-lg bg-white/[0.06] px-3 py-1.5 text-xs text-slate-300">{item}</div>
          ))}
        </div>
        <div className="space-y-3">
            <div className="rounded-2xl border border-violet-300/20 bg-violet-400/10 p-3 text-xs text-violet-100">Evidence captured</div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-xs text-slate-300">Instructor review queue</div>
            <div className="h-20 rounded-2xl border border-cyan-300/20 bg-cyan-300/10" />
          </div>
        </div>
      </div>
    );
  }

  if (project.slug === "teletrack-enterprise") {
    return (
      <div className="relative h-64 overflow-hidden rounded-3xl border border-blue-300/20 bg-slate-950 p-4">
        <div className="grid grid-cols-3 gap-3">
          {["116 online", "7 incidents", "94% SLA"].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 font-mono text-xs text-slate-200">{item}</div>
          ))}
        </div>
        <div className="mt-4 grid h-40 grid-cols-[0.9fr_1.1fr] gap-4">
          <div className="relative rounded-2xl border border-cyan-300/20 bg-cyan-300/10">
            {[[22, 28], [65, 42], [42, 72], [76, 76], [32, 54]].map(([x, y], index) => (
              <span key={index} className="absolute h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.9)]" style={{ left: `${x}%`, top: `${y}%` }} />
            ))}
          </div>
          <div className="space-y-2">
            {["Router Lahore-03 offline", "Switch Floor-2 latency", "Audit log updated"].map((item) => (
              <div key={item} className="rounded-xl bg-white/[0.06] px-3 py-2 text-xs text-slate-300">{item}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-64 overflow-hidden rounded-3xl border border-violet-300/20 bg-slate-950 p-4">
      <div className="mx-auto mb-4 w-fit rounded-full border border-violet-300/30 bg-violet-400/10 px-4 py-2 font-mono text-xs text-violet-100">Reasoning risk: Medium</div>
      <div className="grid grid-cols-3 gap-3">
        {["Claim", "Assumptions", "Evidence gaps"].map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center text-xs text-slate-200">{item}</div>
        ))}
      </div>
      <div className="mt-5 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-4">
        <div className="mb-3 h-2 w-2/3 rounded-full bg-cyan-200/70" />
        <div className="mb-3 h-2 w-1/2 rounded-full bg-violet-200/70" />
        <div className="h-16 rounded-2xl bg-white/[0.05]" />
      </div>
    </div>
  );
}
