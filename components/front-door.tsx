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

// Each node is a real project and links to its page, so the links work even
// before any JavaScript loads (and the phone list below is always rendered).
type GraphNode = {
  id: string;
  slug: string;
  node: string;
  title: string;
  dek: string;
  type: (typeof projects)[number]["type"];
  status: (typeof projects)[number]["status"];
  year: string;
  tier: (typeof projects)[number]["tier"];
  x: number;
  y: number;
  r: number;
  video: string | null;
  posters: readonly string[];
};

const nodes: GraphNode[] = projects.map((project) => ({
  id: project.id,
  slug: project.slug,
  node: project.node,
  title: project.title,
  dek: project.dek,
  type: project.type,
  status: project.status,
  year: project.year,
  tier: project.tier,
  x: project.x,
  y: project.y,
  r: project.r,
  video: project.video,
  posters: project.preview.posters,
}));

const flagshipId = nodes.find((node) => node.tier === "flagship")?.id ?? nodes[0]?.id;

// Regions the drifting nodes keep clear of, as fractions of the field. The hero
// sits bottom-LEFT, so that quadrant is reserved for it.
const ZONE = {
  headerBottom: 0.13,
  footerTop: 0.9,
  heroRight: 0.48,
  heroTop: 0.52,
};
const EDGE_X = 76; // horizontal breathing room (icon + label width)
const EDGE_Y = 34;

// Faint species names drifting behind the nodes (the back register the
// constitution calls for: italic serif, distinct from the mono node labels).
const taxonomy = [
  { word: "Balaenoptera musculus", top: "16%", size: 30, dur: 165 },
  { word: "Physeter macrocephalus", top: "34%", size: 22, dur: 205 },
  { word: "Megaptera novaeangliae", top: "54%", size: 26, dur: 180 },
  { word: "Orcinus orca", top: "72%", size: 20, dur: 225 },
  { word: "Monodon monoceros", top: "87%", size: 23, dur: 195 },
];

function iconSize(r: number) {
  return Math.round(Math.max(22, r * 2.2));
}

type Body = { x: number; y: number; vx: number; vy: number };
type DossierPos = { left: number; top: number };

