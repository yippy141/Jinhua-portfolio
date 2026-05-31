import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getProjectBySlug,
  projects,
  projectStatusLabels,
  projectTierLabels,
  projectTypeLabels,
} from "@/data/projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.dek,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.dek,
      url: `/projects/${slug}`,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-14 sm:px-8 sm:py-20">
      <Link
        href="/archive"
        className="font-sans text-sm tracking-[0.04em] text-ink-2 underline-offset-4 transition-colors duration-200 hover:text-oxblood hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-oxblood"
      >
        ← Archive
      </Link>

      <header className="mt-8 border-b border-rule pb-8">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">
          <span
            className={
              project.tier === "flagship" ? "text-oxblood" : undefined
            }
          >
            {projectTierLabels[project.tier]}
          </span>
          <span aria-hidden="true">·</span>
          <span>{projectTypeLabels[project.type]}</span>
          <span aria-hidden="true">·</span>
          <span>{projectStatusLabels[project.status]}</span>
          <span aria-hidden="true">·</span>
          <span>{project.year}</span>
        </p>
        <h1 className="mt-4 font-serif text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-5 max-w-[48ch] font-serif text-xl leading-relaxed text-ink-2">
          {project.dek}
        </p>
      </header>

      <div className="mt-8 max-w-[64ch] space-y-6 font-serif text-lg leading-relaxed text-ink">
        <p>{project.description}</p>
      </div>

      {project.tags.length > 0 && (
        <ul className="mt-8 flex list-none flex-wrap gap-1.5 p-0">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="inline-flex items-center rounded-[2px] border border-rule px-2 py-0.5 font-mono text-[11px] tracking-[0.02em] text-ink-2"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 border-t border-rule pt-6">
        {project.links.length > 0 ? (
          <ul className="flex list-none flex-col gap-3 p-0 sm:flex-row sm:flex-wrap sm:gap-4">
            {project.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-[3px] border border-rule px-4 py-2 font-sans text-sm text-oxblood transition-colors duration-200 hover:border-oxblood hover:text-oxblood-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oxblood"
                >
                  {link.label}
                  <span aria-hidden="true">→</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-sans text-sm text-ink-2">
            No public link yet. This one is still in progress.
          </p>
        )}
      </div>
    </article>
  );
}
