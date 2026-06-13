"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { z } from "zod";
import { siteConfig } from "@/data/site";

type FormState = "idle" | "loading" | "success" | "error";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.string().trim().email("Please enter a valid email address."),
  purpose: z.string().trim().min(2, "Please choose a purpose."),
  message: z.string().trim().min(10, "Please write a slightly longer message."),
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
    <form onSubmit={submit} className="glass-panel rounded-3xl p-5">
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-300">
          Name
          <input name="name" required minLength={2} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-cyan-300/45 focus:bg-cyan-300/[0.04]" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Email
          <input name="email" required type="email" className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-cyan-300/45 focus:bg-cyan-300/[0.04]" />
        </label>
      </div>
      <label className="mt-4 grid gap-2 text-sm text-slate-300">
        Purpose
        <select name="purpose" className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-300/45">
          <option>Internship Opportunity</option>
          <option>Freelance Work</option>
          <option>Collaboration</option>
          <option>Mentorship</option>
          <option>General Inquiry</option>
        </select>
      </label>
      <label className="mt-4 grid gap-2 text-sm text-slate-300">
        Message
        <textarea name="message" required minLength={10} rows={5} className="resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-cyan-300/45 focus:bg-cyan-300/[0.04]" />
      </label>
      <button disabled={state === "loading"} className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 font-semibold text-white shadow-[0_0_28px_rgba(34,211,238,0.14)] transition hover:-translate-y-0.5 hover:shadow-glow active:translate-y-0 disabled:opacity-60">
        <Send size={18} />
        {state === "loading" ? "Sending..." : "Send Message"}
      </button>
      {message ? <p className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${state === "success" ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100" : "border-violet-400/30 bg-violet-400/10 text-violet-100"}`}>{message}</p> : null}
    </form>
  );
}
