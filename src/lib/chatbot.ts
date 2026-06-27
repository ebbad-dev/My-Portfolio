import { statSync } from "node:fs";
import { join } from "node:path";
import {
  archiveProjects,
  currentFocus,
  portfolioProject,
  projects,
  quickFacts,
  recruiterSummary,
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
  return ` Source: ${Array.from(new Set(sources)).join(" + ")}.`;
}

function withMode(mode: ChatbotMode, answer: string, sources: AnswerSource[] = ["portfolio data"]) {
  return `${mode}: ${answer}${sourceLine(sources)}`;
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
    return `Best portfolio projects: ${featured.map((project) => project.title).join(", ")}. They cover ${featured.map((project) => project.category).join("; ")}.`;
  }

  const projectSummaries = featured
    .map((project) => `${project.title}: ${project.shortDescription} Role: ${project.role}`)
    .join(" ");

  const resumeOverlap = resumeFacts.projects
    .filter((resumeProject) => featured.some((project) => compactKey(resumeProject.title).includes(compactKey(project.title)) || compactKey(project.title).includes(compactKey(resumeProject.title))))
    .map((project) => project.title);

  return `His strongest public case-study projects are ${featured.map((project) => project.title).join(", ")}. ${projectSummaries} Resume overlap: ${resumeOverlap.length ? resumeOverlap.join(", ") : "the resume also lists related project work, but not every title maps one-to-one to a featured case study"}.`;
}

function buildProjectAnswer(project: Project, resumeProject: ResumeProject | undefined, mode: ChatbotMode) {
  const base = `${project.title} is a ${project.maturity} in ${project.category}. ${project.longDescription || project.shortDescription}`;
  const code = `Code status: ${linkStatus(project.codeStatus)}${project.githubUrl ? ` at ${project.githubUrl}` : ""}.`;

  if (mode === "Technical Deep Dive Mode") {
    const decisions = project.technicalDecisions.length ? `Technical decisions: ${sentenceList(project.technicalDecisions, 3)}.` : "";
    const architecture = project.architecture.length ? `Flow: ${project.architecture.join(" -> ")}.` : "";
    const tradeoffs = project.tradeoffs.length ? `Trade-offs: ${sentenceList(project.tradeoffs, 2)}.` : "";
    const resumeDetails = resumeProject ? `Resume adds: ${sentenceList(resumeProject.bullets, 2)} Tech listed on resume: ${formatStack(resumeProject.techStack)}.` : "";
    return `${base} Tech stack: ${formatStack(project.techStack)}. ${architecture} ${decisions} ${tradeoffs} ${resumeDetails} ${code}`.replace(/\s+/g, " ").trim();
  }

  if (mode === "Project Guide Mode") {
    const built = project.actuallyBuilt.length ? `What Ebbad actually built: ${sentenceList(project.actuallyBuilt, 5)}.` : "";
    const features = project.features.length ? `Key features: ${sentenceList(project.features, 6)}.` : "";
    return `${base} Problem: ${project.problem || "Not separately listed for this archive item."} Goal: ${project.goal || "Not separately listed for this archive item."} ${built} ${features} ${code}`.replace(/\s+/g, " ").trim();
  }

  if (mode === "Quick Summary Mode") {
    return `${project.title}: ${project.shortDescription} Stack: ${formatStack(project.techStack, 5)}. ${code}`;
  }

  const highlights = project.highlights.length ? `Recruiter angle: ${sentenceList(project.highlights, 4)}.` : "";
  const built = project.actuallyBuilt.length ? `Evidence of work: ${sentenceList(project.actuallyBuilt, 3)}.` : "";
  const resumeDetails = resumeProject ? `Resume also lists: ${sentenceList(resumeProject.bullets, 1)}.` : "";
  return `${base} ${highlights} ${built} ${resumeDetails} ${code}`.replace(/\s+/g, " ").trim();
}

function buildSkillsAnswer(mode: ChatbotMode) {
  const resumeSkills = [
    `Languages: ${formatStack(resumeFacts.skills.languages)}`,
    `Frameworks/libraries: ${formatStack(resumeFacts.skills.frameworks, 10)}`,
    `Databases: ${formatStack(resumeFacts.skills.databases)}`,
    `Concepts: ${formatStack(resumeFacts.skills.concepts)}`,
  ].join(". ");

  if (mode === "Quick Summary Mode") {
    return `${resumeSkills}. Portfolio focus areas: ${currentFocus.slice(0, 6).join(", ")}.`;
  }

  const projectBacked = Object.entries(skillGroups)
    .map(([group, skills]) => `${group}: ${skills.slice(0, 5).map((skill) => `${skill.name} (${skill.level})`).join(", ")}`)
    .join(". ");

  return `${resumeSkills}. Portfolio skill groups add project-backed context: ${projectBacked}.`;
}

