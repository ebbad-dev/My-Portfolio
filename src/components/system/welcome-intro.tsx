"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Play, X } from "lucide-react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/data/site";

export function WelcomeIntro() {
  const [visible, setVisible] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (sessionStorage.getItem("ebbad-intro-seen") === "true") return;
    const introTimer = window.setTimeout(() => setVisible(true), 0);
    return () => window.clearTimeout(introTimer);
  }, []);

  const enter = () => {
    sessionStorage.setItem("ebbad-intro-seen", "true");
    setVisible(false);
  };

  return (
    <>
      <AnimatePresence>
        {visible ? (
          <motion.div
            className="fixed inset-0 z-[110] grid place-items-center bg-[#05070d]/95 p-4 backdrop-blur-2xl"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="glass-panel relative w-full max-w-3xl overflow-hidden rounded-3xl p-8 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_48%)]" />
              <div className="relative">
                <p className="mono-label">EbbadOS boot sequence</p>
                <h2 className="mt-5 font-heading text-6xl font-bold text-white">Hello.</h2>
                <p className="mt-4 text-2xl text-slate-200">I&apos;m Ebbad Ur Rehman.</p>
                <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-300">
                  Welcome to my engineering portfolio. Watch the short intro or jump straight into the projects, skills, demos, and systems I&apos;m building.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <button onClick={enter} className="rounded-full bg-brand-gradient px-6 py-3 font-semibold text-white shadow-glow">
                    Enter Portfolio
                  </button>
                  {siteConfig.introVideoAvailable ? (
                    <button onClick={() => setVideoOpen(true)} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 font-semibold text-slate-100 transition hover:border-cyan-300/40 hover:bg-white/[0.08]">
                      <Play size={17} /> Watch Intro
                    </button>
                  ) : null}
                  <button onClick={enter} className="rounded-full px-6 py-3 font-semibold text-slate-400 hover:text-white">
                    Skip Intro
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {videoOpen && siteConfig.introVideoAvailable ? (
          <motion.div className="fixed inset-0 z-[130] grid place-items-center bg-slate-950/85 p-4 backdrop-blur" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="glass-panel w-full max-w-4xl rounded-3xl p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="mono-label">Intro video</p>
                  <p className="mt-1 text-sm text-slate-400">A quick guided tour of Ebbad&apos;s work and focus areas.</p>
                </div>
                <button onClick={() => setVideoOpen(false)} className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Close intro video">
                  <X size={20} />
                </button>
              </div>
              <video controls playsInline preload="metadata" className="aspect-video w-full rounded-2xl border border-white/10 bg-slate-950" poster={siteConfig.profileImagePath}>
                <source src={siteConfig.introVideoPath} type="video/mp4" />
              </video>
              <div className="mt-4 flex flex-wrap justify-end gap-3">
                <button
                  onClick={() => {
                    setVideoOpen(false);
                    enter();
                  }}
                  className="rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-glow"
                >
                  Enter Portfolio
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
