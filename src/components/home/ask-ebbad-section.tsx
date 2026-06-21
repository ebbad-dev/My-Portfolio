"use client";

import { useState } from "react";
import { ArrowUpRight, Bot, Sparkles } from "lucide-react";
import { AskEbbad } from "@/components/home/ask-ebbad";
import { DynamicAskEbbadRobot } from "@/components/home/dynamic-islands";
import type { AskRobotStatus } from "@/components/ask/types";

const prompts = [
  "What is your strongest project?",
  "What roles are you open to?",
  "Explain TeleTrack Enterprise.",
  "What is your tech stack?",
  "How can I contact you?",
] as const;

export function AskEbbadSection() {
  const [robotStatus, setRobotStatus] = useState<AskRobotStatus>("idle");

  return (
    <div className="grid items-stretch gap-5 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="relative">
        <DynamicAskEbbadRobot status={robotStatus} />
      </div>
      <div className="grid gap-5">
        <div className="glass-panel premium-card rounded-3xl p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mono-label">Portfolio Assistant</p>
              <h3 className="mt-3 flex items-center gap-3 font-heading text-3xl font-bold text-white">
                <Bot className="text-cyan-200" /> Ask Ebbad
              </h3>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-bold text-cyan-100">
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
              Portfolio Guide Online
            </span>
          </div>
          <p className="mt-4 max-w-2xl leading-7 text-slate-300">
            An interactive portfolio guide that answers questions about my projects, skills, resume, availability, and contact details.
          </p>
          <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-slate-400">
            <Sparkles className="mt-1 shrink-0 text-violet-200" size={16} />
            Powered by curated portfolio knowledge, designed to help recruiters and collaborators find answers faster.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {prompts.map((prompt) => (
              <a
                key={prompt}
                href="#ask-ebbad-chat"
                className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:text-white"
              >
                {prompt}
                <ArrowUpRight size={13} className="text-cyan-200 opacity-70 transition group-hover:opacity-100" />
              </a>
            ))}
          </div>
        </div>
        <div id="ask-ebbad-chat">
          <AskEbbad onStatusChange={setRobotStatus} />
        </div>
      </div>
    </div>
  );
}