function buildResumeAnswer(mode: ChatbotMode) {
  const projectNames = resumeFacts.projects.slice(0, 6).map((project) => project.title).join(", ");
  const certs = resumeFacts.certifications.join(", ");

  if (mode === "Quick Summary Mode") {
    return `${resumeFacts.summary} Education: ${resumeFacts.education.degree}, ${resumeFacts.education.institution}, CGPA ${resumeFacts.education.cgpa}. Certifications: ${certs}. ${resumePdfStatus()}`;
  }

  return `${resumeFacts.summary} ${resumeFacts.seeking} Education: ${resumeFacts.education.degree} at ${resumeFacts.education.institution}, ${resumeFacts.education.dates}, CGPA ${resumeFacts.education.cgpa}. Resume projects include ${projectNames}. Certifications: ${certs}. ${resumePdfStatus()}`;
}

function buildContactAnswer() {
  const publicLinks = socials
    .filter((social) => social.status === "available")
    .map((social) => `${social.label}: ${social.href}`)
    .join(". ");

  return `Best contact path: email Ebbad at ${siteConfig.emailAddress}. Phone/WhatsApp listed on the portfolio: ${siteConfig.phoneDisplay}; WhatsApp link: ${siteConfig.whatsappHref}. Public links: ${publicLinks}.`;
}

function buildAvailabilityAnswer() {
  return `The portfolio says Ebbad is open to internships, collaborations, freelance work, and technical project opportunities. The resume says he is looking to join a product-driven software team and contribute to building and scaling real-world applications. I do not have a specific start date, work authorization detail, or salary expectation in the approved data.`;
}

function buildTestimonialsAnswer() {
  return testimonials
    .map((item) => `${item.name} (${item.role}) says: ${item.quote}`)
    .join(" ");
}

function buildEducationAnswer() {
  const initiatives = resumeFacts.initiatives.map((item) => `${item.title}, ${item.organization} (${item.dates})`).join("; ");
  return `${resumeFacts.education.degree} at ${resumeFacts.education.institution}, ${resumeFacts.education.dates}, CGPA ${resumeFacts.education.cgpa}. Coursework listed on the resume: ${resumeFacts.education.coursework.join(", ")}. Initiatives: ${initiatives}. Portfolio quick facts: ${quickFacts.join(", ")}.`;
}

function buildCodeAnswer() {
  const available = allProjectRecords()
    .filter((project) => project.codeStatus === "available" && project.githubUrl)
    .map((project) => `${project.title}: ${project.githubUrl}`)
    .join(". ");

  return `Available code is linked per project only when the portfolio marks it public. GitHub profile: ${socials.find((social) => social.kind === "github")?.href}. Public project links: ${available}. Portfolio source: ${siteConfig.portfolioRepositoryUrl}.`;
}

function fallbackAnswer(question: string) {
  const project = findProject(question);
  if (project) {
    return buildProjectAnswer(project, findResumeProject(project.title), "Recruiter Mode");
  }

  return `I do not have that exact detail in the approved portfolio, case-study, or resume data. ${honestyNote} For anything specific, contact Ebbad at ${siteConfig.emailAddress}.`;
}

export function getChatbotAnswer(question: string, mode: ChatbotMode = "Recruiter Mode") {
  const lower = normalize(question);

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
    return withMode(mode, `${recruiterSummary} ${honestyNote}`, ["portfolio data", "resume PDF facts"]);
  }

  if (hasAny(lower, ["class representative", "leadership", "volunteer", "technoverse", "tutor", "initiative", "initiatives", "coursework"])) {
    return withMode(mode, buildEducationAnswer(), ["resume PDF facts", "portfolio data"]);
  }

  if (hasAny(lower, ["code", "repo", "repository", "source"])) {
    return withMode(mode, buildCodeAnswer(), ["portfolio data", "contact data"]);
  }

  return withMode(mode, fallbackAnswer(question), ["portfolio data", "resume PDF facts"]);
}
