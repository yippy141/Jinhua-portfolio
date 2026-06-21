"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  projects,
  projectStatusLabels,
  projectTypeLabels,
} from "@/data/projects";
import { Icon } from "@/components/icons";
import { NodeIcon } from "@/components/node-icons";

// Replacement for FrontDoor. The old field used a hard-coded bottom-left hero
// exclusion and clustered data anchors with no pairwise repulsion, so nodes
// piled into the upper-right. This version measures the real header/hero/footer
// rectangles, distributes deterministic anchors across the whole field, runs a
// relaxation pass to a non-overlapping layout BEFORE revealing, then keeps each
// node tethered to its anchor with a gentle spring + soft repulsion. Tethering
// is what prevents edge pile-up over time.

type Node = (typeof projects)[number];

const nodes: Node[] = [...projects];
const flagshipId = nodes.find((n) => n.tier === "flagship")?.id ?? nodes[0]?.id;

type Rect = { x: number; y: number; w: number; h: number };
type Body = { x: number; y: number; vx: number; vy: number };
type DebugSnap = {
  w: number;
  h: number;
  exclusions: Rect[];
  anchors: { x: number; y: number }[];
  bodies: Body[];
  radii: number[];
  overlaps: number;
  paused: boolean;
};

// ── tuning constants (collision distance includes visual spacing) ──
const FIELD_PAD = 26;
const SPACING = 32;
const LABEL_ISOLATION = 138;
const SETTLE_ITERATIONS = 340;
const SPRING_K = 3.2; // runtime tether stiffness
const REPEL_K = 26; // runtime repulsion
const DAMPING = 0.86;
const MAX_SPEED = 30; // px/s
const DRIFT_AMP = 9;
const DRIFT_FREQ = 0.16;
const RELAYOUT_AFTER_ENTRANCE_MS = 1900;

function radiusForTier(tier: Node["tier"]): number {
  if (tier === "flagship") return 23;
  if (tier === "lab") return 18;
  return 16;
}
function iconSizeForTier(tier: Node["tier"]): number {
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
    // Degenerate (tiny field): fall back to a centre column.
    for (let i = 0; i < nodes.length; i++) {
      candidates.push({ x: w / 2, y: ((i + 1) / (nodes.length + 1)) * h });
    }
  }

  // Farthest-point sampling, deterministic start at the candidate nearest the
  // field centre.
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

type DossierPos = { left: number; top: number };

