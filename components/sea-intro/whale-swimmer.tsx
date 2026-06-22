"use client";

import type { CSSProperties } from "react";
import Image from "next/image";

import {
  hasRenderableTailAsset,
  type WhaleRegistryEntry,
} from "@/data/whales";

export type WhaleSwimPlacement = {
  id: string;
  whale: WhaleRegistryEntry;
  delaySeconds: number;
  laneOffsetPercent: number;
  direction: "left-to-right" | "right-to-left";
};

type WhaleSwimmerProps = {
  placement: WhaleSwimPlacement;
  paused: boolean;
};

const EASE = "cubic-bezier(0.45, 0, 0.2, 1)";

export function WhaleSwimmer({ placement, paused }: WhaleSwimmerProps) {
  const { whale, direction, delaySeconds, laneOffsetPercent } = placement;
  const tail = hasRenderableTailAsset(whale) ? whale.tail : undefined;
  const swimName =
    direction === "left-to-right" ? "seaFaunaSwimLtr" : "seaFaunaSwimRtl";
  const playState = paused ? "paused" : "running";

  const wrapperStyle = {
    "--fauna-y": `${whale.tuning.yPercent + laneOffsetPercent}%`,
    "--fauna-scale": whale.tuning.scale,
    "--fauna-opacity": whale.tuning.opacity,
    "--fauna-blur": `${whale.tuning.blurPx}px`,
    "--fauna-duration": `${whale.tuning.durationSeconds}s`,
    "--fauna-delay": `${delaySeconds}s`,
    "--fauna-ease": EASE,
    animationName: swimName,
    animationDuration: "var(--fauna-duration)",
    animationTimingFunction: "var(--fauna-ease)",
    animationDelay: "var(--fauna-delay)",
    animationIterationCount: "infinite",
    animationPlayState: playState,
    top: "var(--fauna-y)",
    opacity: "var(--fauna-opacity)",
    filter: `blur(var(--fauna-blur))`,
    transform: "translate3d(-22vw, 0, 0) scale(var(--fauna-scale))",
  } as CSSProperties;

  const bodyStyle = {
    animationPlayState: playState,
    animationDuration: `${Math.max(18, whale.tuning.durationSeconds * 0.28)}s`,
    "--fauna-bob": `${whale.tuning.bobPixels}px`,
  } as CSSProperties;

  const tailStyle = tail
    ? ({
        animationPlayState: playState,
        transformOrigin: `${tail.pivotXPercent}% ${tail.pivotYPercent}%`,
        "--fauna-tail-wag": `${tail.wagDegrees ?? 2.6}deg`,
      } as CSSProperties)
    : undefined;

  return (
    <figure
      aria-hidden="true"
      className="sea-fauna-swimmer absolute left-0 m-0 w-[clamp(8rem,18vw,22rem)]"
      data-depth-band={whale.depthBand}
      style={wrapperStyle}
    >
      <div
        className="sea-fauna-bob relative"
        style={bodyStyle}
      >
        <Image
          src={whale.asset.src}
          alt=""
          draggable={false}
          width={whale.asset.width}
          height={whale.asset.height}
          unoptimized
          className="block h-auto w-full select-none"
        />
        {tail ? (
          <Image
            src={tail.src}
            alt=""
            draggable={false}
            width={tail.width}
            height={tail.height}
            unoptimized
            className="sea-fauna-tail absolute inset-0 h-auto w-full select-none"
            style={tailStyle}
          />
        ) : null}
        {whale.tusk?.restrainedRainbow ? (
          <span
            aria-hidden="true"
            className="sea-fauna-tusk absolute block h-px origin-left"
            style={{
              left: `${whale.tusk.anchorXPercent}%`,
              top: `${whale.tusk.anchorYPercent}%`,
              width: `${whale.tusk.lengthPercent}%`,
              transform: `rotate(${whale.tusk.angleDegrees}deg)`,
              animationPlayState: playState,
            }}
          />
        ) : null}
      </div>
      <figcaption
        className="pointer-events-none absolute whitespace-nowrap font-serif text-[11px] italic leading-none text-ink-2/60"
        style={{
          left: `${whale.tuning.captionXPercent}%`,
          top: `${whale.tuning.captionYPercent}%`,
        }}
      >
        {whale.commonName} / <span>{whale.latinName}</span>
      </figcaption>
    </figure>
  );
}
