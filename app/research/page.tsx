import type { Metadata } from "next";
import Link from "next/link";

import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Research",
  description: "Research projects and policy work by Jinhua Yi.",
};

export default function ResearchPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-8 sm:py-18 lg:px-10">
      <div className="max-w-3xl">
        <p className="mb-4 text-sm uppercase leading-none text-stone-500">
          Research
        </p>
        <h1 className="font-serif text-4xl leading-tight text-stone-950 sm:text-5xl">
          Research notes and policy projects with room for depth.
        </h1>
        <p className="mt-6 text-lg leading-8 text-stone-700">
          A simple listing for now, designed to become a more complete research
          shelf as project material is added.
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {projects.map((project) => (
          <article key={project.slug} className="border-t border-stone-300 pt-5">
            <p className="mb-4 text-sm leading-none text-stone-500">
              {project.category} / {project.status}
            </p>
            <h2 className="font-serif text-2xl leading-tight text-stone-950">
              <Link
                href={`/projects/${project.slug}`}
                className="hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900"
              >
                {project.title}
              </Link>
            </h2>
            <p className="mt-4 text-base leading-7 text-stone-700">
              {project.dek}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
