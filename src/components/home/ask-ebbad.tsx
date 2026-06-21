"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, CheckCircle2, RotateCcw, Send, ShieldCheck, Sparkles } from "lucide-react";
import { chatbotKnowledge } from "@/data/site";
import { chatbotModes, type ChatbotMode } from "@/lib/chatbot";
import { cn } from "@/lib/utils";
import type { AskRobotStatus } from "@/components/ask/types";

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

export function AskEbbad({ compact = false, onStatusChange }: { compact?: boolean; onStatusChange?: (status: AskRobotStatus) => void }) {
  const [mode, setMode] = useState<ChatbotMode>("Recruiter Mode");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: "Hi, I'm Ask Ebbad. I answer from Ebbad's approved portfolio knowledge base, including projects, skills, testimonials, contact, and availability." },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const latestMessageRef = useRef<HTMLDivElement>(null);
  const statusTimerRef = useRef<number | null>(null);

  const promptGroups = useMemo(() => chatbotKnowledge.promptGroups || [{ label: "Suggested", prompts: chatbotKnowledge.suggestedPrompts }], []);
  const compactPrompts = useMemo(() => promptGroups.flatMap((group) => group.prompts).slice(0, 6), [promptGroups]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      latestMessageRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [messages, loading]);

  useEffect(() => {
    return () => {
      if (statusTimerRef.current) window.clearTimeout(statusTimerRef.current);
    };
  }, []);

  const submit = async (text = input) => {
    const prompt = text.trim();
    if (!prompt || loading) return;
    setLoading(true);
    onStatusChange?.("thinking");
    if (statusTimerRef.current) window.clearTimeout(statusTimerRef.current);
    setMessages((current) => [...current, { role: "user", text: prompt }]);
    setInput("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, mode }),
      });
      if (!response.ok) throw new Error("Chat request failed");
      const result = (await response.json()) as { message?: string };
      setMessages((current) => [...current, { role: "assistant", text: result.message || chatbotKnowledge.fallback }]);
      onStatusChange?.("success");
      statusTimerRef.current = window.setTimeout(() => onStatusChange?.("idle"), 1800);
    } catch {
      setMessages((current) => [...current, { role: "assistant", text: `Connection note: ${chatbotKnowledge.fallback}` }]);
      onStatusChange?.("idle");
    } finally {
      setLoading(false);
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <div className={cn("glass-panel overflow-hidden rounded-3xl p-0", compact && "flex min-h-0 flex-1 flex-col rounded-[1.35rem]")}>
      <div className={cn("shrink-0 border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_38%),rgba(2,6,23,0.28)]", compact ? "p-2.5 sm:p-3" : "p-5")}>
        <div className={cn("flex flex-wrap items-start justify-between gap-4", compact && "items-center gap-2")}>
          <div>
            <p className={cn("mono-label", compact && "sr-only")}>Ask Ebbad</p>
            <h3 className={cn("mt-2 flex items-center gap-2 font-heading font-bold text-white", compact ? "mt-0 text-sm sm:text-base" : "text-2xl")}>
              <Bot className="text-cyan-200" size={compact ? 15 : 22} /> Portfolio intelligence
            </h3>
            <p className={cn("mt-2 max-w-xl text-sm leading-6 text-slate-400", compact && "hidden")}>
              Recruiter-ready answers from approved portfolio data only. Unknown details fall back honestly.
            </p>
          </div>
          <span className={cn("inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold text-emerald-100", compact && "gap-1 px-2 py-1 text-[10px]")}>
            <ShieldCheck size={compact ? 12 : 14} /> Verified
          </span>
        </div>
      </div>

      <div className={cn("p-5", compact && "flex min-h-0 flex-1 flex-col gap-2 overflow-hidden p-2.5 sm:p-3")}>
        <div className={cn("flex flex-wrap items-center gap-2", compact && "scrollbar-none flex-nowrap overflow-x-auto pb-1")}>
        {chatbotModes.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setMode(item)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-2 text-xs font-semibold transition",
              compact && "px-2.5 py-1.5 text-[10px]",
              mode === item
                ? "border-cyan-200 bg-cyan-300 text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.22)]"
                : "border-white/10 bg-white/[0.05] text-slate-300 hover:border-cyan-300/35 hover:bg-white/10 hover:text-white",
            )}
          >
            {item}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            setMessages([{ role: "assistant", text: "Chat reset. Ask me about Ebbad, projects, testimonials, skills, contact, or availability." }]);
            onStatusChange?.("idle");
            inputRef.current?.focus();
          }}
          className={cn("ml-auto shrink-0 rounded-full border border-white/10 p-2 text-slate-400 transition hover:border-cyan-300/35 hover:bg-white/10 hover:text-white", compact && "p-1.5")}
          aria-label="Reset chat"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div
        ref={messagesRef}
        className={cn("chat-scrollbar overflow-y-auto rounded-3xl border border-white/10 bg-slate-950/62 p-4", compact ? "min-h-0 flex-1 rounded-2xl p-3" : "mt-5 h-72")}
        aria-live="polite"
      >
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`mb-3 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={cn(
              "max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-[0_12px_34px_rgba(0,0,0,0.18)]",
              compact && "max-w-[94%] px-3 py-2 text-xs leading-5 sm:text-sm",
              message.role === "user"
                ? "bg-cyan-300 text-slate-950"
                : "border border-white/10 bg-white/[0.06] text-slate-200",
            )}>
              {message.role === "assistant" ? <Bot className="mb-1 mr-1 inline text-cyan-200" size={16} /> : null} {message.text}
            </div>
          </div>
        ))}
        {loading ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.07] px-3 py-2 text-sm text-cyan-100">
            <Sparkles size={15} className="animate-pulse" /> Ask Ebbad is checking the knowledge base...
          </div>
        ) : null}
        <div ref={latestMessageRef} aria-hidden="true" />
      </div>

      {compact ? (
        <div className="scrollbar-none flex shrink-0 gap-1.5 overflow-x-auto pb-1">
          {compactPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              disabled={loading}
              onClick={() => submit(prompt)}
              className="shrink-0 rounded-full border border-white/10 px-2.5 py-1.5 text-[10px] text-slate-300 transition hover:border-cyan-300/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      ) : (
      <div className="mt-4 grid gap-3">
        {promptGroups.map((group) => (
          <div key={group.label} className={cn("rounded-2xl border border-white/10 bg-white/[0.025] p-3", compact && "p-2")}>
            <p className="mb-2 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-cyan-100">
              <CheckCircle2 size={13} /> {group.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  disabled={loading}
                  onClick={() => submit(prompt)}
                  className={cn("rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-300/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50", compact && "px-2 py-1 text-[10px]")}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      )}
      <form
        className={cn("flex shrink-0 gap-2", compact ? "pt-0" : "mt-4")}
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          disabled={loading}
          className={cn("min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/45 disabled:cursor-not-allowed disabled:opacity-60", compact && "px-3 py-2.5 text-xs sm:text-sm")}
          placeholder="Ask about Ebbad's projects, testimonials, or contact..."
        />
        <button disabled={loading || !input.trim()} className={cn("grid h-12 w-12 place-items-center rounded-full bg-brand-gradient text-white transition disabled:cursor-not-allowed disabled:opacity-50", compact && "h-10 w-10")} aria-label="Send message">
          <Send size={18} />
        </button>
      </form>
      </div>
    </div>
  );
}
