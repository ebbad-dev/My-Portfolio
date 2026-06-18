export type LinkStatus = "available" | "missing";
export type CodeStatus = "available" | "coming-soon" | "private" | "not-added";
export type ArchiveFilter = "AI" | "Database" | "Backend" | "Full-Stack" | "Systems" | "Algorithms";

export type SocialLink = {
  label: string;
  href: string;
  status: LinkStatus;
  kind: "linkedin" | "github" | "instagram" | "email" | "resume";
};

export type Project = {
  title: string;
  slug: string;
  category: string;
  maturity: string;
  featured: boolean;
  shortDescription: string;
  longDescription: string;
  problem: string;
  goal: string;
  role: string;
  actuallyBuilt: string[];
  techStack: string[];
  features: string[];
  highlights: string[];
  challenges: string[];
  tradeoffs: string[];
  lessons: string[];
  future: string[];
  architecture: string[];
  technicalDecisions: string[];
  githubUrl?: string;
  codeStatus: CodeStatus;
  demo?: string;
  demoRoute?: string;
  demoLabel?: string;
  thumbnail?: string;
  thumbnailAlt?: string;
  visualAccent?: "cyan" | "blue" | "violet";
};

export type ArchiveProject = {
  title: string;
  category: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  codeStatus: CodeStatus;
  tags: ArchiveFilter[];
};

export type Skill = {
  name: string;
  description: string;
  level: string;
  projects?: string[];
};

export const siteConfig = {
  name: "Ebbad Ur Rehman",
  shortName: "Ebbad",
  title: "Software Engineering Student | Full-Stack Developer | AI / ML / Database / Systems Enthusiast",
  location: "Lahore, Pakistan",
  university: "COMSATS University Islamabad, Lahore Campus",
  degree: "BS Software Engineering",
  brandLine: "Building intelligent systems from first principles.",
  heroHeadline: "I build intelligent full-stack systems that turn ideas into real products.",
  heroSubheadline:
    "I work across AI-powered tools, database-backed applications, backend APIs, computer vision projects, and interactive product experiences.",
  heroPersonalLine: "I like projects where the interface, the data, the logic, and the user problem all connect.",
  seoTitle: "Ebbad Ur Rehman - Full-Stack Developer | Software Engineering Student",
  seoDescription:
    "Portfolio of Ebbad Ur Rehman, a Software Engineering student building full-stack applications, AI tools, database systems, computer vision projects, and immersive digital products.",
  siteUrl: "https://ebbad-portfolio.vercel.app",
  portfolioRepositoryUrl: "https://github.com/ebbad-dev/My-Portfolio",
  emailAddress: "ebbadurrehman538@gmail.com",
  emailHref: "mailto:ebbadurrehman538@gmail.com?subject=Portfolio%20Inquiry%20for%20Ebbad%20Ur%20Rehman",
  phoneDisplay: "0302 1846044",
  whatsappHref: "https://wa.me/923021846044?text=Hi%20Ebbad%2C%20I%20visited%20your%20portfolio%20and%20wanted%20to%20connect.",
  resumePath: "/resume/ebbad-resume.pdf",
  resumeAvailable: true,
  profileImagePath: "/images/profile/profile-1.jpeg",
  introVideoPath: "/videos/intro.mp4",
  introVideoAvailable: true,
  formspreeEndpoint: "https://formspree.io/f/mqeogggp",
};

export const socials: SocialLink[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/ebbad-ur-rehman/", status: "available", kind: "linkedin" },
  { label: "GitHub", href: "https://github.com/ebbad-dev", status: "available", kind: "github" },
  { label: "Instagram", href: "https://www.instagram.com/ebbad_official/", status: "available", kind: "instagram" },
  { label: "Email", href: siteConfig.emailHref, status: "available", kind: "email" },
  { label: "Resume", href: siteConfig.resumePath, status: "available", kind: "resume" },
];

export const recruiterSummary =
  "I'm Ebbad Ur Rehman, a Software Engineering student at COMSATS Lahore. My strongest work connects product interfaces, backend logic, databases, computer vision, and reasoning workflows. Key projects include ProctorAI, TeleTrack Enterprise, and MirrorMind. I'm looking for internships, collaborations, and opportunities where I can build useful software and keep growing as an engineer.";

export const quickFacts = [
  "Software Engineering student",
  "COMSATS Lahore",
  "Full-stack development focus",
  "AI / ML and computer vision interest",
  "Database and backend systems experience",
  "Class Representative for 60+ students",
  "Harvard CS50 certified",
  "Open to internships and collaborations",
];

