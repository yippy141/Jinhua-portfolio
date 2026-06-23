"use client";

import Link from "next/link";

import { NodeIcon } from "@/components/node-icons";
import type { projects } from "@/data/projects";

type FieldNode = (typeof projects)[number];

// A single drifting project symbol. Collapsed it shows only the icon; a short
// label appears (driven by the physics hook) only when the node is comfortably
// isolated or focused. The outer div is positioned by the physics writeTransforms
// via `nodeRef`; the inner div plays the staggered depth entrance.
type ProjectDriftNodeProps = {
  node: FieldNode;
  isFlagship: boolean;
  isActive: boolean;
  size: number;
  revealDelay: number;
  settled: boolean;
  nodeRef: (el: HTMLDivElement | null) => void;
  labelRef: (el: HTMLSpanElement | null) => void;
  onOpen: (id: string, el: HTMLElement) => void;
  onClose: () => void;
};

export function ProjectDriftNode({
  node,
  isFlagship,
  isActive,
  size,
  revealDelay,
  settled,
  nodeRef,
  labelRef,
  onOpen,
  onClose,
}: ProjectDriftNodeProps) {
  const color = isFlagship
    ? "var(--oxblood)"
    : isActive
      ? "var(--sonar)"
      : "var(--ink-2)";

  return (
    <div
      ref={nodeRef}
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
                  filter: "blur(7px)",
                }
          }
        >
          <Link
            href={`/projects/${node.slug}`}
            aria-label={`Open ${node.title}`}
            onMouseEnter={(e) => onOpen(node.id, e.currentTarget)}
            onMouseLeave={onClose}
            onFocus={(e) => onOpen(node.id, e.currentTarget)}
            onBlur={onClose}
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
            <span
              ref={labelRef}
              className="whitespace-nowrap font-sans text-[12px] text-ink [text-shadow:0_1px_7px_rgba(3,8,7,0.95)]"
              style={{ opacity: 0, transition: "opacity 300ms ease" }}
            >
              {node.node}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
