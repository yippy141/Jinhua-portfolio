"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";

import { projects, type ProjectTier } from "@/data/projects";

// The project-field layout + physics, extracted from ProjectDriftField so the
// component stays presentational. Behaviour is unchanged: measure the real
// header/hero/footer rectangles, distribute deterministic anchors across the
// whole field, relax to a non-overlapping layout BEFORE revealing, then keep
// each node tethered to its anchor with a gentle spring + soft repulsion.
// Tethering is what prevents edge pile-up over time.

type FieldNode = (typeof projects)[number];

export type Rect = { x: number; y: number; w: number; h: number };
export type Body = { x: number; y: number; vx: number; vy: number };
export type DebugSnap = {
  w: number;
  h: number;
  exclusions: Rect[];
  anchors: { x: number; y: number }[];
  bodies: Body[];
  radii: number[];
  overlaps: number;
  paused: boolean;
};

const nodes: FieldNode[] = [...projects];

// ── tuning constants (collision distance includes visual spacing) ──
const FIELD_PAD = 26;
export const SPACING = 32;
const LABEL_ISOLATION = 138;
const SETTLE_ITERATIONS = 340;
const SPRING_K = 3.2; // runtime tether stiffness
const REPEL_K = 26; // runtime repulsion
const DAMPING = 0.86;
const MAX_SPEED = 30; // px/s
const DRIFT_AMP = 9;
const DRIFT_FREQ = 0.16;
const RELAYOUT_AFTER_ENTRANCE_MS = 1900;
const WIDE_QUERY = "(min-width: 768px)";

export function radiusForTier(tier: ProjectTier): number {
  if (tier === "flagship") return 23;
  if (tier === "lab") return 18;
  return 16;
}
export function iconSizeForTier(tier: ProjectTier): number {
  if (tier === "flagship") return 40;
  if (tier === "lab") return 30;
  return 26;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function insideRect(x: number, y: number, r: Rect, margin: number): boolean {
  return (
    x >= r.x - margin &&
    x <= r.x + r.w + margin &&
    y >= r.y - margin &&
    y <= r.y + r.h + margin
  );
}

// Push a point to the nearest edge of an exclusion rect (minimum translation).
function pushOutOfRect(p: Body, rad: number, r: Rect, margin: number) {
  const m = margin + rad;
  if (!insideRect(p.x, p.y, r, m)) return;
  const left = p.x - (r.x - m);
  const right = r.x + r.w + m - p.x;
  const top = p.y - (r.y - m);
  const bottom = r.y + r.h + m - p.y;
  const min = Math.min(left, right, top, bottom);
  if (min === left) p.x = r.x - m;
  else if (min === right) p.x = r.x + r.w + m;
  else if (min === top) p.y = r.y - m;
  else p.y = r.y + r.h + m;
}

function clampToField(p: Body, rad: number, w: number, h: number) {
  p.x = Math.min(Math.max(p.x, FIELD_PAD + rad), w - FIELD_PAD - rad);
  p.y = Math.min(Math.max(p.y, FIELD_PAD + rad), h - FIELD_PAD - rad);
}

function subscribeWideQuery(onStoreChange: () => void) {
  const mq = window.matchMedia(WIDE_QUERY);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getWideSnapshot() {
  return window.matchMedia(WIDE_QUERY).matches;
}

function getWideServerSnapshot() {
  return false;
}

function subscribeDebugQuery() {
  return () => {};
}

function getDebugSnapshot() {
  try {
    return new URLSearchParams(window.location.search).get("introDebug") === "1";
  } catch {
    return false;
  }
}

function getDebugServerSnapshot() {
  return false;
}

function measureExclusions(field: HTMLElement): Rect[] {
  const fieldRect = field.getBoundingClientRect();
  const rects: Rect[] = [];
  for (const id of ["sea-nav", "sea-hero", "sea-footer"]) {
    const el = document.getElementById(id);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    rects.push({
      x: r.left - fieldRect.left,
      y: r.top - fieldRect.top,
      w: r.width,
      h: r.height,
    });
  }
  return rects;
}

// Deterministic, well-distributed anchors: a jittered grid of candidates in the
// allowed area, then farthest-point sampling so the picks spread across regions.
function generateAnchors(
  w: number,
  h: number,
  exclusions: Rect[],
  maxRadius: number,
  seed: number,
): { x: number; y: number }[] {
  const rand = mulberry32(seed);
  const margin = maxRadius + 14;
  const candidates: { x: number; y: number }[] = [];
  const cols = 9;
  const rows = 7;
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      const px =
        FIELD_PAD + margin + ((cx + 0.5) / cols) * (w - 2 * (FIELD_PAD + margin));
      const py =
        FIELD_PAD + margin + ((cy + 0.5) / rows) * (h - 2 * (FIELD_PAD + margin));
      const jx = px + (rand() - 0.5) * (w / cols) * 0.5;
      const jy = py + (rand() - 0.5) * (h / rows) * 0.5;
      if (exclusions.some((r) => insideRect(jx, jy, r, margin))) continue;
      candidates.push({ x: jx, y: jy });
    }
  }
  if (candidates.length === 0) {
    for (let i = 0; i < nodes.length; i++) {
      candidates.push({ x: w / 2, y: ((i + 1) / (nodes.length + 1)) * h });
    }
  }

  const chosen: { x: number; y: number }[] = [];
  const cxc = w / 2;
  const cyc = h / 2;
  let startIdx = 0;
  let startBest = Infinity;
  candidates.forEach((c, i) => {
    const d = (c.x - cxc) ** 2 + (c.y - cyc) ** 2;
    if (d < startBest) {
      startBest = d;
      startIdx = i;
    }
  });
  chosen.push(candidates[startIdx]);
  while (chosen.length < nodes.length) {
    let best: { x: number; y: number } | null = null;
    let bestDist = -1;
    for (const c of candidates) {
      let minD = Infinity;
      for (const ch of chosen) {
        const d = (c.x - ch.x) ** 2 + (c.y - ch.y) ** 2;
        if (d < minD) minD = d;
      }
      if (minD > bestDist) {
        bestDist = minD;
        best = c;
      }
    }
    if (!best) break;
    chosen.push(best);
  }
  return chosen;
}

