"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { lifeAnchors } from "@/data/places";
import type { AutoSpinPauseReason } from "./dawn-globe";

type MapboxMap = import("mapbox-gl").Map;

// Life-anchor beacons over the orbital globe. Each meaningful place is an
// accessible DOM <button> that tracks its city centroid as the globe rotates.
// Hover or keyboard focus reveals a short summary; clicking pins it (and pauses
// the spin); Escape dismisses it. There are no permanently visible labels, no
// coordinates, no HUD. Markers on the far side of the globe are culled.
//
// Mobile shows the summary in a stable bottom sheet instead of a floating note.

export type BeaconState = { activeId: string | null; pinnedId: string | null };

type LifeAnchorsProps = {
  mapRef: React.RefObject<MapboxMap | null>;
  // Hard pause (a pinned caption keeps the globe still until dismissed).
  rotationPausedRef: React.RefObject<boolean>;
  // Soft pause: any beacon interaction stamps this so auto-spin waits ~3s.
  lastInteractionRef: React.RefObject<number>;
  autoSpinPauseReasonRef: React.RefObject<AutoSpinPauseReason>;
  onPinnedChange?: (pinned: boolean) => void;
  // Reported to the debug panel.
  beaconStateRef: React.RefObject<BeaconState>;
  isMobile: boolean;
};

function angularDist(a: [number, number], b: [number, number]): number {
  const toRad = Math.PI / 180;
  const dLat = (b[1] - a[1]) * toRad;
  const dLng = (b[0] - a[0]) * toRad;
  const la1 = a[1] * toRad;
  const la2 = b[1] * toRad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return (2 * Math.asin(Math.min(1, Math.sqrt(h)))) / toRad;
}

const CULL_DEGREES = 76; // beyond this from the map centre, treat as back-facing

function displayName(p: { city: string; region?: string }): string {
  return p.region ? `${p.city}, ${p.region}` : p.city;
}

// Quietly larger dot for a higher-priority anchor (1 = current base).
function dotSize(priority: number): number {
  if (priority <= 1) return 12;
  if (priority === 2) return 10;
  return 8;
}

