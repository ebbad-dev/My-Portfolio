"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { AskCoreStatus } from "@/components/ask/types";
import { cn } from "@/lib/utils";

function AssistantAvatarFallback({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "ask-assistant-card relative min-w-0 max-w-full overflow-hidden rounded-3xl border border-cyan-300/15 bg-slate-950/70",
        compact ? "h-12 w-12 rounded-2xl" : "h-[clamp(21rem,38vw,27rem)] w-full",
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.24),transparent_44%),radial-gradient(circle_at_70%_68%,rgba(139,92,246,0.2),transparent_48%)]" />
      <div className="absolute inset-x-4 top-4 flex justify-between gap-3">
        <span className="h-6 w-24 rounded-full border border-cyan-300/16 bg-slate-950/54" />
        <span className="h-6 w-28 rounded-full border border-cyan-300/16 bg-slate-950/54" />
      </div>
      <div className="absolute left-1/2 top-[42%] h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-[36%] border border-cyan-200/20 bg-cyan-200/8 shadow-[0_0_38px_rgba(34,211,238,0.2)]" />
      {!compact ? (
        <div className="absolute inset-x-7 bottom-4 rounded-full border border-cyan-300/12 bg-slate-950/38 px-3 py-2">
          <div className="h-1.5 w-2/5 rounded-full bg-cyan-200/24" />
          <div className="mt-1.5 h-1 rounded-full bg-white/[0.06]">
            <div className="h-full w-3/5 rounded-full bg-[linear-gradient(90deg,#22d3ee,#60a5fa,#8b5cf6)]" />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export const DynamicAskAssistantAvatar = dynamic(
  () => import("@/components/ask/ask-assistant-avatar").then((module) => module.AskAssistantAvatar),
  {
    ssr: false,
    loading: () => <AssistantAvatarFallback />,
  },
) as ComponentType<{ status?: AskCoreStatus; compact?: boolean }>;
