"use client";

import { useEffect, useRef } from "react";

import "mapbox-gl/dist/mapbox-gl.css";

import { MAPBOX_TOKEN } from "./mapbox-config";
import { sampleCamera } from "./dive-clock";
import type { DiveClock } from "./dive-clock";
import type { IntroConfig } from "./sea-intro-config";

type MapboxModule = typeof import("mapbox-gl");
type MapboxMap = import("mapbox-gl").Map;

// Stratospheric Dawn surface. Mapbox Standard-satellite with a dawn light
// preset, a luminous cobalt-to-cyan atmosphere, and a readable Earth. During
// the dive the camera is driven frame-by-frame from the shared clock along the
// configured waypoints, so the descent is one continuous orbital-to-oblique
// flight rather than a single generic flyTo.

type DawnGlobeProps = {
  clockRef: React.RefObject<DiveClock>;
  // "surface" idles and slowly rotates; "diving" follows the clock waypoints.
  phase: "surface" | "diving";
  reducedMotion: boolean;
  isMobile: boolean;
  config: IntroConfig;
};

// Standard style config keys are optional across versions; fail soft.
function trySetConfig(map: MapboxMap, key: string, value: unknown) {
  try {
    (map as unknown as {
      setConfigProperty: (i: string, k: string, v: unknown) => void;
    }).setConfigProperty("basemap", key, value);
  } catch {
    // Property not supported by this style version: ignore.
  }
}

export function DawnGlobe({
  clockRef,
  phase,
  reducedMotion,
  isMobile,
  config,
}: DawnGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const phaseRef = useRef(phase);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let map: MapboxMap | null = null;
    let raf = 0;
    let lastTs = 0;
    let interacting = false;

    import("mapbox-gl").then((mod: MapboxModule) => {
      if (cancelled || !containerRef.current) return;
      const mapboxgl = mod.default;
      mapboxgl.accessToken = MAPBOX_TOKEN;

      try {
        map = new mapboxgl.Map({
          container: containerRef.current,
          // Standard-satellite gives photoreal imagery plus dynamic dawn light
          // and atmosphere. Falls back gracefully if the style id changes.
          style: "mapbox://styles/mapbox/standard-satellite",
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
          dragRotate: !isMobile,
          pitchWithRotate: false,
          touchPitch: false,
          keyboard: false,
        });
      } catch {
        return;
      }

      mapRef.current = map;

      map.on("style.load", () => {
        if (!map) return;
        trySetConfig(map, "lightPreset", config.surface.lightPreset);
        // Keep the Earth unlabelled: no place, POI, road, or transit text.
        trySetConfig(map, "showPlaceLabels", false);
        trySetConfig(map, "showPointOfInterestLabels", false);
        trySetConfig(map, "showRoadLabels", false);
        trySetConfig(map, "showTransitLabels", false);

        try {
          map.setFog({
            color: config.atmosphere.horizonColor, // warm sunrise near horizon
            "high-color": config.atmosphere.highColor, // cyan upper rim
            "space-color": config.atmosphere.spaceColor, // cobalt space
            "horizon-blend": config.atmosphere.horizonBlend,
            "star-intensity": config.atmosphere.starIntensity,
          });
        } catch {
          // Older fog API: ignore.
        }
      });

      const onDown = () => {
        interacting = true;
      };
      const onUp = () => {
        interacting = false;
      };
      map.on("mousedown", onDown);
      map.on("touchstart", onDown);
      map.on("mouseup", onUp);
      map.on("touchend", onUp);

      const frame = (ts: number) => {
        if (!map || cancelled) return;
        if (lastTs === 0) lastTs = ts;
        const dt = (ts - lastTs) / 1000;
        lastTs = ts;

        if (phaseRef.current === "diving") {
          const clock = clockRef.current;
          const cam = sampleCamera(config.cameraPath, clock ? clock.progress : 0);
          map.jumpTo({
            center: cam.center,
            zoom: cam.zoom,
            pitch: cam.pitch,
            bearing: cam.bearing,
          });
        } else if (!reducedMotion && !interacting && !document.hidden) {
          // Slow tidal idle rotation on the surface.
          const c = map.getCenter();
          c.lng =
            ((c.lng + config.surface.autoRotateDegPerSec * dt + 180) % 360) - 180;
          map.setCenter(c);
        }
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    });

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      mapRef.current = null;
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