export function LifeAnchors({
  mapRef,
  rotationPausedRef,
  lastInteractionRef,
  autoSpinPauseReasonRef,
  onPinnedChange,
  beaconStateRef,
  isMobile,
}: LifeAnchorsProps) {
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const captionRef = useRef<HTMLDivElement>(null);
  const posRef = useRef<{ x: number; y: number; vis: boolean }[]>(
    lifeAnchors.map(() => ({ x: -9999, y: -9999, vis: false })),
  );

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const activeId = pinnedId ?? hoveredId ?? focusedId;
  const activeIndex = lifeAnchors.findIndex((p) => p.id === activeId);
  const active = activeIndex >= 0 ? lifeAnchors[activeIndex] : null;

  const interact = useCallback((reason: AutoSpinPauseReason = "beacon") => {
    if (lastInteractionRef) lastInteractionRef.current = performance.now();
    autoSpinPauseReasonRef.current = reason;
  }, [autoSpinPauseReasonRef, lastInteractionRef]);

  // Pinning hard-pauses the idle globe rotation; report state to the debug panel.
  useEffect(() => {
    const pinned = pinnedId !== null;
    if (onPinnedChange) onPinnedChange(pinned);
    else rotationPausedRef.current = pinned;
    if (pinnedId) autoSpinPauseReasonRef.current = "pinned";
    return () => {
      if (onPinnedChange) onPinnedChange(false);
      else rotationPausedRef.current = false;
    };
  }, [pinnedId, rotationPausedRef, autoSpinPauseReasonRef, onPinnedChange]);
  useEffect(() => {
    if (beaconStateRef) beaconStateRef.current = { activeId, pinnedId };
  }, [activeId, pinnedId, beaconStateRef]);

  // Escape dismisses a pinned caption.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        interact("beacon");
        setPinnedId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [interact]);

  // Project each place to screen each frame; markers track the rotating globe.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const map = mapRef.current;
      if (map) {
        const center = map.getCenter();
        for (let i = 0; i < lifeAnchors.length; i++) {
          const p = lifeAnchors[i];
          const pt = map.project(p.coordinates);
          const back =
            angularDist([center.lng, center.lat], p.coordinates) > CULL_DEGREES;
          const vis = !back;
          posRef.current[i] = { x: pt.x, y: pt.y, vis };
          const el = btnRefs.current[i];
          if (el) {
            el.style.transform = `translate(${pt.x}px, ${pt.y}px) translate(-50%, -50%)`;
            // Keep focused/active markers visible even if geometrically behind,
            // so keyboard users can still see and reach all of them.
            const forced = p.id === activeId || p.id === focusedId;
            el.style.opacity = vis || forced ? "1" : "0";
            el.style.pointerEvents = vis ? "auto" : "none";
          }
        }
      }
      if (!isMobile && captionRef.current && activeIndex >= 0) {
        const pos = posRef.current[activeIndex];
        captionRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mapRef, activeId, activeIndex, focusedId, isMobile]);

  const captionId = "life-anchor-caption";

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      {lifeAnchors.map((place, i) => {
        const isActive = place.id === activeId;
        const size = dotSize(place.priority);
        return (
          <button
            key={place.id}
            ref={(el) => {
              btnRefs.current[i] = el;
            }}
            type="button"
            aria-label={displayName(place)}
            aria-describedby={isActive ? captionId : undefined}
            data-place-kind="life-anchor"
            data-recent={place.recent ? "true" : "false"}
            onMouseEnter={() => {
              interact();
              setHoveredId(place.id);
            }}
            onMouseLeave={() => setHoveredId(null)}
            onFocus={() => {
              interact();
              setFocusedId(place.id);
            }}
            onBlur={() => setFocusedId(null)}
            onClick={() => {
              interact();
              setPinnedId((cur) => (cur === place.id ? null : place.id));
            }}
            className="pointer-events-auto absolute left-0 top-0 grid h-8 w-8 place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sonar"
            style={{ transition: "opacity 200ms ease" }}
          >
            {/* staggered quiet pulse ring */}
            <span
              aria-hidden="true"
              className="absolute rounded-full border border-sonar/60 motion-safe:animate-[beaconPulse_3.6s_ease-in-out_infinite]"
              style={{ width: size + 8, height: size + 8, animationDelay: `${i * 0.42}s` }}
            />
            {place.recent ? (
              <span
                aria-hidden="true"
                className="absolute rounded-full border border-oxblood-soft/80"
                style={{ width: size + 14, height: size + 14 }}
              />
            ) : null}
            {/* core dot, sized by priority */}
            <span
              aria-hidden="true"
              className={`rounded-full shadow-[0_1px_6px_rgba(7,16,15,0.8)] transition-colors duration-200 ${
                isActive ? "bg-sonar" : "bg-tide"
              }`}
              style={{ width: size, height: size }}
            />
          </button>
        );
      })}

      {/* Desktop: a floating note tracking the active marker. Editorial panel,
          not a glass card. */}
      {!isMobile && active ? (
        <div
          ref={captionRef}
          id={captionId}
          role="status"
          className="pointer-events-none absolute left-0 top-0 z-10 w-60 -translate-y-1/2 will-change-transform"
        >
          <div className="ml-5 border border-rule bg-paper-2/95 px-3 py-2 shadow-[0_16px_40px_rgba(4,9,8,0.5)]">
            <p className="font-serif text-[15px] leading-tight text-ink">
              {displayName(active)}
            </p>
            <p className="mt-1 font-sans text-[13px] leading-snug text-ink-2">
              {active.summary}
            </p>
          </div>
        </div>
      ) : null}

      {/* Mobile: a stable bottom sheet. */}
      {isMobile && active ? (
        <div
          id={captionId}
          role="status"
          className="pointer-events-auto absolute inset-x-0 bottom-0 z-10 border-t border-rule bg-paper-2/95 px-6 pb-7 pt-4 shadow-[0_-16px_40px_rgba(4,9,8,0.5)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-serif text-lg leading-tight text-ink">
                {displayName(active)}
              </p>
              <p className="mt-1 font-sans text-sm leading-snug text-ink-2">
                {active.summary}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                interact("beacon");
                setPinnedId(null);
                setHoveredId(null);
                setFocusedId(null);
              }}
              aria-label="Dismiss"
              className="rounded-[2px] font-sans text-sm text-ink-2 underline-offset-4 hover:text-ink hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sonar"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
