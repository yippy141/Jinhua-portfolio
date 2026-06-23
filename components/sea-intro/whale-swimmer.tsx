"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";

import {
  hasRenderableTailAsset,
  type WhaleRegistryEntry,
} from "@/data/whales";

export type WhaleSwimPlacement = {
  id: string;
  whale: WhaleRegistryEntry;
  delaySeconds: number;
  yPercent: number;
  scale: number;
  opacity: number;
  blurPx: number;
  durationSeconds: number;
  bobPixels: number;
  bobDurationSeconds: number;
  pitchDegrees: number;
  pitchDurationSeconds: number;
  direction: "left-to-right" | "right-to-left";
};

type WhaleSwimmerProps = {
  placement: WhaleSwimPlacement;
  paused: boolean;
};

const SILHOUETTE_CLASS = "brightness-0 invert";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function annotateGroup(svg: string, groupId: string, attr: string) {
  const escaped = escapeRegExp(groupId);
  const groupPattern = new RegExp(
    `(<g\\b(?=[^>]*\\bid=["']${escaped}["'])[^>]*)(>)`,
    "i",
  );
  return svg.replace(groupPattern, `$1 ${attr}="true"$2`);
}

function sanitizeSvgMarkup(raw: string, tailGroupId?: string) {
  const withoutUnsafeBlocks = raw
    .replace(/<\?xml[\s\S]*?\?>/gi, "")
    .replace(/<!doctype[\s\S]*?>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*')/gi, "");

  const match = withoutUnsafeBlocks.match(/<svg[\s\S]*<\/svg>/i);
  if (!match) return null;

  const svg = match[0]
    .replace(/\s(width|height)\s*=\s*(?:"[^"]*"|'[^']*')/gi, "")
    .replace(/<svg\b/i, '<svg aria-hidden="true" focusable="false"');

  return tailGroupId
    ? annotateGroup(svg, tailGroupId, "data-sea-fauna-tail")
    : svg;
}

export function WhaleSwimmer({ placement, paused }: WhaleSwimmerProps) {
  const { whale, direction, delaySeconds } = placement;
  const tail = hasRenderableTailAsset(whale) ? whale.tail : undefined;
  const shouldInlineSvg = whale.asset.structure === "articulated";
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);
  const swimName =
    direction === "left-to-right" ? "seaFaunaSwimLtr" : "seaFaunaSwimRtl";
  const playState = paused ? "paused" : "running";

  useEffect(() => {
    if (!shouldInlineSvg) return;

    let cancelled = false;
    fetch(whale.asset.src)
      .then((response) => (response.ok ? response.text() : null))
      .then((raw) => {
        if (cancelled || !raw) return;
        setSvgMarkup(sanitizeSvgMarkup(raw, tail?.tailGroupId) ?? null);
      })
      .catch(() => {
        if (!cancelled) setSvgMarkup(null);
      });

    return () => {
      cancelled = true;
    };
  }, [shouldInlineSvg, tail?.tailGroupId, whale.asset.src]);

  const wrapperStyle = {
    "--fauna-y": `${placement.yPercent}%`,
    "--fauna-scale": placement.scale,
    "--fauna-opacity": placement.opacity,
    "--fauna-blur": `${placement.blurPx}px`,
    "--fauna-duration": `${placement.durationSeconds}s`,
    "--fauna-delay": `${delaySeconds}s`,
    animationName: swimName,
    animationDuration: "var(--fauna-duration)",
    animationTimingFunction: "linear",
    animationDelay: "var(--fauna-delay)",
    animationIterationCount: "infinite",
    animationPlayState: playState,
    top: "var(--fauna-y)",
    opacity: "var(--fauna-opacity)",
    filter: `blur(var(--fauna-blur))`,
    transform: "translate3d(-22vw, 0, 0) scale(var(--fauna-scale))",
  } as CSSProperties;

  const pitchStyle = {
    animationPlayState: playState,
    animationDuration: `${placement.pitchDurationSeconds}s`,
    "--fauna-pitch": `${placement.pitchDegrees}deg`,
  } as CSSProperties;

  const bobStyle = {
    animationPlayState: playState,
    animationDuration: `${placement.bobDurationSeconds}s`,
    "--fauna-bob": `${placement.bobPixels}px`,
  } as CSSProperties;

  const mediaStyle = tail
    ? ({
        animationPlayState: playState,
        "--fauna-tail-origin": `${tail.pivotXPercent}% ${tail.pivotYPercent}%`,
        "--fauna-tail-wag": `${tail.wagDegrees ?? 2.6}deg`,
        "--fauna-tail-duration": `${tail.wagDurationSeconds ?? 3.8}s`,
      } as CSSProperties)
    : undefined;

  return (
    <figure
      aria-hidden="true"
      className="sea-fauna-swimmer pointer-events-none absolute left-0 m-0 w-[clamp(8rem,18vw,22rem)]"
      data-depth-band={whale.depthBand}
      style={wrapperStyle}
    >
      <div
        className="sea-fauna-pitch relative"
        style={pitchStyle}
      >
        <div
          className="sea-fauna-bob relative"
          style={bobStyle}
        >
          <div className="sea-fauna-media relative" style={mediaStyle}>
            {shouldInlineSvg && svgMarkup ? (
              <span
                aria-hidden="true"
                className="sea-fauna-svg block select-none"
                dangerouslySetInnerHTML={{ __html: svgMarkup }}
              />
            ) : (
              <Image
                src={whale.asset.src}
                alt=""
                draggable={false}
                width={whale.asset.width}
                height={whale.asset.height}
                unoptimized
                className={`block h-auto w-full select-none ${SILHOUETTE_CLASS}`}
              />
            )}
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
        </div>
      </div>
      <figcaption
        className="pointer-events-none absolute hidden whitespace-nowrap font-serif text-[11px] italic leading-none text-ink-2/55 sm:block"
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
