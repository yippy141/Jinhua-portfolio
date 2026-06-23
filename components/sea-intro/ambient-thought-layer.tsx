"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";

import {
  AMBIENT_THOUGHT_DEBUG_KEY,
  ambientThoughtRegistry,
  type AmbientThought,
  type AmbientThoughtCategory,
  type AmbientThoughtDepthBand,
  type AmbientThoughtWeight,
} from "@/data/ambient-thoughts";

type ViewportMode = "desktop" | "mobile";
type DriftDirection = "left-to-right" | "right-to-left";
type FontTone = "serif" | "sans";

type ThoughtPlacementConfig = {
  thoughtId: string;
  direction: DriftDirection;
  yPercent: number;
  xPercent: number;
  xStartVw: number;
  xMidAVw: number;
  xMidBVw: number;
  xEndVw: number;
  yStartVh: number;
  yMidAVh: number;
  yMidBVh: number;
  yEndVh: number;
  delaySeconds: number;
  durationSeconds: number;
  opacity: number;
  blurPx: number;
  fontSizePx: number;
  swayXVw: number;
  swayYPixels: number;
  swayDurationSeconds: number;
  fontTone: FontTone;
};

type AmbientThoughtPlacement = ThoughtPlacementConfig & {
  thought: AmbientThought;
};

type DepthTuning = {
  durationSeconds: readonly [number, number];
  opacity: readonly [number, number];
  blurPx: readonly [number, number];
  fontSizePx: readonly [number, number];
  ghostFontSizePx: readonly [number, number];
  yRanges: readonly (readonly [number, number])[];
};

const DEPTH_TUNING: Record<AmbientThoughtDepthBand, DepthTuning> = {
  shallow: {
    durationSeconds: [60, 96],
    opacity: [0.1, 0.2],
    blurPx: [0, 0.45],
    fontSizePx: [12, 22],
    ghostFontSizePx: [42, 76],
    yRanges: [
      [12, 34],
      [62, 80],
    ],
  },
  mid: {
    durationSeconds: [86, 132],
    opacity: [0.075, 0.15],
    blurPx: [0.45, 1],
    fontSizePx: [13, 28],
    ghostFontSizePx: [54, 104],
    yRanges: [
      [18, 42],
      [64, 84],
    ],
  },
  deep: {
    durationSeconds: [118, 160],
    opacity: [0.05, 0.105],
    blurPx: [1, 2.2],
    fontSizePx: [18, 34],
    ghostFontSizePx: [64, 140],
    yRanges: [
      [8, 30],
      [70, 90],
    ],
  },
};

const MOBILE_GHOST_SIZE: Record<AmbientThoughtDepthBand, readonly [number, number]> = {
  shallow: [34, 54],
  mid: [40, 62],
  deep: [48, 76],
};

const CATEGORY_STYLE: Record<AmbientThoughtCategory, { colorClass: string }> = {
  cetacea: { colorClass: "text-ink" },
  taxonomy: { colorClass: "text-ink-2" },
  consciousness: { colorClass: "text-ink-2" },
};

function makeRng(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createSeed(): number {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const seed = new Uint32Array(1);
    crypto.getRandomValues(seed);
    return seed[0];
  }
  return Math.floor(Math.random() * 4294967295);
}

function randomBetween(rng: () => number, range: readonly [number, number]) {
  return range[0] + (range[1] - range[0]) * rng();
}

function chooseOne<T>(rng: () => number, entries: readonly T[]): T {
  const fallback = entries[0];
  const picked = entries[Math.min(entries.length - 1, Math.floor(rng() * entries.length))];
  if (picked !== undefined) return picked;
  if (fallback !== undefined) return fallback;
  throw new Error("Cannot choose from an empty list.");
}

function weightedSample(
  registry: readonly AmbientThought[],
  count: number,
  rng: () => number,
) {
  const pool = [...registry];
  const selected: AmbientThought[] = [];

  while (pool.length > 0 && selected.length < count) {
    const total = pool.reduce(
      (sum, thought) => sum + Math.max(1, 8 - thought.priority),
      0,
    );
    let cursor = rng() * total;
    const index = pool.findIndex((thought) => {
      cursor -= Math.max(1, 8 - thought.priority);
      return cursor <= 0;
    });
    const [next] = pool.splice(index === -1 ? pool.length - 1 : index, 1);
    if (next) selected.push(next);
  }

  return selected;
}

function sizeForThought(
  thought: AmbientThought,
  mode: ViewportMode,
  rng: () => number,
) {
  const tuning = DEPTH_TUNING[thought.depthBand];
  const sizeRange =
    thought.weight === "ghost"
      ? mode === "mobile"
        ? MOBILE_GHOST_SIZE[thought.depthBand]
        : tuning.ghostFontSizePx
      : tuning.fontSizePx;
  const categoryScale = thought.category === "consciousness" ? 0.78 : 1;
  const mobileScale = mode === "mobile" ? 0.86 : 1;
  return randomBetween(rng, sizeRange) * categoryScale * mobileScale;
}

