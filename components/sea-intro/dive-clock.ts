// The dive is driven by one shared clock so every layer (Mapbox camera, the
// Three.js transition scene, the depths reveal) reads a single source of truth.
// This keeps the sequence one continuous journey rather than stacked effects.

import type {
  CameraKeyframe,
  EasingName,
  Vec2,
} from "./sea-intro-config";

export type DivePhase =
  | "surface"
  | "hold"
  | "orbit-descent"
  | "atmosphere"
  | "water-approach"
  | "water-crossing"
  | "submersion"
  | "depths";

// Phase boundaries in progress space. Debug "jump to phase" seeks to .start.
export const PHASE_TABLE: { name: DivePhase; start: number }[] = [
  { name: "hold", start: 0.0 },
  { name: "orbit-descent", start: 0.08 },
  { name: "atmosphere", start: 0.42 },
  { name: "water-approach", start: 0.62 },
  { name: "water-crossing", start: 0.74 },
  { name: "submersion", start: 0.86 },
  { name: "depths", start: 1.0 },
];

export function phaseAtProgress(progress: number): DivePhase {
  let current: DivePhase = "hold";
  for (const row of PHASE_TABLE) {
    if (progress >= row.start) current = row.name;
  }
  return current;
}

export function phaseStart(name: DivePhase): number {
  const row = PHASE_TABLE.find((r) => r.name === name);
  return row ? row.start : 0;
}

// A mutable clock shared by ref. The orchestrator advances it; children read it.
export interface DiveClock {
  progress: number; // 0..1
  elapsedMs: number;
  durationMs: number;
  paused: boolean;
  running: boolean;
}

export function createDiveClock(durationMs: number): DiveClock {
  return { progress: 0, elapsedMs: 0, durationMs, paused: false, running: false };
}

// ── easing ──
export function ease(name: EasingName, t: number): number {
  const x = Math.min(Math.max(t, 0), 1);
  switch (name) {
    case "easeIn":
      return x * x;
    case "easeOut":
      return 1 - (1 - x) * (1 - x);
    case "easeInOut":
      return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    case "easeInOutCubic":
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    case "linear":
    default:
      return x;
  }
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpVec2(a: Vec2, b: Vec2, t: number): Vec2 {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
}

export interface CameraSample {
  center: Vec2;
  zoom: number;
  pitch: number;
  bearing: number;
}

// Interpolate the Mapbox camera along the keyframe path at a given progress.
export function sampleCamera(
  path: CameraKeyframe[],
  progress: number,
): CameraSample {
  if (path.length === 0) {
    return { center: [0, 0], zoom: 2, pitch: 0, bearing: 0 };
  }
  const p = Math.min(Math.max(progress, 0), 1);
  if (p <= path[0].atProgress) {
    const k = path[0];
    return { center: k.center, zoom: k.zoom, pitch: k.pitch, bearing: k.bearing };
  }
  const last = path[path.length - 1];
  if (p >= last.atProgress) {
    return {
      center: last.center,
      zoom: last.zoom,
      pitch: last.pitch,
      bearing: last.bearing,
    };
  }
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1];
    const b = path[i];
    if (p <= b.atProgress) {
      const span = b.atProgress - a.atProgress || 1;
      const localT = ease(b.easing, (p - a.atProgress) / span);
      return {
        center: lerpVec2(a.center, b.center, localT),
        zoom: lerp(a.zoom, b.zoom, localT),
        pitch: lerp(a.pitch, b.pitch, localT),
        bearing: lerp(a.bearing, b.bearing, localT),
      };
    }
  }
  return {
    center: last.center,
    zoom: last.zoom,
    pitch: last.pitch,
    bearing: last.bearing,
  };
}
