"use client";

import { SPACING } from "./use-project-field-physics";
import type { DebugSnap } from "./use-project-field-physics";

// Field debug overlay (?introDebug=1). Pure function of a snapshot: shows the
// measured field bounds, exclusion rectangles, anchors, collision radii, live
// node positions and velocity vectors, plus settle / reseed actions.
export function ProjectFieldDebug({
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
        <rect
          x={1}
          y={1}
          width={Math.max(0, w - 2)}
          height={Math.max(0, h - 2)}
          fill="none"
          stroke="#4fb3bf"
          strokeWidth={1}
        />
        {snap.exclusions.map((r, i) => (
          <rect
            key={i}
            x={r.x}
            y={r.y}
            width={r.w}
            height={r.h}
            fill="rgba(194,104,92,0.12)"
            stroke="#c2685c"
            strokeDasharray="4 4"
          />
        ))}
        {snap.anchors.map((a, i) => (
          <circle key={`a${i}`} cx={a.x} cy={a.y} r={3} fill="#f4c89a" />
        ))}
        {snap.bodies.map((b, i) => (
          <g key={`b${i}`}>
            <circle
              cx={b.x}
              cy={b.y}
              r={(snap.radii[i] ?? 18) + SPACING / 2}
              fill="none"
              stroke="#4fb3bf"
              strokeOpacity={0.5}
            />
            <line
              x1={b.x}
              y1={b.y}
              x2={b.x + b.vx}
              y2={b.y + b.vy}
              stroke="#edefea"
              strokeWidth={1}
            />
          </g>
        ))}
      </svg>
      <div className="pointer-events-auto absolute right-3 top-24 w-44 rounded border border-white/20 bg-black/70 p-2 font-data text-[10px] text-white/90">
        <div>
          field {w}×{h}
        </div>
        <div>state: {snap.paused ? "paused" : "running"}</div>
        <div>overlaps fixed: {snap.overlaps}</div>
        <div className="mt-1 flex gap-1">
          <button
            type="button"
            className="rounded border border-white/25 px-1.5 py-0.5 hover:bg-white/15"
            onClick={onSettle}
          >
            settle
          </button>
          <button
            type="button"
            className="rounded border border-white/25 px-1.5 py-0.5 hover:bg-white/15"
            onClick={onReseed}
          >
            reseed
          </button>
        </div>
      </div>
    </div>
  );
}
