import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export function PremiumParticles({ className }: { className?: string }) {
  return (
    <div className={cn("premium-particles", className)} aria-hidden="true">
      {Array.from({ length: 12 }).map((_, index) => (
        <span key={index} style={{ "--i": index } as CSSProperties} />
      ))}
    </div>
  );
}
