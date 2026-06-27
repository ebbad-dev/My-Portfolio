"use client";

import dynamic from "next/dynamic";

export const DynamicAskEbbad = dynamic(() => import("@/components/home/ask-ebbad").then((module) => module.AskEbbad), {
  ssr: false,
  loading: () => (
    <div className="ask-console glass-panel flex h-full min-h-0 flex-1 flex-col rounded-[1.35rem] p-3 text-sm text-slate-400">
      <div className="mb-3 h-10 rounded-2xl border border-white/10 bg-white/[0.04]" />
      <div className="chat-scrollbar min-h-0 flex-1 rounded-2xl border border-white/10 bg-slate-950/62 p-3">
        <div className="h-16 max-w-[78%] rounded-2xl border border-cyan-300/10 bg-white/[0.05]" />
      </div>
      <div className="mt-3 h-10 rounded-full border border-white/10 bg-white/[0.04]" />
    </div>
  ),
});
