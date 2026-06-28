"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AskEbbadIcon } from "@/components/ask/ask-ebbad-icon";
import { AskEbbad } from "@/components/home/ask-ebbad";

export function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [askSectionVisible, setAskSectionVisible] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = document.getElementById("ask-ebbad");
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setAskSectionVisible(entry.isIntersecting),
      { threshold: 0.28 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        window.setTimeout(() => triggerRef.current?.focus({ preventScroll: true }), 0);
      }
      if (event.key === "Tab") {
        const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])",
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => {
    setOpen(false);
    window.setTimeout(() => triggerRef.current?.focus({ preventScroll: true }), 0);
  };

  return (
    <>
      {!open && !askSectionVisible ? (
        <button
          ref={triggerRef}
          onClick={() => setOpen(true)}
          className="fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] right-3 z-50 inline-flex h-10 w-10 items-center justify-center gap-2 rounded-full bg-brand-gradient text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 sm:right-5 sm:h-11 sm:w-auto sm:px-3.5 sm:py-2"
          aria-label="Open Ask Ebbad chatbot"
        >
          <MessageSquare size={17} /> <span className="hidden sm:inline">Ask Ebbad</span>
        </button>
      ) : null}
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[120] grid place-items-center bg-slate-950/72 p-3 backdrop-blur md:place-items-end md:p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={close}
          >
            <motion.div
              ref={panelRef}
              className="flex h-[min(39rem,calc(100dvh-5.5rem))] min-h-[28rem] w-full max-w-[calc(100vw-1.5rem)] flex-col md:h-[min(42rem,calc(100dvh-7.5rem))] md:max-w-[26rem] lg:max-w-[27rem]"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="mb-2 flex h-12 shrink-0 items-center justify-between rounded-2xl border border-white/10 bg-slate-950/90 px-3 py-2 shadow-[0_18px_50px_rgba(0,0,0,0.22)] sm:h-[3.25rem] sm:rounded-3xl sm:px-4">
                <span className="flex min-w-0 items-center gap-2">
                  <AskEbbadIcon className="h-10 w-10 rounded-[1rem]" />
                  <span className="min-w-0">
                    <span className="block truncate font-heading text-sm font-semibold text-white sm:text-base">Ask Ebbad</span>
                    <span className="hidden items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-100 sm:flex">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
                      Portfolio Guide Online
                    </span>
                  </span>
                </span>
                <button ref={closeRef} onClick={close} className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-200/70" aria-label="Close Ask Ebbad chat">
                  <X size={18} />
                </button>
              </div>
              <AskEbbad compact showHeader={false} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
