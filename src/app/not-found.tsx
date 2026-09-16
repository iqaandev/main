import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-6 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50">
        Error — Page not found
      </p>
      <h1 className="mt-8 font-serif text-[clamp(5rem,18vw,10rem)] font-light leading-none tracking-tight text-ink">
        404
      </h1>
      <p className="mt-6 font-serif text-xl font-light italic tracking-tight text-ink/70 sm:text-2xl">
        This page doesn&rsquo;t exist — yet.
      </p>
      <Link
        href="/"
        className="group mt-12 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3 text-sm font-medium text-paper transition-colors duration-300 hover:bg-viridian"
      >
        Return home
        <span
          aria-hidden="true"
          className="inline-block h-1.5 w-1.5 rotate-45 bg-gold transition-transform duration-500 group-hover:rotate-[135deg]"
        />
      </Link>
    </div>
  );
}
