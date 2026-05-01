"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import {
  projects,
  projectStatusLabels,
  projectTypeLabels,
  type Project,
  type ProjectHomeVariant,
} from "@/data/projects";

type DecorativeMotif = {
  id: string;
  label: string;
  symbol: string;
  mark: string;
  top: string;
  left: string;
  drift: [number, number];
  duration: number;
  className: string;
};

const decorativeMotifs: DecorativeMotif[] = [
  {
    id: "whales",
    label: "Whales",
    symbol: "W",
    mark: "/marks/whales.svg",
    top: "72%",
    left: "78%",
    drift: [-18, -18],
    duration: 42,
    className: "border-cyan-100/20 text-cyan-50/55",
  },
  {
    id: "aviation",
    label: "Aviation",
    symbol: "A",
    mark: "/marks/aviation.svg",
    top: "24%",
    left: "30%",
    drift: [22, 20],
    duration: 36,
    className: "border-sky-100/20 text-sky-50/55",
  },
  {
    id: "maps",
    label: "Maps",
    symbol: "M",
    mark: "/marks/maps.svg",
    top: "78%",
    left: "44%",
    drift: [14, -22],
    duration: 40,
    className: "border-stone-100/20 text-stone-50/55",
  },
];

type TaxonomyEntry = {
  word: string;
  top: string;
  left: string;
  size: "text-xs" | "text-sm";
  drift: [number, number];
  duration: number;
};

const taxonomyWords: TaxonomyEntry[] = [
  { word: "humpback", top:  "8%", left: "11%", size: "text-sm", drift: [12,  -8], duration: 72 },
  { word: "fin",      top: "13%", left: "84%", size: "text-xs", drift: [-10, 14], duration: 84 },
  { word: "grey",     top: "41%", left:  "4%", size: "text-xs", drift: [14, -12], duration: 66 },
  { word: "orca",     top: "44%", left: "91%", size: "text-xs", drift: [-12, 10], duration: 78 },
  { word: "blue",     top: "74%", left:  "6%", size: "text-sm", drift: [10,  16], duration: 90 },
  { word: "minke",    top: "20%", left: "57%", size: "text-xs", drift: [-14, -8], duration: 60 },
  { word: "sperm",    top: "86%", left: "73%", size: "text-xs", drift: [10, -14], duration: 80 },
  { word: "narwhal",  top: "91%", left: "22%", size: "text-xs", drift: [-10, 12], duration: 68 },
];

const signalLines = [
  "left-[20%] top-[61%] w-[28%] rotate-[-9deg]",
  "left-[34%] top-[31%] w-[27%] rotate-[5deg]",
  "left-[51%] top-[72%] w-[22%] rotate-[-12deg]",
  "left-[71%] top-[27%] w-[14%] rotate-[28deg]",
];

type ProjectCardPosition = {
  top: string;
  left: string;
  drift?: [number, number];
  duration?: number;
  width?: number;
  accentClass?: string;
  code?: string;
};

const projectCardPositions: Partial<Record<Project["slug"], ProjectCardPosition>> = {
  "ir-worldview-inventory": {
    top: "56%",
    left: "18%",
    drift: [22, -28],
    duration: 34,
    width: 288,
    accentClass: "from-amber-200/20 via-stone-100/10 to-transparent",
    code: "IR",
  },
  psii: {
    top: "34%",
    left: "66%",
    drift: [-28, 20],
    duration: 38,
    width: 220,
    accentClass: "from-emerald-200/20 via-stone-100/10 to-transparent",
    code: "PI",
  },
  "philippines-south-china-sea": {
    top: "70%",
    left: "52%",
    drift: [-18, -24],
    duration: 42,
    width: 250,
    accentClass: "from-sky-200/18 via-stone-100/10 to-transparent",
    code: "PH",
  },
  "personal-substack": {
    top: "22%",
    left: "35%",
    drift: [-16, 22],
    duration: 36,
    width: 232,
    accentClass: "from-stone-100/18 via-stone-100/10 to-transparent",
    code: "PS",
  },
};

