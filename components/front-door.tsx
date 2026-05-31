"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  projects,
  projectLinks,
  projectStatusLabels,
  projectTypeLabels,
} from "@/data/projects";
import { Icon } from "@/components/icons";

// The graph reads straight from the project data. Each node is a real project
// and links to its page, so the links work even before any JavaScript loads.
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
}));

const byId: Record<string, GraphNode> = Object.fromEntries(
  nodes.map((node) => [node.id, node]),
);

const flagshipId = nodes.find((node) => node.tier === "flagship")?.id ?? nodes[0]?.id;

// Faint italic-serif species names drifting behind the graph (back register).
const taxonomy = [
  { word: "Balaenoptera musculus", top: "14%", size: 30, dur: 150 },
  { word: "Physeter macrocephalus", top: "30%", size: 22, dur: 190 },
  { word: "Megaptera novaeangliae", top: "52%", size: 26, dur: 165 },
  { word: "Orcinus orca", top: "70%", size: 20, dur: 210 },
  { word: "Monodon monoceros", top: "86%", size: 24, dur: 175 },
];

type DossierPos = { left: number; top: number };

export function FrontDoor() {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isWide, setIsWide] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dossierPos, setDossierPos] = useState<DossierPos | null>(null);

  // After mount, learn whether we are on a wide screen. Default is "not wide",
  // which keeps the server render and the no-JS view static.
  useEffect(() => {
    setMounted(true);
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsWide(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Drift + pulse only on a wide screen with motion allowed. Reduced motion or a
  // narrow screen renders the graph static (fix 4).
  const animate = mounted && isWide && !prefersReducedMotion;

  const open = useCallback((id: string, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const WIDTH = 300;
    const HEIGHT = 326;
    const GAP = 22;
    const NAV_SAFE = 104; // keep the dossier clear of the top navigation (fix 1)
    const PAD = 16;

    // Place the dossier beside the node, on whichever side has room.
    const onRightHalf = rect.left > window.innerWidth * 0.56;
    let left = onRightHalf ? rect.left - WIDTH - GAP : rect.right + GAP;
    left = Math.max(PAD, Math.min(left, window.innerWidth - WIDTH - PAD));

    let top = rect.top + rect.height / 2 - HEIGHT / 2;
    top = Math.max(NAV_SAFE, Math.min(top, window.innerHeight - HEIGHT - PAD));

    setDossierPos({ left, top });
    setActiveId(id);
  }, []);

  const close = useCallback(() => setActiveId(null), []);

  // Esc closes the dossier and drops focus off the node (fix 2).
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveId(null);
        const el = document.activeElement;
        if (el instanceof HTMLElement) el.blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const active = activeId ? byId[activeId] : null;
  // On first load no dossier is open, but the flagship and its edges stay lit.
  const litId = activeId ?? flagshipId;

  return (
    <>
      {/* GRAPH — shown from md up. Hidden on phones, which get the list below. */}
      <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden={false}>
        {/* back register: drifting species names */}
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

        {/* graph edges */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {projectLinks.map(([a, b]) => {
            const from = byId[a];
            const to = byId[b];
            if (!from || !to) return null;
            const lit = a === litId || b === litId;
            return (
              <line
                key={`${a}-${b}`}
                x1={(from.x / 100) * 1440}
                y1={(from.y / 100) * 900}
                x2={(to.x / 100) * 1440}
                y2={(to.y / 100) * 900}
                stroke={lit ? "var(--sonar)" : "var(--rule)"}
                strokeWidth={1}
                opacity={lit ? 0.5 : 0.6}
              />
            );
          })}
        </svg>

        {/* nodes */}
        {nodes.map((node, index) => (
          <GraphNodeMark
            key={node.id}
            node={node}
            index={index}
            animate={animate}
            isFlagship={node.id === flagshipId}
            isActive={activeId === node.id}
            onOpen={open}
            onClose={close}
          />
        ))}
      </div>

      {/* DOSSIER — non-interactive panel, no blur, hairline border (fix 3) */}
      {active && dossierPos && (
        <motion.aside
          role="dialog"
          aria-label={`${active.title} preview`}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "fixed", left: dossierPos.left, top: dossierPos.top, width: 300 }}
          className="pointer-events-none z-40 hidden border border-rule bg-[#060d0c] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.5)] md:block"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink-2">
              {projectTypeLabels[active.type]} · {active.year}
            </span>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-sonar">
              {projectStatusLabels[active.status]}
            </span>
          </div>

          <div className="relative mt-3 aspect-[16/10] overflow-hidden border border-rule bg-[#0a1614]">
            <span
              aria-hidden="true"
              className="absolute inset-0 [background:repeating-linear-gradient(0deg,rgba(255,255,255,0.03)_0_1px,transparent_1px_3px)]"
            />
            <span className="absolute bottom-2 left-2 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-2">
              ▶ Demo loop · {active.video ? "ready" : "placeholder"}
            </span>
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

      {/* PHONE LIST — the stacked fallback. Real links, no graph (fix 4). */}
      <ul className="relative z-10 m-0 mt-8 flex list-none flex-col gap-3 p-0 md:hidden">
        {nodes.map((node) => (
          <li key={node.id}>
            <Link
              href={`/projects/${node.slug}`}
              className="block border border-rule bg-paper-2/40 px-4 py-4 transition-colors duration-200 hover:border-ink-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sonar"
            >
              <span className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-ink-2">
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
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function GraphNodeMark({
  node,
  index,
  animate,
  isFlagship,
  isActive,
  onOpen,
  onClose,
}: {
  node: GraphNode;
  index: number;
  animate: boolean;
  isFlagship: boolean;
  isActive: boolean;
  onOpen: (id: string, element: HTMLElement) => void;
  onClose: () => void;
}) {
  const markColor = isFlagship
    ? "var(--oxblood)"
    : isActive
      ? "var(--sonar)"
      : "var(--ink-2)";
  const markBg = isFlagship
    ? "rgba(194,104,92,0.18)"
    : isActive
      ? "rgba(79,179,191,0.12)"
      : "rgba(157,176,168,0.05)";

  return (
    <div className="absolute" style={{ left: `${node.x}%`, top: `${node.y}%`, zIndex: isActive ? 7 : 4 }}>
      <div className="-translate-x-1/2 -translate-y-1/2">
        <motion.div
          initial={false}
          animate={animate ? { y: [0, -9, 0] } : { y: 0 }}
          transition={
            animate
              ? { duration: 15 + (index % 5) * 3, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0 }
          }
        >
          <Link
            href={`/projects/${node.slug}`}
            aria-label={`Open ${node.title}`}
            onMouseEnter={(event) => onOpen(node.id, event.currentTarget)}
            onMouseLeave={onClose}
            onFocus={(event) => onOpen(node.id, event.currentTarget)}
            onBlur={onClose}
            className="pointer-events-auto flex flex-col items-center gap-1.5 rounded-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-sonar"
          >
            <span
              className="relative grid place-items-center rounded-full border"
              style={{ width: node.r * 2, height: node.r * 2, borderColor: markColor, background: markBg }}
            >
              {isFlagship && animate && (
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full border border-oxblood"
                  animate={{ opacity: [0.5, 0, 0.5], scale: [1, 1.9, 1] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              {isFlagship && !animate && (
                <span
                  aria-hidden="true"
                  className="absolute -inset-1 rounded-full border border-oxblood opacity-40"
                />
              )}
            </span>
            <span
              className="whitespace-nowrap font-mono text-[11px] font-medium tracking-[0.12em] [text-shadow:0_1px_7px_rgba(3,8,7,0.95)]"
              style={{ color: markColor }}
            >
              {node.node}
            </span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
