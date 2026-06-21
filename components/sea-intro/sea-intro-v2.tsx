"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { DawnGlobe } from "./dawn-globe";
import { DiveTransitionScene } from "./dive-transition-scene";
import { HomeScene } from "./home-scene";
import { IntroDebugPanel } from "./intro-debug-panel";
import { SurfaceMenu } from "./surface-menu";
import { createDiveClock } from "./dive-clock";
import type { DiveClock } from "./dive-clock";
import { resolveConfig } from "./sea-intro-config";
import { useSeaIntroState } from "./use-sea-intro-state";

// V2 orchestrator. One shared clock drives Mapbox (DawnGlobe) and the spatial
// Three.js transition (DiveTransitionScene) as a single continuous journey:
// Stratospheric Dawn surface -> orbital-to-oblique descent -> water crossing ->
// underwater convergence onto the existing depths. The map persists beneath the
// transition until the water plane has fully occluded it, then is removed.

type Arrival = "none" | "dive" | "reduced";

const EASE = "cubic-bezier(0.22,1,0.36,1)";

export function SeaIntroV2() {
  const intro = useSeaIntroState();
  const { state, resolved, reducedMotion, introCapable, finishDive } = intro;

  // ── environment ──
  const [isMobile, setIsMobile] = useState(false);
  const [debug, setDebug] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    try {
      setDebug(new URLSearchParams(window.location.search).get("introDebug") === "1");
    } catch {
      // ignore
    }
    return () => mq.removeEventListener("change", update);
  }, []);

  const config = useMemo(() => resolveConfig(isMobile), [isMobile]);

  // ── shared clock ──
  const clockRef = useRef<DiveClock>(createDiveClock(config.timing.totalMs));
  useEffect(() => {
    clockRef.current.durationMs = config.timing.totalMs;
  }, [config.timing.totalMs]);

  // ── derived layer flags (set only on threshold change) ──
  const [mapOccluded, setMapOccluded] = useState(false);
  const [depthsRevealed, setDepthsRevealed] = useState(false);
  const [paused, setPaused] = useState(false);

  const arrivalRef = useRef<Arrival>("none");
  const [arrival, setArrival] = useState<Arrival>("none");

  // Master loop runs only while diving. Advances the clock, derives flags, and
  // resolves to the depths when the dive completes (never auto-finishes in debug).
  useEffect(() => {
    if (state !== "diving") return;
    const clock = clockRef.current;
    clock.running = true;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      if (!clock.paused) {
        clock.elapsedMs = Math.min(clock.elapsedMs + dt, clock.durationMs);
        clock.progress = clock.elapsedMs / clock.durationMs;
      }
      setMapOccluded(clock.progress >= config.timing.occludeProgress);
      setDepthsRevealed(clock.progress >= config.timing.depthsRevealProgress);
      if (clock.progress >= 1 && !clock.paused && !debug) {
        finishDive();
        clock.running = false;
        return;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      clock.running = false;
    };
  }, [state, config.timing.occludeProgress, config.timing.depthsRevealProgress, debug, finishDive]);

  // Move focus into the depths hero after a real transition.
  useEffect(() => {
    if (state === "depths" && arrivalRef.current !== "none") {
      document.getElementById("sea-depths-hero")?.focus();
    }
  }, [state]);

  const resetClock = () => {
    const c = clockRef.current;
    c.progress = 0;
    c.elapsedMs = 0;
    c.paused = false;
    setPaused(false);
    setMapOccluded(false);
    setDepthsRevealed(false);
  };

  // ── user actions ──
  const handleDive = () => {
    if (reducedMotion) {
      arrivalRef.current = "reduced";
      setArrival("reduced");
      intro.skip(); // instant cut + crossfade, marks the session
      return;
    }
    arrivalRef.current = "dive";
    setArrival("dive");
    resetClock();
    intro.dive();
  };

  const handleSurfaceSkip = () => {
    arrivalRef.current = "reduced"; // quick crossfade
    setArrival("reduced");
    intro.skip();
  };

  const handleDivingSkip = () => {
    arrivalRef.current = "dive";
    intro.finishDive();
  };

  const handleReplay = () => {
    arrivalRef.current = "none";
    setArrival("none");
    resetClock();
    intro.replay();
  };

  // ── debug controls ──
  const debugSeek = (progress: number) => {
    const c = clockRef.current;
    c.progress = Math.min(Math.max(progress, 0), 1);
    c.elapsedMs = c.progress * c.durationMs;
    c.paused = true;
    setPaused(true);
    setMapOccluded(c.progress >= config.timing.occludeProgress);
    setDepthsRevealed(c.progress >= config.timing.depthsRevealProgress);
    arrivalRef.current = "dive";
    setArrival("dive");
    if (state !== "diving") intro.force("diving");
  };
  const debugRestart = () => {
    arrivalRef.current = "none";
    setArrival("none");
    resetClock();
    intro.force("surface");
  };
  const debugSurface = () => {
    arrivalRef.current = "none";
    setArrival("none");
    resetClock();
    intro.force("surface");
  };
  const debugDepths = () => {
    arrivalRef.current = "dive";
    setArrival("dive");
    intro.force("depths", { complete: true });
  };
  const debugTogglePause = () => {
    const c = clockRef.current;
    c.paused = !c.paused;
    setPaused(c.paused);
  };

  const debugPanel = debug ? (
    <IntroDebugPanel
      clockRef={clockRef}
      paused={paused}
      onRestart={debugRestart}
      onSurface={debugSurface}
      onDepths={debugDepths}
      onSeek={debugSeek}
      onTogglePause={debugTogglePause}
    />
  ) : null;

  // ── SSR placeholder + stable returning-visitor render (no remount, no anim) ──
  if (!resolved || (state === "depths" && arrival === "none")) {
    return (
      <>
        <HomeScene onReplay={introCapable ? handleReplay : undefined} />
        {debugPanel}
      </>
    );
  }

  const showSurfaceOrDive = state === "surface" || state === "diving";
  const showDepthsLayer = depthsRevealed || state === "depths";

  return (
    <div className="absolute inset-0">
      {/* Dawn globe: persists across surface -> diving; removed once occluded. */}
      {showSurfaceOrDive && !mapOccluded ? (
        <DawnGlobe
          clockRef={clockRef}
          phase={state === "diving" ? "diving" : "surface"}
          reducedMotion={reducedMotion}
          isMobile={isMobile}
          config={config}
        />
      ) : null}

      {/* Spatial transition: clouds always, water + underwater during the dive.
          Fades out as the depths take over so the scenes converge. */}
      {showSurfaceOrDive ? (
        <div
          className="absolute inset-0 z-20"
          style={{
            opacity: depthsRevealed ? 0 : 1,
            transition: `opacity 700ms ${EASE}`,
          }}
        >
          <DiveTransitionScene
            clockRef={clockRef}
            reducedMotion={reducedMotion}
            config={config}
          />
        </div>
      ) : null}

      {/* Surface title menu. */}
      {state === "surface" ? (
        <SurfaceMenu onDive={handleDive} onSkip={handleSurfaceSkip} disabled={false} />
      ) : null}

      {/* Diving: input lock + an always-available quiet Skip + SR announcement. */}
      {state === "diving" ? (
        <>
          <div aria-hidden="true" className="absolute inset-0 z-[35] cursor-default" />
          <button
            type="button"
            onClick={handleDivingSkip}
            className="absolute right-6 top-6 z-40 rounded-[2px] font-sans text-sm text-ink-2/90 underline-offset-4 transition-colors hover:text-ink hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sonar"
          >
            Skip intro
          </button>
          <div aria-live="polite" className="sr-only">
            Entering the archive.
          </div>
        </>
      ) : null}

      {/* Depths: enters beneath the fading transition, in staggered layers. */}
      {showDepthsLayer ? (
        <div
          className="absolute inset-0 z-10 flex flex-col"
          style={
            arrival === "reduced"
              ? {
                  opacity: 1,
                  animation: `seaIntroFade ${config.timing.reducedMotionCrossfadeMs}ms ${EASE}`,
                }
              : undefined
          }
        >
          <HomeScene
            onReplay={introCapable ? handleReplay : undefined}
            entrance={arrival === "dive" && !reducedMotion}
          />
        </div>
      ) : null}

      {debugPanel}
    </div>
  );
}
