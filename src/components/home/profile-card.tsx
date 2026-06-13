"use client";

import Image from "next/image";
import { UserRound } from "lucide-react";
import { useState } from "react";
import { siteConfig } from "@/data/site";

export function ProfileCard() {
  const [imageMissing, setImageMissing] = useState(false);

  return (
    <div className="glass-panel relative min-h-[460px] overflow-hidden rounded-3xl p-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(249,115,22,0.18),transparent_38%),radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_44%)]" />
      <div className="relative grid h-full content-between">
        <div className="relative mx-auto mt-4 aspect-[4/5] w-full max-w-[330px] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950">
          <Image
            src={siteConfig.profileImagePath}
            alt="Ebbad Ur Rehman profile portrait"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 330px, 80vw"
            priority
            onError={() => setImageMissing(true)}
          />
          {imageMissing ? (
            <div className="absolute inset-0 grid place-items-center bg-slate-950/92 text-center">
              <div>
                <UserRound className="mx-auto text-cyan-200" size={64} />
                <p className="mt-4 px-6 text-sm leading-6 text-slate-300">Profile image placeholder. Add a real image at public/images/profile/profile-1.jpeg.</p>
              </div>
            </div>
          ) : null}
        </div>
        <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
          <p className="mono-label">Mission Control</p>
          <p className="mt-2 font-heading text-2xl font-bold text-white">Full-stack / AI / Databases / Systems</p>
        </div>
      </div>
    </div>
  );
}
