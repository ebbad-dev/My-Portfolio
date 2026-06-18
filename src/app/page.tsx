import { CheckCircle2, Cpu, Download, ExternalLink, Mail, MessageCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeader } from "@/components/ui/section-header";
import { ProjectCard } from "@/components/home/project-card";
import { ContactForm } from "@/components/home/contact-form";
import { ProfileCard } from "@/components/home/profile-card";
import { CodeRepoButton } from "@/components/ui/code-repo-button";
import { PremiumTypewriter } from "@/components/ui/premium-typewriter";
import { ArchiveSection } from "@/components/home/archive-section";
import { SkillConstellation } from "@/components/home/skill-constellation";
import { DynamicAskEbbad } from "@/components/home/dynamic-islands";
import { ScrollJourneyLine } from "@/components/system/scroll-journey-line";
import { BackToTop } from "@/components/system/back-to-top";
import { SectionReveal } from "@/components/system/section-reveal";
import { LivingJourneyDock } from "@/components/navigation/living-journey-dock";
import { PremiumParticles } from "@/components/effects/premium-particles";
import {
  journey,
  nonTechnicalSkills,
  portfolioProject,
  projects,
  quickFacts,
  recruiterSummary,
  siteConfig,
  socials,
  testimonials,
} from "@/data/site";
import { isUsableHref } from "@/lib/utils";

const featured = projects.filter((project) => project.featured);

