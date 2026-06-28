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
    "Software Engineering student with hands-on experience building full-stack, AI-assisted, and database-driven systems using Python, JavaScript/TypeScript, Node.js, React, SQL, and modern backend workflows.",
  seeking:
    "Focused on practical engineering problems with foundations in DSA, OOP, DBMS, APIs, computer vision, and system design.",
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
        "Built a debate and self-reflection platform that converts opinions into argument maps, assumptions, evidence gaps, and counterarguments.",
        "Implemented LLM routing concepts, deterministic fallback behavior, bilingual mode, collaborative workspaces, and PDF export workflows.",
      ],
    },
    {
      title: "ProctorAI",
      techStack: ["Python", "Computer Vision", "AI/ML"],
      bullets: [
        "Developed an exam monitoring prototype with webcam analysis, face detection, configurable risk scoring, evidence review, and instructor reporting flows.",
      ],
    },
    {
      title: "TeleTrack Enterprise",
      techStack: ["Python", "FastAPI", "PostgreSQL", "React"],
      bullets: [
        "Designed a network operations system for devices, technicians, facilities, alerts, incidents, audit logs, SLA tracking, and uptime-style reporting.",
      ],
    },
    {
      title: "Student Result Management API",
      techStack: ["Node.js", "Express.js", "MongoDB"],
      bullets: [
        "Created a backend API for student records, subjects, result entries, validation, role-aware routes, and maintainable academic CRUD workflows.",
      ],
    },
    {
      title: "Distributed Banking System",
      techStack: ["Java", "Sockets", "Multi-threading"],
      bullets: [
        "Implemented a multi-client banking simulation with socket-based client-server architecture, thread management, and consistency-focused transaction handling.",
      ],
    },
    {
      title: "Netflix Console DBMS",
      techStack: ["Python", "Flask", "SQL Server", "HTML/JS"],
      bullets: [
        "Modeled a Netflix-inspired database system for subscribers, content, and watch history with CRUD workflows, stored procedures, triggers, views, and reporting exports.",
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
      bullets: ["Represent 60+ students by coordinating student-faculty communication and supporting administrative processes."],
    },
    {
      title: "Sponsorship & Volunteer Lead",
      organization: "TechnoVerse 2025",
      dates: "2025",
      bullets: ["Supported sponsorship outreach for a 500+ attendee university tech event through stakeholder communication and event coordination."],
    },
  ] satisfies ResumeInitiative[],
};
