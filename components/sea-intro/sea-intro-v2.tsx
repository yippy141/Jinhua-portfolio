"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { DawnGlobe } from "./dawn-globe";
import type { MapState } from "./dawn-globe";
import { DiveTransitionScene } from "./dive-transition-scene";
import { HomeScene } from "./home-scene";
import { IntroDebugPanel } from "./intro-debug-panel";
import { LifeAnchors } from "./life-anchors";
import type { BeaconState } from "./life-anchors";
import { SurfaceMenu } from "./surface-menu";
import { createDiveClock } from "./dive-clock";
import type { DiveClock } from "./dive-clock";
import type { ApertureCenter } from "./dive-aperture";
import {
  DEFAULT_DIVE_TARGET,
  resolveConfig,
  type DiveTargetId,
} from "./sea-intro-config";
import { useSeaIntroState } from "./use-sea-intro-state";

type MapboxMap = import("mapbox-gl").Map;

function isDiveTargetId(v: string | null): v is DiveTargetId {
  return v === "potomac" || v === "chesapeake";
}

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
  const [diveTarget, setDiveTargetState] = useState<DiveTargetId>(DEFAULT_DIVE_TARGET);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    const paramId = window.setTimeout(() => {
      try {
        const params = new URLSearchParams(window.location.search);
        setDebug(params.get("introDebug") === "1");
        const t = params.get("diveTarget");
        if (isDiveTargetId(t)) setDiveTargetState(t);
      } catch {
        // ignore
      }
    }, 0);
    return () => {
      window.clearTimeout(paramId);
      mq.removeEventListener("change", update);
    };
  }, []);

  const config = useMemo(
    () => resolveConfig(isMobile, diveTarget),
    [isMobile, diveTarget],
  );

  // Live map handle + camera state (debug + beacons), and rotation pause flag.
  const mapRef = useRef<MapboxMap | null>(null);
  const mapStateRef = useRef<MapState>({
    zoom: 0,
    pitch: 0,
    bearing: 0,
    lng: 0,
    lat: 0,
    ready: false,
    autoSpin: false,
  });
  const rotationPausedRef = useRef(false);
  const lastInteractionRef = useRef(-Infinity);
  const beaconStateRef = useRef<BeaconState>({ activeId: null, pinnedId: null });
  const diveStartRef = useRef(0);
  const mapRemovedAtRef = useRef<number | null>(null);

  // ── shared clock ──
  const clockRef = useRef<DiveClock>(createDiveClock(config.timing.totalMs));
  useEffect(() => {
    clockRef.current.durationMs = config.timing.totalMs;
  }, [config.timing.totalMs]);

  // Optical centre of the dive, set from the aperture on activation.
  const centerRef = useRef<ApertureCenter>({
    x: config.scene.apertureCenter[0],
    y: config.scene.apertureCenter[1],
  });

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
      const occluded = clock.progress >= config.timing.occludeProgress;
      setMapOccluded(occluded);
      // The map is removed (DawnGlobe unmounts) the instant it is fully occluded.
      if (occluded && mapRemovedAtRef.current === null && diveStartRef.current > 0) {
        mapRemovedAtRef.current = Math.round(performance.now() - diveStartRef.current);
      }
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
    mapRemovedAtRef.current = null;
  };

  const setDiveTarget = (id: DiveTargetId) => {
    try {
      const u = new URL(window.location.href);
      u.searchParams.set("diveTarget", id);
      window.history.replaceState({}, "", u);
    } catch {
      // ignore
    }
    setDiveTargetState(id);
    arrivalRef.current = "none";
    setArrival("none");
    resetClock();
    intro.force("surface");
  };

  // ── user actions ──
  const handleDive = (center?: ApertureCenter) => {
    if (center) centerRef.current = center;
    if (reducedMotion) {
      arrivalRef.current = "reduced";
      setArrival("reduced");
      intro.skip(); // instant cut + crossfade, marks the session
      return;
    }
    arrivalRef.current = "dive";
    setArrival("dive");
    resetClock();
    diveStartRef.current = performance.now();
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
      mapStateRef={mapStateRef}
      mapRemovedAtRef={mapRemovedAtRef}
      beaconStateRef={beaconStateRef}
      paused={paused}
      diveTarget={diveTarget}
      occludeProgress={config.timing.occludeProgress}
      crossProgress={config.scene.crossProgress}
      depthsRevealProgress={config.timing.depthsRevealProgress}
      onRestart={debugRestart}
      onSurface={debugSurface}
      onDepths={debugDepths}
      onSeek={debugSeek}
      onTogglePause={debugTogglePause}
      onSetTarget={setDiveTarget}
    />
  ) : null;

  // ── SSR placeholder + stable returning-visitor render (no remount, no anim) ──
  if (!resolved || (state === "depths" && arrival === "none")) {
    return (
      <>
        <HomeScene
          onReplay={introCapable ? handleReplay : undefined}
          showAmbientFauna={resolved && state === "depths"}
        />
        {debugPanel}
      </>
    );
  }

  const showSurfaceOrDive = state === "surface" || state === "diving";
  const showDepthsLayer = depthsRevealed || state === "depths";

  return (
    <div className="absolute inset-0">
      {/* Dawn globe: persists across surface -> diving; removed once occluded.
          Keyed by the dive target so a debug target switch rebuilds the path. */}
      {showSurfaceOrDive && !mapOccluded ? (
        <DawnGlobe
          key={diveTarget}
          clockRef={clockRef}
          phase={state === "diving" ? "diving" : "surface"}
          reducedMotion={reducedMotion}
          isMobile={isMobile}
          config={config}
          onMap={(m) => {
            mapRef.current = m;
          }}
          mapStateRef={mapStateRef}
          rotationPausedRef={rotationPausedRef}
          lastInteractionRef={lastInteractionRef}
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
            centerRef={centerRef}
            reducedMotion={reducedMotion}
            config={config}
          />
        </div>
      ) : null}

      {/* Surface title menu. */}
      {state === "surface" ? (
        <SurfaceMenu onDive={handleDive} onSkip={handleSurfaceSkip} disabled={false} />
      ) : null}

      {/* Life-anchor beacons: above the menu so the markers stay clickable
          (the overlay is transparent, so the menu underneath still works), and
          hidden the moment the dive begins. */}
      {state === "surface" ? (
        <LifeAnchors
          mapRef={mapRef}
          rotationPausedRef={rotationPausedRef}
          lastInteractionRef={lastInteractionRef}
          beaconStateRef={beaconStateRef}
          isMobile={isMobile}
        />
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
            showAmbientFauna={state === "depths"}
          />
        </div>
      ) : null}

      {debugPanel}
    </div>
  );
}
