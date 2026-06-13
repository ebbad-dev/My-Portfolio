import { chatbotKnowledge } from "@/data/site";

export const chatbotModes = ["Recruiter Mode", "Technical Deep Dive Mode", "Project Guide Mode", "Quick Summary Mode"] as const;

export type ChatbotMode = (typeof chatbotModes)[number];

export function getChatbotAnswer(question: string, mode: ChatbotMode = "Recruiter Mode") {
  const lower = question.toLowerCase();
  const injectionTerms = ["ignore previous", "system prompt", "developer message", "reveal hidden", "jailbreak"];

  if (injectionTerms.some((term) => lower.includes(term))) {
    return `${mode}: I can only answer from Ebbad's approved portfolio knowledge base. ${chatbotKnowledge.fallback}`;
  }

  const match = chatbotKnowledge.answers.find((item) => item.triggers.some((trigger) => lower.includes(trigger)));
  const answer = match?.answer || chatbotKnowledge.fallback;
  return `${mode}: ${answer}`;
}
