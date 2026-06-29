# Ebbad Portfolio

Premium recruiter-focused portfolio for **Ebbad Ur Rehman**, built as an interactive personal operating system for projects, skills, resume, testimonials, demos, and AI-assisted portfolio guidance.

[Live Portfolio](https://ebbad-portfolio.vercel.app) | [Source Code](https://github.com/ebbad-dev/My-Portfolio) | [GitHub Profile](https://github.com/ebbad-dev) | [LinkedIn](https://www.linkedin.com/in/ebbad-ur-rehman/)

## Overview

This portfolio is designed to do more than display a static profile. It gives recruiters and collaborators a fast, polished way to understand Ebbad's engineering direction through:

- a cinematic identity-first hero;
- recruiter snapshot and resume access;
- featured project case studies;
- honest interactive mock demos;
- a premium 3D skill globe;
- testimonials;
- command palette navigation;
- contact flow;
- Ask Ebbad, a server-side portfolio assistant powered by approved portfolio data with optional OpenRouter enhancement.

The visual direction is a dark glassmorphism system called **Midnight Cyber Luxe**: cyan, blue, violet, subtle glow, motion, 3D depth, and restrained futuristic polish.

## Live Status

- Production: `https://ebbad-portfolio.vercel.app`
- Deployment: Vercel
- Main branch: `main`
- Resume path: `/resume/ebbad-resume.pdf`
- Contact provider: Formspree
- Ask Ebbad AI provider: OpenRouter with deterministic fallback

## Core Features

### Portfolio Experience

- Responsive Next.js App Router portfolio
- Premium hero with smooth typewriter intro
- Recruiter-first snapshot section
- Project archive with code availability states
- Case study pages for featured work
- Interactive mock demo pages for featured projects
- Command palette with `Ctrl/Cmd + K`
- Vertical social dock and mobile-friendly social placement
- Custom premium scrollbar and reduced-motion support
- SEO metadata, sitemap, robots, Open Graph, and Twitter card support

### Featured Projects

The portfolio highlights three primary projects:

1. **ProctorAI**  
   AI/computer vision exam-monitoring prototype with review-focused risk signals, evidence flow, and instructor reporting concepts.

2. **TeleTrack Enterprise**  
   Database and network-operations system for devices, technicians, alerts, incidents, audit logs, SLA tracking, and topology views.

3. **MirrorMind**  
   AI/debate reasoning workspace that maps opinions into claims, assumptions, evidence gaps, counterarguments, and structured reports.

Additional archive projects include Student Result Management API, Netflix Console DBMS, Plagiarism Detector, Distributed Banking System, and Criminal Database Management System.

### Ask Ebbad

Ask Ebbad is a portfolio assistant that answers from approved portfolio, resume, project, contact, and testimonial data.

It uses a hybrid architecture:

- deterministic local answers for safe, known portfolio facts;
- strict fallback behavior for unknown or out-of-scope prompts;
- optional OpenRouter generation for richer answers;
- server-side-only API key handling;
- bounded response length;
- Zod request validation;
- no-store API responses;
- small in-memory rate limiting as defense in depth.

The assistant must not invent clients, private facts, fake metrics, salaries, production claims, or project outcomes.

### Resume

The resume is a one-page ATS-friendly PDF:

- normal selectable text;
- clean headings;
- no images, icons, columns, or text boxes;
- clickable email, LinkedIn, GitHub, portfolio, and project links;
- available at `public/resume/ebbad-resume.pdf`.

## Tech Stack

| Area | Tools |
| --- | --- |
| Framework | Next.js App Router, React |
| Language | TypeScript |
| Styling | Tailwind CSS, global CSS tokens |
| Motion | Framer Motion, CSS animations |
| 3D | Three.js, React Three Fiber, Drei |
| Icons | Lucide React, local SVG skill icons |
| Validation | Zod |
| Contact | Formspree |
| AI assistant | OpenRouter API with deterministic fallback |
| Deployment | Vercel |
| QA | ESLint, TypeScript, Playwright smoke test |

## Project Structure

```text
src/
  app/
    api/chat/              Ask Ebbad API route
    demos/[slug]/          Interactive demo routes
    projects/[slug]/       Case study routes
    globals.css            Theme, scrollbar, motion, global styling
    layout.tsx             Metadata, fonts, shell
    page.tsx               Main portfolio page
  components/
    home/                  Homepage sections and project surfaces
    navigation/            Nav, command palette, journey dock
    system/                Scroll line, active section, utilities
    ui/                    Reusable UI primitives and visual systems
  data/
    site.ts                Profile, socials, projects, skills, demos, testimonials
    resume.ts              Extracted resume facts for chatbot and UI
  lib/
    chatbot.ts             Deterministic + OpenRouter Ask Ebbad logic
    utils.ts               Shared helpers
public/
  images/                  Profile and project visuals
  resume/                  ATS resume PDF
  videos/                  Intro video asset, currently disabled in UI
scripts/
  smoke-browser.mjs        Lightweight browser smoke tests
  render-intro-video.py    Optional intro-video renderer
```

## Getting Started

### Prerequisites

- Node.js 20+ recommended
- npm
- Vercel account for deployment
- Optional OpenRouter account for AI-backed Ask Ebbad responses

### Install

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Production Build

```bash
npm run build
npm run start
```

## Environment Variables

Create `.env.local` for local secrets. Do not commit it.

```env
NEXT_PUBLIC_SITE_URL=https://ebbad-portfolio.vercel.app

ASK_EBBAD_AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=google/gemma-4-31b-it:free
```

### Notes

- `OPENROUTER_API_KEY` must stay server-side.
- Never prefix the OpenRouter key with `NEXT_PUBLIC_`.
- If OpenRouter is not configured or fails, Ask Ebbad falls back to deterministic approved-data answers.
- The current production model is `google/gemma-4-31b-it:free`.

## Contact Form

The contact form submits validated form data to Formspree:

```text
https://formspree.io/f/mqeogggp
```

Fields sent:

- `name`
- `email`
- `purpose`
- `message`
- honeypot field for spam reduction
- subject and reply-to metadata

To change the contact provider, update `siteConfig.formspreeEndpoint` in `src/data/site.ts`.

## Available Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run start
npm run smoke:browser
```

### Smoke Testing

`npm run smoke:browser` uses Playwright when available. It checks:

- homepage load;
- major section anchors;
- resume route;
- project pages;
- demo pages;
- chat route behavior;
- contact validation;
- horizontal overflow at desktop and mobile sizes.

Screenshots are written to:

```text
test-results/portfolio-smoke
```

To test production:

```bash
SMOKE_BASE_URL=https://ebbad-portfolio.vercel.app npm run smoke:browser
```

On Windows PowerShell:

```powershell
$env:SMOKE_BASE_URL="https://ebbad-portfolio.vercel.app"
npm run smoke:browser
```

## Deployment

The app is deployed on Vercel.

Typical production deploy:

```bash
npx vercel --prod
```

Required production environment variables:

```env
ASK_EBBAD_AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=google/gemma-4-31b-it:free
```

Optional:

```env
NEXT_PUBLIC_SITE_URL=https://ebbad-portfolio.vercel.app
```

## Content Editing Guide

Most public content is centralized:

- Profile and site config: `src/data/site.ts`
- Social links: `src/data/site.ts`
- Featured and archive projects: `src/data/site.ts`
- Skill groups: `src/data/site.ts`
- Testimonials: `src/data/site.ts`
- Demo data: `src/data/site.ts`
- Resume facts for chatbot: `src/data/resume.ts`
- Actual resume PDF: `public/resume/ebbad-resume.pdf`

When updating project claims, keep them honest and supported by real work. Do not add fake metrics, fake clients, fake production deployments, or fake awards.

## Security And Reliability Notes

- Safe baseline headers are configured in `next.config.ts`.
- `/api/chat` validates requests with Zod.
- `/api/chat` returns `Cache-Control: no-store`.
- OpenRouter key is server-side only.
- In-memory rate limiting is included as defense in depth, but it is not a complete serverless-grade rate limiter.
- For stronger abuse protection later, consider Upstash, Vercel KV, or Turnstile.
- Full CSP is intentionally not enforced yet because it requires careful compatibility testing with Next.js, Vercel, fonts, analytics, Formspree, and generated assets.

## Accessibility And Performance

- Reduced-motion behavior is respected across major motion surfaces.
- Custom cursor is disabled for touch and reduced-motion contexts.
- Skill list fallbacks are available around the 3D skill globe.
- Links opening new tabs use `rel="noopener noreferrer"`.
- Internal scroll areas use premium but visible scrollbars.
- Heavy visual surfaces are scoped and lazy where practical.

## Honesty Policy

This portfolio intentionally distinguishes between:

- real project work;
- mock portfolio demos;
- available code repositories;
- future improvements;
- missing or disabled assets.

Mock demos are labeled as mock demos. Code links are shown only where intended. The assistant is instructed not to invent unsupported facts.

## License

This is a personal portfolio project for Ebbad Ur Rehman. The source is public for review and learning, but the personal branding, resume, portrait, testimonials, and portfolio copy should not be reused as someone else's identity.

## Author

**Ebbad Ur Rehman**  
Software Engineering Student | Full-Stack Developer | AI / ML | Databases | Systems

- Portfolio: [https://ebbad-portfolio.vercel.app](https://ebbad-portfolio.vercel.app)
- GitHub: [https://github.com/ebbad-dev](https://github.com/ebbad-dev)
- LinkedIn: [https://www.linkedin.com/in/ebbad-ur-rehman/](https://www.linkedin.com/in/ebbad-ur-rehman/)
- Email: [ebbadurrehman538@gmail.com](mailto:ebbadurrehman538@gmail.com)
