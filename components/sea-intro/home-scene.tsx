"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Icon } from "@/components/icons";
import { ParticleField } from "@/components/particle-field";

import { AmbientThoughtLayer } from "./ambient-thought-layer";
import { ProjectDriftField } from "./project-drift-field";
import { ReturnToSurface } from "./return-to-surface";
import { SeaNav } from "./sea-nav";
import { INTRO_CONFIG } from "./sea-intro-config";

// The settled depths: the existing underwater portfolio, reused unchanged
// (ParticleField + FrontDoor + nav + social + footer). The only change from the
// original homepage body is a smaller, settled hero and a quiet "Return to
// surface" control. When the visitor arrives through the dive, the layers enter
// in a staggered depth reveal rather than one flat opacity fade.

const hero = {
  headline: "Welcome to my Sea of Consciousness",
  blurb:
    "My personal repository of projects on emerging technology and international affairs.",
};

// Stagger derived from the typed reveal offsets so it tunes alongside the dive.
const STAGGER_SPAN = 760;
const DUR = INTRO_CONFIG.reveal.layerDurationMs;
const delays = {
  chrome: INTRO_CONFIG.reveal.chromeAt * STAGGER_SPAN,
  hero: INTRO_CONFIG.reveal.heroAt * STAGGER_SPAN,
  graph: INTRO_CONFIG.reveal.graphAt * STAGGER_SPAN,
};

type HomeSceneProps = {
  // Provided when the intro is available this session; omitted for the no-JS /
  // no-globe path, where there is nothing to replay.
  onReplay?: () => void;
  // Play the staggered depth entrance (true when arriving through the dive).
  entrance?: boolean;
  // Heavy WebGL atmosphere starts only once the depths are the active state.
  showParticleField?: boolean;
  // Ambient thoughts are allowed only after the intro state has settled in depths.
  showAmbientThoughts?: boolean;
};

export function HomeScene({
  onReplay,
  entrance = false,
  showParticleField = true,
  showAmbientThoughts = false,
}: HomeSceneProps) {
  const [revealed, setRevealed] = useState(!entrance);
  // Once settled we drop transforms/filters entirely so FrontDoor's fixed
  // dossier positioning is never trapped inside a transformed ancestor.
  const [settled, setSettled] = useState(!entrance);

  useEffect(() => {
    if (!entrance) return;
    const r = requestAnimationFrame(() => setRevealed(true));
    const t = window.setTimeout(
      () => setSettled(true),
      DUR + delays.graph + 120,
    );
    return () => {
      cancelAnimationFrame(r);
      window.clearTimeout(t);
    };
  }, [entrance]);

  // Per-layer entrance style: slight scale, blur and vertical offset, cleared
  // once settled.
  const layer = (delay: number): React.CSSProperties => {
    if (settled) return {};
    if (revealed) {
      return {
        opacity: 1,
        transform: "none",
        filter: "none",
        transition: `opacity ${DUR}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform ${DUR}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, filter ${DUR}ms ease ${delay}ms`,
      };
    }
    return {
      opacity: 0,
      transform: "translateY(20px) scale(0.97)",
      filter: "blur(7px)",
    };
  };

  return (
    <>
      {showParticleField ? <ParticleField /> : null}
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
      {showAmbientThoughts ? <AmbientThoughtLayer /> : null}

      {/* Navigation */}
      <div style={layer(delays.chrome)}>
        <SeaNav />
      </div>

      {/* Body: a smaller, settled hero pinned bottom-left on desktop, with the
          graph as an overlay on md+ and the stacked list on phones. */}
      <div className="relative z-10 flex flex-1 flex-col">
        <section
          id="sea-hero"
          style={layer(delays.hero)}
          className="relative z-20 px-6 sm:px-8 md:absolute md:bottom-28 md:left-12 md:max-w-[480px] md:px-0 lg:bottom-32"
        >
          <h1
            id="sea-depths-hero"
            tabIndex={-1}
            className="text-balance font-serif text-[1.9rem] font-medium leading-[1.08] tracking-tight text-ink outline-none sm:text-4xl"
          >
            {hero.headline}
          </h1>
          <p className="mt-4 max-w-[440px] font-sans text-[15px] leading-relaxed text-ink/70">
            {hero.blurb}
          </p>
          <div className="mt-6">
            <Link
              href="/archive"
              className="group inline-flex items-center gap-1.5 rounded-[2px] font-sans text-[15px] text-ink underline-offset-4 transition-colors duration-200 hover:text-oxblood hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sonar"
            >
              Browse all projects
              <Icon name="arrow" size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>

        {/* The project field measures the real header/hero/footer rectangles and
            runs its own settled, staggered entrance, so it is not wrapped in a
            transform here (which would break its measurement and fixed dossier). */}
        <ProjectDriftField />
      </div>

      {/* Front footer: a single quiet way back up, no decorative coordinates. */}
      {onReplay ? (
        <footer
          id="sea-footer"
          className="relative z-20 mt-10 flex px-6 pb-7 sm:px-8 md:absolute md:inset-x-12 md:bottom-7 md:mt-0 md:justify-end md:px-0"
        >
          <ReturnToSurface onReplay={onReplay} />
        </footer>
      ) : (
        <footer id="sea-footer" aria-hidden="true" className="md:absolute md:bottom-7" />
      )}
    </>
  );
}