export function FrontDoor() {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isWide, setIsWide] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dossierPos, setDossierPos] = useState<DossierPos | null>(null);

  const fieldRef = useRef<HTMLDivElement>(null);
  const nodeEls = useRef<(HTMLDivElement | null)[]>([]);
  const bodies = useRef<Body[]>([]);
  const activeRef = useRef<string | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    setMounted(true);
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsWide(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Drift only on a wide screen with motion allowed. Reduced motion or a narrow
  // screen renders the nodes static; phones get the list instead.
  const animate = mounted && isWide && !prefersReducedMotion;

  // Keep a point inside the allowed water (clear of header, footer, hero box).
  const contain = useCallback(
    (x: number, y: number, w: number, h: number) => {
      const minX = EDGE_X;
      const maxX = w - EDGE_X;
      const minY = ZONE.headerBottom * h + EDGE_Y;
      const maxY = ZONE.footerTop * h - EDGE_Y;
      let cx = Math.min(Math.max(x, minX), maxX);
      let cy = Math.min(Math.max(y, minY), maxY);
      const heroRight = ZONE.heroRight * w + EDGE_X;
      const heroTop = ZONE.heroTop * h - EDGE_Y;
      if (cx < heroRight && cy > heroTop) {
        // Push out the nearer way: up over the hero, or right past it.
        if (heroRight - cx < cy - heroTop) cx = heroRight;
        else cy = heroTop;
      }
      return { x: cx, y: cy };
    },
    [],
  );

  const writeTransforms = useCallback((w: number, h: number) => {
    nodes.forEach((node, index) => {
      const element = nodeEls.current[index];
      const body = bodies.current[index];
      if (!element || !body) return;
      const baseX = (node.x / 100) * w;
      const baseY = (node.y / 100) * h;
      element.style.transform = `translate(${body.x - baseX}px, ${body.y - baseY}px)`;
    });
  }, []);

  const layout = useCallback(() => {
    const field = fieldRef.current;
    if (!field) return;
    const w = field.clientWidth;
    const h = field.clientHeight;
    bodies.current = nodes.map((node, index) => {
      const placed = contain((node.x / 100) * w, (node.y / 100) * h, w, h);
      const previous = bodies.current[index];
      const speed = 11 + (index % 4) * 3; // px per second, slow and tidal
      const angle = (index / nodes.length) * Math.PI * 2 + 0.6;
      return {
        x: placed.x,
        y: placed.y,
        vx: previous?.vx ?? Math.cos(angle) * speed,
        vy: previous?.vy ?? Math.sin(angle) * speed,
      };
    });
    writeTransforms(w, h);
  }, [contain, writeTransforms]);

  // One integration step: move, then reflect off the walls and the hero box.
  const step = useCallback((dt: number, w: number, h: number) => {
    const minX = EDGE_X;
    const maxX = w - EDGE_X;
    const minY = ZONE.headerBottom * h + EDGE_Y;
    const maxY = ZONE.footerTop * h - EDGE_Y;
    const heroRight = ZONE.heroRight * w + EDGE_X;
    const heroTop = ZONE.heroTop * h - EDGE_Y;

    for (const body of bodies.current) {
      body.x += body.vx * dt;
      body.y += body.vy * dt;

      if (body.x < minX) {
        body.x = minX;
        body.vx = Math.abs(body.vx);
      } else if (body.x > maxX) {
        body.x = maxX;
        body.vx = -Math.abs(body.vx);
      }
      if (body.y < minY) {
        body.y = minY;
        body.vy = Math.abs(body.vy);
      } else if (body.y > maxY) {
        body.y = maxY;
        body.vy = -Math.abs(body.vy);
      }
      // Hero box (bottom-left): only reachable from its top or right edge.
      if (body.x < heroRight && body.y > heroTop) {
        if (heroRight - body.x < body.y - heroTop) {
          body.x = heroRight;
          body.vx = Math.abs(body.vx);
        } else {
          body.y = heroTop;
          body.vy = -Math.abs(body.vy);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted || !isWide) return;

    if (!animate) {
      // Reduced motion: lay the nodes out once, no loop.
      layout();
      const onResize = () => layout();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    layout();
    const field = fieldRef.current;
    if (!field) return;

    let last = performance.now();
    const onVisibility = () => {
      if (!document.hidden) last = performance.now(); // resume without a jump
    };
    const onResize = () => layout();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    const loop = (now: number) => {
      rafRef.current = requestAnimationFrame(loop);
      let dt = (now - last) / 1000;
      last = now;
      if (document.hidden) return; // paused while the tab is hidden
      if (dt > 0.05) dt = 0.05;
      if (activeRef.current !== null) return; // frozen while a dossier is open
      const w = field.clientWidth;
      const h = field.clientHeight;
      step(dt, w, h);
      writeTransforms(w, h);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [mounted, isWide, animate, layout, step, writeTransforms]);

  const open = useCallback((id: string, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const WIDTH = 300;
    const HEIGHT = 344;
    const GAP = 22;
    const NAV_SAFE = 104; // keep the dossier clear of the top navigation
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
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        const el = document.activeElement;
        if (el instanceof HTMLElement) el.blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const active = activeId ? nodes.find((node) => node.id === activeId) : null;

  return (
    <>
      {/* DRIFTING FIELD: md up. No connecting lines; nodes float freely. */}
      <div ref={fieldRef} className="pointer-events-none absolute inset-0 hidden md:block">
        {/* Back register: faint species names drifting through the deep. */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          {taxonomy.map((entry) => (
            <motion.span
              key={entry.word}
              className="absolute whitespace-nowrap font-serif italic text-tide"
              style={{ top: entry.top, left: "-30%", fontSize: entry.size, opacity: 0.08 }}
              initial={false}
              animate={animate ? { x: ["0%", "520%"] } : { x: "180%" }}
              transition={
                animate
                  ? { duration: entry.dur, repeat: Infinity, ease: "linear" }
                  : { duration: 0 }
              }
            >
              {entry.word}
            </motion.span>
          ))}
        </div>

        {nodes.map((node, index) => {
          const isFlagship = node.id === flagshipId;
          const isActive = activeId === node.id;
          const color = isFlagship
            ? "var(--oxblood)"
            : isActive
              ? "var(--sonar)"
              : "var(--ink-2)";
          const size = iconSize(node.r);
          return (
            <div
              key={node.id}
              ref={(element) => {
                nodeEls.current[index] = element;
              }}
              className="absolute will-change-transform"
              style={{ left: `${node.x}%`, top: `${node.y}%`, zIndex: isActive ? 7 : 4 }}
            >
              <div className="-translate-x-1/2 -translate-y-1/2">
                <Link
                  href={`/projects/${node.slug}`}
                  aria-label={`Open ${node.title}`}
                  onMouseEnter={(event) => open(node.id, event.currentTarget)}
                  onMouseLeave={close}
                  onFocus={(event) => open(node.id, event.currentTarget)}
                  onBlur={close}
                  className="pointer-events-auto flex flex-col items-center gap-2 rounded-[4px] p-1 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-sonar"
                  style={{ color }}
                >
                  <span className="relative grid place-items-center">
                    {isFlagship && animate && (
                      <motion.span
                        aria-hidden="true"
                        className="absolute rounded-full border border-oxblood"
                        style={{ width: size + 14, height: size + 14 }}
                        animate={{ opacity: [0.45, 0, 0.45], scale: [1, 1.5, 1] }}
                        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                      />
                    )}
                    {isFlagship && !animate && (
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
                  <span className="whitespace-nowrap font-mono text-[11px] font-medium tracking-[0.12em] [text-shadow:0_1px_7px_rgba(3,8,7,0.95)]">
                    {node.node}
                  </span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* DOSSIER: non-interactive panel, no blur, hairline border. */}
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

          {/* Decision: no "placeholder" labels. A real looping preview where one
              exists (IR Worldview), a static poster frame where we have art,
              otherwise a clean icon panel. */}
          <div className="mt-3">
            {active.video && !prefersReducedMotion ? (
              <video
                src={active.video}
                poster={active.posters[0]}
                muted
                loop
                autoPlay
                playsInline
                aria-hidden="true"
                className="block aspect-[16/10] w-full border border-rule object-cover"
              />
            ) : active.posters.length > 0 ? (
              <span
                role="img"
                aria-label={`${active.title} preview`}
                className="block aspect-[16/10] w-full border border-rule bg-cover bg-center"
                style={{ backgroundImage: `url(${active.posters[0]})` }}
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

          <h2 className="mt-3 font-serif text-[17px] leading-tight text-ink">
            {active.title}
          </h2>
          <p className="mt-1.5 font-serif text-[12.5px] leading-snug text-ink-2">
            {active.dek}
          </p>
          <div className="mt-3 flex items-center gap-1.5 border-t border-rule pt-3 text-oxblood">
            <span className="font-mono text-[11px] tracking-[0.08em]">Open project</span>
            <Icon name="arrow" size={13} />
          </div>
        </motion.aside>
      )}

      {/* PHONE LIST: the stacked fallback. Real links, no graph. */}
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
                  <span>
                    {projectTypeLabels[node.type]} · {node.year}
                  </span>
                  <span className={node.tier === "flagship" ? "text-oxblood" : undefined}>
                    {projectStatusLabels[node.status]}
                  </span>
                </span>
                <span className="mt-2 block font-serif text-xl leading-tight text-ink">
                  {node.node}
                </span>
                <span className="mt-1.5 block font-serif text-sm leading-snug text-ink-2">
                  {node.dek}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
