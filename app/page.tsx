"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
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
    note: "Seven dimensions for reading world politics",
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
    note: "A research system still taking shape",
    href: "/projects/psii",
    top: "34%",
    left: "68%",
    drift: [-24, 16],
    duration: 38,
    color: "border-emerald-200/60 bg-emerald-100/10 text-emerald-100",
  },
  {
    id: "whales",
    label: "Whales & Marine Life",
    note: "Scale, sentience, ecology, the deep",
    top: "72%",
    left: "78%",
    drift: [-18, -18],
    duration: 42,
    color: "border-cyan-100/60 bg-cyan-100/10 text-cyan-50",
  },
  {
    id: "aviation",
    label: "Aviation & Flight Paths",
    note: "Routes, altitude, risk, horizon",
    top: "24%",
    left: "30%",
    drift: [22, 20],
    duration: 36,
    color: "border-sky-100/60 bg-sky-100/10 text-sky-50",
  },
  {
    id: "cartography",
    label: "Cartography",
    note: "Maps as argument, memory, and power",
    top: "76%",
    left: "45%",
    drift: [14, -22],
    duration: 40,
    color: "border-stone-100/60 bg-stone-100/10 text-stone-50",
  },
  {
    id: "sci-fi-strategy",
    label: "Sci-Fi/Strategy",
    note: "Speculation as a way to test futures",
    top: "18%",
    left: "78%",
    drift: [-20, 24],
    duration: 44,
    color: "border-fuchsia-100/50 bg-fuchsia-100/10 text-fuchsia-50",
  },
];

const fragments = [
  {
    text: "order is a habit before it is a theory",
    top: "20%",
    left: "8%",
    duration: 46,
  },
  {
    text: "archipelagos / alliances / pressure",
    top: "46%",
    left: "62%",
    duration: 52,
  },
  {
    text: "flight paths cross old maps",
    top: "84%",
    left: "12%",
    duration: 58,
  },
  {
    text: "deep time below the surface",
    top: "64%",
    left: "42%",
    duration: 50,
  },
  {
    text: "strategy begins where certainty ends",
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

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <main
      id="main"
      className="relative isolate min-h-screen overflow-hidden bg-[#070807] text-stone-50"
    >
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(7,8,7,1)_0%,rgba(13,25,21,1)_42%,rgba(20,18,25,1)_100%)]" />
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(250,250,248,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(250,250,248,0.035)_1px,transparent_1px)] [background-size:86px_86px]" />
      <div className="absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(170deg,transparent_0,transparent_36px,rgba(231,229,228,0.05)_37px,transparent_39px)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(0deg,rgba(7,8,7,0.92)_0%,rgba(7,8,7,0)_100%)]" />

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
              Sea of Consciousness
            </p>
            <h1 className="max-w-5xl font-serif text-5xl leading-[1.03] text-stone-50 sm:text-7xl lg:text-8xl">
              Research interests drifting into relation.
            </h1>
          </div>
          <p className="max-w-xl text-lg leading-8 text-stone-300">
            A moving surface of projects, questions, and recurring motifs:
            world politics, strategy, maps, flight, marine life, and speculative
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
      <span className="flex h-[clamp(2.75rem,7vw,5.75rem)] w-[clamp(2.75rem,7vw,5.75rem)] items-center justify-center border border-current bg-black/20 backdrop-blur-sm">
        <span className="h-[clamp(0.375rem,0.95vw,0.75rem)] w-[clamp(0.375rem,0.95vw,0.75rem)] bg-current" />
      </span>
      <motion.span
        className="pointer-events-none absolute left-1/2 top-[clamp(3.5rem,8.5vw,6.75rem)] w-[clamp(10rem,28vw,15rem)] max-w-[calc(100vw-2rem)] -translate-x-1/2 border border-stone-100/20 bg-[#070807]/85 px-[clamp(0.875rem,2vw,1.25rem)] py-[clamp(0.625rem,1.5vw,1rem)] text-stone-100 shadow-2xl shadow-black/40 backdrop-blur-md"
        initial={false}
        animate={
          isActive
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: shouldReduceMotion ? 0 : -6 }
        }
        transition={{ duration: 0.24, ease: "easeOut" }}
      >
        <span className="block font-serif text-[clamp(1rem,2.1vw,1.35rem)] leading-tight">
          {node.label}
        </span>
        <span className="mt-2 block text-[clamp(0.75rem,1.45vw,0.9rem)] leading-6 text-stone-300">
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
