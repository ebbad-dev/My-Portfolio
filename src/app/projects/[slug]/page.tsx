import { notFound } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, GitBranch, Layers, ListChecks, Route } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { ProjectVisual } from "@/components/home/project-visual";
import { CodeRepoButton } from "@/components/ui/code-repo-button";
import { projects } from "@/data/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.filter((project) => project.featured).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} - Case Study | Ebbad Ur Rehman`,
    description: project.shortDescription,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug && item.featured);
  if (!project) notFound();

  return (
    <main className="pt-16">
      <section className="section-shell">
        <Link href="/#projects" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
          <ArrowLeft size={16} /> Back to projects
        </Link>
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="mono-label">{project.category}</p>
            <h1 className="mt-4 font-heading text-5xl font-bold text-white lg:text-7xl">{project.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{project.longDescription}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={project.demoRoute} variant="primary">Open Demo</ButtonLink>
              <CodeRepoButton href={project.githubUrl} status={project.codeStatus} label="GitHub Repo" />
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Academic Project", "Prototype", "Interactive Demo", "Case Study"].map((status) => (
                <span key={status} className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 font-mono text-xs text-cyan-100">
                  {status}
                </span>
              ))}
              <span className={`rounded-full border px-3 py-1 font-mono text-xs ${project.codeStatus === "available" ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100" : "border-slate-400/15 bg-white/[0.035] text-slate-400"}`}>
                {project.codeStatus === "available" ? "Code Available" : "Code Coming Soon"}
              </span>
            </div>
          </div>
          <ProjectVisual project={project} />
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="grid gap-5 lg:grid-cols-2">
          <CaseBlock icon={<Route />} title="Problem" items={[project.problem]} />
          <CaseBlock icon={<GitBranch />} title="Goal" items={[project.goal]} />
          <CaseBlock icon={<Layers />} title="My Role" items={[project.role]} />
          <CaseBlock icon={<ListChecks />} title="What I Actually Built" items={project.actuallyBuilt} />
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="glass-panel rounded-3xl p-6">
            <h2 className="font-heading text-3xl font-bold text-white">System Flow</h2>
            <div className="mt-6 grid gap-3">
              {project.architecture.map((step, index) => (
                <div key={step} className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-slate-300 transition hover:border-cyan-300/30 hover:bg-cyan-300/[0.06]">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-cyan-300/10 font-mono text-xs text-cyan-100">{index + 1}</span>
                  {step}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-3xl border border-cyan-300/15 bg-cyan-300/[0.06] p-4">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-cyan-100">Product flow preview</p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                {project.architecture.slice(0, 5).map((step, index) => (
                  <span key={`${step}-preview`} className="inline-flex items-center gap-2">
                    <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5">{step}</span>
                    {index < Math.min(project.architecture.length, 5) - 1 ? <span className="text-cyan-300/60">/</span> : null}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <CaseBlock title="Technical Decisions" items={project.technicalDecisions} />
            <CaseBlock title="Feature Breakdown" items={project.features} />
            <CaseBlock title="Engineering Highlights" items={project.highlights} />
            <CaseBlock title="Challenges" items={project.challenges} />
            <CaseBlock title="Trade-offs" items={project.tradeoffs} />
            <CaseBlock title="Lessons Learned" items={project.lessons} />
            <CaseBlock title="Future Improvements" items={project.future} />
          </div>
        </div>
      </section>
    </main>
  );
}

function CaseBlock({ title, items, icon }: { title: string; items: string[]; icon?: ReactNode }) {
  return (
    <div className="glass-panel rounded-3xl p-6">
      <div className="flex items-center gap-3">
        {icon ? <span className="text-cyan-200">{icon}</span> : null}
        <h2 className="font-heading text-2xl font-bold text-white">{title}</h2>
      </div>
      <ul className="mt-4 grid gap-3">
        {items.map((item) => (
          <li key={item} className="text-sm leading-7 text-slate-300">{item}</li>
        ))}
      </ul>
    </div>
  );
}