// Stable viewport-percent positions for avoidance geometry.
// parseFloat("56%") → 56, so the % sign is harmless.
const dossierPositions: Record<string, { top: number; left: number }> =
  Object.fromEntries(
    projects.map((p) => {
      const card = projectCardPositions[p.slug as keyof typeof projectCardPositions];
      return [
        p.slug,
        {
          top: parseFloat(card?.top ?? p.homeNode.coordinates.top),
          left: parseFloat(card?.left ?? p.homeNode.coordinates.left),
        },
      ];
    })
  );

function computeAvoidanceOffset(
  mySlug: string,
  activeSlug: string | null,
): { x: number; y: number } {
  if (!activeSlug || activeSlug === mySlug) return { x: 0, y: 0 };
  const me = dossierPositions[mySlug];
  const active = dossierPositions[activeSlug];
  if (!me || !active) return { x: 0, y: 0 };
  const dx = me.left - active.left;
  const dy = me.top - active.top;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 0.01) return { x: 0, y: 0 };
  return { x: (dx / dist) * 13, y: (dy / dist) * 13 };
}

const SeaConsciousnessScene = dynamic(
  () =>
    import("@/components/sea-consciousness-scene").then(
      (module) => module.SeaConsciousnessScene,
    ),
  {
    loading: () => null,
    ssr: false,
  },
);