export const currentFocus = [
  "Full-stack applications",
  "AI-powered tools",
  "Backend APIs",
  "Database systems",
  "Computer vision",
  "System design",
  "Clean UI/UX",
  "Real-world project development",
];

export const projects: Project[] = [
  {
    title: "ProctorAI",
    slug: "proctorai",
    category: "AI / Computer Vision / Exam Integrity",
    maturity: "Advanced Academic Prototype",
    featured: true,
    shortDescription:
      "An AI-powered exam monitoring system combining webcam analysis, risk scoring, evidence logging, and instructor reporting.",
    longDescription:
      "ProctorAI is an exam integrity system designed to help monitor online assessments using AI and behavior signals. It combines computer vision, audio detection, browser activity tracking, risk scoring, evidence capture, and reporting into a structured monitoring workflow.",
    problem: "Online exams can be difficult to monitor fairly without structured evidence and review tools.",
    goal: "Build a system that combines computer vision and activity signals into a reviewable exam integrity dashboard.",
    role:
      "Worked on system planning, AI monitoring flow, risk scoring direction, dashboard/reporting ideas, and integration thinking across detection, evidence, and instructor review.",
    actuallyBuilt: [
      "Designed the project flow around monitoring sessions",
      "Helped define detection modules and risk events",
      "Worked on dashboard and reporting direction",
      "Structured how evidence and risk data should support instructor review",
      "Prepared project explanation and presentation material",
    ],
    techStack: ["Python", "OpenCV", "Streamlit", "FastAPI", "Flask", "SQLite", "Computer Vision", "Audio Processing"],
    features: [
      "Face detection",
      "Eye movement monitoring",
      "Head pose tracking",
      "Phone detection",
      "Audio anomaly detection",
      "Tab switch detection",
      "Evidence screenshots",
      "Risk score timeline",
      "Instructor dashboard",
    ],
    highlights: ["Multi-signal monitoring approach", "Risk scoring pipeline", "Evidence-based review", "AI + backend + reporting integration"],
    challenges: [
      "Balancing multiple weak signals without presenting one event as a final verdict",
      "Designing reports that help instructors review evidence instead of trusting a black box",
    ],
    tradeoffs: [
      "Use risk scoring as a review aid rather than an automatic accusation",
      "Keep demo data synthetic so the portfolio does not imply a deployed production system",
    ],
    lessons: ["Good AI products need review workflows, not only detection models.", "Evidence and context matter as much as the raw signal."],
    future: ["Add real deployment links when available", "Improve model accuracy and privacy controls", "Expand instructor review tools"],
    architecture: ["Webcam / Audio / Browser Events", "Detection Modules", "Risk Engine", "Evidence Logger", "Instructor Dashboard", "Report Generator"],
    technicalDecisions: [
      "Used risk scoring as an instructor review signal instead of presenting single events as final cheating proof.",
      "Kept demo data synthetic because the public portfolio should not imply a production exam-monitoring deployment.",
      "Structured evidence around reviewability so instructors can inspect context before making decisions.",
    ],
    githubUrl: "https://github.com/ebbad-dev/Proctor-Ai",
    codeStatus: "coming-soon",
    demoRoute: "/demos/proctorai",
    demoLabel: "Interactive Portfolio Demo",
    thumbnail: "/images/projects/proctorai-thumbnail.svg",
    thumbnailAlt: "Stylized ProctorAI dashboard thumbnail with webcam scan, risk meter, evidence timeline, and review queue",
    visualAccent: "cyan",
  },
  {
    title: "TeleTrack Enterprise",
    slug: "teletrack-enterprise",
    category: "Database / Network Monitoring / Enterprise Dashboard",
    maturity: "Database Systems Project",
    featured: true,
    shortDescription:
      "An enterprise telemetry and network monitoring database system for devices, facilities, incidents, alerts, audit logs, SLA tracking, and topology views.",
    longDescription:
      "TeleTrack Enterprise is a database-focused network monitoring project designed around enterprise telemetry. It models how devices, facilities, technicians, alerts, incidents, and audit logs interact inside a monitoring system.",
    problem: "Enterprise networks need organized tracking of devices, alerts, technicians, incidents, and uptime.",
    goal: "Design a database system that can support monitoring, reporting, incident management, and audit visibility.",
    role:
      "Worked on database planning, system design, dashboard thinking, object definitions, procedures, triggers, audit logic, and viva/project explanation.",
    actuallyBuilt: [
      "Designed database entities and relationships",
      "Planned stored procedures and triggers",
      "Structured incident, alert, and audit workflows",
      "Worked on dashboard and reporting ideas",
      "Prepared technical explanation for database viva",
    ],
    techStack: ["SQL", "SQLite / PostgreSQL direction", "Flask concepts", "React dashboard direction", "Stored Procedures", "Triggers", "Views"],
    features: ["Device management", "Facility management", "Technician assignment", "Alerts", "Incidents", "SLA tracking", "Audit logs", "Topology view"],
    highlights: ["Relational database modeling", "Trigger-based automation", "Audit trail design", "SLA and uptime reporting"],
    challenges: ["Keeping the schema flexible enough for alerts, devices, incidents, and technician workflows", "Making database logic explainable for viva review"],
    tradeoffs: ["Prioritize database clarity over production networking integrations", "Represent topology as a demo preview until real monitoring agents exist"],
    lessons: ["A strong database model makes dashboards easier to reason about.", "Audit logs and status history make operational systems more trustworthy."],
    future: ["Connect live telemetry sources", "Add real-time alert ingestion", "Expand topology and SLA reporting"],
    architecture: ["Devices / Facilities / Technicians", "Metrics / Alerts", "Incidents", "SLA Tracking", "Audit Logs", "Dashboard Reports"],
    technicalDecisions: [
      "Modeled alerts, incidents, technicians, and audit logs as connected operational records instead of isolated dashboard widgets.",
      "Used SLA and status history as first-class concepts because operations systems need accountability over time.",
      "Prioritized database clarity and explainable workflows before adding real telemetry agents.",
    ],
    githubUrl: "https://github.com/ebbad-dev/TeleTrack-Enterprise",
    codeStatus: "available",
    demoRoute: "/demos/teletrack",
    demoLabel: "Interactive Portfolio Demo",
    thumbnail: "/images/projects/teletrack-thumbnail.svg",
    thumbnailAlt: "Stylized TeleTrack Enterprise network operations thumbnail with topology, device health, alerts, and SLA panels",
    visualAccent: "blue",
  },
  {
    title: "MirrorMind",
    slug: "mirrormind",
    category: "AI / Debate / Reasoning Platform",
    maturity: "Concept / Advanced Prototype",
    featured: true,
    shortDescription:
      "An AI-powered debate and reflection platform that turns opinions into structured argument maps, hidden assumptions, evidence gaps, and counterarguments.",
    longDescription:
      "MirrorMind is a reasoning and debate-analysis platform designed to help users examine opinions more deeply. It breaks arguments into claims, assumptions, evidence gaps, possible weaknesses, and stronger opposing views.",
    problem: "People often hold opinions without seeing hidden assumptions, weak evidence, or strong opposing views.",
    goal: "Build a system that helps users reason more clearly by visually mapping and analyzing their arguments.",
    role: "Designed the product concept, core feature set, reasoning flow, analysis structure, and user experience direction.",
    actuallyBuilt: [
      "Defined the platform idea and feature system",
      "Planned structured reasoning outputs",
      "Designed argument map and analysis flow",
      "Developed product-level thinking around reflection and debate",
      "Created project description and system direction",
    ],
    techStack: ["AI / LLM concepts", "React", "Structured JSON validation", "Argument Mapping", "Reasoning Analysis", "Multi-language direction"],
    features: ["Argument analysis", "Hidden assumption detection", "Evidence gap detection", "Counterargument generation", "Visual argument maps", "Reasoning report"],
    highlights: ["Structured AI output", "Argument mapping", "Reflection-oriented UX", "Multi-mode AI product design"],
    challenges: ["Keeping AI feedback useful without pretending it is a neutral final judge", "Designing reasoning output that is structured but still readable"],
    tradeoffs: ["Focus on transparent reasoning reports before adding complex social debate features", "Use concept demo data until production AI integration is available"],
    lessons: ["Reasoning tools work best when they show uncertainty and invite revision.", "The output format shapes how people think with AI."],
    future: ["Add real LLM integration", "Support teacher/rubric mode", "Improve multilingual reasoning flows"],
    architecture: ["User Opinion", "Claim Extraction", "Assumption Detection", "Evidence Gap Analysis", "Counterargument", "Argument Map", "Reasoning Report"],
    technicalDecisions: [
      "Used structured reasoning cards so feedback stays readable instead of becoming a vague AI paragraph.",
      "Designed argument maps to make claims, assumptions, and evidence gaps visible as a system.",
      "Kept the demo transparent about mock analysis while leaving room for production LLM integration later.",
    ],
    githubUrl: "https://github.com/ebbad-dev/Mirror-Mind",
    codeStatus: "available",
    demoRoute: "/demos/mirrormind",
    demoLabel: "Interactive Portfolio Demo",
    thumbnail: "/images/projects/mirrormind-thumbnail.svg",
    thumbnailAlt: "Stylized MirrorMind reasoning platform thumbnail with argument map, assumptions, evidence gaps, and report panel",
    visualAccent: "violet",
  },
  {
    title: "Student Result Management API",
    slug: "student-result-management-api",
    category: "Backend / Full-Stack / REST API / MySQL",
    maturity: "Complete Backend Project",
    featured: false,
    shortDescription: "A REST API for managing students, subjects, marks, reports, toppers, grades, and CRUD operations.",
    longDescription:
      "Student Result Management API is a backend-focused project designed to manage academic result data with reports, grade calculation, topper detection, and browser-based testing.",
    problem: "Academic result data needs organized CRUD operations, reports, and grade calculations.",
    goal: "Build a backend API that supports result management workflows.",
    role: "Built backend API structure, database integration, CRUD operations, report generation, and basic frontend testing interface.",
    actuallyBuilt: ["Built API routes", "Integrated MySQL", "Implemented CRUD operations", "Added report and topper logic"],
    techStack: ["Node.js", "Express.js", "MySQL", "JavaScript", "HTML", "CSS", "REST APIs"],
    features: ["Students", "Subjects", "Marks", "Reports", "Grades", "Toppers", "CRUD"],
    highlights: ["Backend API structure", "Database integration", "Report generation"],
    challenges: ["Keeping grade and topper logic consistent"],
    tradeoffs: ["Kept the frontend simple to focus on backend behavior"],
    lessons: ["Clear endpoints make database-backed apps easier to test."],
    future: ["Deploy a live demo", "Add authentication", "Improve the frontend"],
    architecture: ["Students / Subjects", "Marks", "Reports", "Grades", "Topper Queries"],
    technicalDecisions: ["Kept the browser UI simple so the project could stay focused on API and database behavior."],
    githubUrl: "https://github.com/ebbad-dev/STUDENT-RESULT-MANAGEMENT-API",
    codeStatus: "available",
  },
];

