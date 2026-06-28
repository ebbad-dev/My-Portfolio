import { NextResponse } from "next/server";
import { z } from "zod";
import { chatbotModes, getHybridChatbotAnswer } from "@/lib/chatbot";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 24;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();
const jsonHeaders = {
  "Cache-Control": "no-store",
};

const chatSchema = z.object({
  message: z.string().min(1).max(800),
  mode: z.enum(chatbotModes).default("Recruiter Mode"),
});

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  return forwardedFor || realIp || "local";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const bucket = rateBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  if (bucket.count > RATE_LIMIT_MAX_REQUESTS) return true;

  if (rateBuckets.size > 500) {
    for (const [entryKey, entry] of rateBuckets) {
      if (entry.resetAt <= now) rateBuckets.delete(entryKey);
    }
  }

  return false;
}

export async function POST(request: Request) {
  const clientKey = getClientKey(request);
  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      { message: "Too many Ask Ebbad requests in a short time. Please try again in a minute." },
      { status: 429, headers: jsonHeaders },
    );
  }

  const parsed = chatSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ message: "Please send a valid question." }, { status: 400, headers: jsonHeaders });
  }

  const result = await getHybridChatbotAnswer(parsed.data.message, parsed.data.mode);

  return NextResponse.json({
    message: result.message,
    answer: result.answer,
    intent: result.intent,
    source: result.source,
  }, { headers: jsonHeaders });
}

export function GET() {
  return NextResponse.json(
    { message: "Ask Ebbad accepts POST requests only." },
    { status: 405, headers: { ...jsonHeaders, Allow: "POST" } },
  );
}
