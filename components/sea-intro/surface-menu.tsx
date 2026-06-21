"use client";

import Link from "next/link";

import { SocialCluster } from "@/components/icons";

// The surface presents as a quiet title menu over the dawn globe, not a HUD and
// not a generic CTA. Newsreader + IBM Plex Sans only, sentence case, normal
// tracking. The Dive in control is typographic with a restrained underline and
// a small descent chevron; Skip intro stays visually subordinate.

const navItems = [
  { href: "/about", label: "About" },
  { href: "/research", label: "Research" },
  { href: "/archive", label: "Archive" },
  { href: "/contact", label: "Contact" },
];

type SurfaceMenuProps = {
  onDive: () => void;
  onSkip: () => void;
  disabled: boolean;
};

export function SurfaceMenu({ onDive, onSkip, disabled }: SurfaceMenuProps) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col" inert={disabled ? true : undefined}>
      {/* Top: wordmark + primary navigation, kept accessible. */}
      <header className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-7">
        <Link
          href="/"
          className="rounded-[3px] font-serif text-xl text-ink/90 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sonar"
        >
          Jinhua Yip
        </Link>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <nav aria-label="Primary">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-sm text-ink-2">
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
          <SocialCluster size={15} />
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

          <button
            type="button"
            onClick={onDive}
            className="group mt-9 inline-flex flex-col items-center gap-1.5 rounded-[2px] font-serif text-lg text-ink transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-6 focus-visible:outline-sonar"
          >
            <span className="relative">
              Dive in
              <span className="absolute -bottom-1 left-1/2 h-px w-6 -translate-x-1/2 bg-ink/60 transition-all duration-300 group-hover:w-full group-hover:bg-ink" />
            </span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="translate-y-0 text-ink-2 transition-transform duration-300 group-hover:translate-y-1"
            >
              <path
                d="M12 5v13M6 13l6 6 6-6"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={onSkip}
            className="mt-6 rounded-[2px] font-sans text-sm text-ink-2 underline-offset-4 transition-colors hover:text-ink hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sonar"
          >
            Skip intro
          </button>
        </div>
      </div>
    </div>
  );
}
