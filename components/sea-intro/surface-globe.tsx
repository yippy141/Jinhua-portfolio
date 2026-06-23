"use client";

import { useEffect, useRef } from "react";

import "mapbox-gl/dist/mapbox-gl.css";

import {
  DIVE_CURVE,
  DIVE_DURATION_MS,
  DIVE_PITCH,
  DIVE_TARGET,
  DIVE_ZOOM,
  MAPBOX_STYLE,
  MAPBOX_TOKEN,
  RASTER_GRADE,
  ROTATE_DEG_PER_SEC,
  SURFACE_CENTER,
  SURFACE_FOG,
  SURFACE_MAX_ZOOM,
  SURFACE_MIN_ZOOM,
  SURFACE_ZOOM,
} from "./mapbox-config";

type MapboxModule = typeof import("mapbox-gl");
type MapboxMap = import("mapbox-gl").Map;

type SurfaceGlobeProps = {
  // "surface" rests on the globe; "diving" runs the locked camera flight.
  diving: boolean;
  // Still frame, no auto-rotate, no flight (the dive is handled as an instant
  // cut by the orchestrator under reduced motion).
  reducedMotion: boolean;
  // Fired once the camera has settled on the water (or the dive was a no-op).
  onArrived: () => void;
};

// Grade every raster layer in the style toward the deep-water palette so the
// satellite imagery never reads as a stock Earth render.
function applyDarkSatelliteGrade(map: MapboxMap) {
  const style = map.getStyle();
  if (!style?.layers) return;
  for (const layer of style.layers) {
    if (layer.type !== "raster") continue;
    map.setPaintProperty(layer.id, "raster-saturation", RASTER_GRADE.saturation);
    map.setPaintProperty(layer.id, "raster-contrast", RASTER_GRADE.contrast);
    map.setPaintProperty(
      layer.id,
      "raster-brightness-min",
      RASTER_GRADE.brightnessMin,
    );
    map.setPaintProperty(
      layer.id,
      "raster-brightness-max",
      RASTER_GRADE.brightnessMax,
    );
    map.setPaintProperty(layer.id, "raster-hue-rotate", RASTER_GRADE.hueRotate);
  }
}

export function SurfaceGlobe({
  diving,
  reducedMotion,
  onArrived,
}: SurfaceGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const readyRef = useRef(false);
  const rotateRaf = useRef<number | null>(null);
  // Keep the latest onArrived without re-running the init effect.
  const onArrivedRef = useRef(onArrived);
  useEffect(() => {
    onArrivedRef.current = onArrived;
  }, [onArrived]);

  // Initialise the map once.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let map: MapboxMap | null = null;
    let interacting = false;
    let lastTs = 0;

    const stopRotate = () => {
      if (rotateRaf.current != null) {
        cancelAnimationFrame(rotateRaf.current);
        rotateRaf.current = null;
      }
    };

    const spin = (ts: number) => {
      if (!map || cancelled) return;
      if (lastTs === 0) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;
      // Pause while the visitor interacts or the tab is hidden.
      if (!interacting && !document.hidden) {
        const c = map.getCenter();
        c.lng = ((c.lng + ROTATE_DEG_PER_SEC * dt + 180) % 360) - 180;
        map.setCenter(c);
      } else {
        lastTs = ts;
      }
      rotateRaf.current = requestAnimationFrame(spin);
    };

    import("mapbox-gl").then((mod: MapboxModule) => {
      if (cancelled || !containerRef.current) return;
      const mapboxgl = mod.default;
      mapboxgl.accessToken = MAPBOX_TOKEN;

      try {
        map = new mapboxgl.Map({
          container: containerRef.current,
          style: MAPBOX_STYLE,
          center: SURFACE_CENTER,
          zoom: SURFACE_ZOOM,
          minZoom: SURFACE_MIN_ZOOM,
          maxZoom: SURFACE_MAX_ZOOM,
          projection: "globe",
          attributionControl: false,
          // Gentle constrained interaction: drag/scroll only, no dbl-click or
          // box zoom, no keyboard pan, no HUD controls.
          interactive: true,
          doubleClickZoom: false,
          boxZoom: false,
          dragRotate: true,
          pitchWithRotate: false,
          touchPitch: false,
          keyboard: false,
          // The globe is decorative; meaning lives in the visible controls.
          cooperativeGestures: false,
        });
      } catch {
        // No WebGL / context creation failed: resolve as if arrived so the
        // orchestrator can fall through to the depths.
        onArrivedRef.current();
        return;
      }

      mapRef.current = map;

      map.on("style.load", () => {
        if (!map) return;
        map.setFog({
          color: SURFACE_FOG.color,
          "high-color": SURFACE_FOG.highColor,
          "space-color": SURFACE_FOG.spaceColor,
          "horizon-blend": SURFACE_FOG.horizonBlend,
          "star-intensity": SURFACE_FOG.starIntensity,
        });
        applyDarkSatelliteGrade(map);
        readyRef.current = true;
        // Begin the slow tidal rotation unless the visitor prefers stillness.
        if (!reducedMotion) {
          lastTs = 0;
          rotateRaf.current = requestAnimationFrame(spin);
        }
      });

      // Pause rotation around any direct interaction.
      const onDown = () => {
        interacting = true;
      };
      const onUp = () => {
        interacting = false;
        lastTs = 0;
      };
      map.on("mousedown", onDown);
      map.on("touchstart", onDown);
      map.on("dragstart", onDown);
      map.on("mouseup", onUp);
      map.on("touchend", onUp);
      map.on("dragend", onUp);
    });

    return () => {
      cancelled = true;
      stopRotate();
      readyRef.current = false;
      mapRef.current = null;
      if (map) map.remove();
    };
    // Init once; reducedMotion is read at init time and does not change live.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Run the dive flight when the orchestrator flips `diving`.
  useEffect(() => {
    if (!diving) return;
    const map = mapRef.current;

    // Stop the idle rotation the moment we commit to the dive.
    if (rotateRaf.current != null) {
      cancelAnimationFrame(rotateRaf.current);
      rotateRaf.current = null;
    }

    if (!map) {
      // Map never initialised: let the orchestrator move on.
      onArrivedRef.current();
      return;
    }

    let settled = false;
    const arrive = () => {
      if (settled) return;
      settled = true;
      onArrivedRef.current();
    };

    map.flyTo({
      center: DIVE_TARGET,
      zoom: DIVE_ZOOM,
      pitch: DIVE_PITCH,
      bearing: map.getBearing() + 8, // a small drift, not a spin
      duration: DIVE_DURATION_MS,
      curve: DIVE_CURVE,
      essential: true,
    });
    map.once("moveend", arrive);

    // The orchestrator also runs a hard timeout guard, but guard here too in
    // case moveend is dropped while this component owns the flight.
    const guard = window.setTimeout(arrive, DIVE_DURATION_MS + 600);
    return () => window.clearTimeout(guard);
  }, [diving]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
