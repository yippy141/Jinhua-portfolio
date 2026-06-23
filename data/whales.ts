export type DepthBand = "shallow" | "mid" | "deep";

export type WhaleSpeciesKind =
  | "blue-whale"
  | "sperm-whale"
  | "humpback"
  | "gray-whale"
  | "orca"
  | "beluga"
  | "narwhal"
  | "dolphin";

export type WhaleAssetStructure = "static" | "articulated";

export type WhaleAssetSource = {
  license: string;
  attribution: string;
  url?: string;
};

export type WhaleSvgAsset = {
  src: `/whales/${string}.svg`;
  width: number;
  height: number;
  source: WhaleAssetSource;
  verified: boolean;
  structure: WhaleAssetStructure;
};

export type WhaleTailFragment = {
  bodyGroupId?: string;
  tailGroupId: string;
  pivotXPercent: number;
  pivotYPercent: number;
  wagDegrees?: number;
  wagDurationSeconds?: number;
  verified: boolean;
};

export type WhaleTuskFragment = {
  anchorXPercent: number;
  anchorYPercent: number;
  lengthPercent: number;
  angleDegrees: number;
  restrainedRainbow: boolean;
};

export type WhaleDepthModifier = {
  scale: number;
  opacityRange: readonly [number, number];
  blurRangePx: readonly [number, number];
};

export type WhaleDepthTuning = {
  band: DepthBand;
  yPercent: number;
  yJitterPercent: number;
  scale: number;
  durationSeconds: number;
  durationJitterSeconds: number;
  bobPixels: number;
  bobJitterPixels: number;
  pitchDegrees: number;
  pitchDurationSeconds: number;
  pitchJitterSeconds: number;
  captionXPercent: number;
  captionYPercent: number;
};

export type WhaleRegistryEntry = {
  id: string;
  commonName: string;
  latinName: string;
  species: WhaleSpeciesKind;
  depthBand: DepthBand;
  asset: WhaleSvgAsset;
  tail?: WhaleTailFragment;
  tusk?: WhaleTuskFragment;
  direction?: "left-to-right" | "right-to-left";
  rarity: number;
  enabled: boolean;
  tuning: WhaleDepthTuning;
};

export const WHALE_REGISTRY_VERSION = 2;
export const NARWHAL_SESSION_PROBABILITY = 0.06;

export const WHALE_SPECIES_SCALE: Record<WhaleSpeciesKind, number> = {
  "blue-whale": 1.45,
  "sperm-whale": 1.25,
  humpback: 1.15,
  "gray-whale": 1.05,
  orca: 0.8,
  beluga: 0.65,
  narwhal: 0.65,
  dolphin: 0.38,
};

export const WHALE_DEPTH_MODIFIERS: Record<DepthBand, WhaleDepthModifier> = {
  shallow: {
    scale: 1.05,
    opacityRange: [0.18, 0.26],
    blurRangePx: [0, 0.5],
  },
  mid: {
    scale: 0.85,
    opacityRange: [0.1, 0.18],
    blurRangePx: [0.5, 1],
  },
  deep: {
    scale: 0.65,
    opacityRange: [0.06, 0.12],
    blurRangePx: [1, 2],
  },
};

export const whaleRegistry: WhaleRegistryEntry[] = [];

function isWhaleSvgPath(src: string): src is `/whales/${string}.svg` {
  return src.startsWith("/whales/") && src.endsWith(".svg");
}

export function hasRenderableWhaleAsset(whale: WhaleRegistryEntry): boolean {
  return whale.enabled && whale.asset.verified && isWhaleSvgPath(whale.asset.src);
}

export function hasRenderableTailAsset(whale: WhaleRegistryEntry): boolean {
  return Boolean(
    whale.asset.structure === "articulated" &&
      whale.tail?.verified &&
      whale.tail.tailGroupId.trim().length > 0,
  );
}

export function isArticulatedWhaleAsset(whale: WhaleRegistryEntry): boolean {
  return whale.asset.structure === "articulated" && hasRenderableTailAsset(whale);
}
