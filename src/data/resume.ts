export type ResumeProject = {
  title: string;
  techStack: string[];
  bullets: string[];
};

export type ResumeInitiative = {
  title: string;
  organization: string;
  dates: string;
  bullets: string[];
};

export const resumeSource = {
  path: "/resume/ebbad-resume.pdf",
  pdfLastModified: "2026-06-28",
  extractedFromPdf: true,
};

export const resumeFacts = {
  headline: "Software Engineering Student",
  summary:
    "Software Engineering student with a 3.4 CGPA, Harvard CS50 certification, and project work across full-stack development, AI/ML, computer vision, distributed systems, and database design.",
  seeking:
    "Seeking a product-driven software team where he can contribute to reliable backend APIs, clear interfaces, and practical engineering workflows.",
  education: {
    degree: "BS Software Engineering",
    institution: "COMSATS University Islamabad, Lahore Campus",
    dates: "Sep 2024-2028 (Expected)",
    cgpa: "3.4",
    coursework: ["Data Structures & Algorithms", "DBMS", "OOP", "Computer Networks", "AI"],
  },
  certifications: [
    "CS50: Intro to Computer Science (Harvard)",
    "Full-Stack Web Development (Coursera)",
    "Agentic AI & Web Technology (Virtual University Bootcamp)",
  ],
  skills: {
    languages: ["Python", "C/C++", "Java", "JavaScript", "TypeScript", "SQL", "HTML", "CSS"],
    frameworks: ["Node.js", "Express.js", "Flask", "FastAPI", "Django", "React", "Next.js", "PyTorch", "TensorFlow", "OpenCV"],
    databases: ["MySQL", "PostgreSQL", "MSSQL Server", "MongoDB", "SQLite", "Prisma", "PyODBC"],
    tools: ["Git", "GitHub", "Redis", "VS Code", "Docker", "GitHub Actions", "IntelliJ IDEA", "Postman", "Vercel"],
    concepts: ["OOP", "DSA", "AI/ML", "Computer Vision", "NLP", "Distributed Systems", "REST APIs", "Agile Development"],
  },
  projects: [
    {
      title: "Mirror-Mind",
      techStack: ["Next.js", "TypeScript", "Prisma", "Redis", "AI/ML"],
      bullets: [
        "Full-stack debate and self-reflection platform that turns opinions into visual argument maps, assumptions, evidence gaps, and counterarguments.",
        "Resume lists multi-provider LLM routing, deterministic fallback behavior, claim classification, evidence triangulation, collaborative workspaces, bilingual Urdu/English mode, and PDF export.",
      ],
    },
    {
      title: "ProctorAI",
      techStack: ["Python", "Computer Vision", "AI/ML"],
      bullets: [
        "AI exam monitoring prototype using webcam analysis, face detection, configurable risk scoring, structured incident logs, evidence review, and instructor-facing reporting flows.",
      ],
    },
    {
      title: "TeleTrack Enterprise",
      techStack: ["Python", "FastAPI", "PostgreSQL", "React"],
      bullets: [
        "Network operations project for managing devices, technicians, facilities, alerts, incidents, audit logs, SLA tracking, and uptime-style reporting through a dashboard workflow.",
      ],
    },
    {
      title: "Student Result Management API",
      techStack: ["Node.js", "Express.js", "MongoDB"],
      bullets: [
        "Backend API for student records, subjects, result entries, validation, role-aware routes, and clean CRUD workflows.",
      ],
    },
    {
      title: "Distributed Banking System",
      techStack: ["Java", "Sockets", "Multi-threading"],
      bullets: [
        "Multi-client banking simulation with socket-based client-server architecture, thread management, transaction handling, and consistency-focused concurrency controls.",
      ],
    },
    {
      title: "Netflix Console / DBMS",
      techStack: ["Python", "Flask", "SQL Server", "HTML/JS"],
      bullets: [
        "Netflix-inspired database system managing subscribers, content, and watch history with CRUD operations, stored procedures, triggers, views, and export-oriented reporting.",
      ],
    },
  ] satisfies ResumeProject[],
  initiatives: [
    {
      title: "Private Tutor - CS, Maths & Sciences",
      organization: "International Teachers Academy, Lahore",
      dates: "2023-2025",
      bullets: ["Taught O/A Level students across five subjects, strengthening communication, curriculum planning, and one-on-one assessment skills."],
    },
    {
      title: "Class Representative",
      organization: "COMSATS University Lahore",
      dates: "2024-Present",
      bullets: ["Elected cohort representative for 60+ students, coordinating student-faculty communication and administrative processes."],
    },
    {
      title: "Sponsorship & Volunteer Lead",
      organization: "TechnoVerse 2025",
      dates: "2025",
      bullets: ["Supported sponsorship outreach for a 500+ attendee university tech event, managing stakeholder correspondence and event coordination responsibilities."],
    },
  ] satisfies ResumeInitiative[],
};
