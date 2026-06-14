"use client";

import { useEffect, useState } from "react";

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

      const focusY = window.innerHeight * 0.45;
      let closest = sectionIds[0];
      let closestDistance = Number.POSITIVE_INFINITY;
      let containing: T | null = null;

      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const containsFocusLine = rect.top <= focusY && rect.bottom >= focusY;
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - focusY);

        if (containsFocusLine && containing === null) {
          containing = id;
        }

        if (distance < closestDistance) {
          closest = id;
          closestDistance = distance;
        }
      });

      const nextActive = containing || closest;
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
