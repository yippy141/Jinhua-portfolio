import type { Metadata } from "next";
import Link from "next/link";

import {
  projects,
  projectStatusLabels,
  projectTypeLabels,
  type ProjectSlug,
} from "@/data/projects";

const researchGroups = [
  {
    title: "Interactive Systems",
    slugs: [
      "ir-worldview-inventory",
      "psii",
      "mine-to-magnet-capability-tracker",
    ],
  },
  {
    title: "Writing & Publications",
    slugs: ["personal-substack"],
  },
] as const satisfies readonly {
  title: string;
  slugs: readonly ProjectSlug[];
}[];

export const metadata: Metadata = {
  title: "Research",
  description: "Research projects and policy work by Jinhua Yip.",
};

function getProjectsBySlugs(slugs: readonly ProjectSlug[]) {
  return projects.filter((project) => slugs.includes(project.slug));
}

export default function ResearchPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-8 sm:py-18 lg:px-10">
      <div className="max-w-3xl">
        <p className="mb-4 text-sm uppercase leading-none text-stone-500">
          Research
        </p>
        <h1 className="font-serif text-4xl leading-tight text-stone-950 sm:text-5xl">
          Research systems, publications, and public analysis.
        </h1>
        <p className="mt-6 text-lg leading-8 text-stone-700">
          A working shelf for interactive tools, research frameworks, and
          writing on international relations, AI governance, political economy,
          and strategic influence.
        </p>
      </div>

      <div className="mt-14 space-y-14">
        {researchGroups.map((group) => {
          const groupProjects = getProjectsBySlugs(group.slugs);

          return (
            <section key={group.title}>
              <h2 className="border-b border-stone-300 pb-4 text-sm uppercase leading-none text-stone-500">
                {group.title}
              </h2>
              <div className="grid gap-8 pt-8 md:grid-cols-2">
                {groupProjects.map((project) => (
                  <article
                    key={project.slug}
                    className="border-t border-stone-300 pt-5"
                  >
                    <p className="mb-4 text-sm leading-none text-stone-500">
                      {projectTypeLabels[project.type]} /{" "}
                      {projectStatusLabels[project.status]}
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
          );
        })}
      </div>
    </div>
  );
}
