import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4 pt-16">
      <div className="glass-panel max-w-xl rounded-3xl p-8 text-center">
        <p className="mono-label">404</p>
        <h1 className="mt-4 font-heading text-5xl font-bold text-white">Route not found</h1>
        <p className="mt-4 leading-8 text-slate-300">This system path does not exist yet. Return to the portfolio mission control.</p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-brand-gradient px-6 py-3 font-semibold text-white">
          Back Home
        </Link>
      </div>
    </main>
  );
}
