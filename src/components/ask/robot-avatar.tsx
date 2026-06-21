import { cn } from "@/lib/utils";
import type { AskRobotStatus } from "@/components/ask/types";

export function RobotAvatar({ status = "idle", compact = false }: { status?: AskRobotStatus; compact?: boolean }) {
  return (
    <span
      className={cn(
        "robot-avatar relative grid shrink-0 place-items-center overflow-hidden rounded-2xl border border-cyan-300/25 bg-slate-950/80 shadow-[0_0_22px_rgba(34,211,238,0.16)]",
        compact ? "h-9 w-9" : "h-11 w-11",
        status === "thinking" && "robot-avatar-thinking",
        status === "success" && "robot-avatar-success",
      )}
      aria-hidden="true"
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,0.25),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.2),transparent_44%)]" />
      <span className="relative h-[62%] w-[70%] rounded-[40%] border border-cyan-100/30 bg-slate-950 shadow-[inset_0_0_18px_rgba(34,211,238,0.18)]">
        <span className="absolute left-[22%] top-[32%] h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
        <span className="absolute right-[22%] top-[32%] h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
        <span className="absolute bottom-[24%] left-1/2 h-1 w-7 -translate-x-1/2 rounded-full bg-cyan-300/80 shadow-[0_0_12px_rgba(34,211,238,0.7)]" />
      </span>
    </span>
  );
}
