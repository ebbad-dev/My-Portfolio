import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

export function PremiumRobotSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "robot-panel relative isolate overflow-hidden rounded-3xl border border-cyan-300/15 bg-slate-950/72",
        compact ? "grid h-10 w-10 place-items-center rounded-2xl" : "min-h-[26rem] p-6",
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_64%_68%,rgba(139,92,246,0.14),transparent_40%)]" />
      {compact ? (
        <Bot size={18} className="relative text-cyan-100" />
      ) : (
        <div className="relative flex min-h-[23rem] flex-col items-center justify-center text-center">
          <div className="h-36 w-44 animate-pulse rounded-[2.25rem] border border-cyan-300/20 bg-white/[0.06] shadow-[0_0_55px_rgba(34,211,238,0.16)]" />
          <div className="mt-6 h-4 w-44 rounded-full bg-cyan-300/15" />
          <p className="mt-5 font-mono text-xs uppercase tracking-[0.18em] text-cyan-100">AI guide loading</p>
        </div>
      )}
    </div>
  );
}
