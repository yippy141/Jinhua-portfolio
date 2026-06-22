"use client";

import { useEffect, useRef } from "react";

import { DiveVeil } from "./dive-veil";
import { HomeScene } from "./home-scene";
import { SeaNav } from "./sea-nav";
import { SurfaceControls } from "./surface-controls";
import { SurfaceGlobe } from "./surface-globe";
import { TIMELINE_GUARD_MS } from "./mapbox-config";
import { useSeaIntroState } from "./use-sea-intro-state";

// Orchestrates Surface -> Dive -> Depths. Owns the state machine, the input
// lock, the screen-reader announcement, the hard timeout guard, and the focus
// handoff into the depths. Renderers never share a canvas; Mapbox is fully
// destroyed when SurfaceGlobe unmounts at the depths.
export function SeaIntro() {
  const {
    state,
    resolved,
    reducedMotion,
    introCapable,
    locked,
    dive,
    skip,
    replay,
    finishDive,
  } = useSeaIntroState();

  // Read the live state inside callbacks without stale closures.
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  // Whether the visitor reached the depths through the intro this load (so we
  // only move focus after a real transition, never on the SSR placeholder).
  const cameThrough = useRef(false);

  const handleDive = () => {
    cameThrough.current = true;
    if (reducedMotion) {
      // Instant cut, no fly-in or shader.
      skip();
    } else {
      dive();
    }
  };

  const handleSkip = () => {
    cameThrough.current = true;
    skip();
  };

  const handleReplay = () => {
    cameThrough.current = false;
    replay();
  };

  // Called when the camera settles (or the globe could not run). Resolve from
  // wherever we currently are so we never strand the visitor.
  const handleArrived = () => {
    if (stateRef.current === "diving") finishDive();
    else if (stateRef.current === "surface") skip();
  };

  // Hard guard: force completion if `moveend` is dropped (tab blur, GPU stall).
  useEffect(() => {
    if (state !== "diving") return;
    const id = window.setTimeout(finishDive, TIMELINE_GUARD_MS);
    return () => window.clearTimeout(id);
  }, [state, finishDive]);

  // Move focus into the depths hero after a real transition, for SR continuity.
  useEffect(() => {
    if (state === "depths" && cameThrough.current) {
      document.getElementById("sea-depths-hero")?.focus();
    }
  }, [state]);

  // Until the client resolves the real state, render the depths shell so the
  // server output and first paint are usable (no-JS friendly).
  if (!resolved || state === "depths") {
    return (
      <HomeScene
        onReplay={introCapable ? handleReplay : undefined}
        showAmbientFauna={resolved && state === "depths"}
      />
    );
  }

  // Surface and Dive share the same globe instance and chrome.
  return (
    <div className="absolute inset-0 flex flex-col">
      <SeaNav />

      <SurfaceGlobe
        diving={state === "diving"}
        reducedMotion={reducedMotion}
        onArrived={handleArrived}
      />

      {/* Bottom scrim for control legibility over the imagery. A soft gradient,
          not a glass panel. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/2 [background:linear-gradient(0deg,rgba(7,16,15,0.85),transparent)]"
      />

      <div className="relative z-20 mt-auto px-6 pb-12 sm:px-8 md:px-12">
        <SurfaceControls
          onDive={handleDive}
          onSkip={handleSkip}
          disabled={locked}
        />
      </div>

      {/* The dive transition: water-surface veil over the descending camera. */}
      {state === "diving" ? <DiveVeil /> : null}

      {/* Input lock + polite announcement while the transition owns the screen. */}
      {locked ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-30 cursor-default"
          onClickCapture={(e) => e.stopPropagation()}
        />
      ) : null}
      <div aria-live="polite" className="sr-only">
        {state === "diving" ? "Entering the archive." : ""}
      </div>
    </div>
  );
}
