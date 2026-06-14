import type { Metadata } from "next";
import Link from "next/link";

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
          Jinhua Yip builds source-backed intelligence products on frontier
          technology and great-power competition. The recurring form is the
          atlas: a public, source-traceable map of a hard domain, built so a
          newcomer can learn it and a specialist can still find something they
          had not been tracking.
        </p>

        <p>
          The atlases share one standard: every public claim traces to a source
          record, confidence is stated plainly, and gaps in the record are shown
          rather than papered over. The methodology page documents the contract.
        </p>

        <p>
          Trained at Johns Hopkins SAIS in emerging technology, governance, and
          security. Currently a tech policy and strategy researcher at DGA Group
          / Albright Stonebridge Group, working across technology policy, AI
          governance, semiconductor supply chains, data centers, and geopolitical
          risk. Moving toward AI safety and governance research. Author of a
          sole-authored Springer chapter on private-sector influence in
          asymmetric conflict (2025). Born in Vancouver, raised across Shanghai,
          Beijing, and Hong Kong. Based in the Washington, DC area.
        </p>

        <p>
          The work published here is built from public sources only. It does not
          use employer, client, or proprietary material as evidence.
        </p>

        <p className="font-sans text-base leading-7 text-ink-2">
          Read the shared {" "}
          <Link
            href="/methodology"
            className="text-oxblood underline underline-offset-4 transition-colors duration-200 hover:text-oxblood-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-oxblood"
          >
            Methodology and limits
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
