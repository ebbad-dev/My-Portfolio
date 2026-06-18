"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Gauge,
  Network,
  Pause,
  Play,
  RefreshCw,
  Search,
  Send,
  Shield,
  UserCheck,
  X,
} from "lucide-react";
import { demoData } from "@/data/site";
import { cn } from "@/lib/utils";

type Severity = "Warning" | "Critical";
type EventFilter = "All" | Severity;

const proctorEventPool: Array<{ title: string; severity: Severity; detail: string; delta: number }> = [
  { title: "Eye movement warning", severity: "Warning", detail: "Candidate looked away from screen for 7 seconds.", delta: 6 },
  { title: "Tab switch detected", severity: "Critical", detail: "Browser focus changed during active assessment.", delta: 14 },
  { title: "Head pose deviation", severity: "Warning", detail: "Head angle exceeded review threshold.", delta: 5 },
  { title: "Audio anomaly", severity: "Critical", detail: "Unexpected background voice detected in the session.", delta: 12 },
  { title: "Phone-like object flagged", severity: "Critical", detail: "A rectangular object entered the camera frame.", delta: 11 },
];

const detectionChips = ["Face Detection", "Eye Tracking", "Head Pose", "Phone Detection", "Audio Anomaly", "Tab Switches"];

export function ProctorInteractiveDemo() {
  const [status, setStatus] = useState<"idle" | "running" | "paused">("idle");
  const [elapsed, setElapsed] = useState(0);
  const [risk, setRisk] = useState(34);
  const [filter, setFilter] = useState<EventFilter>("All");
  const [events, setEvents] = useState(proctorEventPool.slice(0, 2));
  const [selected, setSelected] = useState(proctorEventPool[0]);
  const [reportOpen, setReportOpen] = useState(false);
  const [riskHistory, setRiskHistory] = useState([34, 42, 38, 49]);
  const eventCursor = useRef(2);

  useEffect(() => {
    if (status !== "running") return;
    const timer = window.setInterval(() => {
      setElapsed((value) => value + 3);
      setEvents((current) => {
        const next = proctorEventPool[eventCursor.current % proctorEventPool.length];
        eventCursor.current += 1;
        setSelected(next);
        setRisk((score) => {
          const updated = Math.max(24, Math.min(94, score + next.delta - 4));
          setRiskHistory((history) => [...history, updated].slice(-10));
          return updated;
        });
        return [next, ...current].slice(0, 6);
      });
    }, 1600);
    return () => window.clearInterval(timer);
  }, [status]);

  const visibleEvents = filter === "All" ? events : events.filter((event) => event.severity === filter);
  const criticalCount = events.filter((event) => event.severity === "Critical").length;
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const seconds = String(elapsed % 60).padStart(2, "0");

  const reset = () => {
    setStatus("idle");
    setElapsed(0);
    setRisk(34);
    setRiskHistory([34, 42, 38, 49]);
    setEvents(proctorEventPool.slice(0, 2));
    setSelected(proctorEventPool[0]);
    eventCursor.current = 2;
    setReportOpen(false);
  };

  return (
    <div className="grid gap-5">
      <DemoHeader
        label="Interactive Portfolio Demo"
        title={status === "running" ? "Monitoring session active" : status === "paused" ? "Session paused for review" : "Ready to simulate a session"}
        note="Demo uses mock data to show the product flow."
        actions={
          <>
            <button onClick={() => setStatus("running")} className="demo-action-primary"><Play size={16} /> Start Demo Session</button>
            <button onClick={() => setStatus("paused")} className="demo-action"><Pause size={16} /> Pause</button>
            <button onClick={reset} className="demo-action"><RefreshCw size={16} /> Reset</button>
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1.22fr_0.78fr]">
        <div className="glass-panel rounded-3xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-2xl font-bold text-white">Live Monitoring Panel</h2>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 font-mono text-xs text-cyan-100"><Clock size={14} /> {minutes}:{seconds}</span>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-[1fr_0.75fr]">
            <div className="relative min-h-72 overflow-hidden rounded-3xl border border-cyan-300/20 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.2),transparent_58%)] p-5">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.08),transparent)]" />
              <div className={cn("absolute inset-x-6 top-1/2 h-px bg-cyan-200/60 shadow-[0_0_28px_rgba(34,211,238,0.75)]", status === "running" && "animate-pulse")} />
              <div className={cn("absolute left-0 top-0 h-full w-20 bg-cyan-200/10 blur-xl transition", status === "running" ? "translate-x-[620%] duration-[1700ms]" : "translate-x-0")} />
              <Shield className="relative text-cyan-200" />
              <p className="relative mt-4 max-w-sm text-sm leading-7 text-slate-300">Simulated webcam and browser monitoring view. Scanning overlay, event chips, and score react after the session starts.</p>
              <div className="absolute bottom-5 left-5 right-5 grid gap-2 sm:grid-cols-2">
                {detectionChips.map((chip, index) => {
                  const active = status === "running" && (index + elapsed) % 3 !== 0;
                  const critical = chip.includes("Phone") || chip.includes("Tab") || chip.includes("Audio");
                  return (
                    <button key={chip} onClick={() => setSelected(proctorEventPool[index % proctorEventPool.length])} className={cn("rounded-full border px-3 py-1.5 text-left text-xs transition", active ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-50" : critical ? "border-violet-300/25 bg-violet-400/10 text-violet-100" : "border-white/10 bg-white/[0.04] text-slate-300")}>
                      {chip}: {active ? "Clear" : critical ? "Review" : "Idle"}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="grid gap-3">
              <MetricCard label="Risk Score" value={risk} tone={risk > 70 ? "critical" : "normal"} />
              <MetricCard label="Critical Events" value={criticalCount} tone={criticalCount ? "critical" : "normal"} />
              <MetricCard label="Evidence Clips" value={events.length} tone="normal" />
              <MetricCard label="Review State" value={status === "idle" ? "Idle" : status === "paused" ? "Paused" : "Live"} tone="normal" />
              <div className="rounded-3xl border border-cyan-300/15 bg-cyan-300/[0.07] p-4">
                <p className="text-sm text-slate-400">Risk Trend</p>
                <div className="mt-4 flex h-20 items-end gap-1.5" aria-label="Mock risk trend chart">
                  {riskHistory.map((point, index) => (
                    <span
                      key={`${point}-${index}`}
                      className="flex-1 rounded-t-full bg-brand-gradient shadow-[0_0_18px_rgba(34,211,238,0.18)] transition-all"
                      style={{ height: `${Math.max(16, point)}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-5">
          <h2 className="font-heading text-2xl font-bold text-white">Instructor Review</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {(["All", "Warning", "Critical"] as EventFilter[]).map((item) => (
              <FilterButton key={item} active={filter === item} onClick={() => setFilter(item)}>{item}</FilterButton>
            ))}
          </div>
          <div className="mt-5 grid gap-3">
            {visibleEvents.map((event, index) => (
              <button key={`${event.title}-${index}`} onClick={() => setSelected(event)} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-left text-sm text-slate-300 transition hover:border-cyan-300/35 hover:text-white">
                <span className={event.severity === "Critical" ? "text-violet-200" : "text-cyan-200"}>{event.severity}</span> - {event.title}
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm leading-7 text-cyan-50">
            <strong>{selected.title}:</strong> {selected.detail}
          </div>
          <div className="mt-4 grid gap-2">
            {events.slice(0, 3).map((event, index) => (
              <button
                key={`${event.title}-evidence-${index}`}
                onClick={() => setSelected(event)}
                className="grid grid-cols-[2.5rem_1fr] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-left text-sm text-slate-300 transition hover:border-cyan-300/35 hover:text-white"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-300/10 font-mono text-xs text-cyan-100">E{index + 1}</span>
                <span>
                  <span className="block font-semibold text-slate-100">{event.title}</span>
                  <span className="text-xs text-slate-500">Mock evidence preview captured for instructor review</span>
                </span>
              </button>
            ))}
          </div>
          <button onClick={() => setReportOpen(true)} className="demo-action-primary mt-4"><FileText size={16} /> Generate Report</button>
        </div>
      </div>

      {reportOpen ? (
        <DemoModal title="Mock ProctorAI Report" onClose={() => setReportOpen(false)}>
          <p>Risk score: {risk}. Critical events: {criticalCount}. Session duration: {minutes}:{seconds}.</p>
          <p className="mt-3">Recommendation: {criticalCount > 1 ? "Instructor review recommended before accepting the attempt." : "Low manual review priority with normal evidence sampling."}</p>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {["Evidence", "Timeline", "Decision"].map((item) => (
              <div key={item} className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.07] p-3 text-sm text-cyan-50">
                {item} ready
              </div>
            ))}
          </div>
        </DemoModal>
      ) : null}
    </div>
  );
}

type DeviceStatus = "Online" | "Offline" | "Critical";
type Device = { name: string; status: DeviceStatus; technician: string; sla: number; incident: "Open" | "Assigned" | "Monitoring" };

const initialDevices: Device[] = [
  { name: "Router Lahore-03", status: "Critical", technician: "Unassigned", sla: 62, incident: "Open" },
  { name: "Switch Floor-2", status: "Online", technician: "Ayesha", sla: 94, incident: "Monitoring" },
  { name: "Firewall Edge-1", status: "Critical", technician: "Hamza", sla: 71, incident: "Assigned" },
  { name: "Backup Link-4", status: "Offline", technician: "Unassigned", sla: 48, incident: "Open" },
];

export function TeletrackInteractiveDemo() {
  const [filter, setFilter] = useState<"All" | DeviceStatus>("All");
  const [query, setQuery] = useState("");
  const [devices, setDevices] = useState(initialDevices);
  const [selectedName, setSelectedName] = useState(initialDevices[0].name);
  const [audit, setAudit] = useState(demoData.teletrack.events);
  const selected = devices.find((device) => device.name === selectedName) || devices[0];
  const visible = devices.filter((device) => (filter === "All" || device.status === filter) && device.name.toLowerCase().includes(query.toLowerCase()));

  const updateSelected = (patch: Partial<Device>, log: string) => {
    setDevices((current) => current.map((device) => (device.name === selected.name ? { ...device, ...patch } : device)));
    setAudit((current) => [log, ...current].slice(0, 6));
  };

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Online Devices" value={devices.filter((device) => device.status === "Online").length} tone="normal" />
        <MetricCard label="Critical Alerts" value={devices.filter((device) => device.status === "Critical").length} tone="critical" />
        <MetricCard label="Open Incidents" value={devices.filter((device) => device.incident === "Open").length} tone="critical" />
        <MetricCard label="Avg SLA" value={`${Math.round(devices.reduce((sum, device) => sum + device.sla, 0) / devices.length)}%`} tone="normal" />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="glass-panel rounded-3xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-2xl font-bold text-white">Device Operations</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search devices" className="rounded-full border border-white/10 bg-white/[0.04] py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-cyan-300/45" />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(["All", "Online", "Offline", "Critical"] as const).map((item) => (
              <FilterButton key={item} active={filter === item} onClick={() => setFilter(item)}>{item}</FilterButton>
            ))}
          </div>
          <div className="mt-5 overflow-hidden rounded-3xl border border-white/10">
            {visible.map((device) => (
              <button key={device.name} onClick={() => setSelectedName(device.name)} className={cn("grid w-full gap-3 border-b border-white/10 bg-white/[0.03] p-4 text-left text-sm text-slate-300 transition last:border-b-0 hover:bg-cyan-300/5 md:grid-cols-[1fr_0.38fr_0.48fr_0.42fr]", selected.name === device.name && "bg-cyan-300/[0.08]")}>
                <span className="font-semibold text-white">{device.name}</span>
                <span>{device.status}</span>
                <span>{device.technician}</span>
                <span>{device.incident}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-5">
          <div className="glass-panel rounded-3xl p-5">
            <h2 className="font-heading text-2xl font-bold text-white">Topology</h2>
            <div className="relative mt-5 h-64 overflow-hidden rounded-3xl border border-cyan-300/20 bg-cyan-300/10">
              <div className="absolute inset-8 rounded-full border border-cyan-300/10" />
              <div className="absolute inset-x-10 top-1/2 h-px bg-cyan-300/15" />
              <div className="absolute inset-y-10 left-1/2 w-px bg-blue-300/15" />
              {devices.map((device, index) => {
                const positions = [[18, 24], [52, 20], [75, 46], [32, 66]];
                const [x, y] = positions[index];
                return (
                  <button key={device.name} onClick={() => setSelectedName(device.name)} className={cn("absolute grid h-12 w-12 place-items-center rounded-full border bg-slate-950 shadow-[0_0_18px_rgba(34,211,238,0.35)] transition hover:scale-110 hover:shadow-[0_0_30px_rgba(34,211,238,0.42)]", selected.name === device.name ? "border-cyan-200 text-cyan-100" : "border-cyan-200/30 text-slate-300")} style={{ left: `${x}%`, top: `${y}%` }} data-cursor-label="Node">
                    <Network size={18} />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="glass-panel rounded-3xl p-5">
            <h2 className="font-heading text-2xl font-bold text-white">Alert Details</h2>
            <p className="mt-3 text-slate-300">{selected.name} is assigned to {selected.technician}. Incident is {selected.incident}.</p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-brand-gradient transition-all" style={{ width: `${selected.sla}%` }} />
            </div>
            <div className="mt-4 grid grid-cols-7 gap-1.5" aria-label="Mock seven point SLA history">
              {[86, selected.sla - 8, 91, selected.sla, 88, Math.min(100, selected.sla + 7), selected.sla].map((point, index) => (
                <span key={`${point}-${index}`} className="rounded-t-xl bg-cyan-300/55 shadow-[0_0_14px_rgba(34,211,238,0.18)]" style={{ height: `${Math.max(28, point * 0.72)}px` }} />
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => updateSelected({ technician: "Zain", incident: "Assigned" }, `${selected.name} assigned to Zain`)} className="demo-action"><UserCheck size={16} /> Assign Technician</button>
              <button onClick={() => updateSelected({ incident: "Monitoring", sla: Math.min(100, selected.sla + 10) }, `${selected.name} moved to monitoring`)} className="demo-action-primary"><Gauge size={16} /> Mark Monitoring</button>
            </div>
          </div>
        </div>
      </div>
      <div className="glass-panel rounded-3xl p-5">
        <h2 className="font-heading text-2xl font-bold text-white">Audit Log Timeline</h2>
        <div className="mt-4 grid gap-3">
          {audit.map((event) => (
            <div key={event} className="flex items-center gap-3 rounded-2xl bg-white/[0.05] p-3 text-sm text-slate-300">
              <Activity size={16} className="text-cyan-200" /> {event}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const mirrorSamples = [
  "AI proctoring should be required in all online exams because it stops cheating.",
  "Remote work is always more productive because employees avoid commuting.",
  "Universities should use AI tutors because students need instant feedback.",
];

export function MirrorMindInteractiveDemo() {
  const data = demoData.mirrormind;
  const [input, setInput] = useState(data.input);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(true);
  const [selectedNode, setSelectedNode] = useState("Claim");

  const riskScore = useMemo(() => {
    const strongWords = ["always", "all", "must", "never"];
    return Math.min(86, 42 + strongWords.filter((word) => input.toLowerCase().includes(word)).length * 11 + (input.length < 120 ? 8 : 0));
  }, [input]);

  const analyze = () => {
    setAnalyzing(true);
    setAnalyzed(false);
    window.setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
      setSelectedNode("Claim");
    }, 850);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="glass-panel rounded-3xl p-5">
        <h2 className="font-heading text-2xl font-bold text-white">Opinion Input</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {mirrorSamples.map((sample, index) => (
            <button key={sample} onClick={() => setInput(sample)} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-300/35 hover:text-white">
              Sample {index + 1}
            </button>
          ))}
        </div>
        <textarea value={input} onChange={(event) => setInput(event.target.value)} rows={7} className="mt-4 w-full resize-none rounded-3xl border border-white/10 bg-white/[0.04] p-5 leading-8 text-slate-200 outline-none focus:border-cyan-300/45" />
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={analyze} className="demo-action-primary"><Send size={16} /> {analyzing ? "Analyzing..." : "Analyze Argument"}</button>
          <button onClick={() => { setInput(data.input); setAnalyzed(true); setSelectedNode("Claim"); }} className="demo-action"><RefreshCw size={16} /> Reset Example</button>
        </div>
        <div className="mt-5 rounded-2xl border border-violet-300/20 bg-violet-400/10 p-4">
          <p className="font-mono text-xs uppercase tracking-wider text-violet-100">Reasoning Risk</p>
          <p className="mt-2 font-heading text-3xl font-bold text-white">{analyzing ? "Analyzing reasoning structure..." : `${riskScore}/100`}</p>
        </div>
      </div>
      <div className="grid gap-5">
        <div className="glass-panel rounded-3xl p-5">
          <h2 className="font-heading text-2xl font-bold text-white">Argument Map</h2>
          <div className="relative mt-4 grid gap-3 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-4 sm:grid-cols-4">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[82%] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent" />
            {["Claim", "Reasons", "Assumptions", "Evidence Gaps"].map((node) => (
              <button key={node} onClick={() => setSelectedNode(node)} className={cn("rounded-2xl border p-4 text-sm transition", selectedNode === node ? "border-cyan-300/45 bg-cyan-300/10 text-cyan-50" : "border-white/10 bg-white/[0.04] text-slate-300 hover:text-white")}>
                {node}
              </button>
            ))}
          </div>
          <p className="mt-4 rounded-2xl bg-white/[0.05] p-4 text-sm leading-7 text-slate-300">
            {analyzed ? nodeDetail(selectedNode, input) : "Run analysis to inspect reasoning nodes."}
          </p>
        </div>
        <Panel title="Hidden Assumptions" icon={<Eye />} items={data.assumptions} />
        <Panel title="Evidence Gaps" icon={<BarChart3 />} items={data.gaps} />
        <div className="glass-panel rounded-3xl p-5">
          <h2 className="font-heading text-2xl font-bold text-white">Counterargument + Improvement</h2>
          <p className="mt-4 leading-8 text-slate-300">{data.counterargument}</p>
          <p className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm leading-7 text-cyan-50">
            Suggested improvement: narrow the claim, add evidence, name the trade-offs, and explain when the idea should not be used.
          </p>
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-violet-100">Mock report preview</p>
            <div className="mt-3 grid gap-2">
              {["Claim clarity: medium", "Evidence strength: low", "Assumptions: visible", "Revision priority: high"].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-xl bg-white/[0.045] px-3 py-2 text-sm text-slate-300">
                  <CheckCircle2 size={15} className="text-cyan-200" /> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function nodeDetail(node: string, input: string) {
  if (node === "Claim") return `Main claim detected: "${input.slice(0, 115)}${input.length > 115 ? "..." : ""}"`;
  if (node === "Reasons") return "The reasoning depends on expected benefits, but it needs clearer evidence and boundaries.";
  if (node === "Assumptions") return "This argument assumes the solution works equally well for every user and context.";
  return "Evidence gaps include measurable outcomes, privacy impact, failure cases, and comparison with alternatives.";
}

function DemoHeader({ label, title, note, actions }: { label: string; title: string; note: string; actions: ReactNode }) {
  return (
    <div className="glass-panel rounded-3xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mono-label">{label}</p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-white">{title}</h2>
          <p className="mt-2 text-sm text-slate-400">{note}</p>
        </div>
        <div className="flex flex-wrap gap-2">{actions}</div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, tone }: { label: string; value: ReactNode; tone: "normal" | "critical" }) {
  return (
    <div className={cn("rounded-3xl border p-4", tone === "critical" ? "border-violet-300/20 bg-violet-400/10" : "border-cyan-300/15 bg-cyan-300/[0.07]")}>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 font-heading text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

function FilterButton({ active, children, onClick }: { active: boolean; children: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("rounded-full border px-3 py-1.5 text-xs transition", active ? "border-cyan-300/45 bg-cyan-300/10 text-cyan-50" : "border-white/10 text-slate-400 hover:text-white")}>
      {children}
    </button>
  );
}

function DemoModal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/72 p-4 backdrop-blur" role="dialog" aria-modal="true" aria-label={title} onMouseDown={onClose}>
      <div className="glass-panel max-w-lg rounded-3xl p-6" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-heading text-2xl font-bold text-white">{title}</h3>
          <button ref={closeRef} onClick={onClose} className="rounded-full border border-white/10 p-2 text-slate-300 hover:text-white" aria-label="Close report preview">
            <X size={18} />
          </button>
        </div>
        <div className="mt-4 text-sm leading-7 text-slate-300">{children}</div>
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
