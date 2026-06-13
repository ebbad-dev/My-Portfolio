"use client";

import { useMemo, useState } from "react";
import type { ArchiveFilter } from "@/data/site";
import { archiveProjects } from "@/data/site";
import { CodeRepoButton } from "@/components/ui/code-repo-button";
import { cn } from "@/lib/utils";

const filters: Array<ArchiveFilter | "All"> = ["All", "AI", "Database", "Backend", "Full-Stack", "Systems", "Algorithms"];

export function ArchiveSection() {
  const [active, setActive] = useState<ArchiveFilter | "All">("All");
  const projects = useMemo(
    () => (active === "All" ? archiveProjects : archiveProjects.filter((project) => project.tags.includes(active))),
    [active],
  );

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap gap-2" role="list" aria-label="Archive project filters">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActive(filter)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition duration-300",
              active === filter
                ? "border-cyan-300/50 bg-cyan-300/12 text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.12)]"
                : "border-white/10 bg-white/[0.035] text-slate-400 hover:border-cyan-300/35 hover:text-white",
            )}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {projects.map((project) => (
          <article key={project.title} className="glass-panel premium-card rounded-3xl p-5 transition duration-500 hover:-translate-y-1 hover:border-cyan-300/35">
            <div className="flex flex-wrap items-center gap-2">
              <p className="mono-label">{project.category}</p>
              <span className={`rounded-full border px-3 py-1 font-mono text-xs ${project.codeStatus === "available" ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100" : "border-slate-400/15 bg-white/[0.035] text-slate-400"}`}>
                {project.codeStatus === "available" ? "Code Available" : "Code Coming Soon"}
              </span>
            </div>
            <h3 className="mt-3 font-heading text-2xl font-semibold text-white">{project.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span key={tech} className="rounded-full bg-white/[0.05] px-3 py-1 text-xs text-slate-300">{tech}</span>
              ))}
            </div>
            <CodeRepoButton href={project.githubUrl} status={project.codeStatus} label="View Code" className="mt-5" />
          </article>
        ))}
      </div>
    </div>
  );
}
