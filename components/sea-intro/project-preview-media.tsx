"use client";

import { memo, useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

import { NodeIcon } from "@/components/node-icons";
import type { ProjectPreview } from "@/data/projects";

// One place that decides how a project's preview renders, so the homepage
// dossier and the project page agree and the IR Worldview video actually plays.
//
// - video previews render a real <video> (muted, loop, playsInline) with the
//   poster visible before playback; play() is called when the preview is active
//   and paused when it is not, with rejected play promises swallowed.
// - reduced motion shows the poster instead of the video.
// - image previews show the poster.
// - empty previews show the project symbol, with no fake placeholder label.
//
// The component is memoised and keeps a stable element identity, so it is not
// remounted when the parent re-renders on a physics frame; only the `active`
// prop toggles playback.

type ProjectPreviewMediaProps = {
  preview: ProjectPreview;
  projectId: string;
  title: string;
  // True while this preview is the focused one (hover/focus dossier open, or the
  // primary preview on a project page). Drives play/pause.
  active: boolean;
  // Optional: when omitted the component reads prefers-reduced-motion itself, so
  // it works in server-rendered contexts (the project page) too.
  reducedMotion?: boolean;
  flagship?: boolean;
  className?: string;
};

function ProjectPreviewMediaImpl({
  preview,
  projectId,
  title,
  active,
  reducedMotion,
  flagship = false,
  className = "aspect-[16/10] w-full",
}: ProjectPreviewMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const systemReducedMotion = useReducedMotion() ?? false;
  const reduced = reducedMotion ?? systemReducedMotion;
  const videoSrc = preview.kind === "video" ? preview.video ?? null : null;
  const poster = preview.posters[0];

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (active) {
      const p = el.play();
      // Browsers reject play() if not yet allowed; ignore rather than throw.
      if (p && typeof p.catch === "function") p.catch(() => {});
    } else {
      el.pause();
    }
  }, [active]);

  if (videoSrc && !reduced) {
    return (
      <video
        ref={videoRef}
        src={videoSrc}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={`${title} preview`}
        className={`block border border-rule object-cover ${className}`}
      />
    );
  }

  if (poster) {
    // Background image rather than an image element, to match the rest of the
    // site and avoid the LCP cost; these posters are decorative previews.
    return (
      <span
        role="img"
        aria-label={`${title} preview`}
        className={`block border border-rule bg-cover bg-center ${className}`}
        style={{ backgroundImage: `url(${poster})` }}
      />
    );
  }

  // No media: show the project's own symbol, never a fake "placeholder" label.
  return (
    <span
      aria-hidden="true"
      className={`grid place-items-center border border-rule bg-paper-2 ${className}`}
      style={{ color: flagship ? "var(--oxblood)" : "var(--sonar)" }}
    >
      <NodeIcon id={projectId} size={34} />
    </span>
  );
}

export const ProjectPreviewMedia = memo(ProjectPreviewMediaImpl);
