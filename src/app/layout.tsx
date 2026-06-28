import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { siteConfig } from "@/data/site";
import { HolographicCursor } from "@/components/ui/holographic-cursor";
import { CommandPalette } from "@/components/system/command-palette";
import { SiteNav } from "@/components/system/site-nav";
import { SocialDock } from "@/components/system/social-dock";
import { SmoothScroll } from "@/components/system/smooth-scroll";
import { WelcomeIntro } from "@/components/system/welcome-intro";
import { FloatingChatbot } from "@/components/chatbot/floating-chatbot";
import { ActiveSectionProvider } from "@/hooks/useActiveSection";
import { InitialScrollGuard } from "@/components/system/initial-scroll-guard";

const heading = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || siteConfig.siteUrl),
  title: siteConfig.seoTitle,
  description: siteConfig.seoDescription,
  alternates: {
    canonical: siteConfig.siteUrl,
  },
  openGraph: {
    title: "Ebbad Ur Rehman - Full-Stack Developer Portfolio",
    description: "Explore Ebbad Ur Rehman's projects in full-stack development, AI, computer vision, databases, backend systems, and interactive software products.",
    type: "website",
    locale: "en_US",
    url: siteConfig.siteUrl,
    images: [
      {
        url: siteConfig.profileImagePath,
        width: 1200,
        height: 1400,
        alt: "Ebbad Ur Rehman",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seoTitle,
    description: siteConfig.seoDescription,
    images: [siteConfig.profileImagePath],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: siteConfig.name,
    url: siteConfig.siteUrl,
    image: `${siteConfig.siteUrl}${siteConfig.profileImagePath}`,
    about: siteConfig.seoDescription,
    mainEntity: {
      "@type": "Person",
      name: siteConfig.name,
      jobTitle: "Software Engineering Student and Full-Stack Developer",
      address: {
        "@type": "PostalAddress",
        addressLocality: siteConfig.location,
        addressCountry: "Pakistan",
      },
      alumniOf: siteConfig.university,
      sameAs: [
        "https://www.linkedin.com/in/ebbad-ur-rehman/",
        "https://github.com/ebbad-dev",
        "https://www.instagram.com/ebbad_official/",
      ],
    },
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${heading.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                try {
                  const stored = localStorage.getItem("ebbad-theme");
                  const systemLight = window.matchMedia("(prefers-color-scheme: light)").matches;
                  const theme = stored === "light" || stored === "dark" ? stored : systemLight ? "light" : "dark";
                  document.documentElement.dataset.theme = theme;
                  document.documentElement.style.colorScheme = theme;
                } catch {
                  document.documentElement.dataset.theme = "dark";
                  document.documentElement.style.colorScheme = "dark";
                }
              })();
            `,
          }}
        />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-slate-950">
          Skip to content
        </a>
        <ActiveSectionProvider>
          <SiteNav />
          <SocialDock />
          <CommandPalette />
          <InitialScrollGuard />
          <SmoothScroll />
          <WelcomeIntro />
          <HolographicCursor />
          {children}
          <FloatingChatbot />
        </ActiveSectionProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <Analytics />
      </body>
    </html>
  );
}
