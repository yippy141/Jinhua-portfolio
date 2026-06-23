"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";

import {
  AMBIENT_THOUGHT_DEBUG_KEY,
  AMBIENT_THOUGHT_SESSION_PREFIX,
  ambientThoughtRegistry,
  type AmbientThought,
  type AmbientThoughtCategory,
  type AmbientThoughtDepthBand,
  type AmbientThoughtWeight,
} from "@/data/ambient-thoughts";

type ViewportMode = "desktop" | "mobile";
type DriftDirection = "left-to-right" | "right-to-left";
type FontTone = "serif" | "sans";

type StoredThoughtPlacement = {
  thoughtId: string;
  direction: DriftDirection;
  yPercent: number;
  xPercent: number;
  delaySeconds: number;
  durationSeconds: number;
  opacity: number;
  blurPx: number;
  fontSizePx: number;
  bobPixels: number;
  bobDurationSeconds: number;
  fontTone: FontTone;
};

type AmbientThoughtPlacement = StoredThoughtPlacement & {
  thought: AmbientThought;
};

type StoredThoughtSelection = {
  seed: number;
  mode: ViewportMode;
  placements: StoredThoughtPlacement[];
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
    opacity: [0.08, 0.16],
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
    opacity: [0.055, 0.12],
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
    opacity: [0.035, 0.085],
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
    whisper: 0.74,
    normal: 1,
    ghost: 0.48,
  };
  const categoryScale = thought.category === "taxonomy" ? 0.72 : 1;
  return base * weightScale[thought.weight] * categoryScale;
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

    return {
      thought,
      thoughtId: thought.id,
      direction,
      yPercent: Number(randomBetween(rng, yRange).toFixed(2)),
      xPercent: Number(randomBetween(rng, [8, 92]).toFixed(2)),
      delaySeconds: Number((-duration * randomBetween(rng, [0.08, 0.92])).toFixed(2)),
      durationSeconds: Number(duration.toFixed(2)),
      opacity: Number(opacityForThought(thought, rng).toFixed(3)),
      blurPx: Number(
        (randomBetween(rng, tuning.blurPx) + (thought.weight === "ghost" ? 0.25 : 0)).toFixed(2),
      ),
      fontSizePx: Number(sizeForThought(thought, mode, rng).toFixed(2)),
      bobPixels: Number(randomBetween(rng, [1.5, 7]).toFixed(2)),
      bobDurationSeconds: Number(randomBetween(rng, [18, 36]).toFixed(2)),
      fontTone,
    };
  });
}

function isViewportMode(value: unknown): value is ViewportMode {
  return value === "desktop" || value === "mobile";
}

function isStoredPlacement(value: unknown): value is StoredThoughtPlacement {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.thoughtId === "string" &&
    (entry.direction === "left-to-right" || entry.direction === "right-to-left") &&
    typeof entry.yPercent === "number" &&
    typeof entry.xPercent === "number" &&
    typeof entry.delaySeconds === "number" &&
    typeof entry.durationSeconds === "number" &&
    typeof entry.opacity === "number" &&
    typeof entry.blurPx === "number" &&
    typeof entry.fontSizePx === "number" &&
    typeof entry.bobPixels === "number" &&
    typeof entry.bobDurationSeconds === "number" &&
    (entry.fontTone === "serif" || entry.fontTone === "sans")
  );
}

function readStoredSelection(
  mode: ViewportMode,
): { seed: number; placements: AmbientThoughtPlacement[] } | null {
  try {
    const raw = window.sessionStorage.getItem(`${AMBIENT_THOUGHT_SESSION_PREFIX}-${mode}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredThoughtSelection>;
    if (
      typeof parsed.seed !== "number" ||
      !isViewportMode(parsed.mode) ||
      parsed.mode !== mode ||
      !Array.isArray(parsed.placements)
    ) {
      return null;
    }

    const byId = new Map(ambientThoughtRegistry.map((thought) => [thought.id, thought]));
    const placements = parsed.placements
      .filter(isStoredPlacement)
      .map((stored) => {
        const thought = byId.get(stored.thoughtId);
        return thought ? { ...stored, thought } : null;
      })
      .filter((placement): placement is AmbientThoughtPlacement => Boolean(placement));

    return placements.length > 0 ? { seed: parsed.seed, placements } : null;
  } catch {
    return null;
  }
}

function storeSelection(
  mode: ViewportMode,
  seed: number,
  placements: AmbientThoughtPlacement[],
) {
  try {
    const stored: StoredThoughtSelection = {
      seed,
      mode,
      placements: placements.map((placement) => {
        const { thought, ...storedPlacement } = placement;
        void thought;
        return storedPlacement;
      }),
    };
    window.sessionStorage.setItem(
      `${AMBIENT_THOUGHT_SESSION_PREFIX}-${mode}`,
      JSON.stringify(stored),
    );
  } catch {
    // Storage can be unavailable in private or hardened browsing modes.
  }
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
      const stored = readStoredSelection(mode);
      if (stored) {
        const nextPlacements = prefersReducedMotion
          ? stored.placements.slice(0, mode === "mobile" ? 4 : 7)
          : stored.placements;
        if (cancelled) return;
        setSeed(stored.seed);
        setPlacements(nextPlacements);
        storeDebug(stored.seed, mode, nextPlacements.length, prefersReducedMotion);
        return;
      }

      const nextSeed = createSeed();
      const fullPlacements = createPlacements(nextSeed, mode);
      const nextPlacements = prefersReducedMotion
        ? fullPlacements.slice(0, mode === "mobile" ? 4 : 7)
        : fullPlacements;
      storeSelection(mode, nextSeed, fullPlacements);
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
        const driftName =
          placement.direction === "left-to-right"
            ? "ambientThoughtDriftLtr"
            : "ambientThoughtDriftRtl";
        const playState = paused ? "paused" : "running";
        const style = {
          "--thought-y": `${placement.yPercent}%`,
          "--thought-x": `${placement.xPercent}%`,
          "--thought-duration": `${placement.durationSeconds}s`,
          "--thought-delay": `${placement.delaySeconds}s`,
          "--thought-opacity": placement.opacity,
          "--thought-blur": `${placement.blurPx}px`,
          "--thought-size": `${placement.fontSizePx}px`,
          "--thought-bob": `${placement.bobPixels}px`,
          "--thought-bob-duration": `${placement.bobDurationSeconds}s`,
          top: "var(--thought-y)",
          left: prefersReducedMotion ? "var(--thought-x)" : 0,
          opacity: "var(--thought-opacity)",
          filter: "blur(var(--thought-blur))",
          fontSize: "var(--thought-size)",
          animationName: prefersReducedMotion ? undefined : driftName,
          animationDuration: "var(--thought-duration)",
          animationTimingFunction: "linear",
          animationDelay: "var(--thought-delay)",
          animationIterationCount: "infinite",
          animationPlayState: playState,
          transform: prefersReducedMotion ? "translate3d(-50%, 0, 0)" : undefined,
        } as CSSProperties;
        const bobStyle = {
          animationDuration: "var(--thought-bob-duration)",
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
            <span className="ambient-thought-bob inline-block" style={bobStyle}>
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
