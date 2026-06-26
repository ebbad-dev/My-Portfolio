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
      <div className="absolute left-1/2 top-[42%] h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-[36%] border border-cyan-200/25 bg-cyan-200/10 shadow-[0_0_38px_rgba(34,211,238,0.24)]" />
      {!compact ? (
        <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-cyan-300/14 bg-slate-950/52 p-3">
          <div className="h-2 w-2/3 rounded-full bg-cyan-200/35" />
          <div className="mt-3 h-1.5 rounded-full bg-white/8">
            <div className="h-full w-2/3 rounded-full bg-[linear-gradient(90deg,#22d3ee,#60a5fa,#8b5cf6)]" />
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
