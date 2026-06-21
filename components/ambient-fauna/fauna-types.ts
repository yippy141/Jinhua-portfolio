import type { ReactNode } from "react";

// Asset contract for a future AmbientFaunaLayer. The old project field drifted
// crude generated whale outlines and unrelated Latin names through the graph;
// that is intentionally gone. This is the replacement architecture: a typed
// registry of real species assets that stays disabled until genuine SVG art
// exists. No fake animals are ever rendered.

export type DepthBand = "surface" | "mid" | "deep";

// Provenance for each asset, so licensing is explicit before anything ships.
export interface FaunaAssetSource {
  license: string; // e.g. "CC-BY-4.0", "commissioned", "public-domain"
  attribution: string; // credit line to display or retain
  url?: string;
}

export interface FaunaSpecies {
  id: string;
  commonName: string; // e.g. "Blue whale"
  latinName: string; // e.g. "Balaenoptera musculus"
  // SVG <g> groups for the body and the (separately animated) tail. Null means
  // no real asset yet, in which case the species is never rendered.
  bodySvg: ReactNode | null;
  tailSvg: ReactNode | null;
  scale: number; // relative size multiplier
  depthBand: DepthBand; // which vertical band it drifts through
  speed: number; // horizontal drift speed
  opacity: number; // 0..1 silhouette opacity
  rarity: number; // 0..1, lower appears less often
  source: FaunaAssetSource;
  enabled: boolean; // master switch; false keeps a species out entirely
}

// A species is only renderable when it is enabled and has real art.
export function isRenderable(species: FaunaSpecies): boolean {
  return species.enabled && species.bodySvg !== null && species.tailSvg !== null;
}
