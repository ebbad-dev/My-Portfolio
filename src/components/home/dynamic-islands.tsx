"use client";

import dynamic from "next/dynamic";
import { PremiumRobotSkeleton } from "@/components/ask/premium-robot-skeleton";

export const DynamicSkillGlobe = dynamic(() => import("@/components/home/skill-globe").then((module) => module.SkillGlobe), {
  ssr: false,
  loading: () => (
    <div className="glass-panel hidden rounded-3xl p-8 text-sm text-slate-400 lg:block">
      <div className="mb-5 h-[430px] rounded-3xl border border-cyan-300/15 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.13),transparent_58%)]" />
      Preparing the 3D skill globe. Skills remain available in the list beside it.
    </div>
  ),
});

export const DynamicAskEbbad = dynamic(() => import("@/components/home/ask-ebbad").then((module) => module.AskEbbad), {
  ssr: false,
  loading: () => (
    <div className="glass-panel rounded-3xl p-8 text-sm text-slate-400">
      <div className="mb-5 flex flex-wrap gap-2">
        {["Who is Ebbad?", "Show me his best projects", "How can I contact him?"].map((prompt) => (
          <span key={prompt} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300">{prompt}</span>
        ))}
      </div>
      Ask Ebbad is getting ready. The floating chat button is available anytime.
    </div>
  ),
});

export const DynamicAskEbbadRobot = dynamic(() => import("@/components/ask/ask-ebbad-robot").then((module) => module.AskEbbadRobot), {
  ssr: false,
  loading: () => <PremiumRobotSkeleton />,
});
