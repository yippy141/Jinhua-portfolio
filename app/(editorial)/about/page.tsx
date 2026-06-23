import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Jinhua Yip is a technology-policy researcher working on AI, semiconductors, critical minerals, commercial space, and the role private companies play in foreign policy.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-14 sm:px-8 sm:py-20">
      <h1 className="font-serif text-4xl font-medium leading-tight tracking-tight text-ink sm:text-5xl">
        I research how technology changes power.
      </h1>

      <div className="mt-10 space-y-6 font-serif text-[1.0625rem] leading-[1.65] text-ink sm:text-lg">
        <p>
          I&apos;m Jinhua Yip, a technology-policy researcher. My work covers
          artificial intelligence, semiconductors, critical minerals, commercial
          space, and the role private companies play in foreign policy.
        </p>

        <p>
          This site is where I turn that research into things people can use:
          maps, trackers, indices, questionnaires, and explainers. Each project
          includes its sources, method, and known gaps so readers can inspect the
          reasoning rather than take the result on trust.
        </p>

        <p>
          I studied international relations at SAIS and UBC and have worked in
          political-risk consulting and the Canadian government. Outside work, I
          follow whales, aviation, geography, and history. Those interests are the
          reason the portfolio takes place in an ocean rather than a conventional
          project grid.
        </p>

        <p className="font-sans text-base leading-[1.6] text-ink-2">
          Every project links to its{" "}
          <Link
            href="/methodology"
            className="text-oxblood underline underline-offset-4 transition-colors duration-200 hover:text-oxblood-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-oxblood"
          >
            methodology and limits
          </Link>
          , so you can see how a result was reached and where it is uncertain.
        </p>
      </div>
    </div>
  );
}
