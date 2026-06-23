import type { FaunaSpecies } from "./fauna-types";

// The fauna registry is intentionally EMPTY. The AmbientFaunaLayer renders only
// species listed here that are enabled and carry real body + tail SVG assets.
// Until credible, anatomically honest art with clear licensing exists, nothing
// is added, and the layer renders nothing.
//
// To add a species later: provide bodySvg / tailSvg <g> groups, set enabled:true,
// fill in source (license + attribution), and pick a depthBand, scale, speed,
// opacity, and rarity. The caption (commonName + latinName) is drawn next to the
// animal by the layer, never as unrelated drifting words.
export const faunaRegistry: FaunaSpecies[] = [];
