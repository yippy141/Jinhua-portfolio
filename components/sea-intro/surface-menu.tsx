"use client";

import Link from "next/link";

import { SocialCluster } from "@/components/icons";

import { DiveAperture } from "./dive-aperture";
import type { ApertureCenter } from "./dive-aperture";

// The surface presents as a quiet title menu over the dawn globe, not a HUD and
// not a generic CTA. Newsreader + IBM Plex Sans only, sentence case, normal
// tracking. The dive action is an authored circular aperture; Skip intro stays
// visually subordinate beneath it.

const navItems = [
  { href: "/about", label: "About" },
  { href: "/research", label: "Research" },
  { href: "/archive", label: "Archive" },
  { href: "/contact", label: "Contact" },
];

type SurfaceMenuProps = {
  onDive: (center: ApertureCenter) => void;
  onSkip: () => void;
  disabled: boolean;
};

export function SurfaceMenu({ onDive, onSkip, disabled }: SurfaceMenuProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-30 flex flex-col"
      inert={disabled ? true : undefined}
    >
      {/* Top: wordmark + primary navigation, kept accessible. */}
      <header className="pointer-events-auto flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-7">
        <Link
          href="/"
          className="rounded-[3px] font-serif text-xl text-ink drop-shadow-[0_1px_10px_rgba(7,16,15,0.6)] transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sonar"
        >
          Jinhua Yip
        </Link>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <nav aria-label="Primary">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-[15px] text-ink/85 drop-shadow-[0_1px_10px_rgba(7,16,15,0.6)]">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="rounded-[2px] underline-offset-4 transition-colors hover:text-ink hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sonar"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <SocialCluster size={16} />
        </div>
      </header>

      {/* Centre / lower-centre: the title and the dive action. */}
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="flex translate-y-[6vh] flex-col items-center text-center">
          <h1 className="font-serif text-5xl font-medium leading-none tracking-tight text-ink drop-shadow-[0_2px_18px_rgba(7,16,15,0.55)] sm:text-7xl">
            Jinhua Yip
          </h1>
          <p className="mt-4 max-w-sm font-sans text-sm leading-relaxed text-ink-2 drop-shadow-[0_1px_10px_rgba(7,16,15,0.6)]">
            Projects on emerging technology and international affairs.
          </p>

          <div className="pointer-events-auto mt-8">
            <DiveAperture onDive={onDive} disabled={disabled} />
          </div>

          <button
            type="button"
            onClick={onSkip}
            className="pointer-events-auto mt-5 rounded-[2px] font-sans text-sm text-ink-2 underline-offset-4 transition-colors hover:text-ink hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sonar"
          >
            Skip intro
          </button>
        </div>
      </div>
    </div>
  );
}
