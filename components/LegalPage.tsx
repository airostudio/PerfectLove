import Link from "next/link";

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-9 last:mb-0">
      <h2 className="font-serif text-lg md:text-xl text-bone mb-3">{title}</h2>
      <div className="text-sm text-mist/70 leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-1.5 [&_a]:text-orchid [&_a]:hover:text-bone [&_a]:transition-colors">
        {children}
      </div>
    </section>
  );
}

export function LegalPageShell({
  eyebrow,
  title,
  lastUpdated,
  children,
}: {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-block text-xs text-ash hover:text-orchid transition-colors mb-10"
        >
          &larr; Back to PerfectLove
        </Link>

        <p className="text-xs uppercase tracking-[0.3em] text-orchid/50 mb-3">
          {eyebrow}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-bone mb-2">
          {title}
        </h1>
        <p className="text-xs text-ash/60 mb-10">Last updated: {lastUpdated}</p>

        <div className="mystic-divider mb-10" />

        <div className="glass-card p-8 md:p-10">{children}</div>

        <p className="text-xs text-ash/50 text-center mt-10">
          Questions? Reach us at{" "}
          <a
            href="mailto:support@perfectlove.site"
            className="text-orchid hover:text-bone transition-colors"
          >
            support@perfectlove.site
          </a>
        </p>
      </div>
    </main>
  );
}
