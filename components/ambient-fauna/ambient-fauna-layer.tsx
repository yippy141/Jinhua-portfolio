"use client";

import { faunaRegistry } from "./fauna-registry";
import { isRenderable } from "./fauna-types";

// A future ambient layer for the deep water. It is wired but DISABLED: with an
// empty registry (and no real assets) it renders nothing. When species with real
// body + tail SVG art are registered, each drifts slowly through its depth band
// with its taxonomy caption (common + Latin name) drawn next to it, not as
// unrelated words floating through the project field.
//
// Not mounted anywhere yet by design. Mount it inside the depths scene only once
// the registry has credible assets.
export function AmbientFaunaLayer() {
  const species = faunaRegistry.filter(isRenderable);
  if (species.length === 0) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-[5] overflow-hidden">
      {species.map((s) => (
        <figure
          key={s.id}
          className="absolute"
          style={{ opacity: s.opacity, transform: `scale(${s.scale})` }}
          data-depth-band={s.depthBand}
        >
          <svg viewBox="0 0 100 40" className="block">
            {s.bodySvg}
            {s.tailSvg}
          </svg>
          {/* Caption sits next to its animal. */}
          <figcaption className="mt-1 font-serif text-[11px] italic text-tide">
            {s.commonName} · {s.latinName}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
