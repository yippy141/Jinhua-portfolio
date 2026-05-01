"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

type SeaNode = {
  id: string;
  label: string;
  note: string;
  href?: string;
  top: string;
  left: string;
  drift: [number, number];
  duration: number;
  color: string;
};

const nodes: SeaNode[] = [
  {
    id: "ir-worldview",
    label: "IR Worldview",
    note: "map your worldview and how you understand international relations",
    href: "/projects/ir-worldview-inventory",
    top: "58%",
    left: "18%",
    drift: [18, -24],
    duration: 34,
    color: "border-amber-200/70 bg-amber-100/10 text-amber-100",
  },
  {
    id: "psii",
    label: "PSII",
    note: "an index that maps the degree of private sector influence in foreign policy",
    href: "/projects/psii",
    top: "34%",
    left: "68%",
    drift: [-24, 16],
    duration: 38,
    color: "border-emerald-200/60 bg-emerald-100/10 text-emerald-100",
  },
  {
    id: "whales",
    label: "Cetaceans",
    note: "My favorite animals :)",
    top: "72%",
    left: "78%",
    drift: [-18, -18],
    duration: 42,
    color: "border-cyan-100/60 bg-cyan-100/10 text-cyan-50",
  },
  {
    id: "aviation",
    label: "Transportation",
    note: "planes, trains, and things that go boom",
    top: "24%",
    left: "30%",
    drift: [22, 20],
    duration: 36,
    color: "border-sky-100/60 bg-sky-100/10 text-sky-50",
  },
  {
    id: "cartography",
    label: "Geography",
    note: "atlases are my favorite books",
    top: "76%",
    left: "45%",
    drift: [14, -22],
    duration: 40,
    color: "border-stone-100/60 bg-stone-100/10 text-stone-50",
  },
  {
    id: "sci-fi-strategy",
    label: "Sci-Fi & Strategy",
    note: "RTS, lore, and sci-fi",
    top: "18%",
    left: "78%",
    drift: [-20, 24],
    duration: 44,
    color: "border-fuchsia-100/50 bg-fuchsia-100/10 text-fuchsia-50",
  },
];

const fragments = [
  {
    text: "Grey",
    top: "20%",
    left: "8%",
    duration: 46,
  },
  {
    text: "Sperm",
    top: "46%",
    left: "62%",
    duration: 52,
  },
  {
    text: "Blue",
    top: "84%",
    left: "12%",
    duration: 58,
  },
  {
    text: "Orca",
    top: "64%",
    left: "42%",
    duration: 50,
  },
  {
    text: "Humpback",
    top: "30%",
    left: "48%",
    duration: 62,
  },
];

const signalLines = [
  "left-[20%] top-[61%] w-[28%] rotate-[-9deg]",
  "left-[34%] top-[31%] w-[27%] rotate-[5deg]",
  "left-[51%] top-[72%] w-[22%] rotate-[-12deg]",
  "left-[71%] top-[27%] w-[14%] rotate-[28deg]",
];

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
  const [activeNode, setActiveNode] = useState<string | null>(null);
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
        <div
          aria-live="polite"
          className="absolute right-6 top-28 z-50 rounded-full border border-stone-100/15 bg-stone-950/35 px-3 py-2 text-xs uppercase leading-none text-stone-400 backdrop-blur-md lg:right-10"
        >
          Motion reduced
        </div>
      )}

      {!prefersReducedMotion ? (
        <SeaConsciousnessScene reduceMotion={isMotionPaused} />
      ) : null}

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

      <div className="absolute inset-0 z-10">
        {fragments.map((fragment) => (
          <motion.p
            key={fragment.text}
            aria-hidden="true"
            className="absolute max-w-52 text-xs uppercase leading-5 text-stone-400/55"
            style={{ top: fragment.top, left: fragment.left }}
            animate={
              isMotionPaused
                ? { x: 0, y: 0, opacity: 0.32 }
                : {
                    x: [0, 18, -8, 0],
                    y: [0, -22, 10, 0],
                    opacity: [0.2, 0.54, 0.28, 0.2],
                  }
            }
            transition={{
              duration: isMotionPaused ? 0.3 : fragment.duration,
              repeat: isMotionPaused ? 0 : Infinity,
              ease: "easeInOut",
            }}
          >
            {fragment.text}
          </motion.p>
        ))}
      </div>

      <div className="absolute inset-0 z-30">
        {nodes.map((node) => (
          <SeaNodeMarker
            key={node.id}
            node={node}
            activeNode={activeNode}
            isMotionPaused={isMotionPaused}
            setActiveNode={setActiveNode}
          />
        ))}
      </div>
    </>
  );
}

