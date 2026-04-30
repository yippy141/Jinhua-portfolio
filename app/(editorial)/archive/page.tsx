import type { Metadata } from "next";
import Link from "next/link";

import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Archive",
  description: "An archive of Jinhua Yi's research and editorial projects.",
};

export default function ArchivePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-8 sm:py-18 lg:px-10">
      <div className="max-w-3xl">
        <p className="mb-4 text-sm uppercase leading-none text-stone-500">
          Archive
        </p>
        <h1 className="font-serif text-4xl leading-tight text-stone-950 sm:text-5xl">
          A working index of projects, publications, and research systems.
        </h1>
      </div>

      <div className="mt-12 divide-y divide-stone-300 border-y border-stone-300">
        {projects.map((project) => (
          <article
            key={project.slug}
            className="grid gap-4 py-7 md:grid-cols-[9rem_1fr_12rem]"
          >
            <p className="text-sm leading-6 text-stone-500">{project.year}</p>
            <div>
              <h2 className="font-serif text-2xl leading-tight text-stone-950">
                <Link
                  href={`/projects/${project.slug}`}
                  className="hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900"
                >
                  {project.title}
                </Link>
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-stone-700">
                {project.dek}
              </p>
            </div>
            <p className="text-sm leading-6 text-stone-600">{project.status}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
