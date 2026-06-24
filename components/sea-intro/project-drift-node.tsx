"use client";

import { useTranslations } from "next-intl";

import { NodeIcon } from "@/components/node-icons";
import type { LocalizedProject } from "@/data/i18n";
import { Link } from "@/i18n/navigation";

// A single drifting project symbol. Collapsed it shows only the icon; a short
// label appears (driven by the physics hook) only when the node is comfortably
// isolated or focused. The outer div is positioned by the physics writeTransforms
// via `nodeRef`; the inner div plays the staggered depth entrance.
type ProjectDriftNodeProps = {
  node: LocalizedProject;
  isFlagship: boolean;
  isActive: boolean;
  size: number;
  revealDelay: number;
  settled: boolean;
  fallbackVisible: boolean;
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
  fallbackVisible,
  nodeRef,
  labelRef,
  onOpen,
  onClose,
}: ProjectDriftNodeProps) {
  const t = useTranslations("projects");
  const color = isFlagship
    ? "var(--oxblood)"
    : isActive
      ? "var(--sonar)"
      : "var(--ink-2)";
  const visible = settled || fallbackVisible;
  const fallbackPosition = !settled ? node.homeNode.coordinates : null;

  return (
    <div
      ref={nodeRef}
      className="absolute left-0 top-0 will-change-transform"
      style={{
        zIndex: isActive ? 7 : 4,
        ...(fallbackPosition
          ? { left: fallbackPosition.left, top: fallbackPosition.top }
          : {}),
      }}
    >
      <div className="-translate-x-1/2 -translate-y-1/2">
        <div
          style={
            visible
              ? {
                  opacity: 1,
                  transform: "none",
                  filter: "none",
                  transition: settled
                    ? `opacity 620ms cubic-bezier(0.22,1,0.36,1) ${revealDelay}ms, transform 620ms cubic-bezier(0.22,1,0.36,1) ${revealDelay}ms, filter 620ms ease ${revealDelay}ms`
                    : "opacity 360ms cubic-bezier(0.22,1,0.36,1), transform 360ms cubic-bezier(0.22,1,0.36,1), filter 360ms ease",
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
            aria-label={`${t("openProject")}: ${node.title}`}
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
              style={{
                opacity: fallbackVisible && !settled ? 1 : 0,
                transition: "opacity 300ms ease",
              }}
            >
              {node.node}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
