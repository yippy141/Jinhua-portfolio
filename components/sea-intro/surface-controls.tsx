"use client";

import { Icon } from "@/components/icons";

type SurfaceControlsProps = {
  onDive: () => void;
  onSkip: () => void;
  // True while the dive is running: the controls go inert so neither action can
  // fire twice or interrupt the locked transition.
  disabled: boolean;
};

// One primary action and one quiet escape hatch. No HUD, no coordinates, no
// city label: just the two verbs the visitor needs.
export function SurfaceControls({
  onDive,
  onSkip,
  disabled,
}: SurfaceControlsProps) {
  return (
    <div
      className="pointer-events-auto flex flex-wrap items-center gap-5"
      inert={disabled ? true : undefined}
    >
      <button
        type="button"
        onClick={onDive}
        className="inline-flex items-center gap-2 rounded-[3px] bg-oxblood px-5 py-3 font-sans text-sm tracking-[0.02em] text-paper transition-colors duration-200 hover:bg-oxblood-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sonar"
      >
        Dive in <Icon name="arrow" size={14} />
      </button>
      <button
        type="button"
        onClick={onSkip}
        className="rounded-[2px] font-sans text-sm text-ink-2 underline-offset-4 transition-colors duration-200 hover:text-ink hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sonar"
      >
        Skip intro
      </button>
    </div>
  );
}
