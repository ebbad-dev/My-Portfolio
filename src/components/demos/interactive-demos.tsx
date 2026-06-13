"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Activity, BarChart3, CheckCircle2, Download, Eye, Network, Play, Send, Shield, UserCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { demoData } from "@/data/site";
import { cn } from "@/lib/utils";

type Severity = "Warning" | "Critical";
type Filter = "All" | Severity;

const evidenceEvents: Array<{ title: string; severity: Severity; detail: string }> = [
  { title: "Eye movement warning", severity: "Warning", detail: "Candidate looked away from screen for 7 seconds." },
  { title: "Tab switch detected", severity: "Critical", detail: "Browser focus changed during active assessment." },
  { title: "Head pose deviation", severity: "Warning", detail: "Head angle exceeded review threshold." },
  { title: "Audio anomaly", severity: "Critical", detail: "Unexpected background voice detected in the session." },
];

export function ProctorInteractiveDemo() {
  const [started, setStarted] = useState(false);
  const [filter, setFilter] = useState<Filter>("All");
  const [selected, setSelected] = useState(evidenceEvents[0]);
  const visibleEvents = filter === "All" ? evidenceEvents : evidenceEvents.filter((event) => event.severity === filter);
  const risk = started ? 78 : 42;

  return (
    <div className="grid gap-6">
      <div className="glass-panel rounded-3xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mono-label">Session Control</p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-white">{started ? "Monitoring session active" : "Ready to simulate a session"}</h2>
          </div>
          <button onClick={() => setStarted((value) => !value)} className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-3 text-sm font-semibold text-white shadow-glow">
            <Play size={17} /> {started ? "Pause Demo Session" : "Start Demo Session"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-panel rounded-3xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-2xl font-bold text-white">Monitoring Panel</h2>
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 font-mono text-xs text-cyan-100">00:{started ? "48" : "00"}</span>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-[1fr_0.78fr]">
            <div className="relative min-h-80 overflow-hidden rounded-3xl border border-cyan-300/20 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.22),transparent_56%)] p-5">
              <div className={cn("absolute inset-x-6 top-1/2 h-px bg-cyan-200/50 shadow-[0_0_28px_rgba(34,211,238,0.7)]", started && "animate-pulse")} />
              <Shield className="text-cyan-200" />
              <div className="absolute bottom-5 left-5 right-5 grid gap-2">
                {["Face Detection", "Eye Tracking", "Head Pose", "Phone Detection", "Audio Anomaly", "Tab Switches"].map((chip, index) => (
                  <span key={chip} className={`rounded-full border px-3 py-1.5 text-xs ${index % 3 === 1 ? "border-violet-300/25 bg-violet-400/10 text-violet-100" : "border-cyan-300/20 bg-cyan-300/10 text-cyan-50"}`}>
                    {chip}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid gap-3">
              <div className="rounded-3xl border border-violet-300/20 bg-violet-400/10 p-4">
                <p className="text-sm text-violet-100">Risk Score</p>
                <p className="mt-2 font-heading text-5xl font-bold text-white">{risk}</p>
              </div>
              {demoData.proctorai.metrics.slice(1, 5).map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white/[0.05] px-4 py-3 text-sm text-slate-300">
                  <span className="text-slate-100">{label}:</span> {value}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-5">
          <h2 className="font-heading text-2xl font-bold text-white">Instructor Review</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {(["All", "Warning", "Critical"] as Filter[]).map((item) => (
              <button key={item} onClick={() => setFilter(item)} className={cn("rounded-full border px-3 py-1.5 text-xs transition", filter === item ? "border-cyan-300/45 bg-cyan-300/10 text-cyan-50" : "border-white/10 text-slate-400 hover:text-white")}>
                {item}
              </button>
            ))}
          </div>
          <div className="mt-5 grid gap-3">
            {visibleEvents.map((event) => (
              <button key={event.title} onClick={() => setSelected(event)} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-left text-sm text-slate-300 transition hover:border-cyan-300/35 hover:text-white">
                <span className={event.severity === "Critical" ? "text-violet-200" : "text-cyan-200"}>{event.severity}</span> - {event.title}
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm leading-7 text-cyan-50">
            <strong>{selected.title}:</strong> {selected.detail}
          </div>
          <ButtonLink href="#" className="mt-4" available={false} unavailableLabel="Mock Report Preview">
            <Download size={16} /> Preview Report
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

const devices = [
  { name: "Router Lahore-03", status: "Critical", technician: "Unassigned", sla: 62 },
  { name: "Switch Floor-2", status: "Online", technician: "Ayesha", sla: 94 },
  { name: "Firewall Edge-1", status: "Critical", technician: "Hamza", sla: 71 },
  { name: "Backup Link-4", status: "Offline", technician: "Unassigned", sla: 48 },
];

export function TeletrackInteractiveDemo() {
  const [filter, setFilter] = useState<"All" | "Online" | "Offline" | "Critical">("All");
  const [selected, setSelected] = useState(devices[0]);
  const visible = filter === "All" ? devices : devices.filter((device) => device.status === filter);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-4">
        {demoData.teletrack.metrics.slice(0, 4).map(([label, value]) => (
          <div key={label} className="glass-panel rounded-3xl p-5">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-2 font-heading text-3xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="glass-panel rounded-3xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-2xl font-bold text-white">Device Operations</h2>
            <div className="flex flex-wrap gap-2">
              {(["All", "Online", "Offline", "Critical"] as const).map((item) => (
                <button key={item} onClick={() => setFilter(item)} className={cn("rounded-full border px-3 py-1.5 text-xs", filter === item ? "border-cyan-300/45 bg-cyan-300/10 text-cyan-50" : "border-white/10 text-slate-400 hover:text-white")}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5 overflow-hidden rounded-3xl border border-white/10">
            {visible.map((device) => (
              <button key={device.name} onClick={() => setSelected(device)} className="grid w-full gap-3 border-b border-white/10 bg-white/[0.03] p-4 text-left text-sm text-slate-300 transition last:border-b-0 hover:bg-cyan-300/5 md:grid-cols-[1fr_0.45fr_0.55fr]">
                <span className="font-semibold text-white">{device.name}</span>
                <span>{device.status}</span>
                <span>{device.technician}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-5">
          <div className="glass-panel rounded-3xl p-5">
            <h2 className="font-heading text-2xl font-bold text-white">Topology</h2>
            <div className="relative mt-5 h-64 rounded-3xl border border-cyan-300/20 bg-cyan-300/10">
              {[[18, 24], [52, 20], [75, 46], [32, 66], [62, 75]].map(([x, y], index) => (
                <button key={index} className="absolute grid h-12 w-12 place-items-center rounded-full border border-cyan-200/40 bg-slate-950 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.45)] transition hover:scale-110" style={{ left: `${x}%`, top: `${y}%` }} data-cursor-label="Node">
                  <Network size={18} />
                </button>
              ))}
            </div>
          </div>
          <div className="glass-panel rounded-3xl p-5">
            <h2 className="font-heading text-2xl font-bold text-white">Alert Details</h2>
            <p className="mt-3 text-slate-300">{selected.name} is assigned to {selected.technician}. SLA progress is {selected.sla}%.</p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${selected.sla}%` }} />
            </div>
            <button onClick={() => setSelected({ ...selected, technician: "Assigned to Zain" })} className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-50">
              <UserCheck size={16} /> Assign Technician
            </button>
          </div>
        </div>
      </div>
      <div className="glass-panel rounded-3xl p-5">
        <h2 className="font-heading text-2xl font-bold text-white">Audit Log Timeline</h2>
        <div className="mt-4 grid gap-3">
          {demoData.teletrack.events.map((event) => (
            <div key={event} className="flex items-center gap-3 rounded-2xl bg-white/[0.05] p-3 text-sm text-slate-300">
              <Activity size={16} className="text-cyan-200" /> {event}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MirrorMindInteractiveDemo() {
  const data = demoData.mirrormind;
  const [input, setInput] = useState(data.input);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedNode, setSelectedNode] = useState("Claim");

  const analyze = () => {
    setAnalyzing(true);
    window.setTimeout(() => setAnalyzing(false), 650);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="glass-panel rounded-3xl p-5">
        <h2 className="font-heading text-2xl font-bold text-white">Opinion Input</h2>
        <textarea value={input} onChange={(event) => setInput(event.target.value)} rows={6} className="mt-4 w-full resize-none rounded-3xl border border-white/10 bg-white/[0.04] p-5 leading-8 text-slate-200 outline-none focus:border-cyan-300/45" />
        <button onClick={analyze} className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-3 text-sm font-semibold text-white shadow-glow">
          <Send size={16} /> {analyzing ? "Analyzing..." : "Analyze Argument"}
        </button>
        <div className="mt-5 rounded-2xl border border-violet-300/20 bg-violet-400/10 p-4">
          <p className="font-mono text-xs uppercase tracking-wider text-violet-100">Reasoning Risk</p>
          <p className="mt-2 font-heading text-3xl font-bold text-white">{analyzing ? "Reviewing" : "Medium"}</p>
        </div>
      </div>
      <div className="grid gap-5">
        <div className="glass-panel rounded-3xl p-5">
          <h2 className="font-heading text-2xl font-bold text-white">Argument Map</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {["Claim", "Assumptions", "Evidence Gaps"].map((node) => (
              <button key={node} onClick={() => setSelectedNode(node)} className={cn("rounded-2xl border p-4 text-sm transition", selectedNode === node ? "border-cyan-300/45 bg-cyan-300/10 text-cyan-50" : "border-white/10 bg-white/[0.04] text-slate-300 hover:text-white")}>
                {node}
              </button>
            ))}
          </div>
          <p className="mt-4 rounded-2xl bg-white/[0.05] p-4 text-sm leading-7 text-slate-300">
            Selected node: <span className="text-cyan-100">{selectedNode}</span>. This mock map shows how the product separates claims from supporting reasoning.
          </p>
        </div>
        <Panel title="Hidden Assumptions" icon={<Eye />} items={data.assumptions} />
        <Panel title="Evidence Gaps" icon={<BarChart3 />} items={data.gaps} />
        <div className="glass-panel rounded-3xl p-5">
          <h2 className="font-heading text-2xl font-bold text-white">Counterargument</h2>
          <p className="mt-4 leading-8 text-slate-300">{data.counterargument}</p>
          <p className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm text-cyan-50">Report preview: strengthen the claim with evidence, address privacy risks, and define responsible classroom use.</p>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, icon, items }: { title: string; icon: ReactNode; items: string[] }) {
  return (
    <div className="glass-panel rounded-3xl p-5">
      <h2 className="flex items-center gap-3 font-heading text-2xl font-bold text-white">
        <span className="text-cyan-200">{icon}</span> {title}
      </h2>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/[0.05] p-3 text-sm text-slate-300">
            <CheckCircle2 size={16} className="text-emerald-300" /> {item}
          </div>
        ))}
      </div>
    </div>
  );
}
