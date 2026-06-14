import Link from "next/link";

import { FrontDoor } from "@/components/front-door";
import { Icon, SocialCluster } from "@/components/icons";
import { ParticleField } from "@/components/particle-field";

const navItems = [
  { href: "/about", label: "ABOUT" },
  { href: "/research", label: "RESEARCH" },
  { href: "/archive", label: "ARCHIVE" },
  { href: "/contact", label: "CONTACT" },
];

// Decision: the old "The Atlases · No. 02" eyebrow is removed. This is a living
// personal index, not a numbered issue series, so a fixed number would be a
// claim we would have to maintain. No eyebrow, just the title and blurb.
const hero = {
  headline: "Welcome to my Sea of Consciousness",
  blurb:
    "My personal repository of projects on emerging technology and international affairs.",
  cta: "Enter the archive",
  hint: "Explore a project",
};

const frontFooter = [
  "22.5°N · 114.1°E",
  "Each object is a real project",
  "Select a project to open it.",
];

export default function HomePage() {
  return (
    <main
      id="main"
      data-theme="dark"
      className="relative isolate flex min-h-screen flex-col overflow-hidden bg-paper text-ink"
    >
      {/* Deep-water atmosphere: WebGL plankton field (behind everything), then
          tide glow, faint grid, and fog at the foot layered over it. The rgba()
          values below are the constitution tokens with alpha: 53,107,102 = tide,
          157,176,168 = ink-2, 7,16,15 = deep-water paper. */}
      <ParticleField />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(120%_90%_at_80%_8%,rgba(53,107,102,0.16),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] [background-image:linear-gradient(rgba(157,176,168,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(157,176,168,0.04)_1px,transparent_1px)] [background-size:90px_90px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 [background:linear-gradient(0deg,rgba(7,16,15,0.92),transparent)]"
      />

      {/* Navigation */}
      <header className="relative z-20 flex flex-col gap-5 px-6 py-6 sm:px-8 lg:flex-row lg:items-start lg:justify-between lg:px-12 lg:py-8">
        <Link
          href="/"
          className="block w-fit rounded-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sonar"
        >
          <span className="block font-serif text-2xl leading-none text-ink">
            Jinhua Yip
          </span>
          <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-[0.24em] text-ink-2">
            Intelligence Atlases
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
          <nav aria-label="Primary">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-xs uppercase tracking-[0.12em] text-ink-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="rounded-[2px] transition-colors duration-200 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sonar"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <SocialCluster size={15} />
        </div>
      </header>

      {/* Body: hero in flow (mobile) / pinned bottom-left (desktop), with the
          graph as an overlay on md+ and the stacked list on phones. */}
      <div className="relative z-10 flex flex-1 flex-col">
        <section className="relative z-20 px-6 sm:px-8 md:absolute md:bottom-28 md:left-12 md:max-w-[560px] md:px-0 lg:bottom-32">
          <h1 className="text-balance font-serif text-[2.5rem] font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl">
            {hero.headline}
          </h1>
          <p className="mt-5 max-w-[440px] font-sans text-base leading-relaxed text-ink-2">
            {hero.blurb}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-5">
            <Link
              href="/archive"
              className="inline-flex items-center gap-2 rounded-[3px] bg-oxblood px-5 py-3 font-sans text-sm tracking-[0.02em] text-paper transition-colors duration-200 hover:bg-oxblood-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sonar"
            >
              {hero.cta} <Icon name="arrow" size={14} />
            </Link>
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2">
              {hero.hint}
            </span>
          </div>
        </section>

        <FrontDoor />
      </div>

      {/* Front footer */}
      <footer className="relative z-20 mt-10 flex flex-col gap-2 px-6 pb-7 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-2 sm:flex-row sm:items-center sm:justify-between sm:gap-12 sm:px-8 md:absolute md:inset-x-12 md:bottom-7 md:mt-0 md:px-0">
        {frontFooter.map((line) => (
          <span key={line} className="whitespace-nowrap">
            {line}
          </span>
        ))}
      </footer>
    </main>
  );
}
