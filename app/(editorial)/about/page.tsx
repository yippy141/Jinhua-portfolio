import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Jinhua Yip and the editorial direction of the portfolio.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-14 sm:px-8 sm:py-18">
      <p className="mb-4 text-sm uppercase leading-none text-stone-500">About</p>
      <h1 className="font-serif text-4xl leading-tight text-stone-950 sm:text-5xl">
        A place for research, systems, and careful public thinking.
      </h1>
      <div className="mt-10 space-y-6 text-lg leading-8 text-stone-700">
        <p>
          I work across international relations, AI governance, political
          economy, and strategic analysis, with a particular interest in how
          institutions, technology, and commercial actors shape world politics.
        </p>
        <p>
          This site is both an archive and a laboratory: a place to collect
          projects, publications, and experiments, and to develop more visual
          and interactive ways of thinking through geopolitical questions.
        </p>
        <p>
          My interests extend beyond formal policy work. Marine mammals,
          aviation, geography, history, and strategy games all shape the way I
          look at systems, movement, and power. I want the site to feel serious
          without becoming sterile, and personal without becoming performative.
        </p>
      </div>
    </div>
  );
}
