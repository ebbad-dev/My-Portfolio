"use client";

import { useMemo, useRef, useState } from "react";
import { Bot, CheckCircle2, RotateCcw, Send, ShieldCheck, Sparkles } from "lucide-react";
import { chatbotKnowledge } from "@/data/site";
import { chatbotModes, type ChatbotMode } from "@/lib/chatbot";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

export function AskEbbad({ compact = false }: { compact?: boolean }) {
  const [mode, setMode] = useState<ChatbotMode>("Recruiter Mode");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: "Hi, I'm Ask Ebbad. I answer from Ebbad's approved portfolio knowledge base, including projects, skills, testimonials, contact, and availability." },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  const promptGroups = useMemo(() => chatbotKnowledge.promptGroups || [{ label: "Suggested", prompts: chatbotKnowledge.suggestedPrompts }], []);

  const submit = async (text = input) => {
    const prompt = text.trim();
    if (!prompt || loading) return;
    setLoading(true);
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
    } catch {
      setMessages((current) => [...current, { role: "assistant", text: `Connection note: ${chatbotKnowledge.fallback}` }]);
    } finally {
      setLoading(false);
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <div className="glass-panel overflow-hidden rounded-3xl p-0">
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_38%),rgba(2,6,23,0.28)] p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mono-label">Ask Ebbad</p>
            <h3 className="mt-2 flex items-center gap-2 font-heading text-2xl font-bold text-white">
              <Bot className="text-cyan-200" size={22} /> Portfolio intelligence
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Recruiter-ready answers from approved portfolio data only. Unknown details fall back honestly.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
            <ShieldCheck size={14} /> Verified knowledge
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
        {chatbotModes.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setMode(item)}
            className={cn(
              "rounded-full border px-3 py-2 text-xs font-semibold transition",
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
            inputRef.current?.focus();
          }}
          className="ml-auto rounded-full border border-white/10 p-2 text-slate-400 transition hover:border-cyan-300/35 hover:bg-white/10 hover:text-white"
          aria-label="Reset chat"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div className={`mt-5 overflow-y-auto rounded-3xl border border-white/10 bg-slate-950/62 p-4 ${compact ? "h-[340px]" : "h-72"}`} aria-live="polite">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`mb-3 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={cn(
              "max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-[0_12px_34px_rgba(0,0,0,0.18)]",
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
      </div>

      <div className="mt-4 grid gap-3">
        {promptGroups.map((group) => (
          <div key={group.label} className="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
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
                  className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-300/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <form
        className="mt-4 flex gap-2"
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
          className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/45 disabled:cursor-not-allowed disabled:opacity-60"
          placeholder="Ask about Ebbad's projects, testimonials, or contact..."
        />
        <button disabled={loading || !input.trim()} className="grid h-12 w-12 place-items-center rounded-full bg-brand-gradient text-white transition disabled:cursor-not-allowed disabled:opacity-50" aria-label="Send message">
          <Send size={18} />
        </button>
      </form>
      </div>
    </div>
  );
}