function opacityForThought(thought: AmbientThought, rng: () => number) {
  const base = randomBetween(rng, DEPTH_TUNING[thought.depthBand].opacity);
  const weightScale: Record<AmbientThoughtWeight, number> = {
    whisper: 0.86,
    normal: 1,
    ghost: 0.62,
  };
  const categoryScale = thought.category === "taxonomy" ? 0.82 : 1;
  return base * weightScale[thought.weight] * categoryScale;
}

function fluidPathForThought(
  thought: AmbientThought,
  direction: DriftDirection,
  rng: () => number,
) {
  const travelRange: Record<AmbientThoughtDepthBand, readonly [number, number]> = {
    shallow: [4, 10],
    mid: [6, 14],
    deep: [8, 18],
  };
  const travel = randomBetween(rng, travelRange[thought.depthBand]);
  const signed = () => randomBetween(rng, [-travel, travel]);
  const xStartVw = direction === "left-to-right" ? -46 : 146;
  const xEndVw = direction === "left-to-right" ? 146 : -46;
  const xMidAVw =
    direction === "left-to-right"
      ? randomBetween(rng, [14, 40])
      : randomBetween(rng, [60, 86]);
  const xMidBVw =
    direction === "left-to-right"
      ? randomBetween(rng, [60, 92])
      : randomBetween(rng, [8, 40]);

  return {
    xStartVw: Number(xStartVw.toFixed(2)),
    xMidAVw: Number(xMidAVw.toFixed(2)),
    xMidBVw: Number(xMidBVw.toFixed(2)),
    xEndVw: Number(xEndVw.toFixed(2)),
    yStartVh: Number(randomBetween(rng, [-travel * 0.45, travel * 0.45]).toFixed(2)),
    yMidAVh: Number(signed().toFixed(2)),
    yMidBVh: Number(signed().toFixed(2)),
    yEndVh: Number(randomBetween(rng, [-travel * 0.7, travel * 0.7]).toFixed(2)),
  };
}

function createPlacements(
  seed: number,
  mode: ViewportMode,
): AmbientThoughtPlacement[] {
  const rng = makeRng(seed);
  const baseCount = mode === "mobile"
    ? 5 + Math.floor(rng() * 4)
    : 10 + Math.floor(rng() * 7);
  const selected = weightedSample(ambientThoughtRegistry, baseCount, rng);

  return selected.map((thought, index) => {
    const tuning = DEPTH_TUNING[thought.depthBand];
    const yRange = chooseOne(rng, tuning.yRanges);
    const duration = randomBetween(rng, tuning.durationSeconds);
    const direction: DriftDirection =
      index % 2 === 0
        ? rng() > 0.36
          ? "right-to-left"
          : "left-to-right"
        : rng() > 0.36
          ? "left-to-right"
          : "right-to-left";
    const fontTone: FontTone =
      thought.category === "consciousness" && rng() > 0.35 ? "sans" : "serif";
    const path = fluidPathForThought(thought, direction, rng);

    return {
      thought,
      thoughtId: thought.id,
      direction,
      yPercent: Number(randomBetween(rng, yRange).toFixed(2)),
      xPercent: Number(randomBetween(rng, [8, 92]).toFixed(2)),
      ...path,
      delaySeconds: Number((-duration * randomBetween(rng, [0.08, 0.92])).toFixed(2)),
      durationSeconds: Number(duration.toFixed(2)),
      opacity: Number(opacityForThought(thought, rng).toFixed(3)),
      blurPx: Number(
        (randomBetween(rng, tuning.blurPx) + (thought.weight === "ghost" ? 0.25 : 0)).toFixed(2),
      ),
      fontSizePx: Number(sizeForThought(thought, mode, rng).toFixed(2)),
      swayXVw: Number(randomBetween(rng, [0.35, 1.65]).toFixed(2)),
      swayYPixels: Number(randomBetween(rng, [2, 8]).toFixed(2)),
      swayDurationSeconds: Number(randomBetween(rng, [16, 34]).toFixed(2)),
      fontTone,
    };
  });
}

function storeDebug(seed: number, mode: ViewportMode, activeCount: number, reducedMotion: boolean) {
  try {
    window.sessionStorage.setItem(
      AMBIENT_THOUGHT_DEBUG_KEY,
      JSON.stringify({ seed, mode, activeCount, reducedMotion }),
    );
  } catch {
    // Debug state is best-effort only.
  }
}

function useViewportMode() {
  const [mode, setMode] = useState<ViewportMode | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setMode(mq.matches ? "mobile" : "desktop");
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return mode;
}