export function ProjectDriftField() {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isWide, setIsWide] = useState(false);
  const [settled, setSettled] = useState(false);
  const [debug, setDebug] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dossierPos, setDossierPos] = useState<DossierPos | null>(null);
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

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    try {
      setDebug(new URLSearchParams(window.location.search).get("introDebug") === "1");
    } catch {
      // ignore
    }
    return () => mq.removeEventListener("change", update);
  }, []);

  const animate = mounted && isWide && !prefersReducedMotion;

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
      anchors.current = generateAnchors(w, h, exclusions.current, Math.max(...radii.current), seed);

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
          for (const r of exclusions.current) pushOutOfRect(pos[i], radii.current[i], r, 14);
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
    if (!mounted || !isWide) return;
    const raf1 = requestAnimationFrame(() => settleLayout(true));
    const t = window.setTimeout(() => settleLayout(false), RELAYOUT_AFTER_ENTRANCE_MS);

    const field = fieldRef.current;
    let ro: ResizeObserver | null = null;
    if (field && "ResizeObserver" in window) {
      let firstRO = true;
      ro = new ResizeObserver(() => {
        if (firstRO) {
          firstRO = false;
          return; // ignore the initial observe callback
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
  }, [mounted, isWide, settleLayout, debug]);

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
      // Freeze the field while a preview is open, but keep the debug snapshot live.
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
        // Effective anchor drifts slowly so the field feels alive but bounded.
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

      // Reveal short labels only where a node is comfortably isolated.
      for (let i = 0; i < pos.length; i++) {
        let nearest = Infinity;
        for (let j = 0; j < pos.length; j++) {
          if (j === i) continue;
          const d = Math.hypot(pos[i].x - pos[j].x, pos[i].y - pos[j].y);
          if (d < nearest) nearest = d;
        }
        const label = labelEls.current[i];
        if (label) {
          const show = nearest > LABEL_ISOLATION || activeRef.current === nodes[i].id;
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

  const open = useCallback((id: string, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const WIDTH = 300;
    const HEIGHT = 320;
    const GAP = 20;
    const NAV_SAFE = 96;
    const PAD = 16;
    const onRightHalf = rect.left > window.innerWidth * 0.56;
    let left = onRightHalf ? rect.left - WIDTH - GAP : rect.right + GAP;
    left = Math.max(PAD, Math.min(left, window.innerWidth - WIDTH - PAD));
    let top = rect.top + rect.height / 2 - HEIGHT / 2;
    top = Math.max(NAV_SAFE, Math.min(top, window.innerHeight - HEIGHT - PAD));
    setDossierPos({ left, top });
    setActiveId(id);
    activeRef.current = id;
  }, []);

  const close = useCallback(() => {
    setActiveId(null);
    activeRef.current = null;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        const el = document.activeElement;
        if (el instanceof HTMLElement) el.blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const active = activeId ? nodes.find((n) => n.id === activeId) : null;

  return (
    <>
      {/* DRIFTING FIELD: md up. Hidden until a settled layout exists. */}
      <div
        ref={fieldRef}
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{ opacity: settled ? 1 : 0, transition: "opacity 300ms ease" }}
      >
        {nodes.map((node, index) => {
          const isFlagship = node.id === flagshipId;
          const isActive = activeId === node.id;
          const color = isFlagship
            ? "var(--oxblood)"
            : isActive
              ? "var(--sonar)"
              : "var(--ink-2)";
          const size = iconSizeForTier(node.tier);
          const revealDelay = 120 + index * 70;
          return (
            <div
              key={node.id}
              ref={(el) => {
                nodeEls.current[index] = el;
              }}
              className="absolute left-0 top-0 will-change-transform"
              style={{ zIndex: isActive ? 7 : 4 }}
            >
              <div className="-translate-x-1/2 -translate-y-1/2">
                <div
                  style={
                    settled
                      ? {
                          opacity: 1,
                          transform: "none",
                          filter: "none",
                          transition: `opacity 620ms cubic-bezier(0.22,1,0.36,1) ${revealDelay}ms, transform 620ms cubic-bezier(0.22,1,0.36,1) ${revealDelay}ms, filter 620ms ease ${revealDelay}ms`,
                        }
                      : {
                          opacity: 0,
                          transform: "translateY(14px) scale(0.9)",
                          filter: "blur(4px)",
                        }
                  }
                >
                <Link
                  href={`/projects/${node.slug}`}
                  aria-label={`Open ${node.title}`}
                  onMouseEnter={(e) => open(node.id, e.currentTarget)}
                  onMouseLeave={close}
                  onFocus={(e) => open(node.id, e.currentTarget)}
                  onBlur={close}
                  className="pointer-events-auto flex flex-col items-center gap-2 rounded-[4px] p-1 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-sonar"
                  style={{ color }}
                >
                  <span className="relative grid place-items-center">
                    {isFlagship && (
                      <span
                        aria-hidden="true"
                        className="absolute rounded-full border border-oxblood opacity-40"
                        style={{ width: size + 12, height: size + 12 }}
                      />
                    )}
                    <NodeIcon
                      id={node.id}
                      size={size}
                      className="[filter:drop-shadow(0_1px_8px_rgba(3,8,7,0.85))]"
                    />
                  </span>
                  {/* Short label, only shown when isolated or active. */}
                  <span
                    ref={(el) => {
                      labelEls.current[index] = el;
                    }}
                    className="whitespace-nowrap font-sans text-[11px] tracking-normal text-ink [text-shadow:0_1px_7px_rgba(3,8,7,0.95)]"
                    style={{ opacity: 0, transition: "opacity 300ms ease" }}
                  >
                    {node.node}
                  </span>
                </Link>
                </div>
              </div>
            </div>
          );
        })}

        {debug && debugSnap ? (
          <FieldDebugOverlay
            snap={debugSnap}
            onSettle={() => settleLayout(false)}
            onReseed={() => setSeed((s) => s + 101)}
          />
        ) : null}
      </div>

      {/* DOSSIER: compact anchored preview, non-interactive, no blur. */}
      {active && dossierPos && (
        <motion.aside
          role="dialog"
          aria-label={`${active.title} preview`}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "fixed", left: dossierPos.left, top: dossierPos.top, width: 300 }}
          className="pointer-events-none z-40 hidden border border-rule bg-paper-2 p-4 shadow-[0_24px_60px_rgba(4,9,8,0.55)] md:block"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink-2">
              {projectTypeLabels[active.type]} · {active.year}
            </span>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-sonar">
              {projectStatusLabels[active.status]}
            </span>
          </div>
          <div className="mt-3">
            {active.preview.posters.length > 0 ? (
              <span
                role="img"
                aria-label={`${active.title} preview`}
                className="block aspect-[16/10] w-full border border-rule bg-cover bg-center"
                style={{ backgroundImage: `url(${active.preview.posters[0]})` }}
              />
            ) : (
              <span
                aria-hidden="true"
                className="grid aspect-[16/10] w-full place-items-center border border-rule bg-paper"
                style={{ color: active.id === flagshipId ? "var(--oxblood)" : "var(--sonar)" }}
              >
                <NodeIcon id={active.id} size={30} />
              </span>
            )}
          </div>
          <h2 className="mt-3 font-serif text-[17px] leading-tight text-ink">{active.title}</h2>
          <p className="mt-1.5 font-serif text-[12.5px] leading-snug text-ink-2">{active.dek}</p>
          <div className="mt-3 flex items-center gap-1.5 border-t border-rule pt-3 text-oxblood">
            <span className="font-mono text-[11px] tracking-[0.08em]">Open project</span>
            <Icon name="arrow" size={13} />
          </div>
        </motion.aside>
      )}

      {/* PHONE LIST: stable, non-physics presentation. Real links, no moving targets. */}
      <ul className="relative z-10 m-0 mt-8 flex list-none flex-col gap-3 p-0 md:hidden">
        {nodes.map((node) => (
          <li key={node.id}>
            <Link
              href={`/projects/${node.slug}`}
              className="flex items-start gap-3 border border-rule bg-paper-2/40 px-4 py-4 transition-colors duration-200 hover:border-ink-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sonar"
            >
              <span
                className="mt-0.5 shrink-0"
                style={{ color: node.tier === "flagship" ? "var(--oxblood)" : "var(--ink-2)" }}
              >
                <NodeIcon id={node.id} size={26} />
              </span>
              <span className="min-w-0">
                <span className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-2">
                  <span>{projectTypeLabels[node.type]} · {node.year}</span>
                  <span className={node.tier === "flagship" ? "text-oxblood" : undefined}>
                    {projectStatusLabels[node.status]}
                  </span>
                </span>
                <span className="mt-2 block font-serif text-xl leading-tight text-ink">{node.node}</span>
                <span className="mt-1.5 block font-serif text-sm leading-snug text-ink-2">{node.dek}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

// ── debug overlay (?introDebug=1) ── pure function of a snapshot, no ref reads.
function FieldDebugOverlay({
  snap,
  onSettle,
  onReseed,
}: {
  snap: DebugSnap;
  onSettle: () => void;
  onReseed: () => void;
}) {
  const { w, h } = snap;
  return (
    <div className="pointer-events-none absolute inset-0 z-50">
      <svg width={w} height={h} className="absolute inset-0">
        <rect x={1} y={1} width={Math.max(0, w - 2)} height={Math.max(0, h - 2)} fill="none" stroke="#4fb3bf" strokeWidth={1} />
        {snap.exclusions.map((r, i) => (
          <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill="rgba(194,104,92,0.12)" stroke="#c2685c" strokeDasharray="4 4" />
        ))}
        {snap.anchors.map((a, i) => (
          <circle key={`a${i}`} cx={a.x} cy={a.y} r={3} fill="#f4c89a" />
        ))}
        {snap.bodies.map((b, i) => (
          <g key={`b${i}`}>
            <circle cx={b.x} cy={b.y} r={(snap.radii[i] ?? 18) + SPACING / 2} fill="none" stroke="#4fb3bf" strokeOpacity={0.5} />
            <line x1={b.x} y1={b.y} x2={b.x + b.vx} y2={b.y + b.vy} stroke="#edefea" strokeWidth={1} />
          </g>
        ))}
      </svg>
      <div className="pointer-events-auto absolute right-3 top-24 w-44 rounded border border-white/20 bg-black/70 p-2 font-mono text-[10px] text-white/90">
        <div>field {w}×{h}</div>
        <div>state: {snap.paused ? "paused" : "running"}</div>
        <div>overlaps fixed: {snap.overlaps}</div>
        <div className="mt-1 flex gap-1">
          <button type="button" className="rounded border border-white/25 px-1.5 py-0.5 hover:bg-white/15" onClick={onSettle}>settle</button>
          <button type="button" className="rounded border border-white/25 px-1.5 py-0.5 hover:bg-white/15" onClick={onReseed}>reseed</button>
        </div>
      </div>
    </div>
  );
}
