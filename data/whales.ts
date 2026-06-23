export type DepthBand = "shallow" | "mid" | "deep";

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
};

export type WhaleTailFragment = {
  src: `/whales/${string}.svg`;
  width: number;
  height: number;
  pivotXPercent: number;
  pivotYPercent: number;
  wagDegrees?: number;
  verified: boolean;
};

export type WhaleTuskFragment = {
  anchorXPercent: number;
  anchorYPercent: number;
  lengthPercent: number;
  angleDegrees: number;
  restrainedRainbow: boolean;
};

export type WhaleDepthTuning = {
  band: DepthBand;
  yPercent: number;
  scale: number;
  opacity: number;
  blurPx: number;
  durationSeconds: number;
  bobPixels: number;
  captionXPercent: number;
  captionYPercent: number;
};

export type WhaleRegistryEntry = {
  id: string;
  commonName: string;
  latinName: string;
  depthBand: DepthBand;
  asset: WhaleSvgAsset;
  tail?: WhaleTailFragment;
  tusk?: WhaleTuskFragment;
  direction?: "left-to-right" | "right-to-left";
  rarity: number;
  enabled: boolean;
  tuning: WhaleDepthTuning;
};

export const WHALE_REGISTRY_VERSION = 1;
export const NARWHAL_SESSION_PROBABILITY = 0.06;

export const whaleRegistry: WhaleRegistryEntry[] = [
  {
    id: "blue-whale",
    commonName: "Blue whale",
    latinName: "Balaenoptera musculus",
    depthBand: "deep",
    asset: {
      src: "/whales/blue-whale.svg",
      width: 550,
      height: 550,
      source: {
        license: "Unknown",
        attribution: "SVG Repo",
        url: "https://www.svgrepo.com/",
      },
      verified: true,
    },
    direction: "left-to-right",
    rarity: 1,
    enabled: true,
    tuning: {
      band: "deep",
      yPercent: 80,
      scale: 0.38,
      opacity: 0.12,
      blurPx: 1.4,
      durationSeconds: 96,
      bobPixels: 2.5,
      captionXPercent: 52,
      captionYPercent: 64,
    },
  },
];

function isWhaleSvgPath(src: string): src is `/whales/${string}.svg` {
  return src.startsWith("/whales/") && src.endsWith(".svg");
}

export function hasRenderableWhaleAsset(whale: WhaleRegistryEntry): boolean {
  return whale.enabled && whale.asset.verified && isWhaleSvgPath(whale.asset.src);
}

export function hasRenderableTailAsset(whale: WhaleRegistryEntry): boolean {
  return Boolean(
    whale.tail?.verified &&
      isWhaleSvgPath(whale.tail.src) &&
      whale.tail.width > 0 &&
      whale.tail.height > 0,
  );
}
