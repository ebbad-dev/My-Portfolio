import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/data/site";
import { MirrorMindInteractiveDemo, ProctorInteractiveDemo, TeletrackInteractiveDemo } from "@/components/demos/interactive-demos";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.filter((project) => project.featured).map((project) => ({ slug: project.slug.replace("-enterprise", "") }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} Demo | Ebbad Ur Rehman`,
    description: `Interactive portfolio demo for ${project.title}.`,
  };
}

export default async function DemoPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main className="pt-16">
      <section className="section-shell">
        <Link href="/#demos" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
          <ArrowLeft size={16} /> Back to demos
        </Link>
        <div className="mb-7">
          <p className="mono-label">Interactive Portfolio Demo</p>
          <h1 className="mt-3 font-heading text-4xl font-bold text-white lg:text-6xl">{project.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">Demo uses mock data to show the product flow. It is not presented as a deployed production system.</p>
        </div>
        {slug === "proctorai" ? <ProctorInteractiveDemo /> : slug === "teletrack" ? <TeletrackInteractiveDemo /> : <MirrorMindInteractiveDemo />}
      </section>
    </main>
  );
}

function getProject(slug: string) {
  const map: Record<string, string> = {
    proctorai: "proctorai",
    teletrack: "teletrack-enterprise",
    mirrormind: "mirrormind",
  };
  return projects.find((project) => project.slug === map[slug]);
}