function useIntroDebugFlag() {
  const [debug, setDebug] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        setDebug(new URLSearchParams(window.location.search).get("introDebug") === "1");
      } catch {
        setDebug(false);
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  return debug;
}

export function AmbientThoughtLayer() {
  const mode = useViewportMode();
  const debug = useIntroDebugFlag();
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [seed, setSeed] = useState<number | null>(null);
  const [placements, setPlacements] = useState<AmbientThoughtPlacement[]>([]);
  const [paused, setPaused] = useState(
    () => typeof document !== "undefined" && document.hidden,
  );

  useEffect(() => {
    if (!mode) return;

    let cancelled = false;
    const id = window.setTimeout(() => {
      const nextSeed = createSeed();
      const fullPlacements = createPlacements(nextSeed, mode);
      const nextPlacements = prefersReducedMotion
        ? fullPlacements.slice(0, mode === "mobile" ? 4 : 7)
        : fullPlacements;
      if (cancelled) return;
      storeDebug(nextSeed, mode, nextPlacements.length, prefersReducedMotion);
      setSeed(nextSeed);
      setPlacements(nextPlacements);
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [mode, prefersReducedMotion]);

  useEffect(() => {
    const update = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  const rendered = useMemo(
    () =>
      placements.map((placement) => {
        const thought = placement.thought;
        const playState = paused ? "paused" : "running";
        const style = {
          "--thought-y": `${placement.yPercent}%`,
          "--thought-x": `${placement.xPercent}%`,
          "--thought-x-start": `${placement.xStartVw}vw`,
          "--thought-x-mid-a": `${placement.xMidAVw}vw`,
          "--thought-x-mid-b": `${placement.xMidBVw}vw`,
          "--thought-x-end": `${placement.xEndVw}vw`,
          "--thought-y-start": `${placement.yStartVh}vh`,
          "--thought-y-mid-a": `${placement.yMidAVh}vh`,
          "--thought-y-mid-b": `${placement.yMidBVh}vh`,
          "--thought-y-end": `${placement.yEndVh}vh`,
          "--thought-duration": `${placement.durationSeconds}s`,
          "--thought-delay": `${placement.delaySeconds}s`,
          "--thought-opacity": placement.opacity,
          "--thought-blur": `${placement.blurPx}px`,
          "--thought-size": `${placement.fontSizePx}px`,
          "--thought-sway-x": `${placement.swayXVw}vw`,
          "--thought-sway-y": `${placement.swayYPixels}px`,
          "--thought-sway-duration": `${placement.swayDurationSeconds}s`,
          top: "var(--thought-y)",
          left: prefersReducedMotion ? "var(--thought-x)" : 0,
          opacity: "var(--thought-opacity)",
          filter: "blur(var(--thought-blur))",
          fontSize: "var(--thought-size)",
          animationName: prefersReducedMotion ? undefined : "ambientThoughtFloat",
          animationDuration: "var(--thought-duration)",
          animationTimingFunction: "linear",
          animationDelay: "var(--thought-delay)",
          animationIterationCount: "infinite",
          animationPlayState: playState,
          transform: prefersReducedMotion ? "translate3d(-50%, 0, 0)" : undefined,
        } as CSSProperties;
        const swayStyle = {
          animationDuration: "var(--thought-sway-duration)",
          animationPlayState: playState,
        } as CSSProperties;
        const isItalic = thought.italic || thought.category === "taxonomy";
        const fontClass = placement.fontTone === "serif" ? "font-serif" : "font-sans";

        return (
          <span
            key={`${placement.thoughtId}-${placement.yPercent}`}
            className={[
              "ambient-thought absolute select-none whitespace-nowrap leading-none",
              "will-change-transform",
              CATEGORY_STYLE[thought.category].colorClass,
              fontClass,
              isItalic ? "italic" : "",
            ].join(" ")}
            data-depth-band={thought.depthBand}
            data-thought-category={thought.category}
            style={style}
          >
            <span className="ambient-thought-sway inline-block" style={swayStyle}>
              {thought.label}
            </span>
          </span>
        );
      }),
    [paused, placements, prefersReducedMotion],
  );

  if (placements.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      data-ambient-thought-paused={paused ? "true" : "false"}
      data-reduced-motion={prefersReducedMotion ? "true" : "false"}
    >
      {rendered}
      {debug ? (
        <div className="pointer-events-none fixed bottom-3 right-3 z-[100] w-60 rounded-[3px] border border-white/15 bg-[#07100f]/75 p-3 font-sans text-[11px] leading-5 text-white/70 backdrop-blur-sm">
          <div>
            ambient thoughts <span className="text-white">yes</span>
          </div>
          <div>
            words <span className="text-white">{placements.length}</span>
            {" · "}motion{" "}
            <span className="text-white">{prefersReducedMotion ? "reduced" : "drift"}</span>
          </div>
          <div>
            seed <span className="text-white">{seed ?? "pending"}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
