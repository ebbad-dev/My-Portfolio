export function IntelligenceCoreSkeleton() {
  return (
    <div className="core-panel relative isolate h-[clamp(20rem,36vw,25rem)] min-w-0 max-w-full overflow-hidden rounded-3xl border border-cyan-300/15 bg-slate-950/72 p-4" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_68%_70%,rgba(139,92,246,0.14),transparent_42%)]" />
      <div className="relative flex h-full flex-col items-center justify-center text-center">
        <div className="h-40 w-40 animate-pulse rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] shadow-[0_0_60px_rgba(34,211,238,0.18)]" />
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.18em] text-cyan-100">Initializing portfolio intelligence</p>
      </div>
    </div>
  );
}
