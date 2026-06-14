"use client";

import { useEffect, useState } from "react";
import { PORTFOLIO_SECTIONS, type PortfolioSectionId } from "@/data/portfolioSections";

const ACTIVATION_RATIO = 0.42;
const EDGE_THRESHOLD = 80;

type ActiveSectionState = {
  activeId: PortfolioSectionId;
  activeIndex: number;
  progress: number;
  foundIds: PortfolioSectionId[];
  missingIds: PortfolioSectionId[];
  debugEnabled: boolean;
};

const initialState: ActiveSectionState = {
  activeId: PORTFOLIO_SECTIONS[0].id,
  activeIndex: 0,
  progress: 0,
  foundIds: [],
  missingIds: [],
  debugEnabled: false,
};

function getSectionState(debugEnabled: boolean): ActiveSectionState {
  const measuredSections = PORTFOLIO_SECTIONS.map((section, index) => {
    const element = document.getElementById(section.id);
    if (!element) {
      return {
        id: section.id,
        index,
        element: null,
        top: 0,
      };
    }

    const rect = element.getBoundingClientRect();

    return {
      id: section.id,
      index,
      element,
      top: rect.top + window.scrollY,
    };
  });

  const foundIds = measuredSections.filter((section) => section.element).map((section) => section.id);
  const missingIds = measuredSections.filter((section) => !section.element).map((section) => section.id);
  const lastIndex = PORTFOLIO_SECTIONS.length - 1;

  if (window.scrollY < EDGE_THRESHOLD) {
    return { activeId: PORTFOLIO_SECTIONS[0].id, activeIndex: 0, progress: 0, foundIds, missingIds, debugEnabled };
  }

  const scrollBottom = window.innerHeight + window.scrollY;
  const documentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
  if (scrollBottom >= documentHeight - EDGE_THRESHOLD) {
    return { activeId: PORTFOLIO_SECTIONS[lastIndex].id, activeIndex: lastIndex, progress: 1, foundIds, missingIds, debugEnabled };
  }

  const activationY = window.scrollY + window.innerHeight * ACTIVATION_RATIO;
  let activeIndex = 0;

  for (const section of measuredSections) {
    if (!section.element) continue;
    if (activationY >= section.top) {
      activeIndex = section.index;
    }
  }

  return {
    activeId: PORTFOLIO_SECTIONS[activeIndex].id,
    activeIndex,
    progress: lastIndex > 0 ? activeIndex / lastIndex : 0,
    foundIds,
    missingIds,
    debugEnabled,
  };
}

export function useActiveSection() {
  const [state, setState] = useState<ActiveSectionState>(initialState);

  useEffect(() => {
    let frame = 0;
    let missingSignature = "";
    const debugEnabled = process.env.NODE_ENV === "development" && new URLSearchParams(window.location.search).has("debugJourney");

    const update = () => {
      const nextState = getSectionState(debugEnabled);
      const nextMissingSignature = nextState.missingIds.join(",");

      if (process.env.NODE_ENV === "development" && nextMissingSignature && nextMissingSignature !== missingSignature) {
        nextState.missingIds.forEach((id) => {
          console.warn(`[JourneyLine] Missing section id: ${id}`);
        });
      }

      missingSignature = nextMissingSignature;
      setState((current) =>
        current.activeId === nextState.activeId &&
        current.activeIndex === nextState.activeIndex &&
        current.progress === nextState.progress &&
        current.foundIds.join(",") === nextState.foundIds.join(",") &&
        current.missingIds.join(",") === nextState.missingIds.join(",") &&
        current.debugEnabled === nextState.debugEnabled
          ? current
          : nextState,
      );
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
  }, []);

  return state;
}
