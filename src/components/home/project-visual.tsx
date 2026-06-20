"use client";

import { Activity, AlertTriangle, BrainCircuit, Camera, CheckCircle2, Database, Eye, Network, Radar, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Project } from "@/data/site";
import { cn } from "@/lib/utils";

export function ProjectVisual({ project }: { project: Project }) {
  if (project.slug === "teletrack-enterprise") return <TeleTrackVisual />;
  if (project.slug === "mirrormind") return <MirrorMindVisual />;
  return <ProctorVisual />;
}

function VisualShell({ children, accent = "cyan" }: { children: ReactNode; accent?: "cyan" | "blue" | "violet" }) {
  return (
    <div
      className={cn(
        "project-thumbnail project-visual-shell group/visual relative h-80 overflow-hidden rounded-3xl border bg-slate-950",
        accent === "violet"
          ? "border-violet-300/28 shadow-[0_0_70px_rgba(139,92,246,0.16)]"
          : accent === "blue"
            ? "border-blue-300/28 shadow-[0_0_70px_rgba(59,130,246,0.16)]"
            : "border-cyan-300/28 shadow-[0_0_70px_rgba(34,211,238,0.16)]",
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(34,211,238,0.2),transparent_28%),radial-gradient(circle_at_82%_8%,rgba(139,92,246,0.18),transparent_30%),linear-gradient(145deg,rgba(15,23,42,0.98),rgba(2,6,23,0.96))]" />
      <div className="absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgba(148,163,184,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.18)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="project-visual-shimmer absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      <div className="relative h-full p-4">{children}</div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/90 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full border border-white/10 bg-slate-950/72 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-cyan-50 backdrop-blur">
          Immersive system preview
        </span>
        <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-cyan-100 backdrop-blur">
          Interactive portfolio demo
        </span>
      </div>
    </div>
  );
}

