import type { ReactNode } from "react";

// Per-project node art for the "sea of consciousness" homepage.
//
// These are PLACEHOLDERS in the same 24x24, currentColor, line-art style as
// components/icons.tsx. To use your own art later, replace the paths for a
// project id below (or swap the whole <svg> for an <img src="/node-icons/..svg">
// inside NodeIcon). The key is the project id from data/projects.ts.
const NODE_PATHS: Record<string, ReactNode> = {
  // IR Worldview: a globe
  irwv: (
    <>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M3.75 12h16.5" />
      <path d="M12 3.75c2.4 2.2 2.4 14.3 0 16.5" />
      <path d="M12 3.75c-2.4 2.2-2.4 14.3 0 16.5" />
      <path d="M5 7c2.1 1.3 11.9 1.3 14 0" />
      <path d="M5 17c2.1-1.3 11.9-1.3 14 0" />
    </>
  ),
  // AI Safety Atlas: a shield with a check
  aisa: (
    <>
      <path d="M12 3.5l7 2.4v4.8c0 4.4-3 7.5-7 8.8-4-1.3-7-4.4-7-8.8V5.9L12 3.5Z" />
      <path d="M8.8 12l2.2 2.2 4.2-4.6" />
    </>
  ),
  // AI Conversion Atlas: capability flowing into outcomes
  aicc: (
    <>
      <circle cx="5.8" cy="12" r="2.2" />
      <circle cx="12" cy="12" r="2.2" />
      <circle cx="18.2" cy="6.6" r="2.2" />
      <circle cx="18.2" cy="17.4" r="2.2" />
      <path d="M8 12h1.8" />
      <path d="M14 10.7l2.4-2.1" />
      <path d="M14 13.3l2.4 2.1" />
    </>
  ),
  // Semiconductor Atlas: a chip
  semi: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="1" />
      <rect x="10" y="10" width="4" height="4" />
      <path d="M9.5 4v3M14.5 4v3M9.5 17v3M14.5 17v3M4 9.5h3M4 14.5h3M17 9.5h3M17 14.5h3" />
    </>
  ),
  // Commercial Space: a rocket
  space: (
    <>
      <path d="M12 3.2c2.7 1.9 4.1 5 4.1 8.4l-2.2 2.4h-3.8L7.9 11.6c0-3.4 1.4-6.5 4.1-8.4Z" />
      <circle cx="12" cy="9.4" r="1.5" />
      <path d="M9.9 14l-2.2 2.3 2.4-.4M14.1 14l2.2 2.3-2.4-.4" />
      <path d="M10.4 17c.3 1.4 1 2.5 1.6 3.3.6-.8 1.3-1.9 1.6-3.3" />
    </>
  ),
  // Rare Earths: mineral shards
  magnet: (
    <>
      <path d="M6 13.5l2.6-5.2 4 .8 2-3.4 3.4 3-1 5.3-5.6 2.2L6 13.5Z" />
      <path d="M8.6 8.3l1.8 4.6M14.6 5.7l-1.2 6.4M10.4 12.9l6.6 .3" />
    </>
  ),
  // PSII: an index / bar chart
  psii: (
    <>
      <path d="M4 20h16" />
      <rect x="5.5" y="12" width="2.6" height="8" />
      <rect x="10.7" y="6" width="2.6" height="14" />
      <rect x="15.9" y="9.5" width="2.6" height="10.5" />
    </>
  ),
  // Philippines · South China Sea: waves
  phsc: (
    <>
      <path d="M3.5 8.5c1.8-1.8 3.6-1.8 5.4 0s3.6 1.8 5.4 0 3.6-1.8 5.4 0" />
      <path d="M3.5 13c1.8-1.8 3.6-1.8 5.4 0s3.6 1.8 5.4 0 3.6-1.8 5.4 0" />
      <path d="M3.5 17.5c1.8-1.8 3.6-1.8 5.4 0s3.6 1.8 5.4 0 3.6-1.8 5.4 0" />
    </>
  ),
  // Writing: a fountain-pen nib
  writing: (
    <>
      <path d="M9 4h6l.8 9.2L12 20l-3.8-6.8L9 4Z" />
      <path d="M12 9.5v5" />
      <path d="M10.5 13.7h3" />
    </>
  ),
};

export function NodeIcon({
  id,
  size = 24,
  className,
}: {
  id: string;
  size?: number;
  className?: string;
}) {
  const paths = NODE_PATHS[id];
  if (!paths) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths}
    </svg>
  );
}