export const archiveProjects: ArchiveProject[] = [
  {
    title: "Student Result Management API",
    category: "Backend / REST API / MySQL",
    description: "Node.js and Express API for students, subjects, marks, reports, toppers, grades, and CRUD operations.",
    techStack: ["Node.js", "Express.js", "MySQL", "JavaScript"],
    githubUrl: "https://github.com/ebbad-dev/STUDENT-RESULT-MANAGEMENT-API",
    codeStatus: "available",
    tags: ["Backend", "Database", "Full-Stack"],
  },
  {
    title: "Netflix Console",
    category: "Database / Console / SQL",
    description: "A Netflix-style database project with structured subscriber, content, watch history, and database operation flows.",
    techStack: ["SQL", "Database Design", "Console App"],
    githubUrl: "https://github.com/ebbad-dev/Netlfix-Console",
    codeStatus: "coming-soon",
    tags: ["Database", "Systems"],
  },
  {
    title: "Plagiarism Detector",
    category: "C++ / Algorithms / Text Processing",
    description: "C++ text similarity engine using cosine similarity, Karp-Rabin rolling hash, k-shingles, stemming, and stopword removal.",
    techStack: ["C++", "Algorithms", "NLP Concepts"],
    githubUrl: "https://github.com/ebbad-dev/PlagiarismDetector",
    codeStatus: "coming-soon",
    tags: ["Algorithms", "AI"],
  },
  {
    title: "Distributed Banking System",
    category: "Java / Sockets / Distributed Systems",
    description: "Socket-based client-server banking system with multi-client communication and transaction handling.",
    techStack: ["Java", "Sockets", "Multithreading"],
    githubUrl: "https://github.com/ebbad-dev/distributed-banking-system",
    codeStatus: "coming-soon",
    tags: ["Systems", "Backend"],
  },
  {
    title: "Criminal Database Management System",
    category: "Java / SQLite / Database System",
    description: "Database management system with role-based access, CRUD modules, evidence records, audit logs, and reports.",
    techStack: ["Java", "SQLite", "Database Design"],
    githubUrl: "https://github.com/ebbad-dev/Criminal-Database-Management-System",
    codeStatus: "coming-soon",
    tags: ["Database", "Systems"],
  },
];

