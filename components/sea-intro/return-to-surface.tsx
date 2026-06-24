"use client";

import { useTranslations } from "next-intl";

type ReturnToSurfaceProps = {
  onReplay: () => void;
};

// A quiet way back up. Sits discreetly in the chrome; never competes with the
// archive CTA. No decorative mono, no icon glow.
export function ReturnToSurface({ onReplay }: ReturnToSurfaceProps) {
  const t = useTranslations("sea.depths");

  return (
    <button
      type="button"
      onClick={onReplay}
      className="rounded-[2px] font-sans text-xs tracking-[0.02em] text-ink-2 underline-offset-4 transition-colors duration-200 hover:text-ink hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sonar"
    >
      {t("return")}
    </button>
  );
}
