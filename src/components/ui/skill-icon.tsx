import type { ReactElement, SVGProps } from "react";
import type { PortfolioSkill } from "@/data/skills";
import { cn } from "@/lib/utils";

type SkillIconProps = {
  skill: Pick<PortfolioSkill, "id" | "name" | "color" | "glowColor">;
  large?: boolean;
  className?: string;
  iconClassName?: string;
};

type IconProps = SVGProps<SVGSVGElement> & {
  color: string;
};

type BrandConfig = {
  kind: "text" | "paths" | "system";
  label?: string;
  bg?: string;
  fg?: string;
  render?: (props: IconProps) => ReactElement;
};

const brandIcons: Record<string, BrandConfig> = {
  python: { kind: "paths", render: PythonIcon },
  java: { kind: "paths", render: JavaIcon },
  cpp: { kind: "text", label: "C++", bg: "linear-gradient(135deg,#3B82F6,#8B5CF6)", fg: "#F8FAFC" },
  sql: { kind: "paths", render: SqlIcon },
  javascript: { kind: "text", label: "JS", bg: "#F7DF1E", fg: "#111827" },
  typescript: { kind: "text", label: "TS", bg: "#3178C6", fg: "#F8FAFC" },
  react: { kind: "paths", render: ReactIcon },
  nextjs: { kind: "text", label: "N", bg: "linear-gradient(135deg,#F8FAFC,#94A3B8)", fg: "#020617" },
  tailwind: { kind: "paths", render: TailwindIcon },
  html: { kind: "text", label: "H5", bg: "#E34F26", fg: "#FFF7ED" },
  css: { kind: "text", label: "CSS", bg: "#1572B6", fg: "#EFF6FF" },
  nodejs: { kind: "text", label: "Node", bg: "#339933", fg: "#F0FDF4" },
  express: { kind: "text", label: "Ex", bg: "#111827", fg: "#E5E7EB" },
  git: { kind: "paths", render: GitIcon },
  github: { kind: "paths", render: GithubIcon },
  vercel: { kind: "paths", render: VercelIcon },
  docker: { kind: "paths", render: DockerIcon },
  postman: { kind: "text", label: "P", bg: "#FF6C37", fg: "#FFF7ED" },
};

export function SkillIcon({ skill, large = false, className, iconClassName }: SkillIconProps) {
  const config = brandIcons[skill.id] || { kind: "system", label: initials(skill.name), bg: `linear-gradient(135deg, ${skill.color}, #8B5CF6)`, fg: "#F8FAFC" };
  const size = large ? "h-14 w-14" : "h-10 w-10";
  const iconSize = large ? 32 : 24;

  return (
    <span
      className={cn("grid shrink-0 place-items-center rounded-2xl border border-white/10 bg-slate-950/70", size, className)}
      style={{ boxShadow: `0 0 24px ${skill.glowColor}` }}
      aria-hidden="true"
    >
      {config.kind === "paths" && config.render ? (
        config.render({ width: iconSize, height: iconSize, color: skill.color, className: iconClassName })
      ) : (
        <span
          className={cn("skill-icon-text grid h-[72%] w-[72%] place-items-center rounded-xl text-center font-heading font-black leading-none tracking-tight", large ? "text-sm" : "text-[10px]", iconClassName)}
          style={{ background: config.bg, color: config.fg }}
          data-label={config.label}
        />
      )}
    </span>
  );
}

export function SkillOrbIcon({ skill }: { skill: Pick<PortfolioSkill, "id" | "name" | "color" | "glowColor"> }) {
  return <SkillIcon skill={skill} className="h-8 w-8 rounded-full border-cyan-300/20 bg-slate-950/80" iconClassName="rounded-full" />;
}

function initials(name: string) {
  return name
    .split(/\s|\/|-/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function PythonIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <path d="M24 5c-8 0-10 3.4-10 8.2V18h12.5v2.6H9.8C5.6 20.6 3 24 3 28.6c0 4.7 2.8 8 7 8h4.2v-5.8c0-4.4 3.8-8 8.2-8h9.6c3.8 0 7-3.1 7-7v-2.6C39 8.4 35.3 5 24 5Z" fill="#3776AB" />
      <path d="M19.2 12.4a2 2 0 1 0 0-4.1 2 2 0 0 0 0 4.1Z" fill="#F8FAFC" />
      <path d="M24 43c8 0 10-3.4 10-8.2V30H21.5v-2.6h16.7c4.2 0 6.8-3.4 6.8-8 0-4.7-2.8-8-7-8h-4.2v5.8c0 4.4-3.8 8-8.2 8H16c-3.8 0-7 3.1-7 7v2.6C9 39.6 12.7 43 24 43Z" fill="#FFD43B" />
      <path d="M28.8 35.6a2 2 0 1 0 0 4.1 2 2 0 0 0 0-4.1Z" fill="#0F172A" />
    </svg>
  );
}

function JavaIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <path d="M26 5c3.5 4.1-5 6.4-3.3 11.2 1 2.9 4.8 3.8 3.3 8.1" stroke="#F89820" strokeWidth="3" strokeLinecap="round" />
      <path d="M31 9c2.8 3-3.9 5-2.5 8.4.8 2 3.2 3.2 2.2 6.2" stroke="#5382A1" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M15 28c7.6 2.1 16.2 1.7 22-.6" stroke="#5382A1" strokeWidth="3" strokeLinecap="round" />
      <path d="M13 34c8 3.2 20 2.6 25-.7" stroke="#5382A1" strokeWidth="3" strokeLinecap="round" />
      <path d="M17 39c6 1.6 13.8 1.3 19-.8" stroke="#F89820" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function SqlIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <ellipse cx="24" cy="12" rx="14" ry="6" fill="#22D3EE" fillOpacity=".95" />
      <path d="M10 12v20c0 3.3 6.3 6 14 6s14-2.7 14-6V12" stroke="#E0F7FF" strokeWidth="3" />
      <path d="M10 22c0 3.3 6.3 6 14 6s14-2.7 14-6" stroke="#8B5CF6" strokeWidth="3" />
      <path d="M10 31c0 3.3 6.3 6 14 6s14-2.7 14-6" stroke="#3B82F6" strokeWidth="3" />
    </svg>
  );
}

function ReactIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <circle cx="24" cy="24" r="4" fill="#61DAFB" />
      <ellipse cx="24" cy="24" rx="19" ry="7" stroke="#61DAFB" strokeWidth="2.8" />
      <ellipse cx="24" cy="24" rx="19" ry="7" stroke="#61DAFB" strokeWidth="2.8" transform="rotate(60 24 24)" />
      <ellipse cx="24" cy="24" rx="19" ry="7" stroke="#61DAFB" strokeWidth="2.8" transform="rotate(120 24 24)" />
    </svg>
  );
}

function TailwindIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <path d="M13 22c3-8 8-11 15-9 4 1 6 4 9 5 3 1 5 0 8-3-3 8-8 11-15 9-4-1-6-4-9-5-3-1-5 0-8 3Z" fill="#38BDF8" />
      <path d="M3 34c3-8 8-11 15-9 4 1 6 4 9 5 3 1 5 0 8-3-3 8-8 11-15 9-4-1-6-4-9-5-3-1-5 0-8 3Z" fill="#22D3EE" />
    </svg>
  );
}

function GitIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <rect x="9" y="9" width="30" height="30" rx="6" transform="rotate(45 24 24)" fill="#F05032" />
      <path d="M18 18l12 12M21 21a3 3 0 1 0-4.2-4.2A3 3 0 0 0 21 21Zm12 12a3 3 0 1 0-4.2-4.2A3 3 0 0 0 33 33Zm-3-15v12" stroke="#FFF7ED" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function GithubIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <circle cx="24" cy="24" r="20" fill="#0F172A" stroke="#CBD5E1" strokeWidth="2" />
      <path d="M24 11c-7.4 0-13.4 6-13.4 13.4 0 5.9 3.8 10.9 9.1 12.7.7.1 1-.3 1-.7v-2.5c-3.7.8-4.5-1.6-4.5-1.6-.6-1.5-1.5-1.9-1.5-1.9-1.2-.8.1-.8.1-.8 1.3.1 2 1.4 2 1.4 1.2 2 3.1 1.4 3.9 1.1.1-.9.5-1.4.8-1.8-3-.3-6.1-1.5-6.1-6.6 0-1.5.5-2.7 1.4-3.6-.1-.4-.6-1.8.1-3.6 0 0 1.1-.4 3.7 1.4 1.1-.3 2.2-.4 3.4-.4s2.3.1 3.4.4c2.6-1.8 3.7-1.4 3.7-1.4.7 1.8.2 3.2.1 3.6.9 1 1.4 2.2 1.4 3.6 0 5.1-3.1 6.2-6.1 6.6.5.4.9 1.2.9 2.4v3.7c0 .4.3.8 1 .7 5.3-1.8 9.1-6.8 9.1-12.7C37.4 17 31.4 11 24 11Z" fill="#F8FAFC" />
    </svg>
  );
}

function VercelIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <path d="M24 8 43 40H5L24 8Z" fill="#F8FAFC" />
    </svg>
  );
}

function DockerIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <path d="M10 24h27c-.3 8-5.8 13-14.4 13H19c-6.4 0-10.8-3.8-12-9.8 1.1.4 2.7.5 4.1-.2-.9-.6-1.5-1.7-1.7-3Z" fill="#2496ED" />
      {[11, 18, 25].map((x) => <rect key={x} x={x} y="17" width="6" height="5" rx="1" fill="#E0F2FE" />)}
      {[18, 25].map((x) => <rect key={x} x={x} y="11" width="6" height="5" rx="1" fill="#E0F2FE" />)}
      <path d="M37 21c2.2-.1 3.7-1 5-2.8.4 2.2-.3 4.1-2.2 5.7" stroke="#E0F2FE" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
