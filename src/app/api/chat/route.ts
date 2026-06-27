import { NextResponse } from "next/server";
import { z } from "zod";
import { chatbotModes, getChatbotAnswer } from "@/lib/chatbot";

export const runtime = "nodejs";

const chatSchema = z.object({
  message: z.string().min(1).max(800),
  mode: z.enum(chatbotModes).default("Recruiter Mode"),
});

export async function POST(request: Request) {
  const parsed = chatSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ message: "Please send a valid question." }, { status: 400 });
  }

  return NextResponse.json({
    message: getChatbotAnswer(parsed.data.message, parsed.data.mode),
  });
}
