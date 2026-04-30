"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { useState } from "react";

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

const navigation = [
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About" },
  { href: "/research", label: "Research" },
];

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

const ENABLE_3D_SCENE = true;

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <main
      id="main"
      className="relative isolate min-h-screen overflow-hidden bg-[#070807] text-stone-50"
    >
      {ENABLE_3D_SCENE ? (
        <SeaConsciousnessScene reduceMotion={Boolean(shouldReduceMotion)} />
      ) : null}
      <div className="pointer-events-none absolute inset-0 z-[-50] bg-[linear-gradient(115deg,rgba(7,8,7,1)_0%,rgba(13,25,21,0.92)_42%,rgba(20,18,25,0.9)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-[-30] opacity-40 [background-image:linear-gradient(rgba(250,250,248,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(250,250,248,0.035)_1px,transparent_1px)] [background-size:86px_86px]" />
      <div className="pointer-events-none absolute inset-0 z-[-20] opacity-30 [background-image:repeating-linear-gradient(170deg,transparent_0,transparent_36px,rgba(231,229,228,0.05)_37px,transparent_39px)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[-10] h-1/2 bg-[linear-gradient(0deg,rgba(7,8,7,0.92)_0%,rgba(7,8,7,0)_100%)]" />

      <header className="absolute inset-x-0 top-0 z-40">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-6 py-6 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10">
          <Link
            href="/"
            className="w-fit font-serif text-2xl leading-none text-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-100"
          >
            Jinhua Yip
          </Link>
          <nav aria-label="Primary navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm uppercase leading-none text-stone-300">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="underline-offset-4 hover:text-stone-50 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <section className="relative z-20 flex min-h-screen items-end px-6 pb-16 pt-36 sm:px-8 lg:px-10">
        <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(24rem,0.42fr)] lg:items-end">
          <div>
            <p className="mb-6 text-sm uppercase leading-none text-stone-400">
              Yippy&apos;s Sea of Consciousness
            </p>
            <h1 className="max-w-5xl font-serif text-5xl leading-[1.03] text-stone-50 sm:text-7xl lg:text-8xl">
              Welcome to my personal repository
            </h1>
          </div>
          <p className="max-w-xl text-lg leading-8 text-stone-300">
            A shifting home of my ideas, projects, questions, and interests:
            international affairs, history, aviation, marine life, and speculative
            futures.
          </p>
        </div>
      </section>

      <div aria-hidden="true" className="absolute inset-0 z-10">
        {signalLines.map((line) => (
          <motion.div
            key={line}
            className={`absolute h-px origin-left bg-stone-100/15 ${line}`}
            animate={
              shouldReduceMotion
                ? undefined
                : { opacity: [0.08, 0.24, 0.08], scaleX: [0.85, 1, 0.85] }
            }
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 z-10">
        {fragments.map((fragment) => (
          <motion.p
            key={fragment.text}
            className="absolute max-w-52 text-xs uppercase leading-5 text-stone-400/55"
            style={{ top: fragment.top, left: fragment.left }}
            animate={
              shouldReduceMotion
                ? undefined
                : {
                  x: [0, 18, -8, 0],
                  y: [0, -22, 10, 0],
                  opacity: [0.2, 0.54, 0.28, 0.2],
                }
            }
            transition={{
              duration: fragment.duration,
              repeat: Infinity,
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
            setActiveNode={setActiveNode}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}
      </div>
    </main>
  );
}

function SeaNodeMarker({
  node,
  activeNode,
  setActiveNode,
  shouldReduceMotion,
}: {
  node: SeaNode;
  activeNode: string | null;
  setActiveNode: (id: string | null) => void;
  shouldReduceMotion: boolean | null;
}) {
  const isActive = activeNode === node.id;
  const animation = shouldReduceMotion
    ? undefined
    : {
      x: [0, node.drift[0], node.drift[0] / -2, 0],
      y: [0, node.drift[1], node.drift[1] / 2, 0],
    };
  const transition = {
    duration: node.duration,
    repeat: Infinity,
    ease: "easeInOut" as const,
  };
  const wrapperProps = {
    className: "absolute",
    style: { top: node.top, left: node.left },
    animate: animation,
    transition,
    whileHover: { scale: 1.04 },
  };
  const interactiveClasses = `group relative block -translate-x-1/2 -translate-y-1/2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-100 ${node.color}`;
  const interactiveProps = {
    onMouseEnter: () => setActiveNode(node.id),
    onMouseLeave: () => setActiveNode(null),
    onFocus: () => setActiveNode(node.id),
    onBlur: () => setActiveNode(null),
  };

  const content = (
    <>
      <span className="relative flex h-[clamp(2.5rem,6vw,5rem)] w-[clamp(2.5rem,6vw,5rem)] items-center justify-center">
        <span className="absolute inset-0 rounded-full border border-stone-100/20 bg-stone-100/[0.03] shadow-[0_0_28px_rgba(210,245,255,0.12)]" />
        <span className="absolute h-1/2 w-1/2 rounded-full border border-current/25 opacity-70" />
        <span className="h-[clamp(0.35rem,0.8vw,0.55rem)] w-[clamp(0.35rem,0.8vw,0.55rem)] rounded-full bg-current/80 shadow-[0_0_18px_currentColor]" />
      </span>
      <motion.span
        className="pointer-events-none absolute left-1/2 top-[clamp(3.4rem,8vw,6rem)] w-[clamp(10rem,26vw,15rem)] max-w-[calc(100vw-2rem)] -translate-x-1/2 text-center [text-shadow:0_1px_18px_rgba(0,0,0,0.72)]"
        initial={false}
        animate={
          isActive
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: shouldReduceMotion ? 0 : -4 }
        }
        transition={{ duration: 0.28, ease: "easeOut" }}
      >
        <span className="block font-serif text-[clamp(1rem,2vw,1.3rem)] leading-tight text-stone-50">
          {node.label}
        </span>
        <span className="mt-2 block text-[clamp(0.75rem,1.35vw,0.88rem)] leading-5 text-stone-300/80">
          {node.note}
        </span>
      </motion.span>
    </>
  );

  if (node.href) {
    return (
      <motion.div {...wrapperProps}>
        <Link
          href={node.href}
          aria-label={node.label}
          className={interactiveClasses}
          {...interactiveProps}
        >
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div {...wrapperProps}>
      <button
        type="button"
        aria-label={node.label}
        className={interactiveClasses}
        {...interactiveProps}
      >
        {content}
      </button>
    </motion.div>
  );
}
