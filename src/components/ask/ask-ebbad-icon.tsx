import { cn } from "@/lib/utils";

export function AskEbbadIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "ask-ebbad-glyph relative grid shrink-0 place-items-center overflow-hidden rounded-2xl border border-cyan-300/25 bg-slate-950/85 shadow-[0_0_24px_rgba(34,211,238,0.18)]",
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" className="relative z-10 h-[78%] w-[78%]" role="img" aria-label="Ask Ebbad assistant icon">
        <defs>
          <linearGradient id="ask-glyph-shell" x1="12" x2="52" y1="8" y2="56" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ECFEFF" stopOpacity="0.94" />
            <stop offset="0.44" stopColor="#67E8F9" stopOpacity="0.88" />
            <stop offset="1" stopColor="#8B5CF6" stopOpacity="0.82" />
          </linearGradient>
          <linearGradient id="ask-glyph-face" x1="18" x2="48" y1="18" y2="45" gradientUnits="userSpaceOnUse">
            <stop stopColor="#061827" />
            <stop offset="1" stopColor="#020617" />
          </linearGradient>
          <filter id="ask-glyph-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.6" result="blur" />
            <feColorMatrix in="blur" values="0 0 0 0 0.13 0 0 0 0 0.83 0 0 0 0 0.93 0 0 0 0.65 0" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d="M22 13.5C22 10.5 24.5 8 27.5 8h9c3 0 5.5 2.5 5.5 5.5v1.7c7.1 2.4 12 8.9 12 16.8 0 10.1-7.8 18-18.7 18H28.7C17.8 50 10 42.1 10 32c0-7.9 4.9-14.4 12-16.8v-1.7Z" fill="url(#ask-glyph-shell)" opacity="0.88" />
        <path d="M19 30.2c0-6.9 5.1-11.7 12.2-11.7h1.6C39.9 18.5 45 23.3 45 30.2v2.1C45 39.1 39.9 44 32.8 44h-1.6C24.1 44 19 39.1 19 32.3v-2.1Z" fill="url(#ask-glyph-face)" stroke="#67E8F9" strokeOpacity="0.45" strokeWidth="1.4" />
        <path d="M14 30.5h-3.2c-2.1 0-3.8 1.7-3.8 3.8v3.4c0 2.1 1.7 3.8 3.8 3.8H14v-11ZM50 30.5h3.2c2.1 0 3.8 1.7 3.8 3.8v3.4c0 2.1-1.7 3.8-3.8 3.8H50v-11Z" fill="#1D4ED8" opacity="0.58" />
        <g filter="url(#ask-glyph-glow)">
          <circle cx="26" cy="30.5" r="3.6" fill="#22D3EE" />
          <circle cx="38" cy="30.5" r="3.6" fill="#22D3EE" />
          <circle cx="27" cy="31.7" r="1.35" fill="#052B32" />
          <circle cx="39" cy="31.7" r="1.35" fill="#052B32" />
          <path d="M24.5 36.6c4.4 4.1 10.6 4.1 15 0" fill="none" stroke="#22D3EE" strokeLinecap="round" strokeWidth="2.6" />
        </g>
        <path d="M32 8V4.8M32 4.8l3 2M32 4.8l-3 2" stroke="#A5F3FC" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" opacity="0.9" />
      </svg>
    </span>
  );
}
