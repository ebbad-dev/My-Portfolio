import type { ReactNode } from "react";

export function SectionHeader({ eyebrow, title, children, id }: { eyebrow: string; title: string; children?: ReactNode; id?: string }) {
  return (
    <div id={id} className="mb-10 max-w-3xl">
      <p className="mono-label mb-3">{eyebrow}</p>
      <h2 className="font-heading text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">{title}</h2>
      {children ? <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">{children}</p> : null}
    </div>
  );
}
