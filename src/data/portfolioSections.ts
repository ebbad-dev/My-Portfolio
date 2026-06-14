import { Bot, Briefcase, FileText, Home, Layers, MessageSquare, Orbit, PlayCircle, Route, Send } from "lucide-react";

export const PORTFOLIO_SECTIONS = [
  { id: "hero", label: "Hero", shortLabel: "Home", href: "#hero", icon: Home },
  { id: "recruiters", label: "Recruiters", shortLabel: "Recruiters", href: "#recruiters", icon: Briefcase },
  { id: "projects", label: "Projects", shortLabel: "Projects", href: "#projects", icon: Layers },
  { id: "skills", label: "Skills", shortLabel: "Skills", href: "#skills", icon: Orbit },
  { id: "demos", label: "Demos", shortLabel: "Demos", href: "#demos", icon: PlayCircle },
  { id: "journey", label: "Journey", shortLabel: "Journey", href: "#journey", icon: Route },
  { id: "testimonials", label: "Testimonials", shortLabel: "Reviews", href: "#testimonials", icon: MessageSquare },
  { id: "resume", label: "Resume", shortLabel: "Resume", href: "#resume", icon: FileText },
  { id: "ask-ebbad", label: "Ask Ebbad", shortLabel: "Ask", href: "#ask-ebbad", icon: Bot },
  { id: "contact", label: "Contact", shortLabel: "Contact", href: "#contact", icon: Send },
] as const;

export type PortfolioSectionId = (typeof PORTFOLIO_SECTIONS)[number]["id"];