export function HomeSceneClient() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [motionPaused, setMotionPaused] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const canShowAtmosphere = useMediaQuery(
    "(min-width: 1024px) and (pointer: fine)",
  );
  const isMotionPaused = prefersReducedMotion || motionPaused;

  if (!canShowAtmosphere) {
    return null;
  }

  return (
    <>
      {!prefersReducedMotion ? (
        <button
          type="button"
          aria-pressed={isMotionPaused}
          onClick={() => setMotionPaused((current) => !current)}
          className="absolute right-6 top-28 z-50 rounded-full border border-stone-100/15 bg-stone-950/35 px-3 py-2 text-xs uppercase leading-none text-stone-300 backdrop-blur-md transition hover:border-stone-100/30 hover:text-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-100 lg:right-10"
        >
          {isMotionPaused ? "Resume motion" : "Pause motion"}
        </button>
      ) : (
        <div className="absolute right-6 top-28 z-50 rounded-full border border-stone-100/15 bg-stone-950/35 px-3 py-2 text-xs uppercase leading-none text-stone-400 backdrop-blur-md lg:right-10">
          Motion reduced
        </div>
      )}

      {!prefersReducedMotion ? (
        <SeaConsciousnessScene reduceMotion={isMotionPaused} />
      ) : null}

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5]">
        {taxonomyWords.map((entry) => (
          <DriftingWord key={entry.word} entry={entry} isMotionPaused={isMotionPaused} />
        ))}
      </div>

      <div aria-hidden="true" className="absolute inset-0 z-10">
        {signalLines.map((line) => (
          <motion.div
            key={line}
            className={`absolute h-px origin-left bg-stone-100/15 ${line}`}
            animate={
              isMotionPaused
                ? { opacity: 0.14, scaleX: 1 }
                : { opacity: [0.08, 0.24, 0.08], scaleX: [0.85, 1, 0.85] }
            }
            transition={{
              duration: isMotionPaused ? 0.3 : 18,
              repeat: isMotionPaused ? 0 : Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 z-20">
        {decorativeMotifs.map((motif) => (
          <DecorativeMotif
            key={motif.id}
            motif={motif}
            isMotionPaused={isMotionPaused}
          />
        ))}
      </div>

      <div className="absolute inset-0 z-30">
        {projects.map((project) => (
          <DriftingDossier
            key={project.slug}
            project={project}
            isMotionPaused={isMotionPaused}
            activeSlug={activeSlug}
            onActivate={setActiveSlug}
          />
        ))}
      </div>
    </>
  );
}

function DriftingDossier({
  project,
  isMotionPaused,
  activeSlug,
  onActivate,
}: {
  project: Project;
  isMotionPaused: boolean;
  activeSlug: string | null;
  onActivate: (slug: string | null) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const card = projectCardPositions[project.slug];
  const isExpanded = isOpen;
  const driftX = card?.drift?.[0] ?? 15;
  const driftY = card?.drift?.[1] ?? 20;
  const duration = card?.duration ?? 8;
  const top = card?.top ?? project.homeNode.coordinates.top;
  const left = card?.left ?? project.homeNode.coordinates.left;
  const width = card?.width ?? getDefaultCardWidth(project.homeNode.size);
  const accentClass =
    card?.accentClass ?? getDefaultAccentClass(project.homeNode.accentColor);
  const code = card?.code ?? getProjectCode(project.title);

  useEffect(() => {
    return () => {
      if (hoverTimer.current) {
        clearTimeout(hoverTimer.current);
      }
    };
  }, []);

  const clearHoverTimer = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };

  const queueOpen = () => {
    clearHoverTimer();
    onActivate(project.slug);
    hoverTimer.current = setTimeout(() => setIsOpen(true), 300);
  };

  const close = () => {
    clearHoverTimer();
    onActivate(null);
    setIsOpen(false);
  };

  const avoidanceOffset = computeAvoidanceOffset(project.slug, activeSlug);

  const wrapperAnimation = isMotionPaused
    ? { x: 0, y: 0, rotate: 0 }
    : {
        x: [0, driftX, driftX / -2, 0],
        y: [0, driftY, driftY / 2, 0],
        rotate: [0, 0.45, -0.3, 0],
      };

  return (
    <motion.div
      className="absolute"
      style={{ top, left }}
      animate={wrapperAnimation}
      transition={{
        duration: isMotionPaused ? 0.3 : duration,
        repeat: isMotionPaused ? 0 : Infinity,
        ease: "easeInOut",
      }}
    >
      <motion.div
        animate={isMotionPaused ? { x: 0, y: 0 } : avoidanceOffset}
        transition={{ duration: isMotionPaused ? 0 : 1.0, ease: [0.16, 1, 0.3, 1] }}
      >
      <motion.div
        animate={{
          width: isExpanded ? width : 116,
          height: isExpanded ? 288 : 72,
        }}
        transition={{ duration: isMotionPaused ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
        className="relative -translate-x-1/2 -translate-y-1/2"
      >
        {project.homeNode.variant === "folio" && (
          <>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 translate-x-1 translate-y-1 border border-stone-100/[0.07] bg-[#0b0d0b]/55"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 translate-x-[3px] translate-y-[3px] border border-stone-100/[0.10] bg-[#0d0f0c]/60"
            />
          </>
        )}
        <Link
          href={`/projects/${project.slug}`}
          aria-label={`Open ${project.title}`}
          onMouseEnter={queueOpen}
          onMouseLeave={close}
          onFocus={queueOpen}
          onBlur={close}
          className="group relative block h-full overflow-hidden border border-stone-100/18 bg-[#10120f]/72 text-left text-stone-50 shadow-[0_18px_60px_rgba(0,0,0,0.34)] backdrop-blur-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-100"
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${accentClass}`}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_32%,rgba(255,255,255,0.03))]"
          />

          <VariantChrome
            variant={project.homeNode.variant}
            isExpanded={isExpanded}
            isMotionPaused={isMotionPaused}
          />

          <motion.span
            aria-hidden="true"
            animate={{ opacity: isExpanded ? 0 : 1 }}
            transition={{ duration: isMotionPaused ? 0 : 0.18 }}
            className="absolute inset-0 grid place-items-center"
          >
            <span className="flex items-center gap-3 text-xs uppercase leading-none tracking-[0.16em] text-stone-300">
              <span className="font-serif text-2xl tracking-normal text-stone-50">
                {code}
              </span>
              <span>{project.year}</span>
            </span>
          </motion.span>

          <motion.span
            animate={{
              opacity: isExpanded ? 1 : 0,
              y: isMotionPaused ? 0 : (isExpanded ? 0 : 8),
            }}
            transition={{ duration: isMotionPaused ? 0 : 0.26, ease: "easeOut" }}
            className="absolute inset-0 grid content-start gap-3 p-3"
          >
            <HoverPreview
              posters={project.preview.posters}
              alt={project.preview.alt}
              video={project.preview.video ?? null}
              isExpanded={isExpanded}
              isMotionPaused={isMotionPaused}
            />

            <span className="text-[0.65rem] uppercase leading-none tracking-[0.16em] text-stone-400">
              {projectTypeLabels[project.type]} /{" "}
              {projectStatusLabels[project.status]}
            </span>
            <span className="font-serif text-xl leading-tight text-stone-50">
              {project.title}
            </span>
            <span className="text-sm leading-5 text-stone-300">
              {project.dek}
            </span>
          </motion.span>
        </Link>
      </motion.div>
      </motion.div>
    </motion.div>
  );
}

function DriftingWord({
  entry,
  isMotionPaused,
}: {
  entry: TaxonomyEntry;
  isMotionPaused: boolean;
}) {
  return (
    <motion.span
      aria-hidden="true"
      className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 font-serif ${entry.size} text-stone-100 opacity-[0.08]`}
      style={{ top: entry.top, left: entry.left }}
      animate={
        isMotionPaused
          ? { x: 0, y: 0 }
          : {
              x: [0, entry.drift[0], entry.drift[0] / -2, 0],
              y: [0, entry.drift[1], entry.drift[1] / 2, 0],
            }
      }
      transition={{
        duration: isMotionPaused ? 0.3 : entry.duration,
        repeat: isMotionPaused ? 0 : Infinity,
        ease: "easeInOut",
      }}
    >
      {entry.word}
    </motion.span>
  );
}

function DecorativeMotif({
  motif,
  isMotionPaused,
}: {
  motif: DecorativeMotif;
  isMotionPaused: boolean;
}) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{ top: motif.top, left: motif.left }}
      animate={
        isMotionPaused
          ? { x: 0, y: 0, opacity: 0.42 }
          : {
              x: [0, motif.drift[0], motif.drift[0] / -2, 0],
              y: [0, motif.drift[1], motif.drift[1] / 2, 0],
              opacity: [0.26, 0.48, 0.32, 0.26],
            }
      }
      transition={{
        duration: isMotionPaused ? 0.3 : motif.duration,
        repeat: isMotionPaused ? 0 : Infinity,
        ease: "easeInOut",
      }}
    >
      <span
        className={`relative grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border bg-stone-100/[0.025] font-serif text-xl ${motif.className}`}
      >
        <span className="absolute inset-3 rounded-full border border-current/20" />
        <span
          className="h-7 w-7 bg-current opacity-70"
          style={{
            maskImage: `url(${motif.mark})`,
            maskPosition: "center",
            maskRepeat: "no-repeat",
            maskSize: "contain",
            WebkitMaskImage: `url(${motif.mark})`,
            WebkitMaskPosition: "center",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
          }}
        />
        <span className="sr-only">{motif.symbol}</span>
        <span className="sr-only">{motif.label}</span>
      </span>
    </motion.div>
  );
}

function VariantChrome({
  variant,
  isExpanded,
  isMotionPaused,
}: {
  variant: ProjectHomeVariant;
  isExpanded: boolean;
  isMotionPaused: boolean;
}) {
  if (variant === "viewport") {
    return (
      <motion.span
        aria-hidden="true"
        animate={{ opacity: isExpanded ? 0 : 1 }}
        transition={{ duration: isMotionPaused ? 0 : 0.18 }}
        className="pointer-events-none absolute left-2.5 top-2 flex items-center gap-[3px]"
      >
        <span className="block h-1.5 w-1.5 rounded-full bg-stone-100/30" />
        <span className="block h-1.5 w-1.5 rounded-full bg-stone-100/20" />
        <span className="block h-1.5 w-1.5 rounded-full bg-stone-100/12" />
      </motion.span>
    );
  }

  if (variant === "triptych") {
    return (
      <>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 top-0 w-px bg-stone-100/[0.08]"
          style={{ left: "33.33%" }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 top-0 w-px bg-stone-100/[0.08]"
          style={{ left: "66.66%" }}
        />
      </>
    );
  }

  if (variant === "note") {
    return (
      <>
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-3 h-px bg-stone-100/[0.10]" style={{ bottom: "22%" }} />
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-3 h-px bg-stone-100/[0.07]" style={{ bottom: "38%" }} />
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-3 h-px bg-stone-100/[0.04]" style={{ bottom: "54%" }} />
      </>
    );
  }

  return null;
}

function HoverPreview({
  posters,
  alt,
  video,
  isExpanded,
  isMotionPaused,
}: {
  posters: readonly string[];
  alt: string;
  video: string | null;
  isExpanded: boolean;
  isMotionPaused: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [posterIndex, setPosterIndex] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const canPlayVideo = !isMotionPaused && Boolean(video);

  useEffect(() => {
    if (isMotionPaused || posters.length < 2 || !isExpanded) {
      return;
    }
    const id = window.setInterval(() => {
      setPosterIndex((current) => (current + 1) % posters.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [isExpanded, isMotionPaused, posters.length]);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) {
      return;
    }
    if (!canPlayVideo || !isExpanded) {
      node.pause();
      try {
        node.currentTime = 0;
      } catch {
        // Setting currentTime can throw before metadata loads; safe to ignore.
      }
      return;
    }
    const playPromise = node.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Playback can be rejected (e.g., user gesture policies); poster fallback remains visible.
      });
    }
  }, [isExpanded, canPlayVideo]);

  if (posters.length === 0 && !video) {
    return null;
  }

  const fallbackPoster = posters[posterIndex] ?? posters[0] ?? undefined;
  const showVideoLayer = videoReady && isExpanded && canPlayVideo;

  return (
    <span
      role="img"
      aria-label={alt}
      className="relative block aspect-[16/9] overflow-hidden border border-stone-100/10 bg-stone-950/50 opacity-90"
    >
      {posters.map((src, index) => (
        <span
          key={src}
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out"
          style={{
            backgroundImage: `url(${src})`,
            opacity: index === posterIndex ? 1 : 0,
          }}
        />
      ))}
      {video ? (
        <video
          ref={videoRef}
          src={video}
          poster={fallbackPoster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          onPlaying={() => setVideoReady(true)}
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-300 ${
            showVideoLayer ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : null}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(7,8,7,0.52))]"
      />
    </span>
  );
}

function getDefaultCardWidth(size: Project["homeNode"]["size"]) {
  if (size === "lg") {
    return 240;
  }

  if (size === "sm") {
    return 204;
  }

  return 224;
}

function getDefaultAccentClass(accentColor: string) {
  if (accentColor === "amber") {
    return "from-amber-200/20 via-stone-100/10 to-transparent";
  }

  if (accentColor === "emerald") {
    return "from-emerald-200/20 via-stone-100/10 to-transparent";
  }

  if (accentColor === "sky") {
    return "from-sky-200/18 via-stone-100/10 to-transparent";
  }

  return "from-stone-100/18 via-stone-100/10 to-transparent";
}

function getProjectCode(title: string) {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const updateMatches = () => setMatches(mediaQuery.matches);

    updateMatches();
    mediaQuery.addEventListener("change", updateMatches);

    return () => {
      mediaQuery.removeEventListener("change", updateMatches);
    };
  }, [query]);

  return matches;
}