export default function Home() {
  const visibleSocials = socials.filter((social) => social.kind !== "resume" && isUsableHref(social.href));

  return (
    <main id="main" className="relative overflow-hidden pt-16">
      <ScrollJourneyLine />
      <BackToTop />

      <section id="hero" data-section-id="hero" className="section-shell hero-shell content-center">
        <PremiumParticles className="opacity-70" />
        <SectionReveal>
          <div className="grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr] xl:gap-10">
            <div className="max-w-3xl">
              <p className="mb-4 font-heading text-lg italic text-cyan-100 drop-shadow-[0_0_14px_rgba(34,211,238,0.25)]">Hello, I&apos;m</p>
              <h1 className="font-heading text-[clamp(3.25rem,8vw,7.35rem)] font-bold leading-[0.94] text-white">
                Ebbad <span className="text-gradient">Ur Rehman</span>
              </h1>
              <h2 className="mt-4 font-heading text-[clamp(1.75rem,3.5vw,3.2rem)] font-bold leading-tight text-white">
                Software <span className="text-gradient">Engineer.</span>
              </h2>
              <p className="mono-label mt-4 text-slate-300">Full-Stack Developer / AI / ML / Databases / Systems</p>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">{siteConfig.heroHeadline}</p>
              <p className="mt-3 max-w-2xl text-base leading-8 text-slate-300">
                <PremiumTypewriter text={siteConfig.heroSubheadline} />
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-400 sm:text-base">{siteConfig.heroPersonalLine}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="#projects" variant="primary">View Projects</ButtonLink>
                <ButtonLink href="#demos">Try Demos</ButtonLink>
                <ButtonLink href="#ask-ebbad">Ask Ebbad</ButtonLink>
                <ButtonLink href={siteConfig.resumePath} available={siteConfig.resumeAvailable} unavailableLabel="Resume not added yet" openInNewTab>
                  Download Resume
                </ButtonLink>
                <ButtonLink href="#contact">Contact Me</ButtonLink>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {["Full-Stack Development", "AI / ML", "Database Systems", "Computer Vision", "Backend APIs", "System Design"].map((badge) => (
                  <span key={badge} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-slate-300">{badge}</span>
                ))}
              </div>
            </div>
            <ProfileCard />
          </div>
        </SectionReveal>
      </section>

      <section className="journey-dock-section">
        <LivingJourneyDock />
      </section>

      <section id="recruiters" data-section-id="recruiters" className="section-shell">
        <SectionReveal>
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="glass-panel premium-card rounded-3xl p-6">
              <p className="mono-label">Recruiter Snapshot</p>
              <h2 className="mt-3 font-heading text-4xl font-bold text-white">If you only have 30 seconds</h2>
              <p className="mt-5 leading-8 text-slate-300">{recruiterSummary}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["AI + Computer Vision", "Database Systems", "Full-Stack Products"].map((badge) => (
                  <span key={badge} className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 font-mono text-xs text-cyan-50">{badge}</span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="#projects" variant="primary">View Top Projects</ButtonLink>
                <ButtonLink href={siteConfig.resumePath} available={siteConfig.resumeAvailable} unavailableLabel="Resume not added yet" openInNewTab>Download Resume</ButtonLink>
                <ButtonLink href="#contact">Contact Me</ButtonLink>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Who I Am", "Software Engineering student at COMSATS University Islamabad, Lahore Campus."],
                ["What I Build", "Practical software that connects interfaces, data, logic, and clear user workflows."],
                ["Strongest Work", "Featured projects include ProctorAI, TeleTrack Enterprise, and MirrorMind."],
                ["Availability", "Open to internships, collaborations, freelance opportunities, and technical project work."],
              ].map(([title, text]) => (
                <div key={title} className="glass-panel rounded-3xl p-5">
                  <h3 className="font-heading text-xl font-semibold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>
      </section>

      <section id="about" className="section-shell">
        <SectionHeader eyebrow="About Me" title="I like projects where the interface, database, logic, and user problem all connect.">
          I&apos;m a Software Engineering student at COMSATS Lahore. My work sits where product interfaces, data models, backend logic, and intelligent workflows meet.
        </SectionHeader>
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="glass-panel rounded-3xl p-6">
            <p className="text-lg leading-9 text-slate-300">
              I try to build with seriousness: clear structure, understandable interfaces, useful features, and technical depth. I am still learning and improving, but I care about making projects that feel like systems people can actually use.
            </p>
            <p className="mt-5 text-lg leading-9 text-slate-300">
              My current direction is full-stack development with stronger foundations in AI systems, backend engineering, databases, computer vision, and system design.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickFacts.map((fact) => (
              <div key={fact} className="glass-panel rounded-2xl p-4 text-sm font-semibold text-slate-200">
                {fact}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" data-section-id="projects" className="section-shell">
        <SectionHeader eyebrow="Featured Projects" title="Three serious builds, three different engineering angles.">
          These projects show AI monitoring, database-backed operations, and reasoning-product thinking without pretending mock demos are production systems.
        </SectionHeader>
        <div className="grid gap-6 lg:grid-cols-3">
          {featured.map((project) => (
            <SectionReveal key={project.slug}>
              <ProjectCard project={project} />
            </SectionReveal>
          ))}
        </div>
      </section>

      <section id="skills" data-section-id="skills" className="section-shell">
        <PremiumParticles className="opacity-45" />
        <SectionHeader eyebrow="Skill Constellation" title="My stack is not just a list of tools.">
          Each skill connects to something I have built, explored, or used inside real project work.
        </SectionHeader>
        <SkillConstellation />
      </section>

      <section id="beyond-code" className="section-shell">
        <SectionHeader eyebrow="Beyond Code" title="Clear thinking, communication, and ownership.">
          Software is built with logic, but good projects also need communication, teamwork, patience, and the ability to explain ideas clearly.
        </SectionHeader>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {nonTechnicalSkills.map((skill) => (
            <div key={skill} className="glass-panel rounded-2xl p-4 text-sm font-semibold text-slate-200">{skill}</div>
          ))}
        </div>
      </section>

      <section id="demos" data-section-id="demos" className="section-shell">
        <SectionHeader eyebrow="Live Demos" title="Mini product experiences with honest labels.">
          Each demo uses mock data to show product flow clearly. These are portfolio demos, not production deployments.
        </SectionHeader>
        <div className="grid gap-5 md:grid-cols-3">
          {featured.map((project) => (
            <div key={project.slug} className="glass-panel rounded-3xl p-5">
              <Cpu className="text-cyan-200" />
              <h3 className="mt-4 font-heading text-2xl font-semibold text-white">{project.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{project.demoLabel}. Demo uses mock data to show the product flow.</p>
              <ButtonLink href={project.demoRoute} variant="primary" className="mt-5">Open Demo</ButtonLink>
            </div>
          ))}
        </div>
      </section>

      <section id="archive" className="section-shell">
        <SectionHeader eyebrow="Case Studies / Archive" title="More project history, kept in the right order.">
          Featured projects get the deepest treatment. Archive projects stay available without flattening the portfolio into one long list.
        </SectionHeader>
        <ArchiveSection />
      </section>

      <section id="this-portfolio" className="section-shell">
        <SectionHeader eyebrow="This Portfolio" title="The portfolio itself is also a product.">
          Built as EbbadOS: a recruiter-friendly personal operating system with interactive demos, a 3D skill globe, chatbot guidance, Formspree contact delivery, and Vercel deployment.
        </SectionHeader>
        <div className="glass-panel grid gap-6 rounded-3xl p-6 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <p className="mono-label">{portfolioProject.category}</p>
            <h3 className="mt-3 font-heading text-3xl font-bold text-white">{portfolioProject.title}</h3>
            <p className="mt-4 text-lg leading-8 text-slate-300">{portfolioProject.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {portfolioProject.techStack.map((tech) => (
                <span key={tech} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300">{tech}</span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <CodeRepoButton href={portfolioProject.githubUrl} status={portfolioProject.codeStatus} label="View Code" />
              <ButtonLink href={portfolioProject.live} variant="primary" external>
                <ExternalLink size={16} /> Live Site
              </ButtonLink>
            </div>
          </div>
          <div className="rounded-3xl border border-cyan-300/20 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.16),transparent_58%)] p-5">
            <div className="rounded-2xl border border-white/10 bg-slate-950/75 p-4">
              <p className="mono-label">Build pipeline</p>
              <div className="mt-4 grid gap-3 text-sm text-slate-300">
                {["Next.js App Router", "Typed portfolio data", "Dynamic 3D skill island", "Formspree contact flow", "Vercel production deploy"].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl bg-white/[0.05] px-3 py-2">
                    <CheckCircle2 size={16} className="text-emerald-300" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="journey" data-section-id="journey" className="section-shell">
        <SectionHeader eyebrow="Journey / Leadership" title="A practical path through software engineering.">
          From programming foundations to database systems, AI concepts, and class representative responsibilities.
        </SectionHeader>
        <div className="grid gap-4">
          {journey.map(([title, text], index) => (
            <div key={title} className="glass-panel grid gap-4 rounded-3xl p-5 sm:grid-cols-[4rem_1fr]">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-cyan-300/10 font-mono text-cyan-100">{String(index + 1).padStart(2, "0")}</div>
              <div>
                <h3 className="font-heading text-xl font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="testimonials" data-section-id="testimonials" className="section-shell">
        <div className="mb-12 text-center">
          <p className="mono-label mb-4 justify-center">Testimonials</p>
          <h2 className="mx-auto max-w-4xl font-heading text-[clamp(3rem,7vw,6.7rem)] font-bold leading-[0.95] text-white">
            Testimonials
          </h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.initials} className="testimonial-card glass-panel premium-card relative min-h-[25rem] overflow-hidden rounded-3xl p-6">
              <div className="pointer-events-none absolute left-8 top-3 font-heading text-8xl font-black leading-none text-cyan-300/[0.06]" aria-hidden="true">
                &ldquo;
              </div>
              <div className="relative flex h-full flex-col">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-cyan-100">
                    {item.proof}
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-cyan-300/20 via-blue-400/20 to-transparent" aria-hidden="true" />
                </div>
                {item.kind === "approved" ? (
                  <p className="relative text-base italic leading-8 text-slate-100">&ldquo;{item.quote}&rdquo;</p>
                ) : (
                  <p className="relative text-base leading-8 text-slate-300">{item.note}</p>
                )}
                <div className="mt-auto flex items-center gap-4 pt-8">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-gradient font-heading text-sm font-bold text-white shadow-[0_0_24px_rgba(34,211,238,0.2)]">
                    {item.initials}
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-white">{item.kind === "approved" ? item.name : item.title}</h3>
                    <p className="mt-0.5 text-sm text-slate-400">{item.role}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="resume" data-section-id="resume" className="section-shell">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <SectionHeader eyebrow="Resume & Quick Profile" title="A quick overview of background, skills, and direction.">
              Software Engineering student focused on practical product engineering, databases, computer vision, reasoning workflows, and systems-based projects.
            </SectionHeader>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={siteConfig.resumePath} available={siteConfig.resumeAvailable} variant="primary" unavailableLabel="Resume not added yet" openInNewTab>
                <Download size={16} /> Download Resume
              </ButtonLink>
              <ButtonLink href="#contact">Contact Me</ButtonLink>
            </div>
            {!siteConfig.resumeAvailable ? (
              <p className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm text-cyan-50">
                Resume is temporarily unavailable. Please contact me through email or LinkedIn.
              </p>
            ) : null}
          </div>
          <div className="glass-panel rounded-3xl p-5">
            <h3 className="font-heading text-2xl font-semibold text-white">Top strengths</h3>
            <div className="mt-5 grid gap-3">
              {["Full-stack project development", "Database design and SQL", "AI / computer vision project experience", "Backend API development", "Project documentation and presentation", "Leadership and communication"].map((item) => (
                <div key={item} className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 size={18} className="text-emerald-300" /> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="ask-ebbad" data-section-id="ask-ebbad" className="section-shell">
        <SectionHeader eyebrow="Ask Ebbad" title="A local portfolio guide with strict knowledge rules.">
          It answers from approved portfolio content only and falls back when a detail is not available.
        </SectionHeader>
        <DynamicAskEbbad />
      </section>

      <section id="contact" data-section-id="contact" className="section-shell">
        <PremiumParticles className="opacity-35" />
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="glass-panel premium-card rounded-3xl p-6">
            <p className="mono-label">Contact</p>
            <h2 className="mt-3 font-heading text-4xl font-bold text-white">Let&apos;s Build Something Real</h2>
            <p className="mt-4 leading-8 text-slate-300">
              Have an internship opportunity, collaboration idea, or project in mind? Send me a message and I&apos;ll get back to you.
            </p>
            <div className="mt-6 grid gap-3">
              <div className="rounded-3xl border border-cyan-300/15 bg-cyan-300/[0.06] p-4">
                <div className="flex items-start gap-3 text-slate-300">
                  <Mail className="mt-1 shrink-0 text-cyan-200" />
                  <div>
                    <p className="font-semibold text-white">Email</p>
                    <a href={siteConfig.emailHref} className="mt-1 block break-all text-sm text-cyan-100 hover:text-white">
                      {siteConfig.emailAddress}
                    </a>
                  </div>
                </div>
              </div>
              <a
                href={siteConfig.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-3xl border border-emerald-300/18 bg-emerald-400/[0.055] p-4 transition hover:-translate-y-0.5 hover:border-emerald-300/35 hover:bg-emerald-400/[0.08]"
              >
                <div className="flex items-start gap-3 text-slate-300">
                  <MessageCircle className="mt-1 shrink-0 text-emerald-200" />
                  <div>
                    <p className="font-semibold text-white">WhatsApp</p>
                    <p className="mt-1 text-sm text-emerald-100">{siteConfig.phoneDisplay}</p>
                    <p className="mt-1 text-xs text-slate-500">Message on WhatsApp</p>
                  </div>
                </div>
              </a>
            </div>
            {visibleSocials.length ? (
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {visibleSocials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:text-white"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            ) : null}
            <p className="mt-5 rounded-2xl border border-violet-300/15 bg-violet-400/[0.07] px-4 py-3 text-sm leading-6 text-violet-100">
              Open to internships, collaborations, freelance opportunities, and technical project work.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      <footer className="border-t border-white/10 px-4 py-10">
        <div className="mx-auto flex w-[min(1180px,100%)] flex-col gap-4 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-heading text-lg font-semibold text-white">{siteConfig.brandLine}</p>
            <p className="mt-1">Built with Next.js, TypeScript, Tailwind CSS, Three.js, and curiosity.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {socials.filter((social) => isUsableHref(social.href)).map((social) => (
                <a key={social.label} href={social.href} target={social.href.startsWith("http") || social.kind === "resume" ? "_blank" : undefined} rel={social.href.startsWith("http") || social.kind === "resume" ? "noopener noreferrer" : undefined} className="text-slate-300 hover:text-white">
                  {social.label}
                </a>
              ))}
            </div>
          </div>
          <p>(c) 2026 Ebbad Ur Rehman. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
