import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProjectBySlug, projects } from "@/data/projects";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: project.title,
    description: project.dek,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="mx-auto w-full max-w-4xl px-6 py-14 sm:px-8 sm:py-18 lg:px-10">
      <Link
        href="/archive"
        className="text-sm uppercase leading-none text-stone-600 underline underline-offset-4 hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900"
      >
        Back to archive
      </Link>

      <header className="mt-10 border-b border-stone-300 pb-10">
        <p className="mb-5 text-sm uppercase leading-none text-stone-500">
          {project.category} / {project.status}
        </p>
        <h1 className="font-serif text-4xl leading-tight text-stone-950 sm:text-6xl">
          {project.title}
        </h1>
        <p className="mt-6 max-w-2xl text-xl leading-8 text-stone-700">
          {project.dek}
        </p>
      </header>

      <div className="mt-10 grid gap-10 md:grid-cols-[10rem_1fr]">
        <dl className="space-y-5 text-sm leading-6 text-stone-600">
          <div>
            <dt className="text-stone-500">Year</dt>
            <dd className="text-stone-900">{project.year}</dd>
          </div>
          <div>
            <dt className="text-stone-500">Status</dt>
            <dd className="text-stone-900">{project.status}</dd>
          </div>
        </dl>
        <div className="space-y-6 text-lg leading-8 text-stone-700">
          <p>{project.description}</p>
          <p>
            This detail page is a Sprint 1 scaffold. Future passes can add
            source links, images, publication metadata, and long-form project
            notes without changing the routing model.
          </p>
        </div>
      </div>
    </article>
  );
}
