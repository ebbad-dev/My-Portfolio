"use client";

import { Component, type ComponentType, type ErrorInfo, type ReactNode, useEffect, useMemo, useState } from "react";
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

type ActiveFilter = SkillCategory | NonTechnicalSkillGroup | "all";
type GlobeLoadState = "checking" | "mobile" | "unsupported" | "loading" | "ready" | "error";
type SkillGlobeComponent = ComponentType<{
  skills: PortfolioSkill[];
  selectedSkillId?: string;
  visibleLimit?: number;
  onSelect: (skill: PortfolioSkill) => void;
}>;

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
          <SkillGlobeUpgrade skills={filtered} selectedSkillId={selected?.id} visibleLimit={visibleLimit} onSelect={selectSkill} />
        </div>
        <div className="grid content-start gap-5">
          {selected ? <SkillInfoCard skill={selected} /> : null}
          <div className="glass-panel rounded-3xl p-5 lg:hidden">
            <p className="mono-label">Mobile Skill View</p>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              The globe is simplified on smaller screens so skills stay readable, fast, and easy to tap.
            </p>
            <SkillFallbackGrid skills={filtered.slice(0, visibleLimit)} selectedSkillId={selected?.id} onSelect={selectSkill} className="mt-4" compact />
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
              aria-label={`${skill.name}, ${skill.level}, ${skill.projectCount || 0} projects`}
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

function SkillGlobeUpgrade({ skills, selectedSkillId, visibleLimit, onSelect }: {
  skills: PortfolioSkill[];
  selectedSkillId?: string;
  visibleLimit: number;
  onSelect: (skill: PortfolioSkill) => void;
}) {
  const [Globe, setGlobe] = useState<SkillGlobeComponent | null>(null);
  const [state, setState] = useState<GlobeLoadState>("checking");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    const loadIfSupported = async () => {
      setGlobe(null);

      if (!desktopQuery.matches) {
        setState("mobile");
        return;
      }

      if (!supportsWebGl()) {
        setState("unsupported");
        return;
      }

      setState("loading");

      try {
        const skillGlobeModule = await import("@/components/home/skill-globe");
        if (!cancelled) {
          setGlobe(() => skillGlobeModule.SkillGlobe);
          setState("ready");
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") console.error("Skill globe failed to load", error);
        if (!cancelled) setState("error");
      }
    };

    loadIfSupported();
    desktopQuery.addEventListener("change", loadIfSupported);

    return () => {
      cancelled = true;
      desktopQuery.removeEventListener("change", loadIfSupported);
    };
  }, [retryKey]);

  if (Globe && state === "ready") {
    return (
      <SkillGlobeBoundary onError={() => setState("error")}>
        <Globe skills={skills} selectedSkillId={selectedSkillId} visibleLimit={visibleLimit} onSelect={onSelect} />
      </SkillGlobeBoundary>
    );
  }

  return (
    <SkillGlobeFallback
      state={state}
      skills={skills.slice(0, visibleLimit)}
      selectedSkillId={selectedSkillId}
      onSelect={onSelect}
      onRetry={() => setRetryKey((current) => current + 1)}
    />
  );
}

function supportsWebGl() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ||
          canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true }) ||
          canvas.getContext("experimental-webgl", { failIfMajorPerformanceCaveat: true })),
    );
  } catch {
    return false;
  }
}

function SkillGlobeFallback({ state, skills, selectedSkillId, onSelect, onRetry }: {
  state: GlobeLoadState;
  skills: PortfolioSkill[];
  selectedSkillId?: string;
  onSelect: (skill: PortfolioSkill) => void;
  onRetry: () => void;
}) {
  const loading = state === "checking" || state === "loading";
  const message =
    state === "mobile"
      ? "Using the lightweight skill picker for this screen size."
      : state === "unsupported"
        ? "Interactive 3D is unavailable in this browser, so the accessible skill picker is active."
        : state === "error"
          ? "The 3D globe could not start. The accessible skill picker is still fully available."
          : "Preparing the interactive 3D skill globe.";

  return (
    <div className="glass-panel rounded-3xl p-4 md:p-6" aria-label="Skill globe fallback">
      <div className="relative min-h-[430px] overflow-hidden rounded-3xl border border-cyan-300/15 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14),rgba(59,130,246,0.06)_38%,rgba(2,6,23,0.9)_74%)] p-5 md:min-h-[520px]">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/25 shadow-[0_0_80px_rgba(34,211,238,0.16)]" />
          <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-300/15" />
        </div>
        <div className="relative flex h-full min-h-[390px] flex-col justify-between gap-5 md:min-h-[480px]">
          <div>
            <p className="mono-label">Skill Globe</p>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300" role="status" aria-live="polite">
              {message}
            </p>
            {loading ? <div className="mt-4 h-1.5 max-w-xs overflow-hidden rounded-full bg-white/10"><span className="block h-full w-1/2 rounded-full bg-cyan-300/70 skill-globe-loading-bar" /></div> : null}
          </div>
          <SkillFallbackGrid skills={skills} selectedSkillId={selectedSkillId} onSelect={onSelect} />
          {state === "error" ? (
            <button
              type="button"
              onClick={onRetry}
              className="w-fit rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:border-cyan-300/55 hover:bg-cyan-300/15"
            >
              Retry interactive globe
            </button>
          ) : null}
        </div>
      </div>
      <p className="mt-4 text-center font-mono text-xs uppercase tracking-[0.12em] text-slate-500">
        Showing {skills.length} focused skills. Filters update this fallback too.
      </p>
    </div>
  );
}

function SkillFallbackGrid({ skills, selectedSkillId, onSelect, compact = false, className }: {
  skills: PortfolioSkill[];
  selectedSkillId?: string;
  onSelect: (skill: PortfolioSkill) => void;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-2 sm:grid-cols-2", compact ? "grid-cols-1" : "md:grid-cols-3", className)}>
      {skills.map((skill) => {
        const active = skill.id === selectedSkillId;
        return (
          <button
            key={skill.id}
            type="button"
            onClick={() => onSelect(skill)}
            aria-label={`${skill.name}, ${skill.level}`}
            className={cn(
              "flex min-h-16 items-center gap-3 rounded-2xl border p-3 text-left transition duration-300",
              active
                ? "border-cyan-300/45 bg-cyan-300/10 shadow-[0_0_24px_rgba(34,211,238,0.13)]"
                : "border-white/10 bg-slate-950/45 hover:border-cyan-300/35 hover:bg-white/[0.055]",
            )}
          >
            <SkillIcon skill={skill} />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-white">{skill.name}</span>
              <span className="mt-1 block truncate text-xs text-slate-400">Level: {skill.level}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

class SkillGlobeBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV === "development") console.error("Skill globe runtime error", error, info);
    this.props.onError();
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
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
