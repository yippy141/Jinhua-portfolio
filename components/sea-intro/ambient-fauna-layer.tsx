"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "motion/react";

import {
  hasRenderableWhaleAsset,
  NARWHAL_SESSION_PROBABILITY,
  WHALE_REGISTRY_VERSION,
  whaleRegistry,
  type DepthBand,
  type WhaleRegistryEntry,
} from "@/data/whales";

import {
  WhaleSwimmer,
  type WhaleSwimPlacement,
} from "./whale-swimmer";

const SESSION_KEY = `sea-fauna-selection-v${WHALE_REGISTRY_VERSION}`;
const MAX_VISIBLE_ANIMALS = 3;

function makeRng(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createSessionSeed(): number {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const seed = new Uint32Array(1);
    crypto.getRandomValues(seed);
    return seed[0];
  }
  return Math.floor(Math.random() * 4294967295);
}

function weightedPick(
  whales: WhaleRegistryEntry[],
  rng: () => number,
): WhaleRegistryEntry | null {
  const total = whales.reduce((sum, whale) => sum + Math.max(0.001, whale.rarity), 0);
  if (total <= 0) return null;

  let cursor = rng() * total;
  for (const whale of whales) {
    cursor -= Math.max(0.001, whale.rarity);
    if (cursor <= 0) return whale;
  }
  return whales[whales.length - 1] ?? null;
}

function readStoredSelection(renderableIds: Set<string>): string[] | null {
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const ids = parsed.filter((id): id is string => {
      return typeof id === "string" && renderableIds.has(id);
    });
    return ids.length > 0 ? ids.slice(0, MAX_VISIBLE_ANIMALS) : null;
  } catch {
    return null;
  }
}

function storeSelection(ids: string[]) {
  try {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(ids));
  } catch {
    // Storage can be unavailable in private or hardened browsing modes.
  }
}

function selectWhales(
  renderable: WhaleRegistryEntry[],
  rng: () => number,
): WhaleRegistryEntry[] {
  if (renderable.length === 0) return [];

  const selected: WhaleRegistryEntry[] = [];
  const usedBands = new Set<DepthBand>();
  const targetCount = Math.min(
    MAX_VISIBLE_ANIMALS,
    new Set(renderable.map((whale) => whale.depthBand)).size,
    1 + Math.floor(rng() * MAX_VISIBLE_ANIMALS),
  );

  const narwhals = renderable.filter((whale) => whale.id.includes("narwhal"));
  const narwhal = weightedPick(narwhals, rng);
  if (
    narwhal &&
    rng() < Math.min(NARWHAL_SESSION_PROBABILITY, Math.max(0, narwhal.rarity))
  ) {
    selected.push(narwhal);
    usedBands.add(narwhal.depthBand);
  }

  while (selected.length < targetCount) {
    const candidates = renderable.filter((whale) => {
      return !usedBands.has(whale.depthBand) && !selected.includes(whale);
    });
    const next = weightedPick(candidates, rng);
    if (!next) break;
    selected.push(next);
    usedBands.add(next.depthBand);
  }

  return selected;
}

function createPlacements(whales: WhaleRegistryEntry[]): WhaleSwimPlacement[] {
  return whales.map((whale, index) => ({
    id: whale.id,
    whale,
    delaySeconds: index * -17,
    laneOffsetPercent: index % 2 === 0 ? -2 : 2,
    direction:
      whale.direction ??
      (index % 2 === 0 ? "right-to-left" : "left-to-right"),
  }));
}

export function AmbientFaunaLayer() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const renderable = useMemo(
    () => whaleRegistry.filter(hasRenderableWhaleAsset),
    [],
  );
  const [placements, setPlacements] = useState<WhaleSwimPlacement[]>([]);
  const [paused, setPaused] = useState(
    () => typeof document !== "undefined" && document.hidden,
  );

  useEffect(() => {
    if (prefersReducedMotion || renderable.length === 0) return;

    let cancelled = false;
    const id = window.setTimeout(() => {
      const renderableById = new Map(renderable.map((whale) => [whale.id, whale]));
      const stored = readStoredSelection(new Set(renderableById.keys()));
      if (cancelled) return;

      if (stored) {
        setPlacements(
          createPlacements(
            stored
              .map((storedId) => renderableById.get(storedId))
              .filter((whale): whale is WhaleRegistryEntry => Boolean(whale)),
          ),
        );
        return;
      }

      const rng = makeRng(createSessionSeed());
      const selected = selectWhales(renderable, rng);
      storeSelection(selected.map((whale) => whale.id));
      setPlacements(createPlacements(selected));
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [prefersReducedMotion, renderable]);

  useEffect(() => {
    const update = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  if (prefersReducedMotion || placements.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      data-sea-fauna-paused={paused ? "true" : "false"}
    >
      {placements.map((placement) => (
        <WhaleSwimmer
          key={placement.id}
          placement={placement}
          paused={paused}
        />
      ))}
    </div>
  );
}
