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
        A place for careful public thinking.
      </h1>
      <div className="mt-10 space-y-6 text-lg leading-8 text-stone-700">
        <p>
          This portfolio will collect research, essays, editorial projects, and
          experiments in public reasoning. The design should feel calm enough to
          read and structured enough to grow.
        </p>
        <p>
          Sprint 1 keeps this page intentionally spare. Future passes can add a
          biography, selected affiliations, press links, and a clearer editorial
          statement.
        </p>
      </div>
    </div>
  );
}
