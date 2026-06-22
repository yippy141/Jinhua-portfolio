"use client";

import { useEffect, useRef } from "react";

import "mapbox-gl/dist/mapbox-gl.css";

import { MAPBOX_TOKEN } from "./mapbox-config";
import { sampleCamera } from "./dive-clock";
import type { DiveClock } from "./dive-clock";
import type { IntroConfig } from "./sea-intro-config";

type MapboxModule = typeof import("mapbox-gl");
type MapboxMap = import("mapbox-gl").Map;

// Live Mapbox camera state, shared by ref for the debug panel and beacons.
export interface MapState {
  zoom: number;
  pitch: number;
  bearing: number;
  lng: number;
  lat: number;
  ready: boolean;
  autoSpin: boolean; // true while the idle auto-spin is actually turning
}

// Idle delay before auto-spin resumes after any interaction.
const RESUME_AFTER_MS = 3000;

// Stratospheric Dawn surface. Pure Mapbox satellite imagery (satellite-v9: no
// roads, boundaries, labels, POIs or transit) under a luminous cobalt-to-cyan
// atmosphere. During the dive the camera is driven frame-by-frame from the
// shared clock along the configured waypoints, and once the geographic zoom is
// near its useful limit a container scale continues the apparent forward motion,
// so the descent never visibly freezes before the water takes over.

type DawnGlobeProps = {
  clockRef: React.RefObject<DiveClock>;
  phase: "surface" | "diving";
  reducedMotion: boolean;
  isMobile: boolean;
  config: IntroConfig;
  // Hands the live map instance to the orchestrator (for beacons). null on teardown.
  onMap?: (map: MapboxMap | null) => void;
  // Updated every frame with the current camera state (debug readout).
  mapStateRef?: React.RefObject<MapState>;
  // When true, idle globe rotation is hard-paused (a beacon caption is pinned).
  rotationPausedRef?: React.RefObject<boolean>;
  // Timestamp (performance.now) of the last user interaction, shared with the
  // beacons. Auto-spin resumes ~3s after the most recent interaction.
  lastInteractionRef?: React.RefObject<number>;
};

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(Math.max((x - a) / (b - a || 1), 0), 1);
  return t * t * (3 - 2 * t);
}

