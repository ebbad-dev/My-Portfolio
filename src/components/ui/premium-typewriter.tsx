"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type PremiumTypewriterProps = {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
};

function pauseFor(char: string, base: number) {
  if (char === "." || char === "!" || char === "?") return base + 170;
  if (char === "," || char === ";" || char === ":") return base + 105;
  if (char === "—" || char === "-") return base + 80;
  return base;
}

export function PremiumTypewriter({ text, delay = 420, speed = 22, className }: PremiumTypewriterProps) {
  const reduceMotion = useReducedMotion();
  const [visibleText, setVisibleText] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    let index = 0;
    let timeout = 0;

    const tick = () => {
      index += 1;
      setVisibleText(text.slice(0, index));

      if (index >= text.length) {
        timeout = window.setTimeout(() => setDone(true), 850);
        return;
      }

      timeout = window.setTimeout(tick, pauseFor(text[index - 1] || "", speed));
    };

    timeout = window.setTimeout(tick, delay);
    return () => window.clearTimeout(timeout);
  }, [delay, reduceMotion, speed, text]);

  const renderedText = reduceMotion ? text : visibleText;

  return (
    <span className={cn("relative block", className)} aria-label={text}>
      <span aria-hidden="true" className="invisible block">
        {text}
      </span>
      <span aria-hidden="true" className="absolute inset-0">
        {renderedText}
        {!reduceMotion ? (
          <span
            className={cn(
              "ml-1 inline-block h-[1.1em] w-[2px] translate-y-1 rounded-full bg-gradient-to-b from-cyan-200 via-blue-400 to-violet-400 shadow-[0_0_14px_rgba(34,211,238,0.45)]",
              done ? "animate-[caretFade_0.9s_ease_forwards]" : "animate-[caretBlink_1.1s_ease-in-out_infinite]",
            )}
          />
        ) : null}
      </span>
    </span>
  );
}
