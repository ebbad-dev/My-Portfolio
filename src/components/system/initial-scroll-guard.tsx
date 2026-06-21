"use client";

import { useEffect } from "react";
import { PORTFOLIO_SECTIONS } from "@/data/portfolioSections";

const validHashes = new Set(["#hero", "#main", ...PORTFOLIO_SECTIONS.map((section) => section.href)]);
const legacyChatHashes = new Set(["#ask-ebbad-chat"]);

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

export function InitialScrollGuard() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const { hash, pathname, search } = window.location;

    if (pathname !== "/") return;

    if (legacyChatHashes.has(hash)) {
      window.history.replaceState(null, "", `${pathname}${search}`);
      scrollToTop();
      window.requestAnimationFrame(scrollToTop);
      window.setTimeout(scrollToTop, 80);
      return;
    }

    if (!hash) {
      scrollToTop();
      window.requestAnimationFrame(scrollToTop);
      window.setTimeout(scrollToTop, 80);
      window.setTimeout(scrollToTop, 240);
      return;
    }

    if (validHashes.has(hash)) {
      window.requestAnimationFrame(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start", behavior: "auto" });
      });
      return;
    }

    if (!validHashes.has(hash)) {
      window.history.replaceState(null, "", `${pathname}${search}`);
      window.requestAnimationFrame(scrollToTop);
    }
  }, []);

  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted || window.location.pathname !== "/" || window.location.hash) return;
      scrollToTop();
    };

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return null;
}