export function DawnGlobe({
  clockRef,
  phase,
  reducedMotion,
  isMobile,
  config,
  onMap,
  mapStateRef,
  rotationPausedRef,
  lastInteractionRef,
}: DawnGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const phaseRef = useRef(phase);
  const onMapRef = useRef(onMap);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    onMapRef.current = onMap;
  }, [onMap]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let map: MapboxMap | null = null;
    let raf = 0;
    let lastTs = 0;
    const ax = config.scene.apertureCenter[0] * 100;
    const ay = config.scene.apertureCenter[1] * 100;
    // Stable shared-state object (its identity never changes), captured so the
    // cleanup does not read a ref during teardown.
    const mapStateObj = mapStateRef?.current ?? null;
    // Shared interaction clock: any drag/rotate/pitch/wheel, or a beacon
    // interaction, stamps this; auto-spin resumes RESUME_AFTER_MS later.
    const interactionRef = lastInteractionRef ?? { current: -Infinity };
    const markInteraction = () => {
      interactionRef.current = performance.now();
    };

    import("mapbox-gl").then((mod: MapboxModule) => {
      if (cancelled || !containerRef.current) return;
      const mapboxgl = mod.default;
      mapboxgl.accessToken = MAPBOX_TOKEN;

      try {
        map = new mapboxgl.Map({
          container: containerRef.current,
          style: "mapbox://styles/mapbox/satellite-v9",
          center: config.surface.center,
          zoom: config.surface.zoom,
          pitch: config.surface.pitch,
          bearing: config.surface.bearing,
          minZoom: config.surface.minZoom,
          maxZoom: config.surface.maxZoom,
          projection: "globe",
          attributionControl: false,
          interactive: !isMobile,
          doubleClickZoom: false,
          boxZoom: false,
          // Idle interaction is drag-rotate only; the visitor cannot zoom the
          // surface (the dive drives zoom via jumpTo, which needs the high maxZoom).
          scrollZoom: false,
          dragRotate: !isMobile,
          pitchWithRotate: false,
          touchPitch: false,
          keyboard: false,
        });
        map.addControl(new mapboxgl.AttributionControl({ compact: true }));
      } catch {
        return;
      }

      mapRef.current = map;

      map.on("style.load", () => {
        if (!map) return;
        try {
          map.setFog({
            color: config.atmosphere.horizonColor,
            "high-color": config.atmosphere.highColor,
            "space-color": config.atmosphere.spaceColor,
            "horizon-blend": config.atmosphere.horizonBlend,
            "star-intensity": config.atmosphere.starIntensity,
          });
        } catch {
          // Older fog API: ignore.
        }
      });

      map.on("load", () => {
        if (mapStateObj) mapStateObj.ready = true;
        onMapRef.current?.(map);
      });

      // Quiet Earth-style drag: grab / grabbing cursor, and every user gesture
      // (drag, rotate, pitch, wheel, pointer-down) stamps the interaction clock
      // so auto-spin only resumes after a few seconds of stillness. Our own
      // auto-spin setCenter fires "move" (not "drag"/"rotate"/"pitch"), so it
      // never counts as interaction.
      const canvas = map.getCanvas();
      canvas.style.cursor = "grab";
      const onGestureStart = () => {
        markInteraction();
        canvas.style.cursor = "grabbing";
      };
      const onGestureEnd = () => {
        markInteraction();
        canvas.style.cursor = "grab";
      };
      map.on("dragstart", onGestureStart);
      map.on("rotatestart", onGestureStart);
      map.on("pitchstart", onGestureStart);
      map.on("dragend", onGestureEnd);
      map.on("rotateend", onGestureEnd);
      map.on("pitchend", onGestureEnd);
      map.on("drag", markInteraction);
      map.on("rotate", markInteraction);
      map.on("pitch", markInteraction);
      map.on("mousedown", markInteraction);
      map.on("touchstart", markInteraction);
      map.on("wheel", markInteraction);

      const frame = (ts: number) => {
        if (!map || cancelled) return;
        if (lastTs === 0) lastTs = ts;
        const dt = (ts - lastTs) / 1000;
        lastTs = ts;
        const clock = clockRef.current;
        const progress = clock ? clock.progress : 0;

        if (phaseRef.current === "diving") {
          const cam = sampleCamera(config.cameraPath, progress);
          map.jumpTo({
            center: cam.center,
            zoom: cam.zoom,
            pitch: cam.pitch,
            bearing: cam.bearing,
          });
          // Continue apparent forward motion past the geographic zoom limit by
          // scaling the container toward the dive centre. Ramps in late so the
          // descent keeps its velocity right through the surface crossing.
          if (containerRef.current) {
            const scale = 1 + 0.2 * smoothstep(0.6, 0.86, progress);
            containerRef.current.style.transformOrigin = `${ax}% ${ay}%`;
            containerRef.current.style.transform = `scale(${scale})`;
          }
          if (mapStateObj) mapStateObj.autoSpin = false;
        } else {
          if (containerRef.current && containerRef.current.style.transform) {
            containerRef.current.style.transform = "";
          }
          const pinned = rotationPausedRef?.current ?? false;
          const idle = performance.now() - interactionRef.current > RESUME_AFTER_MS;
          const spinning = !reducedMotion && !pinned && idle && !document.hidden;
          if (spinning) {
            const c = map.getCenter();
            c.lng =
              ((c.lng + config.surface.autoRotateDegPerSec * dt + 180) % 360) - 180;
            map.setCenter(c);
          }
          if (mapStateObj) mapStateObj.autoSpin = spinning;
        }

        if (mapStateObj) {
          const c = map.getCenter();
          mapStateObj.zoom = map.getZoom();
          mapStateObj.pitch = map.getPitch();
          mapStateObj.bearing = map.getBearing();
          mapStateObj.lng = c.lng;
          mapStateObj.lat = c.lat;
          }
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    });

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      mapRef.current = null;
      onMapRef.current?.(null);
      if (mapStateObj) mapStateObj.ready = false;
      if (map) map.remove();
    };
    // Initialise once; live values are read through refs / config is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
