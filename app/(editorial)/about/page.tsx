import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Jinhua Yip builds source-backed intelligence products about frontier technology and great-power competition.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-14 sm:px-8 sm:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-oxblood">
        About
      </p>
      <h1 className="mt-3 font-serif text-4xl font-medium leading-tight tracking-tight text-ink sm:text-5xl">
        Source-backed maps of a hard world.
      </h1>

      <div className="mt-10 space-y-6 font-serif text-lg leading-relaxed text-ink">
        <p>
          I build source-backed intelligence products about frontier technology
          and great-power competition. I work in political risk now, and I am
          moving toward AI safety, governance, and alignment.
        </p>

        <p>
          The recurring form is the atlas: a public map of a hard domain, with
          every claim traceable to its source. China&apos;s AI stack,
          semiconductor tooling, rare-earth capability, the maritime grey-zone.
          Each one is built so a newcomer can learn the domain and a specialist
          can still find something they had not been tracking. The standard is
          one line: confident presentation, humble architecture. State the
          finding clearly. Show the evidence and its limits. Never blur a claim
          with a guess.
        </p>

        <p>
          I trained at SAIS, at the intersection of emerging technology,
          governance, security, and climate. I grew up across Shanghai, Beijing,
          and Hong Kong, and I live in the DC area now. Away from the work, I
          follow marine mammals, aviation, geography, and history. They shape how
          I think about systems, movement, and power.
        </p>
      </div>
    </div>
  );
}
