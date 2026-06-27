"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { z } from "zod";
import { siteConfig } from "@/data/site";

type FormState = "idle" | "loading" | "success" | "error";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120, "Please keep your name under 120 characters."),
  email: z.string().trim().email("Please enter a valid email address.").max(254, "Please enter a shorter email address."),
  purpose: z.string().trim().min(2, "Please choose a purpose."),
  message: z.string().trim().min(10, "Please write a slightly longer message.").max(2000, "Please keep the message under 2,000 characters."),
  website: z.string().max(0),
});

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("loading");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const parsed = contactSchema.safeParse({
      name: form.get("name"),
      email: form.get("email"),
      purpose: form.get("purpose"),
      message: form.get("message"),
      website: form.get("website") || "",
    });
    if (!parsed.success) {
      setState("error");
      setMessage(parsed.error.issues[0]?.message || "Please check the form and try again.");
      return;
    }
    if (parsed.data.website) {
      setState("success");
      setMessage("Thank you for reaching out.");
      event.currentTarget.reset();
      return;
    }
    form.append("_subject", "New portfolio contact message");
    form.append("_replyto", parsed.data.email);

    try {
      const response = await fetch(siteConfig.formspreeEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: form,
      });
      const result = (await response.json().catch(() => null)) as { errors?: Array<{ message?: string }> } | null;
      if (!response.ok) throw new Error(result?.errors?.[0]?.message || "The message could not be sent right now.");
      setState("success");
      setMessage("Thank you for reaching out. Your message has been sent successfully, and Ebbad will receive it through Formspree.");
      event.currentTarget.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Message sending is not available right now. Please contact me through email or LinkedIn.");
    }
  };

  return (
    <form onSubmit={submit} className="glass-panel premium-card rounded-3xl p-5 md:p-6">
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="mb-5">
        <p className="mono-label">Message Form</p>
        <h3 className="mt-2 font-heading text-2xl font-bold text-white">Tell me what you&apos;re building</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">I&apos;ll receive this through Formspree. Success only appears after the provider accepts the message.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-300">
          Name
          <input name="name" required minLength={2} maxLength={120} className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/45 focus:bg-cyan-300/[0.04] focus:shadow-[0_0_22px_rgba(34,211,238,0.1)]" placeholder="Your name" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Email
          <input name="email" required type="email" maxLength={254} className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/45 focus:bg-cyan-300/[0.04] focus:shadow-[0_0_22px_rgba(34,211,238,0.1)]" placeholder="you@example.com" />
        </label>
      </div>
      <label className="mt-4 grid gap-2 text-sm text-slate-300">
        Purpose
        <select name="purpose" className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300/45 focus:shadow-[0_0_22px_rgba(34,211,238,0.1)]">
          <option>Internship Opportunity</option>
          <option>Freelance Work</option>
          <option>Collaboration</option>
          <option>Mentorship</option>
          <option>General Inquiry</option>
        </select>
      </label>
      <label className="mt-4 grid gap-2 text-sm text-slate-300">
        Message
        <textarea name="message" required minLength={10} maxLength={2000} rows={5} className="resize-none rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/45 focus:bg-cyan-300/[0.04] focus:shadow-[0_0_22px_rgba(34,211,238,0.1)]" placeholder="Share the opportunity, project idea, or what you want to discuss." />
      </label>
      <button disabled={state === "loading"} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 font-semibold text-white shadow-[0_0_28px_rgba(34,211,238,0.14)] transition hover:-translate-y-0.5 hover:shadow-glow active:translate-y-0 disabled:opacity-60 sm:w-auto">
        <Send size={18} />
        {state === "loading" ? "Sending..." : "Send Message"}
      </button>
      {message ? <p className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${state === "success" ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100" : "border-violet-400/30 bg-violet-400/10 text-violet-100"}`}>{message}</p> : null}
    </form>
  );
}
