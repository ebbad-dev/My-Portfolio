import { statSync } from "node:fs";
import { join } from "node:path";
import {
  archiveProjects,
  portfolioProject,
  projects,
  siteConfig,
  skillGroups,
  socials,
  testimonials,
  type ArchiveProject,
  type Project,
} from "@/data/site";
import { resumeFacts, resumeSource, type ResumeProject } from "@/data/resume";

export const chatbotModes = ["Recruiter Mode", "Technical Deep Dive Mode", "Project Guide Mode", "Quick Summary Mode"] as const;

export type ChatbotMode = (typeof chatbotModes)[number];

type AnswerSource = "portfolio data" | "project case-study data" | "resume PDF facts" | "contact data" | "testimonial data";

const honestyNote =
  "I only answer from Ebbad's portfolio, case-study data, and resume facts. If a detail is not listed there, I will say so instead of guessing.";

const injectionTerms = [
  "ignore previous",
  "system prompt",
  "developer message",
  "reveal hidden",
  "jailbreak",
  "secret instruction",
  "hidden prompt",
  "act as",
];

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compactKey(text: string) {
  return normalize(text).replace(/[^a-z0-9+#.]/g, "");
}

function hasAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

function sentenceList(items: string[], max = 3) {
  return items.filter(Boolean).slice(0, max).join("; ");
}

function formatStack(stack: string[], max = 8) {
  const visible = stack.slice(0, max).join(", ");
  return stack.length > max ? `${visible}, and more` : visible;
}

function sourceLine(sources: AnswerSource[]) {
  return `\n\nSource: ${Array.from(new Set(sources)).join(" + ")}.`;
}

function withMode(mode: ChatbotMode, answer: string, sources: AnswerSource[] = ["portfolio data"]) {
  const prefix = mode === "Technical Deep Dive Mode" ? "Technical view: " : mode === "Project Guide Mode" ? "Project guide: " : "";
  return `${prefix}${answer}${sourceLine(sources)}`;
}

function resumePdfStatus() {
  try {
    const resumePath = join(process.cwd(), "public", resumeSource.path.replace(/^\//, ""));
    const modifiedDate = statSync(resumePath).mtime.toISOString().slice(0, 10);
    if (modifiedDate !== resumeSource.pdfLastModified) {
      return `Resume PDF: ${resumeSource.path}. The file was modified on ${modifiedDate}; extracted resume facts were recorded from the ${resumeSource.pdfLastModified} PDF, so open the PDF for the newest wording.`;
    }
    return `Resume PDF: ${resumeSource.path}, current extracted source date ${resumeSource.pdfLastModified}.`;
  } catch {
    return `Resume PDF path listed in the portfolio: ${resumeSource.path}.`;
  }
}

function linkStatus(status: Project["codeStatus"] | ArchiveProject["codeStatus"]) {
  if (status === "available") return "public code is linked";
  if (status === "private") return "code is private";
  if (status === "coming-soon") return "code is marked coming soon";
  return "code is not added";
}

function allProjectRecords() {
  return [
    ...projects,
    ...archiveProjects.map((project) => ({
      ...project,
      slug: project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      maturity: "Archive Project",
      featured: false,
      shortDescription: project.description,
      longDescription: project.description,
      problem: "",
      goal: "",
      role: "",
      actuallyBuilt: [],
      features: [],
      highlights: [],
      challenges: [],
      tradeoffs: [],
      lessons: [],
      future: [],
      architecture: [],
      technicalDecisions: [],
    })),
    {
      ...portfolioProject,
      slug: "portfolio",
      maturity: "Live Portfolio",
      featured: false,
      shortDescription: portfolioProject.description,
      longDescription: portfolioProject.description,
      problem: "",
      goal: "",
      role: "Built the portfolio as a recruiter-friendly project surface.",
      actuallyBuilt: ["Interactive demos", "3D skill globe", "Ask Ebbad guidance", "Contact delivery", "Vercel deployment"],
      features: ["Recruiter-first content", "Interactive demos", "Case studies", "Contact form"],
      highlights: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
      challenges: [],
      tradeoffs: [],
      lessons: [],
      future: [],
      architecture: [],
      technicalDecisions: [],
    },
  ] satisfies Project[];
}

function findProject(question: string) {
  const normalizedQuestion = normalize(question);
  const aliases: Record<string, string[]> = {
    "student-result-management-api": ["student management", "student result", "result api", "student api", "nexvis"],
    "teletrack-enterprise": ["teletrack", "network monitoring", "tele track"],
    proctorai: ["proctor", "proctor ai", "exam monitoring"],
    mirrormind: ["mirror", "mirror mind", "debate", "reasoning"],
    portfolio: ["portfolio", "website", "this site"],
    "netflix-console": ["netflix", "netflix console"],
    "distributed-banking-system": ["banking", "distributed banking", "sockets"],
    "criminal-database-management-system": ["criminal database", "criminal dbms"],
    "plagiarism-detector": ["plagiarism", "similarity"],
  };

  return allProjectRecords().find((project) => {
    const projectTerms = [
      project.title,
      project.slug,
      project.category,
      ...(aliases[project.slug] || []),
    ].map(normalize);
    return projectTerms.some((term) => term.length > 2 && normalizedQuestion.includes(term));
  });
}

function findResumeProject(question: string) {
  const normalizedQuestion = normalize(question);
  const compactQuestion = compactKey(question);
  return resumeFacts.projects.find((project) => {
    const title = normalize(project.title);
    const compactTitle = compactKey(project.title);
    return normalizedQuestion.includes(title) || compactQuestion.includes(compactTitle);
  });
}

function buildFeaturedProjectsAnswer(mode: ChatbotMode) {
  const featured = projects.filter((project) => project.featured);
  if (mode === "Quick Summary Mode") {
    return `My strongest projects are ${featured.map((project) => project.title).join(", ")}. Together they show AI/computer vision, database systems, and reasoning-product thinking.`;
  }

  return [
    "My best portfolio work is centered on three featured projects:",
    "ProctorAI: an exam-monitoring prototype with review-focused risk signals and evidence flow.",
    "TeleTrack Enterprise: a database and operations dashboard for devices, incidents, alerts, audit logs, and SLA tracking.",
    "MirrorMind: a reasoning workspace that maps claims, assumptions, evidence gaps, and counterarguments.",
    "Each project has a case study and interactive mock demo from the portfolio.",
  ].join(" ");
}

function buildProjectAnswer(project: Project, resumeProject: ResumeProject | undefined, mode: ChatbotMode) {
  const base = `${project.title} is my ${project.maturity.toLowerCase()} in ${project.category}. ${project.shortDescription}`;
  const code = `Code status: ${linkStatus(project.codeStatus)}${project.githubUrl ? ` at ${project.githubUrl}` : ""}.`;

  if (mode === "Technical Deep Dive Mode") {
    const decisions = project.technicalDecisions.length ? `Key decisions: ${sentenceList(project.technicalDecisions, 2)}.` : "";
    const architecture = project.architecture.length ? `Flow: ${project.architecture.join(" -> ")}.` : "";
    const resumeDetails = resumeProject ? `Resume stack: ${formatStack(resumeProject.techStack, 6)}.` : `Stack: ${formatStack(project.techStack, 6)}.`;
    return `${base} ${resumeDetails} ${architecture} ${decisions} ${code}`.replace(/\s+/g, " ").trim();
  }

  if (mode === "Project Guide Mode") {
    const built = project.actuallyBuilt.length ? `I worked on: ${sentenceList(project.actuallyBuilt, 4)}.` : "";
    const features = project.features.length ? `Main features: ${sentenceList(project.features, 5)}.` : "";
    return `${base} Problem: ${project.problem || "Not separately listed."} ${built} ${features} ${code}`.replace(/\s+/g, " ").trim();
  }

  if (mode === "Quick Summary Mode") {
    return `${project.title}: ${project.shortDescription} Stack: ${formatStack(project.techStack, 5)}. ${code}`;
  }

  const highlights = project.highlights.length ? `What it shows: ${sentenceList(project.highlights, 3)}.` : "";
  const built = project.actuallyBuilt.length ? `My contribution included ${sentenceList(project.actuallyBuilt, 3).toLowerCase()}.` : "";
  return `${base} ${highlights} ${built} ${code}`.replace(/\s+/g, " ").trim();
}

function buildSkillsAnswer(mode: ChatbotMode) {
  const resumeSkills = `My core skill areas are full-stack development, backend APIs, SQL/database systems, AI/ML concepts, computer vision, and systems-style programming. Key tools include ${formatStack(resumeFacts.skills.languages, 6)}, React/Next.js, Node/Express, Python APIs, and relational databases.`;

  if (mode === "Quick Summary Mode") {
    return resumeSkills;
  }

  const projectBacked = Object.entries(skillGroups)
    .slice(0, 4)
    .map(([group, skills]) => `${group}: ${skills.slice(0, 3).map((skill) => skill.name).join(", ")}`)
    .join("; ");

  return `${resumeSkills} Project-backed areas include ${projectBacked}. I am strongest where UI, APIs, data models, and practical product logic connect.`;
}

function buildResumeAnswer(mode: ChatbotMode) {
  const projectNames = resumeFacts.projects.slice(0, 6).map((project) => project.title).join(", ");
  const certs = resumeFacts.certifications.join(", ");

  if (mode === "Quick Summary Mode") {
    return `My resume highlights ${resumeFacts.education.degree} at ${resumeFacts.education.institution}, CGPA ${resumeFacts.education.cgpa}, Harvard CS50, and projects like ${projectNames}. Use the Download Resume button for the full one-page PDF.`;
  }

  return `${resumeFacts.summary} ${resumeFacts.seeking} My resume also highlights ${projectNames}. Certifications include ${certs}. You can use the portfolio's Download Resume button to open the current one-page PDF. ${resumePdfStatus()}`;
}

function buildContactAnswer() {
  const github = socials.find((social) => social.kind === "github")?.href;
  const linkedin = socials.find((social) => social.kind === "linkedin")?.href;
  return `You can contact me by email at ${siteConfig.emailAddress}. The portfolio also lists my phone/WhatsApp (${siteConfig.phoneDisplay}), LinkedIn (${linkedin}), and GitHub (${github}). For recruiter conversations, email or LinkedIn is the cleanest path.`;
}

function buildAvailabilityAnswer() {
  return "I am open to internships, collaborations, freelance work, and technical project opportunities. My strongest fit is work involving full-stack development, backend APIs, databases, AI-assisted tools, or practical product engineering. I do not have exact start-date, salary, or work-authorization details in the approved portfolio data.";
}

function buildTestimonialsAnswer() {
  return testimonials
    .map((item) => `${item.name} (${item.role}) gave a 5-star testimonial and highlighted ${item.quote.split(".")[0].toLowerCase()}.`)
    .join(" ");
}

function buildEducationAnswer() {
  const initiatives = resumeFacts.initiatives.map((item) => `${item.title}, ${item.organization} (${item.dates})`).join("; ");
  return `I am studying ${resumeFacts.education.degree} at ${resumeFacts.education.institution}, ${resumeFacts.education.dates}, with CGPA ${resumeFacts.education.cgpa}. Relevant coursework includes ${resumeFacts.education.coursework.join(", ")}. I also have leadership/communication experience through ${initiatives}.`;
}

function buildCodeAnswer() {
  const available = allProjectRecords()
    .filter((project) => project.codeStatus === "available" && project.githubUrl)
    .map((project) => `${project.title}: ${project.githubUrl}`)
    .join(". ");

  return `You can view my GitHub profile at ${socials.find((social) => social.kind === "github")?.href}. Public code links are shown only where the portfolio marks code as available. Current linked project repos include: ${available}. Portfolio source: ${siteConfig.portfolioRepositoryUrl}.`;
}

function fallbackAnswer(question: string) {
  const project = findProject(question);
  if (project) {
    return buildProjectAnswer(project, findResumeProject(project.title), "Recruiter Mode");
  }

  return "I don't have that exact detail in my approved portfolio data, but I can help with my projects, skills, resume, education, availability, or contact information.";
}

export function getChatbotAnswer(question: string, mode: ChatbotMode = "Recruiter Mode") {
  const lower = normalize(question);

  if (hasAny(lower, ["hi", "hello", "hey", "salam", "assalam", "aoa"]) && lower.split(" ").length <= 4) {
    return withMode(mode, "Hi, I'm Ask Ebbad. I can help you explore my projects, skills, resume, availability, and contact details. What would you like to know?", ["portfolio data"]);
  }

  if (injectionTerms.some((term) => lower.includes(term))) {
    return withMode(mode, `I cannot follow instructions to bypass the portfolio knowledge rules. ${honestyNote}`, ["portfolio data"]);
  }

  const project = findProject(question);
  if (project) {
    return withMode(mode, buildProjectAnswer(project, findResumeProject(project.title), mode), ["project case-study data", "resume PDF facts"]);
  }

  if (hasAny(lower, ["best project", "best projects", "strongest", "featured", "top project", "case study", "case studies", "impressive"])) {
    return withMode(mode, buildFeaturedProjectsAnswer(mode), ["project case-study data", "resume PDF facts"]);
  }

  if (hasAny(lower, ["resume", "cv", "highlight", "highlights", "cgpa", "certification", "certifications", "education"])) {
    return withMode(mode, buildResumeAnswer(mode), ["resume PDF facts"]);
  }

  if (hasAny(lower, ["skill", "stack", "technology", "technologies", "tools", "language", "framework", "database", "ai", "ml", "backend", "frontend"])) {
    return withMode(mode, buildSkillsAnswer(mode), ["resume PDF facts", "portfolio data"]);
  }

  if (hasAny(lower, ["available", "availability", "internship", "hire", "hiring", "freelance", "collaboration", "opportunity", "job"])) {
    return withMode(mode, buildAvailabilityAnswer(), ["portfolio data", "resume PDF facts"]);
  }

  if (hasAny(lower, ["contact", "email", "phone", "whatsapp", "linkedin", "github", "reach", "message"])) {
    return withMode(mode, buildContactAnswer(), ["contact data"]);
  }

  if (hasAny(lower, ["testimonial", "testimonials", "reference", "feedback", "review", "client", "professionalism", "communication"])) {
    return withMode(mode, buildTestimonialsAnswer(), ["testimonial data"]);
  }

  if (hasAny(lower, ["who", "about", "summary", "intro", "introduce", "profile"])) {
    return withMode(mode, `I'm Ebbad Ur Rehman, a Software Engineering student at COMSATS Lahore. I build full-stack, AI-assisted, and database-driven projects, with featured work in ProctorAI, TeleTrack Enterprise, and MirrorMind. I'm currently focused on internships, collaborations, and practical software projects where I can keep growing as an engineer.`, ["portfolio data", "resume PDF facts"]);
  }

  if (hasAny(lower, ["class representative", "leadership", "volunteer", "technoverse", "tutor", "initiative", "initiatives", "coursework"])) {
    return withMode(mode, buildEducationAnswer(), ["resume PDF facts", "portfolio data"]);
  }

  if (hasAny(lower, ["code", "repo", "repository", "source"])) {
    return withMode(mode, buildCodeAnswer(), ["portfolio data", "contact data"]);
  }

  return withMode(mode, fallbackAnswer(question), ["portfolio data", "resume PDF facts"]);
}
