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
        compact ? "h-12 w-12 rounded-2xl" : "h-[clamp(11rem,24vw,15.5rem)] w-full",
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.24),transparent_44%),radial-gradient(circle_at_70%_68%,rgba(139,92,246,0.2),transparent_48%)]" />
      <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-[36%] border border-cyan-200/25 bg-cyan-200/10 shadow-[0_0_38px_rgba(34,211,238,0.24)]" />
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