export const portfolioProject = {
  title: "Ebbad Portfolio",
  category: "Portfolio / Full-Stack Frontend / Interactive Product",
  description:
    "This portfolio is built as a personal operating system for Ebbad's work, combining recruiter-first content, interactive demos, a 3D skill globe, local chatbot guidance, Formspree contact delivery, and Vercel deployment.",
  techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "React Three Fiber", "Formspree", "Vercel"],
  githubUrl: siteConfig.portfolioRepositoryUrl,
  codeStatus: "available" as CodeStatus,
  live: siteConfig.siteUrl,
};

export const skillGroups: Record<string, Skill[]> = {
  Languages: [
    { name: "Python", description: "Used for AI, computer vision, backend experimentation, data handling, and automation.", level: "Project-Used", projects: ["ProctorAI", "MirrorMind"] },
    { name: "Java", description: "Used for OOP, socket programming, and system-style academic projects.", level: "Project-Used", projects: ["Distributed Banking System", "Criminal DBMS"] },
    { name: "C++", description: "Used for algorithmic projects, similarity detection, and performance-oriented logic.", level: "Project-Used", projects: ["Plagiarism Detection Engine"] },
    { name: "SQL", description: "Used for relational design, queries, procedures, triggers, views, and reporting.", level: "Strong / Project-Used", projects: ["TeleTrack Enterprise", "Netflix Database Project"] },
    { name: "JavaScript", description: "Used for frontend interaction, backend APIs, and full-stack web development.", level: "Project-Used" },
    { name: "TypeScript", description: "Used for safer and more maintainable modern frontend development.", level: "Learning / Comfortable", projects: ["Portfolio"] },
  ],
  "Full-Stack / Frontend": [
    { name: "React", description: "Used to build modern component-based user interfaces.", level: "Comfortable" },
    { name: "Next.js", description: "Used for production-grade React apps with routing, server components, and deployment.", level: "Learning / Comfortable", projects: ["Portfolio"] },
    { name: "Tailwind CSS", description: "Used for fast, responsive, and modern UI design.", level: "Comfortable" },
    { name: "HTML", description: "Used as the foundation of web structure.", level: "Strong" },
    { name: "CSS", description: "Used for layout, styling, responsiveness, and visual polish.", level: "Comfortable" },
    { name: "Node.js", description: "Used to build backend APIs and server-side JavaScript applications.", level: "Project-Used", projects: ["Student Result Management API"] },
    { name: "Express.js", description: "Used to build REST APIs and backend routes.", level: "Project-Used", projects: ["Student Result Management API"] },
  ],
  "Backend / APIs": [
    { name: "REST APIs", description: "Used to expose structured backend endpoints for application features.", level: "Project-Used" },
    { name: "JWT Authentication", description: "Used for secure token-based authentication concepts.", level: "Learning / Project-Used" },
    { name: "CRUD Systems", description: "Used across database and backend applications.", level: "Strong / Project-Used" },
    { name: "Flask", description: "Used for Python-based backend and database-driven interfaces.", level: "Project-Used" },
    { name: "FastAPI", description: "Used for modern Python API and AI/backend integration concepts.", level: "Learning / Project-Used" },
  ],
  Databases: [
    { name: "MySQL", description: "Used for relational database-backed backend projects.", level: "Project-Used" },
    { name: "SQL Server", description: "Used for database projects involving views, procedures, triggers, and structured data.", level: "Project-Used" },
    { name: "SQLite", description: "Used for lightweight local application databases.", level: "Project-Used" },
    { name: "PostgreSQL basics", description: "Familiar with PostgreSQL as a production database option.", level: "Learning" },
    { name: "Database Design", description: "Used for entities, relationships, constraints, and normalized schemas.", level: "Project-Used" },
    { name: "Normalization", description: "Used to reduce redundancy and improve relational database structure.", level: "Comfortable" },
    { name: "ERD / EERD", description: "Used to model entities, relationships, specialization, and database structures.", level: "Comfortable" },
    { name: "Stored Procedures", description: "Used for encapsulating database logic.", level: "Project-Used" },
    { name: "Triggers", description: "Used for automated database actions such as audit logs and status updates.", level: "Project-Used" },
    { name: "Views", description: "Used to simplify reporting and query access.", level: "Project-Used" },
    { name: "Indexing", description: "Used conceptually for improving database query performance.", level: "Learning / Comfortable" },
  ],
  "AI / ML / Systems": [
    { name: "OpenCV", description: "Used for webcam monitoring and visual detection.", level: "Project-Used", projects: ["ProctorAI"] },
    { name: "Computer Vision", description: "Used for face, eye, head pose, and monitoring-style detection systems.", level: "Project-Used", projects: ["ProctorAI"] },
    { name: "NLP", description: "Used in reasoning, debate, and text analysis concepts.", level: "Learning / Project-Used", projects: ["MirrorMind"] },
    { name: "Search Algorithms", description: "Studied and applied in AI and algorithmic problem solving.", level: "Learning / Comfortable" },
    { name: "Reasoning Systems", description: "Used in argument analysis, evidence gaps, assumptions, and structured reasoning.", level: "Project-Used", projects: ["MirrorMind"] },
    { name: "Distributed Systems", description: "Used in multi-client communication and socket-based systems.", level: "Learning / Project-Used" },
    { name: "Socket Programming", description: "Used for client-server communication and multi-client systems.", level: "Project-Used" },
  ],
  Tools: [
    { name: "Git", description: "Used for version control.", level: "Comfortable" },
    { name: "GitHub", description: "Used for project hosting and code sharing.", level: "Comfortable" },
    { name: "VS Code", description: "Main development environment.", level: "Strong" },
    { name: "Postman", description: "Used for testing APIs.", level: "Comfortable" },
    { name: "Vercel", description: "Used for deploying frontend projects.", level: "Learning / Comfortable" },
    { name: "Docker basics", description: "Familiar with containerization concepts.", level: "Learning" },
  ],
};

