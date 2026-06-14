import { Bot, Briefcase, FileText, Home, Layers, MessageSquare, Orbit, PlayCircle, Route, Send } from "lucide-react";

export const journeySections = [
  { id: "home", label: "Hero", shortLabel: "Home", href: "#home", icon: Home },
  { id: "recruiters", label: "For Recruiters", shortLabel: "Recruiters", href: "#recruiters", icon: Briefcase },
  { id: "projects", label: "Featured Projects", shortLabel: "Projects", href: "#projects", icon: Layers },
  { id: "skills", label: "Skill Globe", shortLabel: "Skills", href: "#skills", icon: Orbit },
  { id: "demos", label: "Interactive Demos", shortLabel: "Demos", href: "#demos", icon: PlayCircle },
  { id: "journey", label: "Journey", shortLabel: "Journey", href: "#journey", icon: Route },
  { id: "testimonials", label: "Testimonials", shortLabel: "Reviews", href: "#testimonials", icon: MessageSquare },
  { id: "resume", label: "Resume", shortLabel: "Resume", href: "#resume", icon: FileText },
  { id: "ask-ebbad", label: "Ask Ebbad", shortLabel: "Ask AI", href: "#ask-ebbad", icon: Bot },
  { id: "contact", label: "Contact", shortLabel: "Contact", href: "#contact", icon: Send },
] as const;

export type JourneySectionId = (typeof journeySections)[number]["id"];
