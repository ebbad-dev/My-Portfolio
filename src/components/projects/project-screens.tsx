import { AlertTriangle, BarChart3, BrainCircuit, CheckCircle2, FileText, Gauge, Network, ShieldCheck, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Project } from "@/data/site";
import { cn } from "@/lib/utils";

type Screen = {
  title: string;
  caption: string;
  accent: "cyan" | "blue" | "violet";
  metrics: string[];
  Icon: LucideIcon;
};

const screensBySlug: Record<string, Screen[]> = {
  proctorai: [
    {
      title: "Live Monitoring Dashboard",
      caption: "Mock interface concept showing a session overview, review-focused risk score, and synthetic signal timeline.",
      accent: "cyan",
      metrics: ["Session active", "Risk 72", "3 review events"],
      Icon: ShieldCheck,
    },
    {
      title: "Evidence Review Panel",
      caption: "Generated product mockup for flagged events, evidence notes, and instructor review actions.",
      accent: "violet",
      metrics: ["Face signal", "Audio review", "Tab event"],
      Icon: AlertTriangle,
    },
    {
      title: "Report Export View",
      caption: "Demo UI preview for a summary report that supports human review instead of automatic accusation.",
      accent: "blue",
      metrics: ["Summary", "Caveats", "Review state"],
      Icon: FileText,
    },
  ],
  "teletrack-enterprise": [
    {
      title: "Operations Dashboard",
      caption: "Mock product preview for devices, incidents, critical alerts, SLA status, and audit activity.",
      accent: "blue",
      metrics: ["116 online", "3 critical", "94% SLA"],
      Icon: Network,
    },
    {
      title: "Incident Detail View",
      caption: "Generated interface concept for technician assignment, device state, priority, and local status updates.",
      accent: "cyan",
      metrics: ["Router LHR-03", "Assigned", "Audit logged"],
      Icon: Workflow,
    },
    {
      title: "Reporting View",
      caption: "Demo UI preview for uptime trend, SLA history, and audit-log reporting from structured data.",
      accent: "violet",
      metrics: ["SLA trend", "Uptime", "Export mock"],
      Icon: BarChart3,
    },
  ],
  mirrormind: [
    {
      title: "Argument Map",
      caption: "Mock visual preview showing a claim connected to assumptions, reasons, evidence gaps, and counterpoints.",
      accent: "violet",
      metrics: ["Claim", "Assumptions", "Gaps"],
      Icon: BrainCircuit,
    },
    {
      title: "Reflection Workspace",
      caption: "Generated product mockup for bias checks, evidence prompts, and reasoning-quality feedback.",
      accent: "cyan",
      metrics: ["Evidence low", "Bias check", "Revise"],
      Icon: Gauge,
    },
    {
      title: "Counterargument View",
      caption: "Demo UI preview for comparing opposing perspectives and deciding the next reflection action.",
      accent: "blue",
      metrics: ["Opposing view", "Strength", "Next action"],
      Icon: CheckCircle2,
    },
  ],
};

export function ProjectScreens({ project }: { project: Project }) {
  const screens = screensBySlug[project.slug] || [];
  if (!screens.length) return null;

  return (
    <section className="section-shell pt-0">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mono-label">Visual Walkthrough</p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-white lg:text-4xl">Interface Preview</h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-slate-400">
          These are polished product mockups for the portfolio demo experience. They are not presented as real production screenshots.
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {screens.map((screen, index) => (
          <ScreenCard key={screen.title} screen={screen} index={index} />
        ))}
      </div>
    </section>
  );
}

function ScreenCard({ screen, index }: { screen: Screen; index: number }) {
  const Icon = screen.Icon;

  return (
    <article className={cn(
      "project-visual-shell group relative min-h-[22rem] overflow-hidden rounded-3xl border bg-slate-950 p-4 transition duration-300 hover:-translate-y-1",
      screen.accent === "violet" ? "border-violet-300/24 hover:shadow-[0_0_54px_rgba(139,92,246,0.18)]" : screen.accent === "blue" ? "border-blue-300/24 hover:shadow-[0_0_54px_rgba(59,130,246,0.18)]" : "border-cyan-300/24 hover:shadow-[0_0_54px_rgba(34,211,238,0.18)]",
    )}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(139,92,246,0.18),transparent_28%),linear-gradient(150deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))]" />
      <div className="absolute inset-0 opacity-[0.11] [background-image:linear-gradient(rgba(148,163,184,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.18)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="project-visual-shimmer absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-2">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-100"><Icon size={16} className="text-cyan-200" /> {screen.title}</span>
          <span className="font-mono text-[10px] text-slate-500">0{index + 1}</span>
        </div>
        <div className="mt-4 grid flex-1 grid-rows-[1fr_auto] gap-4 rounded-[1.4rem] border border-white/10 bg-slate-950/58 p-4">
          <div className="relative overflow-hidden rounded-2xl border border-cyan-300/14 bg-cyan-300/[0.045]">
            <div className="absolute inset-x-5 top-7 h-2 rounded-full bg-white/10" />
            <div className="absolute left-5 top-14 h-16 w-[52%] rounded-2xl border border-cyan-300/18 bg-cyan-300/10" />
            <div className="absolute right-5 top-14 h-16 w-[32%] rounded-2xl border border-violet-300/18 bg-violet-400/10" />
            <div className="absolute bottom-6 left-5 right-5 flex items-end gap-2">
              {[42, 68, 52, 84, 61, 74].map((height, itemIndex) => (
                <span key={itemIndex} className="flex-1 rounded-t-full bg-brand-gradient opacity-80 shadow-[0_0_18px_rgba(34,211,238,0.18)]" style={{ height: `${height}px` }} />
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            {screen.metrics.map((metric) => (
              <span key={metric} className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-cyan-100">
                {metric}
              </span>
            ))}
          </div>
        </div>
        <p className="mt-4 text-sm leading-7 text-slate-300">{screen.caption}</p>
      </div>
    </article>
  );
}