export type ProjectFieldController = {
  fieldRef: React.RefObject<HTMLDivElement | null>;
  isWide: boolean;
  settled: boolean;
  debug: boolean;
  debugSnap: DebugSnap | null;
  nodeRef: (i: number) => (el: HTMLDivElement | null) => void;
  labelRef: (i: number) => (el: HTMLSpanElement | null) => void;
  setFrozen: (id: string | null) => void;
  settleNow: () => void;
  reseed: () => void;
};

export function useProjectFieldPhysics(): ProjectFieldController {
  const prefersReducedMotion = useReducedMotion();
  const isWide = useSyncExternalStore(
    subscribeWideQuery,
    getWideSnapshot,
    getWideServerSnapshot,
  );
  const debug = useSyncExternalStore(
    subscribeDebugQuery,
    getDebugSnapshot,
    getDebugServerSnapshot,
  );
  const [settled, setSettled] = useState(false);
  const [seed, setSeed] = useState(1337);
  const [debugSnap, setDebugSnap] = useState<DebugSnap | null>(null);

  const fieldRef = useRef<HTMLDivElement>(null);
  const nodeEls = useRef<(HTMLDivElement | null)[]>([]);
  const labelEls = useRef<(HTMLSpanElement | null)[]>([]);
  const bodies = useRef<Body[]>([]);
  const anchors = useRef<{ x: number; y: number }[]>([]);
  const radii = useRef<number[]>(nodes.map((n) => radiusForTier(n.tier)));
  const exclusions = useRef<Rect[]>([]);
  const activeRef = useRef<string | null>(null);
  const rafRef = useRef(0);
  const overlapCorrections = useRef(0);
  const loggedReveal = useRef(false);

  // Stable per-index ref callbacks so React does not detach/attach every render.
  const nodeRefCbs = useRef<((el: HTMLDivElement | null) => void)[]>([]);
  const labelRefCbs = useRef<((el: HTMLSpanElement | null) => void)[]>([]);
  const nodeRef = useCallback((i: number) => {
    if (!nodeRefCbs.current[i]) {
      nodeRefCbs.current[i] = (el) => {
        nodeEls.current[i] = el;
      };
    }
    return nodeRefCbs.current[i];
  }, []);
  const labelRef = useCallback((i: number) => {
    if (!labelRefCbs.current[i]) {
      labelRefCbs.current[i] = (el) => {
        labelEls.current[i] = el;
      };
    }
    return labelRefCbs.current[i];
  }, []);

  const setFrozen = useCallback((id: string | null) => {
    activeRef.current = id;
  }, []);

  const animate = isWide && !prefersReducedMotion;

  const writeTransforms = useCallback(() => {
    for (let i = 0; i < nodes.length; i++) {
      const el = nodeEls.current[i];
      const b = bodies.current[i];
      if (!el || !b) continue;
      el.style.transform = `translate(${b.x}px, ${b.y}px)`;
    }
  }, []);

  // Settle a valid, distributed, non-overlapping layout before revealing.
  const settleLayout = useCallback(
    (firstLog: boolean) => {
      const field = fieldRef.current;
      if (!field) return;
      const w = field.clientWidth;
      const h = field.clientHeight;
      if (w === 0 || h === 0) return;

      exclusions.current = measureExclusions(field);
      anchors.current = generateAnchors(
        w,
        h,
        exclusions.current,
        Math.max(...radii.current),
        seed,
      );

      const pos: Body[] = anchors.current.map((a) => ({
        x: a.x,
        y: a.y,
        vx: 0,
        vy: 0,
      }));
      overlapCorrections.current = 0;
      for (let it = 0; it < SETTLE_ITERATIONS; it++) {
        for (let i = 0; i < pos.length; i++) {
          pos[i].x += (anchors.current[i].x - pos[i].x) * 0.04;
          pos[i].y += (anchors.current[i].y - pos[i].y) * 0.04;
        }
        for (let i = 0; i < pos.length; i++) {
          for (let j = i + 1; j < pos.length; j++) {
            const dx = pos[i].x - pos[j].x;
            const dy = pos[i].y - pos[j].y;
            const d = Math.hypot(dx, dy) || 0.001;
            const min = radii.current[i] + radii.current[j] + SPACING;
            if (d < min) {
              const push = (min - d) / 2;
              const nx = dx / d;
              const ny = dy / d;
              pos[i].x += nx * push;
              pos[i].y += ny * push;
              pos[j].x -= nx * push;
              pos[j].y -= ny * push;
              overlapCorrections.current++;
            }
          }
        }
        for (let i = 0; i < pos.length; i++) {
          for (const r of exclusions.current)
            pushOutOfRect(pos[i], radii.current[i], r, 14);
          clampToField(pos[i], radii.current[i], w, h);
        }
      }
      bodies.current = pos;
      writeTransforms();
      setSettled(true);

      if (debug) {
        setDebugSnap({
          w,
          h,
          exclusions: exclusions.current.map((r) => ({ ...r })),
          anchors: anchors.current.map((a) => ({ ...a })),
          bodies: pos.map((b) => ({ ...b })),
          radii: [...radii.current],
          overlaps: overlapCorrections.current,
          paused: activeRef.current !== null,
        });
        if (firstLog) {
          console.log("[introDebug] field first layout", {
            w,
            h,
            overlapCorrections: overlapCorrections.current,
          });
        }
      }
    },
    [seed, debug, writeTransforms],
  );

  // Initial layout + re-layout after the depths entrance settles + ResizeObserver.
  useEffect(() => {
    if (!isWide) return;
    const raf1 = requestAnimationFrame(() => settleLayout(true));
    const t = window.setTimeout(
      () => settleLayout(false),
      RELAYOUT_AFTER_ENTRANCE_MS,
    );

    const field = fieldRef.current;
    let ro: ResizeObserver | null = null;
    if (field && "ResizeObserver" in window) {
      let firstRO = true;
      ro = new ResizeObserver(() => {
        if (firstRO) {
          firstRO = false;
          return;
        }
        if (debug) {
          console.log("[introDebug] field re-layout from ResizeObserver");
        }
        settleLayout(false);
      });
      ro.observe(field);
    }
    return () => {
      cancelAnimationFrame(raf1);
      window.clearTimeout(t);
      if (ro) ro.disconnect();
    };
  }, [isWide, settleLayout, debug]);

  // Log field size once the reveal has completed.
  useEffect(() => {
    if (!settled || loggedReveal.current) return;
    loggedReveal.current = true;
    if (debug) {
      const field = fieldRef.current;
      console.log("[introDebug] field at reveal complete", {
        w: field?.clientWidth,
        h: field?.clientHeight,
      });
    }
  }, [settled, debug]);

  // Runtime physics: tether + repulsion + boundary, gentle and damped.
  useEffect(() => {
    if (!animate || !settled) return;
    const field = fieldRef.current;
    if (!field) return;
    let last = performance.now();

    const loop = (now: number) => {
      rafRef.current = requestAnimationFrame(loop);
      let dt = (now - last) / 1000;
      last = now;
      if (document.hidden) return;
      if (dt > 0.05) dt = 0.05;
      const paused = activeRef.current !== null;

      const w = field.clientWidth;
      const h = field.clientHeight;
      const t = now / 1000;
      const pos = bodies.current;
      const rad = radii.current;

      if (!paused) {
        for (let i = 0; i < pos.length; i++) {
          const a = anchors.current[i];
          if (!a) continue;
          const ax = a.x + Math.sin(t * DRIFT_FREQ + i * 1.7) * DRIFT_AMP;
          const ay = a.y + Math.cos(t * DRIFT_FREQ * 0.9 + i * 2.3) * DRIFT_AMP;
          let fx = (ax - pos[i].x) * SPRING_K;
          let fy = (ay - pos[i].y) * SPRING_K;
          for (let j = 0; j < pos.length; j++) {
            if (j === i) continue;
            const dx = pos[i].x - pos[j].x;
            const dy = pos[i].y - pos[j].y;
            const d = Math.hypot(dx, dy) || 0.001;
            const min = rad[i] + rad[j] + SPACING;
            if (d < min) {
              const f = ((min - d) / min) * REPEL_K;
              fx += (dx / d) * f;
              fy += (dy / d) * f;
            }
          }
          pos[i].vx = (pos[i].vx + fx * dt) * DAMPING;
          pos[i].vy = (pos[i].vy + fy * dt) * DAMPING;
          const sp = Math.hypot(pos[i].vx, pos[i].vy);
          if (sp > MAX_SPEED) {
            pos[i].vx = (pos[i].vx / sp) * MAX_SPEED;
            pos[i].vy = (pos[i].vy / sp) * MAX_SPEED;
          }
          pos[i].x += pos[i].vx * dt;
          pos[i].y += pos[i].vy * dt;
          for (const r of exclusions.current) pushOutOfRect(pos[i], rad[i], r, 14);
          clampToField(pos[i], rad[i], w, h);
        }

        for (let i = 0; i < pos.length; i++) {
          let nearest = Infinity;
          for (let j = 0; j < pos.length; j++) {
            if (j === i) continue;
            const d = Math.hypot(pos[i].x - pos[j].x, pos[i].y - pos[j].y);
            if (d < nearest) nearest = d;
          }
          const label = labelEls.current[i];
          if (label) {
            const show =
              nearest > LABEL_ISOLATION || activeRef.current === nodes[i].id;
            label.style.opacity = show ? "1" : "0";
          }
        }

        writeTransforms();
      }

      if (debug) {
        setDebugSnap({
          w,
          h,
          exclusions: exclusions.current.map((r) => ({ ...r })),
          anchors: anchors.current.map((a) => ({ ...a })),
          bodies: pos.map((b) => ({ ...b })),
          radii: [...rad],
          overlaps: overlapCorrections.current,
          paused,
        });
      }
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate, settled, writeTransforms, debug]);

  const settleNow = useCallback(() => settleLayout(false), [settleLayout]);
  const reseed = useCallback(() => setSeed((s) => s + 101), []);

  return {
    fieldRef,
    isWide,
    settled,
    debug,
    debugSnap,
    nodeRef,
    labelRef,
    setFrozen,
    settleNow,
    reseed,
  };
}
