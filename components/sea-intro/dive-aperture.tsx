"use client";

import { useState } from "react";

// An authored "dive aperture": a circular waterline button, not a pill or a
// glowing rectangle. A restrained ring sits around the label; hover/focus adds a
// fainter second ripple and lifts the contrast; pressing feels physical. On
// activation its ripple expands outward and its screen position becomes the
// optical centre of the dive, so the control feels connected to the descent.

export type ApertureCenter = { x: number; y: number };

type DiveApertureProps = {
  onDive: (center: ApertureCenter) => void;
  disabled?: boolean;
};

export function DiveAperture({ onDive, disabled }: DiveApertureProps) {
  const [firing, setFiring] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || firing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const center: ApertureCenter = {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    };
    setFiring(true);
    // Let the aperture ripple begin before the camera commits, so the dive
    // reads as originating here.
    window.setTimeout(() => onDive(center), 180);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Dive in"
      className="group relative grid h-[104px] w-[104px] place-items-center rounded-full text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-sonar"
    >
      {/* idle waterline ring */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full border border-ink/35 transition-all duration-500 group-hover:scale-105 group-hover:border-ink/70 group-focus-visible:scale-105 group-focus-visible:border-ink/70 motion-safe:animate-[seaAperturePulse_5s_ease-in-out_infinite]"
      />
      {/* second, fainter ripple revealed on hover/focus */}
      <span
        aria-hidden="true"
        className="absolute inset-0 scale-110 rounded-full border border-ink/15 opacity-0 transition-all duration-500 group-hover:scale-[1.28] group-hover:opacity-70 group-focus-visible:scale-[1.28] group-focus-visible:opacity-70"
      />
      {/* expanding ripple on activation */}
      {firing ? (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border-2 border-sonar/70 [animation:seaApertureRipple_780ms_cubic-bezier(0.22,1,0.36,1)_forwards]"
        />
      ) : null}

      <span className="z-10 font-serif text-[19px] leading-none text-ink transition-transform duration-200 group-active:scale-95">
        Dive in
      </span>
    </button>
  );
}
