import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Project } from "@/data/site";
import { ButtonLink } from "@/components/ui/button-link";
import { ProjectVisual } from "@/components/home/project-visual";
import { CodeRepoButton } from "@/components/ui/code-repo-button";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="glass-panel premium-card group overflow-hidden rounded-3xl p-5 transition duration-500 hover:-translate-y-1.5 hover:border-cyan-300/40 hover:shadow-[0_28px_90px_rgba(34,211,238,0.13)]">
      <ProjectVisual project={project} />
      <div className="mt-6">
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 font-mono text-xs text-cyan-100">{project.maturity}</span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-xs text-slate-300">{project.category}</span>
          <span className={`rounded-full border px-3 py-1 font-mono text-xs ${project.codeStatus === "available" ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100" : "border-slate-400/15 bg-white/[0.035] text-slate-400"}`}>
            {project.codeStatus === "available" ? "Code Available" : "Code Coming Soon"}
          </span>
        </div>
        <h3 className="font-heading text-2xl font-bold text-white">{project.title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-300">{project.shortDescription}</p>
        <p className="mt-4 text-sm text-slate-400"><span className="text-slate-200">Problem:</span> {project.problem}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.techStack.slice(0, 5).map((tech) => (
            <span key={tech} className="rounded-full bg-white/[0.05] px-3 py-1 text-xs text-slate-300">{tech}</span>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href={project.demoRoute} variant="primary">Demo</ButtonLink>
          <ButtonLink href={`/projects/${project.slug}`}>Case Study</ButtonLink>
          <CodeRepoButton href={project.githubUrl} status={project.codeStatus} label="View Code" />
        </div>
        <Link href={`/projects/${project.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200">
          Read how it works <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
