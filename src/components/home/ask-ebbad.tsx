"use client";

import { useMemo, useState } from "react";
import { Bot, RotateCcw, Send } from "lucide-react";
import { chatbotKnowledge } from "@/data/site";
import { chatbotModes, type ChatbotMode } from "@/lib/chatbot";

export function AskEbbad({ compact = false }: { compact?: boolean }) {
  const [mode, setMode] = useState<ChatbotMode>("Recruiter Mode");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", text: "Hi, I'm Ask Ebbad. I can answer from the approved portfolio knowledge base." }]);

  const promptButtons = useMemo(() => chatbotKnowledge.suggestedPrompts, []);

  const submit = async (text = input) => {
    if (!text.trim()) return;
    setLoading(true);
    setMessages((current) => [...current, { role: "user", text }]);
    setInput("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, mode }),
      });
      const result = (await response.json()) as { message?: string };
      setMessages((current) => [...current, { role: "assistant", text: result.message || chatbotKnowledge.fallback }]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", text: chatbotKnowledge.fallback }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-5">
      <div className="flex flex-wrap items-center gap-2">
        {chatbotModes.map((item) => (
          <button key={item} onClick={() => setMode(item)} className={`rounded-full px-3 py-2 text-xs transition ${mode === item ? "bg-cyan-300 text-slate-950" : "bg-white/[0.05] text-slate-300 hover:bg-white/10"}`}>
            {item}
          </button>
        ))}
        <button onClick={() => setMessages([{ role: "assistant", text: "Chat reset. Ask me about Ebbad, projects, skills, contact, or availability." }])} className="ml-auto rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Reset chat">
          <RotateCcw size={16} />
        </button>
      </div>
      <div className={`mt-5 overflow-y-auto rounded-3xl border border-white/10 bg-slate-950/60 p-4 ${compact ? "h-[360px]" : "h-80"}`}>
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`mb-3 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-cyan-300 text-slate-950" : "bg-white/[0.06] text-slate-200"}`}>
              {message.role === "assistant" ? <Bot className="mb-2 inline text-cyan-200" size={16} /> : null} {message.text}
            </div>
          </div>
        ))}
        {loading ? <div className="text-sm text-slate-500">Ask Ebbad is typing...</div> : null}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {promptButtons.map((prompt) => (
          <button key={prompt} onClick={() => submit(prompt)} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:border-cyan-300/40 hover:text-white">
            {prompt}
          </button>
        ))}
      </div>
      <form
        className="mt-4 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <input value={input} onChange={(event) => setInput(event.target.value)} className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500" placeholder="Ask about Ebbad's projects..." />
        <button className="grid h-12 w-12 place-items-center rounded-full bg-brand-gradient text-white" aria-label="Send message">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
