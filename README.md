# Ebbad Ur Rehman Portfolio

An immersive Next.js portfolio for Ebbad Ur Rehman, built with TypeScript, Tailwind CSS, Framer Motion, Three.js, Formspree, and optional Vercel Analytics.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Configure content

- Profile, socials, skills, projects, chatbot knowledge, demos, and testimonials: `src/data/site.ts`
- Resume: `public/resume/ebbad-resume.pdf`
- Intro video: `public/videos/intro.mp4`
- Profile image: `public/images/profile/profile-1.jpeg`
- Project thumbnails: `public/images/projects/*-thumbnail.svg`
- Future real project screenshots: add files under `public/images/projects/`
- Ask Ebbad route logic: `src/lib/chatbot.ts` and `src/app/api/chat/route.ts`
- Contact form endpoint: `siteConfig.formspreeEndpoint` in `src/data/site.ts`

Missing links and assets are handled with clean unavailable states. Raw placeholder values are never shown publicly.

## Features

- First-visit welcome intro with session memory
- Intro video asset retained at `public/videos/intro.mp4`, with the public video UI disabled for now
- Cinematic hero with profile image slot
- Recruiter snapshot and 30-second summary
- About section, resume section, and leadership journey
- React Three Fiber skill globe with Drei controls and readable fallback lists
- Three featured projects only: ProctorAI, TeleTrack Enterprise, MirrorMind
- Honest local SVG project thumbnails for featured projects
- Honest interactive portfolio demos with mock data labels
- Case study pages for each featured project
- Floating Ask Ebbad chatbot plus `/api/chat`
- Command palette with `Ctrl/Cmd + K`
- Formspree-backed contact form
- SEO metadata, sitemap, robots, reduced-motion support, and Vercel Analytics

## Contact form

The contact form submits validated fields directly to Formspree:

```text
https://formspree.io/f/mqeogggp
```

It sends `name`, `email`, `purpose`, and `message`, plus a subject and reply-to value. To change the provider or endpoint, edit `siteConfig.formspreeEndpoint` in `src/data/site.ts`.

## Real voice intro video

The intro video asset remains at `public/videos/intro.mp4`, but the public intro video UI is currently disabled through `siteConfig.introVideoAvailable` in `src/data/site.ts`. Set that flag back to `true` when the intro should be shown again.

The video is generated from a real recorded video so the face movement and voice stay natural. By default the renderer reads:

```text
C:\Users\HP\Downloads\VID-20260530-WA0046.mp4
```

To regenerate it with another recording, set `INTRO_SOURCE_VIDEO` to the source `.mp4`. If FFmpeg is not on PATH, set `FFMPEG_PATH` to `ffmpeg.exe`, then run:

```bash
python scripts/render-intro-video.py
```

The current render keeps the source audio and trims it into a portfolio-ready intro. The on-screen message is:

```text
Full-stack systems, AI tools, databases, backend APIs, computer vision, and interactive product experiences.
```

## Chatbot knowledge guide

Update `chatbotKnowledge` in `src/data/site.ts`. Keep answers short, honest, and sourced from the portfolio. Unknown questions should keep using the fallback answer.

## Image replacement guide

- Main profile portrait: `public/images/profile/profile-1.jpeg`
- Secondary profile image: `public/images/profile/profile-2.jpg`
- Project screenshots: `public/images/projects/{project-name}/`
- Resume: `public/resume/ebbad-resume.pdf`
- OG images: `public/og/`

The UI uses purpose-built interface visuals when real screenshots are missing.

## Deployment

1. Push the project to GitHub.
2. Import it into Vercel.
3. Optionally set `NEXT_PUBLIC_SITE_URL` in Vercel project settings if the production domain changes.
4. Deploy.

Optional Vercel Analytics is already wired and will work when enabled on Vercel.

## Known placeholders

Project screenshots and project-specific live demo deployments can still be added later. The shipped demo pages use clearly labeled mock data to show product flow honestly.

## Honesty note

Do not add fake clients, fake revenue, fake awards, fake testimonials, fake deployed demos, or fake production metrics. If a link, file, or deployment is missing, keep the clean unavailable state until the real asset exists.
