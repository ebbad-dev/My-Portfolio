import { chatbotKnowledge } from "@/data/site";

export const chatbotModes = ["Recruiter Mode", "Technical Deep Dive Mode", "Project Guide Mode", "Quick Summary Mode"] as const;

export type ChatbotMode = (typeof chatbotModes)[number];

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function scoreAnswer(question: string, triggers: string[]) {
  return triggers.reduce((score, trigger) => {
    const normalizedTrigger = normalize(trigger);
    if (!normalizedTrigger) return score;
    if (question.includes(normalizedTrigger)) return score + normalizedTrigger.split(" ").length * 4;
    const words = normalizedTrigger.split(" ").filter((word) => word.length > 2);
    return score + words.filter((word) => question.split(" ").includes(word)).length;
  }, 0);
}

export function getChatbotAnswer(question: string, mode: ChatbotMode = "Recruiter Mode") {
  const lower = normalize(question);
  const injectionTerms = ["ignore previous", "system prompt", "developer message", "reveal hidden", "jailbreak"];

  if (injectionTerms.some((term) => lower.includes(term))) {
    return `${mode}: I can only answer from Ebbad's approved portfolio knowledge base. ${chatbotKnowledge.fallback}`;
  }

  const scored = chatbotKnowledge.answers
    .map((item) => ({ item, score: scoreAnswer(lower, item.triggers) }))
    .sort((a, b) => b.score - a.score);
  const match = scored[0]?.score > 0 ? scored[0].item : null;
  const answer = match?.answer || chatbotKnowledge.fallback;
  return `${mode}: ${answer}`;
}
