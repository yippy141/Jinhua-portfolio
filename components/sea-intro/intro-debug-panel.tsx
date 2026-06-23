"use client";

import { useEffect, useState } from "react";

import { phaseAtProgress, phaseStart } from "./dive-clock";
import type { DiveClock } from "./dive-clock";
import type { MapState } from "./dawn-globe";
import type { BeaconState } from "./life-anchors";
import { DIVE_TARGETS, type DiveTargetId } from "./sea-intro-config";
import type { IntroState } from "./use-sea-intro-state";

// Development-only tuning surface, enabled with ?introDebug=1. Intentionally
// plain: it is not production UI. Reads the live clock and Mapbox camera state,
// shows the continuity instrumentation (occlusion, removal time, inherited
// velocity), and lets us scrub, switch dive targets, and restart.

type IntroDebugPanelProps = {
  clockRef: React.RefObject<DiveClock>;
  mapStateRef: React.RefObject<MapState>;
  mapRemovedAtRef: React.RefObject<number | null>;
  beaconStateRef: React.RefObject<BeaconState>;
  paused: boolean;
  diveTarget: DiveTargetId;
  introState: IntroState;
  diveTransitionMounted: boolean;
  particleFieldMounted: boolean;
  ambientFaunaMounted: boolean;
  occludeProgress: number;
  crossProgress: number;
  depthsRevealProgress: number;
  onRestart: () => void;
  onSurface: () => void;
  onDepths: () => void;
  onSeek: (progress: number) => void;
  onTogglePause: () => void;
  onSetTarget: (id: DiveTargetId) => void;
};

const JUMPS: { label: string; progress: number }[] = [
  { label: "Atmosphere", progress: phaseStart("atmosphere") },
  { label: "Approach", progress: phaseStart("water-approach") },
  { label: "Crossing", progress: phaseStart("water-crossing") },
  { label: "Underwater", progress: phaseStart("submersion") },
];

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(Math.max((x - a) / (b - a || 1), 0), 1);
  return t * t * (3 - 2 * t);
}

