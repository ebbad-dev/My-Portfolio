import type { MetadataRoute } from "next";
import { projects } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://ebbad-portfolio.vercel.app";
  const featured = projects.filter((project) => project.featured);

  return [
    { url: base, lastModified: new Date() },
    ...featured.map((project) => ({
      url: `${base}/projects/${project.slug}`,
      lastModified: new Date(),
    })),
    ...featured.map((project) => ({
      url: `${base}${project.demoRoute}`,
      lastModified: new Date(),
    })),
  ];
}
