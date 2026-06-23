import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getProjectBySlug,
  projects,
  projectStatusLabels,
  projectTypeLabels,
} from "@/data/projects";
import { ProjectPreviewMedia } from "@/components/sea-intro/project-preview-media";

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
  if (!project) return {};
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

const isSource = (href: string) => /github\.com/i.test(href);

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const openLinks = project.links.filter((l) => !isSource(l.href));
  const sourceLinks = project.links.filter((l) => isSource(l.href));

  // Long-form sections only render when their material exists; projects with
  // different underlying content are not forced into an identical template.
  const sections: { heading: string; body: string }[] = [
    { heading: "What it does", body: project.description },
    { heading: "What you can explore", body: project.detail?.whatYouCanExplore ?? "" },
    { heading: "Why I built it", body: project.detail?.whyIBuiltIt ?? "" },
    { heading: "Evidence and limits", body: project.detail?.evidenceAndLimits ?? "" },
    { heading: "My role", body: project.detail?.myRole ?? "" },
  ].filter((s) => s.body.length > 0);

  const statusLine = project.detail?.currentStatus
    ? `${projectStatusLabels[project.status]} · ${project.year}. ${project.detail.currentStatus}`
    : `${projectStatusLabels[project.status]} · ${project.year}.`;

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-14 sm:px-8 sm:py-20">
      <Link
        href="/archive"
        className="font-sans text-sm text-ink-2 underline-offset-4 transition-colors duration-200 hover:text-oxblood hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-oxblood"
      >
        ← Back to projects
      </Link>

      <header className="mt-8">
        <p className="font-sans text-sm text-ink-2">
          {projectTypeLabels[project.type]} · {projectStatusLabels[project.status]} ·{" "}
          {project.year}
        </p>
        <h1 className="mt-3 font-serif text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-5 max-w-[52ch] font-serif text-xl leading-[1.5] text-ink-2">
          {project.dek}
        </p>

        {(openLinks.length > 0 || sourceLinks.length > 0) && (
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            {openLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[15px] text-oxblood underline-offset-4 transition-colors duration-200 hover:text-oxblood-soft hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-oxblood"
              >
                {link.label} <span aria-hidden="true">→</span>
              </a>
            ))}
            {sourceLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[15px] text-ink-2 underline-offset-4 transition-colors duration-200 hover:text-ink hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-oxblood"
              >
                View source <span aria-hidden="true">→</span>
              </a>
            ))}
          </div>
        )}
      </header>

      <div className="mt-10">
        <ProjectPreviewMedia
          preview={project.preview}
          projectId={project.id}
          title={project.title}
          active
          flagship={project.tier === "flagship"}
          className="aspect-[16/9] w-full"
        />
      </div>

      <div className="mt-12 space-y-10">
        {sections.map((section, i) => (
          <section
            key={section.heading}
            className={i > 0 ? "border-t border-rule pt-10" : undefined}
          >
            <h2 className="font-sans text-sm text-ink-2">{section.heading}</h2>
            <p className="mt-3 max-w-[64ch] font-serif text-lg leading-[1.65] text-ink">
              {section.body}
            </p>
          </section>
        ))}

        <section className="border-t border-rule pt-10">
          <h2 className="font-sans text-sm text-ink-2">Status</h2>
          <p className="mt-3 font-serif text-lg leading-[1.65] text-ink">
            {statusLine}
          </p>
        </section>
      </div>
    </article>
  );
}