function ProctorVisual() {
  const events = [
    ["Face lock", "Stable", "cyan"],
    ["Audio spike", "Review", "violet"],
    ["Tab switch", "Flagged", "blue"],
  ] as const;

  return (
    <VisualShell accent="cyan">
      <div className="relative h-full rounded-[1.65rem] border border-cyan-300/16 bg-slate-950/72 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur">
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-200">ProctorAI command</p>
            <h4 className="mt-1 font-heading text-lg font-bold text-white">Integrity session live</h4>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-50">
            <Radar size={14} /> scanning
          </div>
        </div>

        <div className="grid h-[12.2rem] grid-cols-[1.1fr_0.9fr] gap-3">
          <div className="relative overflow-hidden rounded-2xl border border-cyan-300/18 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.2),transparent_62%)]">
            <div className="project-scan-sweep absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-cyan-200/28 to-transparent" />
            <div className="absolute inset-5 rounded-[2rem] border border-cyan-200/12" />
            <div className="absolute left-1/2 top-[48%] h-24 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/20 bg-cyan-300/10 shadow-[0_0_40px_rgba(34,211,238,0.22)]" />
            <div className="absolute left-1/2 top-[61%] h-10 w-28 -translate-x-1/2 rounded-[50%] border border-cyan-200/14 bg-cyan-200/8" />
            <div className="absolute left-1/2 top-[48%] h-36 w-px -translate-x-1/2 bg-cyan-100/18" />
            <div className="absolute left-[22%] top-[19%] flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-2.5 py-1 text-[10px] text-cyan-100">
              <Camera size={12} /> webcam
            </div>
            <div className="absolute bottom-3 left-3 right-3 h-2 overflow-hidden rounded-full bg-white/8">
              <div className="project-meter h-full w-[72%] rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400" />
            </div>
          </div>

          <div className="grid gap-3">
            <div className="relative grid place-items-center overflow-hidden rounded-2xl border border-violet-300/18 bg-violet-400/8">
              <div className="project-orbit absolute h-28 w-28 rounded-full border-[10px] border-cyan-300/10 border-r-violet-400 border-t-cyan-300" />
              <div className="text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">risk score</p>
                <p className="font-heading text-4xl font-black text-white">72</p>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-100">Evidence queue</p>
              {events.map(([label, status, color]) => (
                <div key={label} className="mb-1.5 flex items-center justify-between rounded-xl bg-slate-950/55 px-2.5 py-1.5 text-[11px]">
                  <span className="text-slate-300">{label}</span>
                  <span className={cn(color === "violet" ? "text-violet-200" : color === "blue" ? "text-blue-200" : "text-cyan-200")}>{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </VisualShell>
  );
}

function TeleTrackVisual() {
  const nodes = [
    ["Core", 48, 46, "bg-blue-400"],
    ["LHR-03", 22, 38, "bg-cyan-300"],
    ["Edge-1", 75, 33, "bg-cyan-300"],
    ["Switch", 33, 72, "bg-violet-400"],
    ["Ops", 71, 74, "bg-cyan-300"],
  ] as const;

  return (
    <VisualShell accent="blue">
      <div className="relative h-full rounded-[1.65rem] border border-blue-300/16 bg-slate-950/72 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur">
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-blue-200">TeleTrack enterprise</p>
            <h4 className="mt-1 font-heading text-lg font-bold text-white">Network operations map</h4>
          </div>
          <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">94% SLA</div>
        </div>

        <div className="grid h-[12.2rem] grid-cols-[1.15fr_0.85fr] gap-3">
          <div className="relative overflow-hidden rounded-2xl border border-blue-300/18 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18),transparent_64%)]">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden="true">
              <path className="project-flow-line" d="M48 46 L22 38 M48 46 L75 33 M48 46 L33 72 M33 72 L71 74 M75 33 L71 74" />
            </svg>
            {nodes.map(([label, x, y, color], index) => (
              <span key={label} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
                <span
                  className={cn("project-node-pulse grid h-10 w-10 place-items-center rounded-full text-[9px] font-bold text-white shadow-[0_0_28px_rgba(34,211,238,0.42)]", color)}
                  style={{ animationDelay: `${index * 160}ms` }}
                >
                  <span className="sr-only">{label}</span>
                  {index === 0 ? <Network size={15} /> : <Database size={14} />}
                </span>
              </span>
            ))}
            <div className="absolute bottom-3 left-3 rounded-full border border-cyan-300/20 bg-slate-950/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-100 backdrop-blur">
              topology sync
            </div>
          </div>

          <div className="grid gap-3">
            {[
              ["Devices", "116", "text-cyan-100"],
              ["Critical alerts", "3", "text-violet-100"],
              ["Active incidents", "7", "text-blue-100"],
            ].map(([label, value, tone]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
                <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">{label}</p>
                <p className={cn("mt-1 font-heading text-2xl font-black", tone)}>{value}</p>
              </div>
            ))}
            <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/8 p-3">
              <div className="mb-2 flex items-center gap-2 text-xs text-cyan-100"><Activity size={14} /> Alert stream</div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="project-meter h-full w-[83%] rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400" /></div>
            </div>
          </div>
        </div>
      </div>
    </VisualShell>
  );
}

function MirrorMindVisual() {
  const reportCards: Array<{ Icon: LucideIcon; title: string; detail: string }> = [
    { Icon: Eye, title: "Hidden assumption", detail: "Accuracy is reliable" },
    { Icon: AlertTriangle, title: "Evidence gap", detail: "No outcome data" },
    { Icon: ShieldCheck, title: "Counterargument", detail: "Equity risk" },
  ];

  return (
    <VisualShell accent="violet">
      <div className="relative h-full rounded-[1.65rem] border border-violet-300/16 bg-slate-950/72 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur">
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-violet-200">MirrorMind reasoning</p>
            <h4 className="mt-1 font-heading text-lg font-bold text-white">Argument intelligence</h4>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1.5 text-xs font-semibold text-violet-100">
            <BrainCircuit size={14} /> analysis
          </div>
        </div>

        <div className="grid h-[12.2rem] grid-cols-[1.05fr_0.95fr] gap-3">
          <div className="relative overflow-hidden rounded-2xl border border-violet-300/18 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.22),transparent_66%)]">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden="true">
              <path className="project-flow-line violet" d="M50 34 L27 62 M50 34 L50 70 M50 34 L75 61 M27 62 L50 70 M75 61 L50 70" />
            </svg>
            <ReasonNode label="Claim" className="left-1/2 top-[28%] h-16 w-16 bg-cyan-300 text-slate-950" />
            <ReasonNode label="Reason" className="left-[28%] top-[62%] h-14 w-14 bg-blue-500 text-white" />
            <ReasonNode label="Assume" className="left-1/2 top-[70%] h-16 w-16 bg-violet-500 text-white" />
            <ReasonNode label="Gaps" className="left-[75%] top-[61%] h-14 w-14 bg-cyan-300 text-slate-950" />
            <div className="absolute left-4 top-4 rounded-full border border-cyan-300/15 bg-slate-950/72 px-2.5 py-1 text-[10px] text-cyan-100 backdrop-blur">
              claim map
            </div>
          </div>

          <div className="grid gap-3">
            {reportCards.map(({ Icon, title, detail }) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
                <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold text-violet-100">
                  <Icon size={14} /> {title}
                </div>
                <p className="text-[11px] leading-5 text-slate-300">{detail}</p>
              </div>
            ))}
            <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/8 p-3">
              <div className="mb-2 flex items-center gap-2 text-xs text-cyan-100"><CheckCircle2 size={14} /> Report confidence</div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="project-meter h-full w-[76%] rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400" /></div>
            </div>
          </div>
        </div>
      </div>
    </VisualShell>
  );
}

function ReasonNode({ label, className }: { label: string; className: string }) {
  return (
    <div className={cn("project-node-pulse absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[10px] font-black shadow-[0_0_32px_rgba(34,211,238,0.36)]", className)}>
      {label}
    </div>
  );
}