export const nonTechnicalSkills = [
  "Communication",
  "Leadership",
  "Teamwork",
  "Empathy",
  "Critical Thinking",
  "Problem Solving",
  "Adaptability",
  "Presentation Skills",
  "Event Coordination",
  "Collaboration",
  "Curiosity",
  "Initiative",
  "Public Speaking",
  "Analytical Thinking",
];

export const journey = [
  ["Started Software Engineering Journey", "Began BS Software Engineering at COMSATS University Islamabad, Lahore Campus."],
  ["Built Foundation in Programming and Databases", "Worked with programming fundamentals, OOP, SQL, database design, and core software engineering concepts."],
  ["Built Backend and Database Projects", "Created projects such as Student Result Management API, Netflix Database Project, and TeleTrack Enterprise."],
  ["Explored AI and Computer Vision", "Worked on AI-focused projects including ProctorAI and reasoning-based systems like MirrorMind."],
  ["Built Systems and Algorithmic Projects", "Worked on socket-based distributed banking and plagiarism detection using algorithmic text similarity methods."],
  ["Leadership and Communication Growth", "Served as Class Representative for 60+ students and took part in coordination, communication, and event-related responsibilities."],
  ["Current Direction", "Focused on full-stack development, AI systems, backend engineering, database systems, and real-world software products."],
];

