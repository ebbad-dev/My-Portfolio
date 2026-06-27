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
  pdfLastModified: "2026-06-13",
  extractedFromPdf: true,
};

export const resumeFacts = {
  headline: "Software Engineering Student",
  summary:
    "Software Engineering student with a 3.4 CGPA, Harvard CS50 certification, and project work across full-stack AI platforms, distributed systems, and database design.",
  seeking:
    "Looking to join a product-driven software team and contribute to building and scaling real-world applications.",
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
    tools: ["Git", "GitHub", "Redis", "VS Code", "Docker", "GitHub Actions", "IntelliJ IDEA"],
    concepts: ["OOP", "DSA", "AI/ML", "Computer Vision", "NLP", "Distributed Systems", "REST APIs", "Agile Development"],
  },
  projects: [
    {
      title: "Mirror-Mind",
      techStack: ["Next.js", "TypeScript", "Prisma", "Redis", "AI/ML"],
      bullets: [
        "Full-stack AI debate and self-reflection platform generating visual argument maps.",
        "Resume lists multi-provider LLM routing, Redis rate limiting, offline deterministic fallback, and PostgreSQL-ready schema.",
        "Includes claim classification, evidence triangulation, counterargument generation, collaborative workspaces, bilingual Urdu/English mode, and PDF export.",
      ],
    },
    {
      title: "ProctorAI",
      techStack: ["Python", "Computer Vision", "AI/ML"],
      bullets: [
        "Real-time AI exam proctoring app using face detection to flag suspicious behavior.",
        "Resume lists a configurable alert pipeline with structured incident logs and an estimated 40% manual invigilation effort reduction.",
      ],
    },
    {
      title: "Netflix Console",
      techStack: ["Python", "Flask", "SQL Server", "HTML/JS"],
      bullets: [
        "Netflix-inspired DBMS for subscribers, content, and watch history.",
        "Resume lists stored procedures, triggers, views, CRUD operations, dashboard analytics, and PDF/CSV/Excel export.",
      ],
    },
    {
      title: "Distributed Banking System",
      techStack: ["Java", "Sockets", "Multi-threading"],
      bullets: [
        "Multi-client concurrent banking app using socket-based client-server architecture.",
        "Resume lists stress testing for simultaneous multi-user access with zero transaction conflicts and full data consistency.",
      ],
    },
    {
      title: "Criminal Database Management System",
      techStack: ["SQL", "Java/C++"],
      bullets: [
        "Normalized relational schema with role-based access control for secure criminal record storage.",
        "Resume lists advanced search, filtering, and report generation with a 60% average case-lookup time reduction.",
      ],
    },
    {
      title: "TeleTrack Enterprise",
      techStack: ["Python", "FastAPI", "PostgreSQL", "React"],
      bullets: [
        "Network monitoring system for tracking and managing networking devices.",
        "Resume lists a React dashboard with real-time device status, SLA monitoring, audit logs, automated reports, and an estimated 50% fault-detection improvement.",
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
      bullets: ["Spearheaded sponsorship for a 500+ attendee university tech event and secured PKR 200,000 in external funding."],
    },
  ] satisfies ResumeInitiative[],
};
