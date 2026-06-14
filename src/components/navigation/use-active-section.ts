"use client";

import { useEffect, useState } from "react";

const ACTIVE_FOCUS_RATIO = 0.42;

export function useActiveSection<T extends string>(sectionIds: readonly T[]) {
  const [active, setActive] = useState<T>(sectionIds[0]);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      if (window.scrollY < 80) {
        setActive(sectionIds[0]);
        frame = 0;
        return;
      }

      const scrollBottom = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      if (documentHeight - scrollBottom < 80) {
        setActive(sectionIds[sectionIds.length - 1]);
        frame = 0;
        return;
      }

      const focusPosition = window.scrollY + window.innerHeight * ACTIVE_FOCUS_RATIO;
      const orderedSections = sectionIds
        .map((id) => {
          const element = document.getElementById(id);
          if (!element) return null;

          return {
            id,
            top: element.getBoundingClientRect().top + window.scrollY,
          };
        })
        .filter((section): section is { id: T; top: number } => Boolean(section))
        .sort((a, b) => a.top - b.top);

      let nextActive = orderedSections[0]?.id ?? sectionIds[0];

      for (const section of orderedSections) {
        if (section.top > focusPosition) break;
        nextActive = section.id;
      }

      setActive((current) => (current === nextActive ? current : nextActive));
      frame = 0;
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [sectionIds]);

  return active;
}
