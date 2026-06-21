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
      <span className="relative h-[66%] w-[54%] border border-cyan-100/30 bg-[linear-gradient(145deg,rgba(236,254,255,0.68),rgba(34,211,238,0.38)_26%,rgba(139,92,246,0.28)_72%)] shadow-[0_0_18px_rgba(34,211,238,0.45),inset_0_0_18px_rgba(139,92,246,0.2)] [clip-path:polygon(50%_0,100%_27%,82%_100%,18%_100%,0_27%)]" />
      <span className="absolute h-[76%] w-[76%] rounded-[34%] border border-violet-300/18 rotate-45" />
    </span>
  );
}
