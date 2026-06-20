"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageSquare, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DynamicAskEbbad } from "@/components/home/dynamic-islands";

export function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        window.setTimeout(() => triggerRef.current?.focus(), 0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => {
    setOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  };

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-brand-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-glow sm:bottom-5 sm:right-5"
        aria-label="Open Ask Ebbad chatbot"
      >
        <MessageSquare size={18} /> Ask Ebbad
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[120] bg-slate-950/72 p-3 backdrop-blur md:grid md:place-items-end md:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={close}
          >
            <motion.div
              className="ml-auto mt-12 w-full max-w-xl sm:mt-14"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3">
                <span className="flex items-center gap-2 font-heading font-semibold text-white"><Bot className="text-cyan-200" /> Ask Ebbad</span>
                <button ref={closeRef} onClick={close} className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Close chatbot">
                  <X size={18} />
                </button>
              </div>
              <DynamicAskEbbad compact />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
