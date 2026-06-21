import { cn } from "@/lib/utils";
import type { AskCoreStatus } from "@/components/ask/types";

export function IntelligenceCoreAvatar({ status = "idle", compact = false }: { status?: AskCoreStatus; compact?: boolean }) {
  return (
    <span
      className={cn(
        "core-avatar relative grid shrink-0 place-items-center overflow-hidden rounded-2xl border border-cyan-300/25 bg-slate-950/80 shadow-[0_0_22px_rgba(34,211,238,0.16)]",
        compact ? "h-9 w-9" : "h-11 w-11",
        status === "thinking" && "core-avatar-thinking",
        status === "success" && "core-avatar-success",
      )}
      aria-hidden="true"
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_48%_42%,rgba(34,211,238,0.35),transparent_42%),radial-gradient(circle_at_68%_70%,rgba(139,92,246,0.28),transparent_48%)]" />
      <span className="relative h-[62%] w-[62%] rounded-full border border-cyan-100/30 bg-[radial-gradient(circle_at_35%_30%,rgba(236,254,255,0.9),rgba(34,211,238,0.5)_14%,rgba(14,165,233,0.22)_38%,rgba(15,23,42,0.92)_70%)] shadow-[0_0_18px_rgba(34,211,238,0.45),inset_0_0_18px_rgba(139,92,246,0.2)]" />
      <span className="absolute h-[76%] w-[76%] rounded-full border border-violet-300/18" />
    </span>
  );
}
