"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageSquare, X } from "lucide-react";
import { useState } from "react";
import { DynamicAskEbbad } from "@/components/home/dynamic-islands";

export function FloatingChatbot() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-3 text-sm font-semibold text-white shadow-glow"
        aria-label="Open Ask Ebbad chatbot"
      >
        <MessageSquare size={18} /> Ask Ebbad
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div className="fixed inset-0 z-[120] bg-slate-950/70 p-4 backdrop-blur md:grid md:place-items-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="ml-auto mt-14 w-full max-w-xl" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }}>
              <div className="mb-3 flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3">
                <span className="flex items-center gap-2 font-heading font-semibold text-white"><Bot className="text-cyan-200" /> Ask Ebbad</span>
                <button onClick={() => setOpen(false)} className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Close chatbot">
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
