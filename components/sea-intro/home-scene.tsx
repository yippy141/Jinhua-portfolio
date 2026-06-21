"use client";

import Link from "next/link";

import { FrontDoor } from "@/components/front-door";
import { Icon } from "@/components/icons";
import { ParticleField } from "@/components/particle-field";

import { ReturnToSurface } from "./return-to-surface";
import { SeaNav } from "./sea-nav";

// The settled depths: the existing underwater portfolio, reused unchanged
// (ParticleField + FrontDoor + nav + social + footer). The only change from the
// original homepage body is a smaller, settled hero and a quiet "Return to
// surface" control. Lifted out of app/page.tsx so the orchestrator can mount it.

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

type HomeSceneProps = {
  // Provided when the intro is available this session; omitted for the no-JS /
  // no-globe path, where there is nothing to replay.
  onReplay?: () => void;
};

export function HomeScene({ onReplay }: HomeSceneProps) {
  return (
    <>
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
      <SeaNav />

      {/* Body: a smaller, settled hero pinned bottom-left on desktop, with the
          graph as an overlay on md+ and the stacked list on phones. */}
      <div className="relative z-10 flex flex-1 flex-col">
        <section className="relative z-20 px-6 sm:px-8 md:absolute md:bottom-28 md:left-12 md:max-w-[480px] md:px-0 lg:bottom-32">
          <h1
            id="sea-depths-hero"
            tabIndex={-1}
            className="text-balance font-serif text-[1.9rem] font-medium leading-[1.08] tracking-tight text-ink outline-none sm:text-4xl"
          >
            {hero.headline}
          </h1>
          <p className="mt-4 max-w-[420px] font-sans text-[0.95rem] leading-relaxed text-ink-2">
            {hero.blurb}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-5">
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
        {onReplay ? (
          <span className="whitespace-nowrap normal-case tracking-normal">
            <ReturnToSurface onReplay={onReplay} />
          </span>
        ) : null}
      </footer>
    </>
  );
}