export type TestimonialCard =
  | {
      kind: "approved";
      name: string;
      initials: string;
      role: string;
      quote: string;
      proof: string;
    }
  | {
      kind: "placeholder";
      title: string;
      initials: string;
      role: string;
      note: string;
      proof: string;
    };

export const testimonials: TestimonialCard[] = [
  {
    kind: "approved",
    name: "Saad Faisal",
    initials: "SF",
    role: "CEO, Sanestix",
    proof: "Approved reference",
    quote:
      "Ebbad shows the kind of curiosity and ownership that stands out early. He approaches tasks with a serious mindset, asks thoughtful questions, and tries to improve the final outcome instead of only completing the minimum requirement. His ability to combine technical learning with clear communication makes him someone with strong growth potential.",
  },
  {
    kind: "placeholder",
    title: "Reference Available",
    initials: "RA",
    role: "Academic / project collaborators",
    proof: "On request",
    note: "Additional references can be shared privately when a recruiter or collaborator needs more context.",
  },
  {
    kind: "placeholder",
    title: "More Feedback Coming Soon",
    initials: "MF",
    role: "Future approved testimonials",
    proof: "Pending approval",
    note: "This slot is intentionally held for a real approved testimonial instead of showing invented praise.",
  },
];

export const testimonial = testimonials[0];