function SeaNodeMarker({
  node,
  activeNode,
  isMotionPaused,
  setActiveNode,
}: {
  node: SeaNode;
  activeNode: string | null;
  isMotionPaused: boolean;
  setActiveNode: (id: string | null) => void;
}) {
  const isActive = activeNode === node.id;
  const wrapperAnimation = isMotionPaused
    ? { x: 0, y: 0 }
    : {
        x: [0, node.drift[0], node.drift[0] / -2, 0],
        y: [0, node.drift[1], node.drift[1] / 2, 0],
      };
  const wrapperTransition = {
    duration: isMotionPaused ? 0.3 : node.duration,
    repeat: isMotionPaused ? 0 : Infinity,
    ease: "easeInOut" as const,
  };

  if (!node.href) {
    return (
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{ top: node.top, left: node.left }}
        animate={wrapperAnimation}
        transition={wrapperTransition}
      >
        <span
          className={`relative block -translate-x-1/2 -translate-y-1/2 ${node.color}`}
        >
          <NodeOrb />
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute"
      style={{ top: node.top, left: node.left }}
      animate={wrapperAnimation}
      transition={wrapperTransition}
      whileHover={{ scale: 1.04 }}
    >
      <Link
        href={node.href}
        aria-label={node.label}
        className={`group relative block -translate-x-1/2 -translate-y-1/2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-100 ${node.color}`}
        onMouseEnter={() => setActiveNode(node.id)}
        onMouseLeave={() => setActiveNode(null)}
        onFocus={() => setActiveNode(node.id)}
        onBlur={() => setActiveNode(null)}
      >
        <NodeOrb />
        <motion.span
          className="pointer-events-none absolute left-1/2 top-[clamp(3.4rem,8vw,6rem)] w-[clamp(10rem,26vw,15rem)] max-w-[calc(100vw-2rem)] -translate-x-1/2 text-center [text-shadow:0_1px_18px_rgba(0,0,0,0.72)]"
          initial={false}
          animate={
            isActive
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: isMotionPaused ? 0 : -4 }
          }
          transition={{ duration: isMotionPaused ? 0.1 : 0.28, ease: "easeOut" }}
        >
          <span className="block font-serif text-[clamp(1rem,2vw,1.3rem)] leading-tight text-stone-50">
            {node.label}
          </span>
          <span className="mt-2 block text-[clamp(0.75rem,1.35vw,0.88rem)] leading-5 text-stone-300/80">
            {node.note}
          </span>
        </motion.span>
      </Link>
    </motion.div>
  );
}

function NodeOrb() {
  return (
    <span className="relative flex h-[clamp(2.5rem,6vw,5rem)] w-[clamp(2.5rem,6vw,5rem)] items-center justify-center">
      <span className="absolute inset-0 rounded-full border border-stone-100/20 bg-stone-100/[0.03] shadow-[0_0_28px_rgba(210,245,255,0.12)]" />
      <span className="absolute h-1/2 w-1/2 rounded-full border border-current/25 opacity-70" />
      <span className="h-[clamp(0.35rem,0.8vw,0.55rem)] w-[clamp(0.35rem,0.8vw,0.55rem)] rounded-full bg-current/80 shadow-[0_0_18px_currentColor]" />
    </span>
  );
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