export function IntroDebugPanel({
  clockRef,
  mapStateRef,
  mapRemovedAtRef,
  beaconStateRef,
  paused,
  diveTarget,
  introState,
  diveTransitionMounted,
  particleFieldMounted,
  ambientFaunaMounted,
  occludeProgress,
  crossProgress,
  depthsRevealProgress,
  onRestart,
  onSurface,
  onDepths,
  onSeek,
  onTogglePause,
  onSetTarget,
}: IntroDebugPanelProps) {
  const [progress, setProgress] = useState(0);
  const [map, setMap] = useState<MapState>({
    zoom: 0,
    pitch: 0,
    bearing: 0,
    lng: 0,
    lat: 0,
    ready: false,
    autoSpin: false,
    autoSpinPauseReason: "none",
    lastInteractionAt: -Infinity,
  });
  const [removedAt, setRemovedAt] = useState<number | null>(null);
  const [lastInteractionAgeMs, setLastInteractionAgeMs] = useState<number | null>(null);
  const [beacon, setBeacon] = useState<BeaconState>({
    activeId: null,
    pinnedId: null,
  });

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const c = clockRef.current;
      if (c) setProgress(c.progress);
      if (mapStateRef.current) setMap({ ...mapStateRef.current });
      if (beaconStateRef.current) setBeacon({ ...beaconStateRef.current });
      setRemovedAt(mapRemovedAtRef.current);
      const lastInteraction = mapStateRef.current?.lastInteractionAt ?? -Infinity;
      setLastInteractionAgeMs(
        lastInteraction === -Infinity
          ? null
          : Math.max(0, performance.now() - lastInteraction),
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [clockRef, mapStateRef, mapRemovedAtRef, beaconStateRef]);

  const phase = phaseAtProgress(progress);
  const occlusion = Math.round(smoothstep(0.46, occludeProgress, progress) * 100);
  const inherited =
    progress > crossProgress
      ? Math.round(Math.max(0, Math.min(1, 1 - (progress - 0.84) / 0.12)) * 100)
      : 0;
  const lastInteraction =
    lastInteractionAgeMs === null
      ? "never"
      : `${lastInteractionAgeMs.toFixed(0)}ms ago`;
  void depthsRevealProgress;

  const btn =
    "rounded border border-white/25 px-2 py-1 text-[11px] text-white/90 hover:bg-white/15";

  return (
    <div className="fixed bottom-3 left-3 z-[100] w-72 rounded-md border border-white/20 bg-black/70 p-3 font-data text-[11px] text-white/90 backdrop-blur">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-semibold">intro debug</span>
        <span className="text-white/60">{(progress * 100).toFixed(1)}%</span>
      </div>

      <div className="mb-2 leading-5 text-white/70">
        phase: <span className="text-white">{phase}</span>
        {" · "}state: <span className="text-white">{introState}</span>
        <br />
        target: <span className="text-white">{DIVE_TARGETS[diveTarget].label}</span>
        <br />
        zoom <span className="text-white">{map.zoom.toFixed(2)}</span> · pitch{" "}
        <span className="text-white">{map.pitch.toFixed(0)}</span> · bear{" "}
        <span className="text-white">{map.bearing.toFixed(0)}</span>
        <br />
        center{" "}
        <span className="text-white">
          {map.lng.toFixed(3)}, {map.lat.toFixed(3)}
        </span>
        <br />
        occlusion <span className="text-white">{occlusion}%</span> · removed{" "}
        <span className="text-white">
          {occlusion >= 100 ? (removedAt === null ? "true" : `true (${removedAt}ms)`) : "false"}
        </span>
        <br />
        inherited vel <span className="text-white">{inherited}%</span>
        <br />
        auto-spin{" "}
        <span className="text-white">{map.autoSpin ? "running" : "paused"}</span>
        {" · "}reason{" "}
        <span className="text-white">{map.autoSpinPauseReason}</span>
        <br />
        last interaction <span className="text-white">{lastInteraction}</span>
        <br />
        mounted dive <span className="text-white">{diveTransitionMounted ? "yes" : "no"}</span>{" "}
        · particles <span className="text-white">{particleFieldMounted ? "yes" : "no"}</span>
        <br />
        fauna <span className="text-white">{ambientFaunaMounted ? "yes" : "no"}</span>
        <br />
        beacon active <span className="text-white">{beacon.activeId ?? "—"}</span> ·
        pinned <span className="text-white">{beacon.pinnedId ?? "—"}</span>
      </div>

      <input
        type="range"
        min={0}
        max={1}
        step={0.001}
        value={progress}
        onChange={(e) => onSeek(parseFloat(e.target.value))}
        className="mb-2 w-full"
        aria-label="Scrub transition progress"
      />

      <div className="mb-2 flex flex-wrap gap-1">
        <button type="button" className={btn} onClick={onRestart}>
          Restart
        </button>
        <button type="button" className={btn} onClick={onSurface}>
          Surface
        </button>
        <button type="button" className={btn} onClick={onTogglePause}>
          {paused ? "Resume" : "Pause"}
        </button>
        <button type="button" className={btn} onClick={onDepths}>
          Depths
        </button>
      </div>

      <div className="mb-2 flex flex-wrap gap-1">
        {(["potomac", "chesapeake"] as DiveTargetId[]).map((id) => (
          <button
            key={id}
            type="button"
            className={`${btn} ${diveTarget === id ? "bg-white/20" : ""}`}
            onClick={() => onSetTarget(id)}
          >
            {DIVE_TARGETS[id].label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1">
        {JUMPS.map((j) => (
          <button
            key={j.label}
            type="button"
            className={btn}
            onClick={() => onSeek(j.progress)}
          >
            {j.label}
          </button>
        ))}
      </div>
    </div>
  );
}