export const demoData = {
  proctorai: {
    metrics: [
      ["Risk Score", "72 / 100"],
      ["Face Detection", "Active"],
      ["Eye Tracking", "Warning"],
      ["Head Pose", "Slight Deviation"],
      ["Phone Detection", "No Phone Detected"],
      ["Tab Switches", "2"],
    ],
    events: ["Face detected successfully", "Eye movement warning detected", "Head pose deviation detected", "Tab switch detected", "Screenshot captured as evidence", "Risk score updated"],
    report: "Session completed with moderate risk. Instructor review recommended due to tab switching and visual attention warnings.",
  },
  teletrack: {
    metrics: [
      ["Total Devices", "128"],
      ["Online Devices", "116"],
      ["Offline Devices", "12"],
      ["Active Incidents", "7"],
      ["Critical Alerts", "3"],
      ["SLA Compliance", "94%"],
    ],
    events: ["Router Lahore-03 offline", "Switch Floor-2 high latency", "Firewall packet drop spike", "Backup link unstable"],
    report: "Network health is mostly stable, with critical attention needed for three alerts and seven active incidents.",
  },
  mirrormind: {
    input: "AI should be used in classrooms because it makes learning faster and more personalized.",
    assumptions: ["AI tools are accurate enough for educational use.", "Students will use AI responsibly.", "Teachers can integrate AI effectively.", "Personalized learning improves outcomes for most students."],
    gaps: ["No data provided about improved learning outcomes.", "No comparison between AI-assisted and traditional classrooms.", "No mention of privacy or academic integrity risks."],
    counterargument: "AI can support learning, but uncontrolled use may reduce independent thinking, create overreliance, and introduce privacy or fairness concerns.",
  },
};

export const chatbotKnowledge = {
  fallback: "I do not have that exact detail yet, but you can contact Ebbad directly through the contact section.",
  suggestedPrompts: [
    "Who is Ebbad?",
    "Show me his best projects",
    "What is ProctorAI?",
    "What is TeleTrack?",
    "What is MirrorMind?",
    "Is Ebbad available for internships?",
    "How can I contact him?",
  ],
  answers: [
    {
      triggers: ["who", "ebbad", "study"],
      answer:
        "Ebbad Ur Rehman is a Software Engineering student at COMSATS University Islamabad, Lahore Campus. He builds full-stack applications, AI-powered tools, database systems, backend APIs, computer vision projects, and interactive software products.",
    },
    {
      triggers: ["strongest", "projects", "featured"],
      answer:
        "His featured projects are ProctorAI, TeleTrack Enterprise, and MirrorMind. They show work across AI, computer vision, databases, system design, and reasoning-based product thinking.",
    },
    {
      triggers: ["proctor", "proctorai"],
      answer:
        "ProctorAI is an AI-powered exam monitoring system using computer vision, audio signals, browser activity, risk scoring, evidence logging, and reporting to support online exam integrity.",
    },
    {
      triggers: ["teletrack", "network"],
      answer:
        "TeleTrack Enterprise is a database and network monitoring project for managing devices, facilities, technicians, alerts, incidents, audit logs, SLA tracking, and uptime reporting.",
    },
    {
      triggers: ["mirror", "mirrormind", "debate", "reasoning"],
      answer:
        "MirrorMind is an AI-powered debate and self-reflection platform that turns opinions into structured argument maps, hidden assumptions, evidence gaps, counterarguments, and reasoning reports.",
    },
    {
      triggers: ["skill", "technical", "stack"],
      answer:
        "Ebbad works with Python, Java, C++, SQL, JavaScript, TypeScript, React, Next.js, Node.js, Express.js, Flask, FastAPI concepts, MySQL, SQL Server, SQLite, OpenCV, REST APIs, Git, GitHub, and related tools.",
    },
    {
      triggers: ["internship", "available", "hire", "collaboration"],
      answer:
        "Yes. The portfolio presents Ebbad as open to internships, collaborations, freelance work, and technical project opportunities.",
    },
    {
      triggers: ["testimonial", "reference", "saad"],
      answer:
        "The portfolio includes an approved testimonial from Saad Faisal, CEO of Sanestix, highlighting Ebbad's curiosity, ownership, thoughtful questions, and clear communication.",
    },
  ],
};
