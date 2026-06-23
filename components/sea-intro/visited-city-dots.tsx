"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

import { visitedPlaces } from "@/data/places";
import type { VisitedPlace } from "@/data/places";
import type { AutoSpinPauseReason } from "./dawn-globe";

type MapboxMap = import("mapbox-gl").Map;

type VisitedCityDotsProps = {
  mapRef: RefObject<MapboxMap | null>;
  lastInteractionRef: RefObject<number>;
  autoSpinPauseReasonRef: RefObject<AutoSpinPauseReason>;
  onPinnedChange: (pinned: boolean) => void;
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

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function markerOpacity(distance: number, cullDegrees: number, forced: boolean) {
  if (forced) return 1;
  const fade = clamp01((cullDegrees - distance) / 24);
  return 0.2 + fade * 0.58;
}

function dotSize(place: VisitedPlace) {
  return place.priority <= 3 ? 9 : 8;
}

function displayName(place: VisitedPlace): string {
  return place.label ?? place.city;
}

export function VisitedCityDots({
  mapRef,
  lastInteractionRef,
  autoSpinPauseReasonRef,
  onPinnedChange,
  isMobile,
}: VisitedCityDotsProps) {
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const captionRef = useRef<HTMLDivElement>(null);
  const posRef = useRef<{ x: number; y: number; vis: boolean }[]>(
    visitedPlaces.map(() => ({ x: -9999, y: -9999, vis: false })),
  );

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const activeId = pinnedId ?? hoveredId ?? focusedId;
  const activeIndex = visitedPlaces.findIndex((place) => place.id === activeId);
  const active = activeIndex >= 0 ? visitedPlaces[activeIndex] : null;

  const interact = useCallback((reason: AutoSpinPauseReason = "beacon") => {
    lastInteractionRef.current = performance.now();
    autoSpinPauseReasonRef.current = reason;
  }, [autoSpinPauseReasonRef, lastInteractionRef]);

  useEffect(() => {
    const pinned = pinnedId !== null;
    onPinnedChange(pinned);
    if (pinned) autoSpinPauseReasonRef.current = "pinned";
    return () => onPinnedChange(false);
  }, [autoSpinPauseReasonRef, onPinnedChange, pinnedId]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        interact("beacon");
        setPinnedId(null);
        setHoveredId(null);
        setFocusedId(null);
        const active = document.activeElement;
        if (
          active instanceof HTMLElement &&
          active.dataset.placeKind === "visited"
        ) {
          active.blur();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [interact]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const map = mapRef.current;
      if (map) {
        const center = map.getCenter();
        const zoom = map.getZoom();
        const cullDegrees = zoom < 2.5 ? 46 : 52;

        for (let i = 0; i < visitedPlaces.length; i++) {
          const place = visitedPlaces[i];
          const pt = map.project(place.coordinates);
          const distance = angularDist([center.lng, center.lat], place.coordinates);
          const visible = distance <= cullDegrees;
          const forced = place.id === activeId || place.id === focusedId;
          const el = btnRefs.current[i];
          posRef.current[i] = { x: pt.x, y: pt.y, vis: visible };

          if (el) {
            el.style.transform = `translate(${pt.x}px, ${pt.y}px) translate(-50%, -50%)`;
            el.style.opacity = visible || forced
              ? `${markerOpacity(distance, cullDegrees, forced)}`
              : "0";
            el.style.pointerEvents = visible ? "auto" : "none";
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
  }, [activeId, activeIndex, focusedId, isMobile, mapRef]);

  const captionId = "visited-city-caption";

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {visitedPlaces.map((place, index) => {
        const size = dotSize(place);
        const isActive = place.id === activeId;
        const coreSize = isActive ? Math.min(size + 2, 11) : size;

        return (
          <button
            key={place.id}
            ref={(el) => {
              btnRefs.current[index] = el;
            }}
            type="button"
            aria-label={displayName(place)}
            aria-describedby={isActive ? captionId : undefined}
            data-place-kind="visited"
            tabIndex={-1}
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
              setPinnedId((current) => (current === place.id ? null : place.id));
            }}
            className="pointer-events-auto absolute left-0 top-0 grid h-8 w-8 place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-sonar"
            style={{ opacity: 0, pointerEvents: "none" }}
          >
            <span
              aria-hidden="true"
              className={`rounded-full bg-confidence-medium ring-1 ring-paper shadow-[0_1px_6px_rgba(7,16,15,0.78)] transition-[box-shadow,transform,width,height] duration-200 ${
                isActive
                  ? "scale-105 shadow-[0_0_0_2px_rgba(7,16,15,0.66),0_0_10px_rgba(154,107,39,0.42)]"
                  : "scale-100"
              }`}
              style={{ width: coreSize, height: coreSize }}
            />
          </button>
        );
      })}

      {!isMobile && active ? (
        <div
          ref={captionRef}
          id={captionId}
          role="status"
          className="pointer-events-none absolute left-0 top-0 z-10 -translate-y-1/2 will-change-transform"
        >
          <div className="ml-3 border border-rule bg-paper-2/95 px-2.5 py-1.5 shadow-[0_8px_8px_rgba(4,9,8,0.28)]">
            <p className="font-sans text-[13px] leading-none text-ink">
              {displayName(active)}
            </p>
          </div>
        </div>
      ) : null}

      {isMobile && active ? (
        <div
          id={captionId}
          role="status"
          className="pointer-events-auto absolute inset-x-0 bottom-0 z-10 border-t border-rule bg-paper-2/95 px-6 pb-7 pt-4 shadow-[0_-12px_10px_rgba(4,9,8,0.35)]"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="font-serif text-lg leading-tight text-ink">
              {displayName(active)}
            </p>
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

      <div className="pointer-events-none absolute bottom-4 right-4 max-w-[13rem] border border-rule bg-paper-2/90 px-2.5 py-2 font-sans text-[11px] leading-4 text-ink-2 shadow-[0_8px_8px_rgba(4,9,8,0.24)] sm:bottom-5 sm:right-5 sm:px-3 sm:text-[12px] sm:leading-5">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="h-3 w-3 rounded-full bg-tide ring-1 ring-paper shadow-[0_1px_5px_rgba(7,16,15,0.75)]" />
          <span>Lived / studied / worked</span>
        </div>
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-confidence-medium ring-1 ring-paper shadow-[0_1px_4px_rgba(7,16,15,0.7)]" />
          <span>Visited</span>
        </div>
      </div>
    </div>
  );
}
