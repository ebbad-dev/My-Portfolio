"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { portfolioSkills, skillCategoryLabels, technicalCategories, type PortfolioSkill, type SkillCategory, type SkillMode } from "@/data/skills";
import { SkillIcon } from "@/components/ui/skill-icon";
import { cn } from "@/lib/utils";

const DynamicGlobe = dynamic(() => import("@/components/home/skill-globe").then((module) => module.SkillGlobe), {
  ssr: false,
  loading: () => (
    <div className="glass-panel rounded-3xl p-6">
      <div className="h-[430px] rounded-3xl border border-cyan-300/15 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.13),transparent_58%)]" />
      <p className="mt-4 text-sm text-slate-400">Preparing the 3D skill constellation. The full skill list is available beside it.</p>
    </div>
  ),
});

export function SkillConstellation() {
  const [mode, setMode] = useState<SkillMode>("technical");
  const [category, setCategory] = useState<SkillCategory | "all">("all");
  const filtered = useMemo(() => {
    const byMode = portfolioSkills.filter((skill) => (mode === "technical" ? skill.category !== "nonTechnical" : skill.category === "nonTechnical"));
    return category === "all" ? byMode : byMode.filter((skill) => skill.category === category);
  }, [category, mode]);
  const [selectedId, setSelectedId] = useState("typescript");
  const selected = filtered.find((skill) => skill.id === selectedId) || filtered[0] || portfolioSkills[0];
  const categories = mode === "technical" ? technicalCategories : (["nonTechnical"] as SkillCategory[]);

  const selectMode = (nextMode: SkillMode) => {
    setMode(nextMode);
    setCategory("all");
    const nextSkill = portfolioSkills.find((skill) => (nextMode === "technical" ? skill.category !== "nonTechnical" : skill.category === "nonTechnical"));
    if (nextSkill) setSelectedId(nextSkill.id);
  };

  const selectSkill = (skill: PortfolioSkill) => setSelectedId(skill.id);

  return (
    <div className="grid gap-6">
      <div className="glass-panel premium-card rounded-3xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mono-label">Interactive Skill Planet</p>
            <h3 className="mt-2 font-heading text-3xl font-bold text-white">A 3D engineering constellation.</h3>
          </div>
          <div className="flex rounded-full border border-white/10 bg-white/[0.04] p-1">
            {(["technical", "nonTechnical"] as SkillMode[]).map((item) => (
              <button
                key={item}
                onClick={() => selectMode(item)}
                className={cn("rounded-full px-4 py-2 text-xs font-semibold transition", mode === item ? "bg-cyan-300 text-slate-950" : "text-slate-400 hover:text-white")}
              >
                {item === "technical" ? "Technical" : "Non-Technical"}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1" aria-label="Skill category filters">
          <button onClick={() => setCategory("all")} className={cn("shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition", category === "all" ? "border-cyan-300/45 bg-cyan-300/10 text-cyan-50" : "border-white/10 text-slate-400 hover:text-white")}>
            All
          </button>
          {categories.map((item) => (
            <button key={item} onClick={() => setCategory(item)} className={cn("shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition", category === item ? "border-cyan-300/45 bg-cyan-300/10 text-cyan-50" : "border-white/10 text-slate-400 hover:text-white")}>
              {skillCategoryLabels[item]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="hidden lg:block">
          <DynamicGlobe skills={filtered} selectedSkillId={selected?.id} onSelect={selectSkill} />
        </div>
        <div className="grid gap-5">
          {selected ? <SkillInfoCard skill={selected} /> : null}
          <div className="glass-panel rounded-3xl p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-heading text-2xl font-bold text-white">Skill Index</h3>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-xs text-slate-300">{filtered.length} skills</span>
            </div>
            <div className="mt-4 grid max-h-[430px] gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
              {filtered.map((skill) => (
                <button
                  key={skill.id}
                  onClick={() => selectSkill(skill)}
                  className={cn("group flex items-start gap-3 rounded-2xl border p-3 text-left transition duration-300 hover:-translate-y-0.5", selected?.id === skill.id ? "border-cyan-300/45 bg-cyan-300/10" : "border-white/10 bg-white/[0.035] hover:border-cyan-300/35")}
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
      </div>
    </div>
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
          <p className="mt-2 text-sm text-cyan-100">{skill.level} - {skill.experienceLabel}</p>
        </div>
      </div>
      <p className="mt-5 leading-8 text-slate-300">{skill.description}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
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
