import Link from "next/link";

import { projects } from "@/data/projects";

export default function Home() {
  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10">
      <section className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="mb-6 text-sm uppercase leading-none text-stone-500">
            Research, essays, and public reasoning
          </p>
          <h1 className="max-w-3xl font-serif text-5xl leading-[1.08] text-stone-950 sm:text-6xl">
            A quiet portfolio for work on international affairs and civic life.
          </h1>
        </div>
        <p className="max-w-xl text-lg leading-8 text-stone-700">
          Sprint 1 establishes the editorial frame: clear routes, typed local
          project data, and a calm foundation ready for richer content later.
        </p>
      </section>

      <section className="mt-20 border-t border-stone-300/70 pt-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-serif text-3xl leading-tight text-stone-950">
            Current Work
          </h2>
          <Link
            href="/archive"
            className="w-fit text-sm uppercase leading-none text-stone-600 underline underline-offset-4 hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900"
          >
            View archive
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {featuredProjects.map((project) => (
            <article key={project.slug} className="border-t border-stone-300 pt-5">
              <p className="mb-4 text-sm leading-none text-stone-500">
                {project.status}
              </p>
              <h3 className="font-serif text-2xl leading-tight text-stone-950">
                <Link
                  href={`/projects/${project.slug}`}
                  className="hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900"
                >
                  {project.title}
                </Link>
              </h3>
              <p className="mt-4 text-base leading-7 text-stone-700">
                {project.dek}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
