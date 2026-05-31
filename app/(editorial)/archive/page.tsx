import type { Metadata } from "next";

import { ArchiveList } from "@/components/archive-list";

export const metadata: Metadata = {
  title: "Archive",
  description:
    "An index of Jinhua Yip's research, tools, and writing on technology and power.",
};

export default function ArchivePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-8 sm:py-20 lg:px-10">
      <header className="grid gap-8 md:grid-cols-[1.35fr_1fr] md:items-end md:gap-14">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-oxblood">
            The Atlases · Index
          </p>
          <h1 className="mt-3 max-w-[14ch] font-serif text-4xl font-medium leading-[1.06] tracking-tight text-ink sm:text-5xl">
            Maps, tools, and writing on technology and power.
          </h1>
        </div>
        <p className="max-w-[44ch] font-serif text-lg leading-relaxed text-ink-2">
          A working index of projects, publications, and research systems on
          international relations, AI governance, and political economy. Built to
          be useful to a newcomer and a specialist alike.
        </p>
      </header>

      <ArchiveList />
    </div>
  );
}
