"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bot, ChevronDown, RotateCcw, Send, ShieldCheck, Sparkles } from "lucide-react";
import { DynamicAskAssistantAvatar } from "@/components/ask/dynamic-assistant-avatar";
import { chatbotKnowledge } from "@/data/site";
import { type ChatbotMode } from "@/lib/chatbot";
import { cn } from "@/lib/utils";
import type { AskCoreStatus } from "@/components/ask/types";

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

const modeOptions: Array<{ label: string; value: ChatbotMode }> = [
  { label: "Recruiter", value: "Recruiter Mode" },
  { label: "Technical", value: "Technical Deep Dive Mode" },
  { label: "Projects", value: "Project Guide Mode" },
];

export function AskEbbad({
  compact = false,
  compactPanel = false,
  externalPrompt,
  onStatusChange,
  showHeader = true,
}: {
  compact?: boolean;
  compactPanel?: boolean;
  externalPrompt?: { id: number; text: string };
  onStatusChange?: (status: AskCoreStatus) => void;
  showHeader?: boolean;
}) {
  const [mode, setMode] = useState<ChatbotMode>("Recruiter Mode");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [morePromptsOpen, setMorePromptsOpen] = useState(false);
  const [assistantStatus, setAssistantStatus] = useState<AskCoreStatus>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: "Hi, I'm Ask Ebbad. I answer from Ebbad's approved portfolio knowledge base, including projects, skills, testimonials, contact, and availability." },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const statusTimerRef = useRef<number | null>(null);
  const lastExternalPromptIdRef = useRef<number | null>(null);

  const promptGroups = useMemo(() => chatbotKnowledge.promptGroups || [{ label: "Suggested", prompts: chatbotKnowledge.suggestedPrompts }], []);
  const compactPrompts = useMemo(() => promptGroups.flatMap((group) => group.prompts).slice(0, 5), [promptGroups]);
  const visiblePrompts = useMemo(() => promptGroups.flatMap((group) => group.prompts).slice(0, 5), [promptGroups]);
  const hiddenPrompts = useMemo(() => promptGroups.flatMap((group) => group.prompts).slice(5), [promptGroups]);

  const updateAssistantStatus = useCallback((status: AskCoreStatus) => {
    setAssistantStatus(status);
    onStatusChange?.(status);
  }, [onStatusChange]);

  const submit = useCallback(async (text = input) => {
    const prompt = text.trim();
    if (!prompt || loading) return;
    setLoading(true);
    updateAssistantStatus("thinking");
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
      updateAssistantStatus("success");
      statusTimerRef.current = window.setTimeout(() => updateAssistantStatus("idle"), 1800);
    } catch {
      setMessages((current) => [...current, { role: "assistant", text: `Connection note: ${chatbotKnowledge.fallback}` }]);
      updateAssistantStatus("idle");
    } finally {
      setLoading(false);
      window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 0);
    }
  }, [input, loading, mode, updateAssistantStatus]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (messagesRef.current) {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        messagesRef.current.scrollTo({ top: messagesRef.current.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
        messagesEndRef.current?.scrollIntoView({ block: "end", behavior: reduceMotion ? "auto" : "smooth" });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [messages, loading]);

  useEffect(() => {
    return () => {
      if (statusTimerRef.current) window.clearTimeout(statusTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!externalPrompt || externalPrompt.id === lastExternalPromptIdRef.current) return;
    lastExternalPromptIdRef.current = externalPrompt.id;
    void submit(externalPrompt.text);
  }, [externalPrompt, submit]);

  return (
    <div className={cn("ask-console glass-panel min-w-0 max-w-full overflow-hidden rounded-3xl p-0", compact && "flex h-full min-h-0 flex-1 flex-col rounded-[1.35rem]")}>
      {showHeader ? (
      <div className={cn("shrink-0 border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_38%),rgba(2,6,23,0.28)]", compact ? "p-2.5 sm:p-3" : compactPanel ? "p-4" : "p-5")}>
        <div className={cn("flex flex-wrap items-start justify-between gap-4", compact && "items-center gap-2")}>
          <div className="flex min-w-0 items-start gap-3">
            {compact ? <DynamicAskAssistantAvatar status={assistantStatus} compact /> : null}
            <div className="min-w-0">
            <p className={cn("mono-label", compact && "sr-only")}>Ask Ebbad</p>
            <h3 className={cn("mt-2 flex min-w-0 items-center gap-2 font-heading font-bold text-white", compact ? "mt-0 text-sm sm:text-base" : compactPanel ? "text-xl" : "text-2xl")}>
              <Bot className="text-cyan-200" size={compact ? 15 : 22} /> Portfolio intelligence
            </h3>
            <p className={cn("mt-2 max-w-xl text-sm leading-6 text-slate-400", compact && "hidden", compactPanel && "text-xs leading-5")}>
              Recruiter-ready answers from approved portfolio data only. Unknown details fall back honestly.
            </p>
            {compactPanel ? (
              <p className="mt-1 max-w-xl text-[11px] leading-5 text-cyan-100/70">
                Powered by curated portfolio knowledge, designed to help recruiters and collaborators find answers faster.
              </p>
            ) : null}
            </div>
          </div>
          <span className={cn("inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold text-emerald-100", compact && "gap-1 px-2 py-1 text-[10px]")}>
            <ShieldCheck size={compact ? 12 : 14} /> Verified
          </span>
        </div>
      </div>
      ) : null}

      <div className={cn("min-w-0 p-5", compact && "flex h-full min-h-0 flex-1 flex-col gap-2 overflow-hidden p-2.5 sm:p-3", compactPanel && "p-4")}>
        <div className={cn(compactPanel && !compact ? "grid min-w-0 gap-4 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]" : "contents")}>
          {compactPanel && !compact ? (
            <div className="min-w-0 max-w-full overflow-hidden">
              <DynamicAskAssistantAvatar status={assistantStatus} />
            </div>
          ) : null}
          <div className="flex min-w-0 max-w-full flex-1 flex-col overflow-hidden">
        <div className={cn("flex flex-wrap items-center gap-2", compact && "scrollbar-none flex-nowrap overflow-x-auto pb-1")}>
        {modeOptions.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setMode(item.value)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-2 text-xs font-semibold transition",
              compact && "px-2.5 py-1.5 text-[10px]",
              mode === item.value
                ? "border-cyan-200 bg-cyan-300 text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.22)]"
                : "border-white/10 bg-white/[0.05] text-slate-300 hover:border-cyan-300/35 hover:bg-white/10 hover:text-white",
            )}
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            setMessages([{ role: "assistant", text: "Chat reset. Ask me about Ebbad, projects, testimonials, skills, contact, or availability." }]);
            updateAssistantStatus("idle");
            inputRef.current?.focus({ preventScroll: true });
          }}
          className={cn("ml-auto shrink-0 rounded-full border border-white/10 p-2 text-slate-400 transition hover:border-cyan-300/35 hover:bg-white/10 hover:text-white", compact && "p-1.5")}
          aria-label="Reset chat"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div
        ref={messagesRef}
        className={cn("chat-scrollbar overflow-y-auto rounded-3xl border border-white/10 bg-slate-950/62 p-4", compact ? "min-h-0 flex-1 rounded-2xl p-3" : compactPanel ? "mt-4 h-56" : "mt-5 h-72")}
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
        <div ref={messagesEndRef} aria-hidden="true" />
      </div>

      {compact ? (
        <div className="chat-prompt-strip flex shrink-0 gap-1.5 overflow-x-auto pb-1">
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
      ) : compactPanel ? (
        <div className="mt-3 grid gap-2">
          <div className="flex flex-wrap gap-2">
            {visiblePrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  disabled={loading}
                  onClick={() => submit(prompt)}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-300/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {prompt}
                </button>
            ))}
            {hiddenPrompts.length ? (
              <button
                type="button"
                onClick={() => setMorePromptsOpen((value) => !value)}
                className="inline-flex items-center gap-1 rounded-full border border-violet-300/15 px-3 py-1.5 text-xs font-semibold text-violet-100 transition hover:border-violet-300/40 hover:text-white"
                aria-expanded={morePromptsOpen}
              >
                More prompts <ChevronDown size={13} className={cn("transition", morePromptsOpen && "rotate-180")} />
              </button>
            ) : null}
          </div>
          {morePromptsOpen ? (
            <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/[0.025] p-2">
              {hiddenPrompts.map((prompt) => (
                <button key={prompt} type="button" disabled={loading} onClick={() => submit(prompt)} className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-slate-300 transition hover:border-cyan-300/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50">
                  {prompt}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-4 grid gap-3">
          {promptGroups.map((group) => (
            <div key={group.label} className="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
              <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-cyan-100">{group.label}</p>
              <div className="flex flex-wrap gap-2">
                {group.prompts.map((prompt) => (
                  <button key={prompt} type="button" disabled={loading} onClick={() => submit(prompt)} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-300/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50">
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
          aria-label="Ask Ebbad a question"
        />
        <button disabled={loading || !input.trim()} className={cn("grid h-12 w-12 place-items-center rounded-full bg-brand-gradient text-white transition disabled:cursor-not-allowed disabled:opacity-50", compact && "h-10 w-10")} aria-label="Send message">
          <Send size={18} />
        </button>
      </form>
          </div>
        </div>
      </div>
    </div>
  );
}
