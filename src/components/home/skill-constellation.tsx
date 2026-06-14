"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
  nonTechnicalGroupLabels,
  nonTechnicalGroups,
  portfolioSkills,
  skillCategoryLabels,
  technicalCategories,
  type NonTechnicalSkillGroup,
  type PortfolioSkill,
  type SkillCategory,
  type SkillMode,
} from "@/data/skills";
import { SkillIcon } from "@/components/ui/skill-icon";
import { cn } from "@/lib/utils";

const DynamicGlobe = dynamic(() => import("@/components/home/skill-globe").then((module) => module.SkillGlobe), {
  ssr: false,
  loading: () => (
    <div className="glass-panel rounded-3xl p-4 md:p-6">
      <div className="h-[360px] rounded-3xl border border-cyan-300/15 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14),transparent_60%)] md:h-[520px]" />
      <p className="mt-4 text-sm text-slate-400">Preparing the holographic skill globe. Core languages remain available below.</p>
    </div>
  ),
});

type ActiveFilter = SkillCategory | NonTechnicalSkillGroup | "all";
const coreLanguageIds = ["python", "java", "cpp", "sql", "javascript", "typescript"];

export function SkillConstellation() {
  const [mode, setMode] = useState<SkillMode>("technical");
  const [filter, setFilter] = useState<ActiveFilter>("all");
  const filtered = useMemo(() => {
    const byMode = portfolioSkills.filter((skill) => (mode === "technical" ? skill.category !== "nonTechnical" : skill.category === "nonTechnical"));
    if (filter === "all") return byMode;
    return mode === "technical"
      ? byMode.filter((skill) => skill.category === filter)
      : byMode.filter((skill) => skill.nonTechnicalGroup === filter);
  }, [filter, mode]);
  const [selectedId, setSelectedId] = useState("typescript");
  const selected = filtered.find((skill) => skill.id === selectedId) || filtered[0] || portfolioSkills[0];
  const activeFilters = mode === "technical" ? technicalCategories : nonTechnicalGroups;
  const visibleLimit = filter === "all" ? 14 : 16;
  const coreLanguages = portfolioSkills.filter((skill) => coreLanguageIds.includes(skill.id));

  const selectMode = (nextMode: SkillMode) => {
    setMode(nextMode);
    setFilter("all");
    const nextSkill = portfolioSkills.find((skill) => (nextMode === "technical" ? skill.category !== "nonTechnical" : skill.category === "nonTechnical"));
    if (nextSkill) setSelectedId(nextSkill.id);
  };

  const selectSkill = (skill: PortfolioSkill) => setSelectedId(skill.id);

  return (
    <div className="grid gap-7">
      <div className="glass-panel premium-card rounded-3xl p-5 md:p-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mono-label">Interactive Skill Planet</p>
          <h3 className="mt-2 font-heading text-3xl font-bold text-white md:text-4xl">Engineering Stack Globe</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300 md:text-base">
            My stack is not just a list of tools. Each skill connects to something I have built, explored, or used inside real project work.
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="flex rounded-full border border-white/10 bg-slate-950/70 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            {(["technical", "nonTechnical"] as SkillMode[]).map((item) => (
              <button
                key={item}
                onClick={() => selectMode(item)}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-semibold transition duration-300 sm:px-5",
                  mode === item
                    ? "bg-[linear-gradient(135deg,rgba(34,211,238,0.95),rgba(59,130,246,0.92),rgba(139,92,246,0.9))] text-white shadow-[0_0_24px_rgba(34,211,238,0.22)]"
                    : "text-slate-400 hover:text-white",
                )}
              >
                {item === "technical" ? "Technical" : "Non-Technical"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex justify-center">
          <div className="flex max-w-full gap-2 overflow-x-auto rounded-full border border-white/10 bg-white/[0.035] p-1.5" aria-label="Skill category filters">
            <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
              All
            </FilterButton>
            {activeFilters.map((item) => (
              <FilterButton key={item} active={filter === item} onClick={() => setFilter(item)}>
                {mode === "technical" ? skillCategoryLabels[item as SkillCategory] : nonTechnicalGroupLabels[item as NonTechnicalSkillGroup]}
              </FilterButton>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.55fr)]">
        <div className="hidden lg:block">
          <DynamicGlobe skills={filtered} selectedSkillId={selected?.id} visibleLimit={visibleLimit} onSelect={selectSkill} />
        </div>
        <div className="grid content-start gap-5">
          {selected ? <SkillInfoCard skill={selected} /> : null}
          <div className="glass-panel rounded-3xl p-5 lg:hidden">
            <p className="mono-label">Mobile Skill View</p>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              The full 3D globe is simplified on smaller screens so the core languages stay readable and easy to tap.
            </p>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="mono-label">Core Programming Languages</p>
            <h3 className="mt-2 font-heading text-2xl font-bold text-white">Core Languages</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
              These are the main languages I use across academic work, backend logic, database systems, and project development.
            </p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-xs text-slate-300">{coreLanguages.length} languages</span>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {coreLanguages.map((skill) => (
            <button
              key={skill.id}
              onClick={() => selectSkill(skill)}
              className={cn(
                "group flex min-h-20 items-center gap-3 rounded-2xl border p-3 text-left transition duration-300 hover:-translate-y-0.5",
                selected?.id === skill.id
                  ? "border-cyan-300/45 bg-cyan-300/10 shadow-[0_0_26px_rgba(34,211,238,0.12)]"
                  : "border-white/10 bg-white/[0.035] hover:border-cyan-300/35",
              )}
              data-cursor-label="Skill"
            >
              <SkillIcon skill={skill} />
              <span>
                <span className="block text-sm font-semibold text-white">{skill.name}</span>
                <span className="mt-1 block text-xs text-slate-400">{skill.level} - {skill.projectCount || 0} projects</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterButton({ active, children, onClick }: { active: boolean; children: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition duration-300 sm:px-4",
        active
          ? "bg-cyan-300/12 text-cyan-50 ring-1 ring-cyan-300/40 shadow-[0_0_18px_rgba(34,211,238,0.12)]"
          : "text-slate-400 hover:bg-white/[0.04] hover:text-white",
      )}
    >
      {children}
    </button>
  );
}

function SkillInfoCard({ skill }: { skill: PortfolioSkill }) {
  return (
    <article className="glass-panel premium-card rounded-3xl p-5">
      <div className="flex items-start gap-4">
        <SkillIcon skill={skill} large />
        <div>
          <p className="mono-label">{skillCategoryLabels[skill.category]}</p>
          <h3 className="mt-2 font-heading text-3xl font-bold text-white">{skill.name}</h3>
          <p className="mt-2 text-sm leading-6 text-cyan-100">{skill.level} - {skill.experienceLabel}</p>
        </div>
      </div>
      <p className="mt-5 leading-8 text-slate-300">{skill.description}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-sm font-semibold text-white">Related projects</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">{skill.relatedProjects.length ? skill.relatedProjects.join(", ") : "No specific public project yet."}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-sm font-semibold text-white">Project count</p>
          <p className="mt-2 font-heading text-3xl font-bold text-cyan-100">{skill.projectCount || 0}</p>
        </div>
      </div>
      {skill.highlights?.length ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {skill.highlights.map((highlight) => (
            <span key={highlight} className="rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1.5 text-xs text-cyan-50">{highlight}</span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
