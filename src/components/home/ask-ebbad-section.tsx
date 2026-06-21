"use client";

import { useState } from "react";
import { AskEbbad } from "@/components/home/ask-ebbad";
import { DynamicPortfolioIntelligenceCore } from "@/components/home/dynamic-islands";
import type { AskCoreStatus } from "@/components/ask/types";

export function AskEbbadSection() {
  const [coreStatus, setCoreStatus] = useState<AskCoreStatus>("idle");

  return (
    <div className="grid min-w-0 max-w-full items-stretch gap-5 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
      <div className="relative min-w-0 max-w-full overflow-hidden">
        <DynamicPortfolioIntelligenceCore status={coreStatus} />
      </div>
      <div id="ask-ebbad-chat" className="min-w-0 max-w-full">
        <AskEbbad onStatusChange={setCoreStatus} compactPanel />
      </div>
    </div>
  );
}
