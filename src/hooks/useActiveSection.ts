"use client";

import { createContext, createElement, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { PORTFOLIO_SECTIONS, type PortfolioSectionId } from "@/data/portfolioSections";
import { scrollToSection as scrollToPortfolioSection } from "@/lib/scroll-to-section";

const ACTIVATION_RATIO = 0.4;
const EDGE_THRESHOLD = 80;
const HYSTERESIS_PX = 24;

type ActiveSectionState = {
  activeId: PortfolioSectionId;
  activeIndex: number;
  progress: number;
  foundIds: PortfolioSectionId[];
  missingIds: PortfolioSectionId[];
  debugEnabled: boolean;
  scrollToSection: (id: PortfolioSectionId, reduceMotion?: boolean) => void;
};

const initialState: ActiveSectionState = {
  activeId: PORTFOLIO_SECTIONS[0].id,
  activeIndex: 0,
  progress: 0,
  foundIds: [],
  missingIds: [],
  debugEnabled: false,
  scrollToSection: () => {},
};

type MeasuredSection = {
  id: PortfolioSectionId;
  index: number;
  element: HTMLElement | null;
  top: number;
  bottom: number;
  midpoint: number;
};

const ActiveSectionContext = createContext<ActiveSectionState>(initialState);

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function measureSections(): MeasuredSection[] {
  return PORTFOLIO_SECTIONS.map((section, index) => {
    const element = document.querySelector<HTMLElement>(`[data-section-id="${section.id}"]`);
    if (!element) {
      return {
        id: section.id,
        index,
        element: null,
        top: 0,
        bottom: 0,
        midpoint: 0,
      };
    }

    const rect = element.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const bottom = rect.bottom + window.scrollY;

    return {
      id: section.id,
      index,
      element,
      top,
      bottom,
      midpoint: top + rect.height / 2,
    };
  });
}

function getSectionState(
  debugEnabled: boolean,
  previousIndex: number,
  initialized: boolean,
  scrollToSection: ActiveSectionState["scrollToSection"],
): ActiveSectionState {
  const measuredSections = measureSections();

  const foundIds = measuredSections.filter((section) => section.element).map((section) => section.id);
  const missingIds = measuredSections.filter((section) => !section.element).map((section) => section.id);
  const lastIndex = PORTFOLIO_SECTIONS.length - 1;
  const availableSections = measuredSections
    .filter((section): section is MeasuredSection & { element: HTMLElement } => Boolean(section.element))
    .sort((a, b) => a.top - b.top);

  if (window.scrollY < EDGE_THRESHOLD) {
    return { activeId: PORTFOLIO_SECTIONS[0].id, activeIndex: 0, progress: 0, foundIds, missingIds, debugEnabled, scrollToSection };
  }

  const scrollBottom = window.innerHeight + window.scrollY;
  const documentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
  if (scrollBottom >= documentHeight - EDGE_THRESHOLD) {
    return { activeId: PORTFOLIO_SECTIONS[lastIndex].id, activeIndex: lastIndex, progress: 1, foundIds, missingIds, debugEnabled, scrollToSection };
  }

  if (!availableSections.length) {
    return { ...initialState, debugEnabled, scrollToSection };
  }

  const activationY = window.scrollY + Math.min(window.innerHeight * ACTIVATION_RATIO, 360);
  const containing = availableSections.find((section, index) => {
    const next = availableSections[index + 1];
    const bottom = next ? Math.min(section.bottom, next.top) : section.bottom;
    return activationY >= section.top - 1 && activationY < bottom;
  });

  let candidate = containing;

  if (!candidate) {
    candidate = availableSections[0];
    for (const section of availableSections) {
      if (activationY >= section.top) candidate = section;
    }
  }

  let activeIndex = candidate.index;

  if (initialized) {
    const previousSection = measuredSections[previousIndex];

    if (activeIndex > previousIndex && activationY < candidate.top + HYSTERESIS_PX) {
      activeIndex = previousIndex;
    } else if (activeIndex < previousIndex && previousSection?.element && activationY > previousSection.top - HYSTERESIS_PX) {
      activeIndex = previousIndex;
    }
  }

  let continuousProgress = lastIndex > 0 ? activeIndex / lastIndex : 0;

  if (lastIndex > 0) {
    const previousByTop = [...availableSections].reverse().find((section) => activationY >= section.top) ?? availableSections[0];
    const nextByTop = availableSections.find((section) => section.index > previousByTop.index && section.top > previousByTop.top);

    if (nextByTop) {
      const sectionSpan = Math.max(nextByTop.top - previousByTop.top, 1);
      const segmentProgress = clamp((activationY - previousByTop.top) / sectionSpan);
      continuousProgress = clamp((previousByTop.index + segmentProgress * (nextByTop.index - previousByTop.index)) / lastIndex);
    } else {
      continuousProgress = clamp(previousByTop.index / lastIndex);
    }
  }

  return {
    activeId: PORTFOLIO_SECTIONS[activeIndex].id,
    activeIndex,
    progress: continuousProgress,
    foundIds,
    missingIds,
    debugEnabled,
    scrollToSection,
  };
}

export function ActiveSectionProvider({ children }: { children: ReactNode }) {
  const scrollToSection = useMemo(
    () => (id: PortfolioSectionId, reduceMotion = false) => scrollToPortfolioSection(id, reduceMotion),
    [],
  );
  const [state, setState] = useState<ActiveSectionState>(initialState);
  const activeIndexRef = useRef(initialState.activeIndex);
  const initializedRef = useRef(false);

  useEffect(() => {
    let frame = 0;
    let missingSignature = "";
    const debugEnabled = process.env.NODE_ENV === "development" && new URLSearchParams(window.location.search).has("debugJourney");

    const update = () => {
      frame = 0;
      const nextState = getSectionState(debugEnabled, activeIndexRef.current, initializedRef.current, scrollToSection);
      const nextMissingSignature = nextState.missingIds.join(",");

      if (process.env.NODE_ENV === "development" && nextMissingSignature && nextMissingSignature !== missingSignature) {
        nextState.missingIds.forEach((id) => {
          console.warn(`[JourneyLine] Missing section id: ${id}`);
        });
      }

      missingSignature = nextMissingSignature;
      activeIndexRef.current = nextState.activeIndex;
      initializedRef.current = true;
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
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("hashchange", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("hashchange", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [scrollToSection]);

  return createElement(ActiveSectionContext.Provider, { value: state }, children);
}

export function useActiveSection() {
  return useContext(ActiveSectionContext);
}
