"use client";

import { useEffect, useRef, useState } from "react";
import { PORTFOLIO_SECTIONS, type PortfolioSectionId } from "@/data/portfolioSections";

const ACTIVATION_RATIO = 0.42;
const EDGE_THRESHOLD = 80;
const DIRECTION_EPSILON = 1;
const MIN_SECTION_ENTRY = 64;
const MAX_SECTION_ENTRY = 140;

type ActiveSectionState = {
  activeId: PortfolioSectionId;
  activeIndex: number;
  progress: number;
  foundIds: PortfolioSectionId[];
  missingIds: PortfolioSectionId[];
  debugEnabled: boolean;
};

type ScrollDirection = "down" | "up" | "still" | "layout" | "jump";

const initialState: ActiveSectionState = {
  activeId: PORTFOLIO_SECTIONS[0].id,
  activeIndex: 0,
  progress: 0,
  foundIds: [],
  missingIds: [],
  debugEnabled: false,
};

function getSectionState(debugEnabled: boolean, previousIndex: number, direction: ScrollDirection, initialized: boolean): ActiveSectionState {
  const measuredSections = PORTFOLIO_SECTIONS.map((section, index) => {
    const element = document.getElementById(section.id);
    if (!element) {
      return {
        id: section.id,
        index,
        element: null,
        top: 0,
        bottom: 0,
        height: 0,
      };
    }

    const rect = element.getBoundingClientRect();

    return {
      id: section.id,
      index,
      element,
      top: rect.top + window.scrollY,
      bottom: rect.bottom + window.scrollY,
      height: rect.height,
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
  let rawIndex = 0;

  for (const section of measuredSections) {
    if (!section.element) continue;
    const entryOffset = section.index === 0 ? 0 : Math.min(MAX_SECTION_ENTRY, Math.max(MIN_SECTION_ENTRY, section.height * 0.18));

    if (activationY >= section.top + entryOffset) {
      rawIndex = section.index;
    }
  }

  let activeIndex = rawIndex;

  if (initialized) {
    if (direction === "down") {
      activeIndex = rawIndex < previousIndex ? previousIndex : Math.min(rawIndex, previousIndex + 1);
    } else if (direction === "up") {
      activeIndex = rawIndex > previousIndex ? previousIndex : Math.max(rawIndex, previousIndex - 1);
    } else if (direction === "layout" || direction === "still") {
      activeIndex = previousIndex;
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
  const activeIndexRef = useRef(initialState.activeIndex);
  const initializedRef = useRef(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    let frame = 0;
    let missingSignature = "";
    const debugEnabled = process.env.NODE_ENV === "development" && new URLSearchParams(window.location.search).has("debugJourney");

    const update = (direction: ScrollDirection) => {
      const nextState = getSectionState(debugEnabled, activeIndexRef.current, direction, initializedRef.current);
      const nextMissingSignature = nextState.missingIds.join(",");

      if (process.env.NODE_ENV === "development" && nextMissingSignature && nextMissingSignature !== missingSignature) {
        nextState.missingIds.forEach((id) => {
          console.warn(`[JourneyLine] Missing section id: ${id}`);
        });
      }

      missingSignature = nextMissingSignature;
      activeIndexRef.current = nextState.activeIndex;
      initializedRef.current = true;
      lastScrollYRef.current = window.scrollY;
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

    const requestUpdate = (direction: ScrollDirection) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => update(direction));
    };

    const handleScroll = () => {
      const delta = window.scrollY - lastScrollYRef.current;
      const direction: ScrollDirection =
        Math.abs(delta) > window.innerHeight * 0.7 ? "jump" : delta > DIRECTION_EPSILON ? "down" : delta < -DIRECTION_EPSILON ? "up" : "still";
      requestUpdate(direction);
    };

    const handleResize = () => requestUpdate("layout");

    update("still");
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return state;
}
