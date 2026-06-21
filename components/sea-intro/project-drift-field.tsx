"use client";

import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

import {
  projects,
  projectStatusLabels,
  projectTypeLabels,
} from "@/data/projects";
import { NodeIcon } from "@/components/node-icons";

import { ProjectDriftNode } from "./project-drift-node";
import { ProjectFieldDebug } from "./project-field-debug";
import { ProjectPreview } from "./project-preview";
import {
  iconSizeForTier,
  useProjectFieldPhysics,
} from "./use-project-field-physics";

// The project field: deterministic, measured, non-overlapping layout with
// tethered-spring drift (physics in use-project-field-physics), drifting symbols
// (project-drift-node), a hover/focus dossier (project-preview), and a stable
// list on phones. Replaces FrontDoor.

const nodes = [...projects];
const flagshipId = nodes.find((n) => n.tier === "flagship")?.id ?? nodes[0]?.id;

type DossierPos = { left: number; top: number };

export function ProjectDriftField() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const {
    fieldRef,
    settled,
    debug,
    debugSnap,
    nodeRef,
    labelRef,
    setFrozen,
    settleNow,
    reseed,
  } = useProjectFieldPhysics();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [dossierPos, setDossierPos] = useState<DossierPos | null>(null);

  const open = useCallback(
    (id: string, element: HTMLElement) => {
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
      setFrozen(id);
    },
    [setFrozen],
  );

  const close = useCallback(() => {
    setActiveId(null);
    setFrozen(null);
  }, [setFrozen]);

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
        {nodes.map((node, index) => (
          <ProjectDriftNode
            key={node.id}
            node={node}
            isFlagship={node.id === flagshipId}
            isActive={activeId === node.id}
            size={iconSizeForTier(node.tier)}
            revealDelay={120 + index * 70}
            settled={settled}
            nodeRef={nodeRef(index)}
            labelRef={labelRef(index)}
            onOpen={open}
            onClose={close}
          />
        ))}

        {debug && debugSnap ? (
          <ProjectFieldDebug snap={debugSnap} onSettle={settleNow} onReseed={reseed} />
        ) : null}
      </div>

      {/* DOSSIER: compact anchored preview. */}
      {active && dossierPos ? (
        <ProjectPreview
          project={active}
          flagship={active.id === flagshipId}
          pos={dossierPos}
          reducedMotion={prefersReducedMotion}
        />
      ) : null}

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
                <span className="flex items-center justify-between gap-3 font-sans text-[12px] text-ink-2">
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
