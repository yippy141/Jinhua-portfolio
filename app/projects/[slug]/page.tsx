import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProjectBySlug, type Project, projects } from "@/data/projects";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const irWorldviewLinks = {
  live: "https://ir-worldview-inventory.vercel.app",
  github: "https://github.com/jinhuayip/ir-worldview-inventory",
};

const coreSurfaces = [
  {
    title: "Foundation",
    eyebrow: "Seven dimensions",
    body: "The opening surface gives people an IR Foundation result: a structured reading of the assumptions they bring to questions of power, order, institutions, norms, history, risk, and agency.",
  },
  {
    title: "Modules",
    eyebrow: "Security and Technology",
    body: "Issue-specific modules test how the foundation behaves when the reader moves from general worldview questions into harder policy terrain, beginning with security and technology.",
  },
  {
    title: "AI Governance",
    eyebrow: "Compass",
    body: "The AI Governance Compass extends the same interpretive logic into governance questions: safety, state capacity, market power, democratic oversight, international coordination, and strategic competition.",
  },
  {
    title: "Profile",
    eyebrow: "Synthesis",
    body: "The profile gathers the results into a readable portrait. It is meant to help people notice patterns in judgment, not to sort them into a fixed identity.",
  },
];

const guardrails = [
  "The framework is interpretive, not psychometric. It does not claim scientific validation or diagnostic authority.",
  "Results are best read as prompts for reflection: they can surface tendencies, but they cannot settle what someone believes.",
  "The dimensions are editorial lenses. They are useful when they clarify tradeoffs and limited when they flatten context.",
  "The friend trial is part of the method. Feedback is being used to refine wording, reduce false precision, and identify where the experience over-explains or under-explains.",
];

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

  if (project.slug === "ir-worldview-inventory") {
    return {
      title: "IR Worldview Inventory",
      description:
        "A serious editorial interactive for examining how people read world politics.",
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

  if (project.slug === "ir-worldview-inventory") {
    return <IrWorldviewInventoryPage project={project} />;
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

function IrWorldviewInventoryPage({ project }: { project: Project }) {
  return (
    <article className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-8 sm:py-18 lg:px-10">
      <Link
        href="/archive"
        className="text-sm uppercase leading-none text-stone-600 underline underline-offset-4 hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900"
      >
        Back to archive
      </Link>

      <header className="mt-10 border-b border-stone-300 pb-12">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <p className="mb-5 text-sm uppercase leading-none text-stone-500">
              {project.category} / {project.status} / Friend trial
            </p>
            <h1 className="max-w-4xl font-serif text-5xl leading-[1.06] text-stone-950 sm:text-7xl">
              IR Worldview Inventory
            </h1>
          </div>
          <div className="max-w-xl">
            <p className="text-xl leading-8 text-stone-700">
              A serious editorial interactive about how people read world
              politics: where they see order, danger, obligation, power, and
              uncertainty.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href={irWorldviewLinks.live}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit border border-stone-950 bg-stone-950 px-5 py-3 text-sm uppercase leading-none text-stone-50 hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900"
              >
                Open friend trial
              </a>
              <p className="max-w-xs text-sm leading-6 text-stone-600">
                The live Vercel app is currently being shared for limited
                friend feedback.
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-10 border-b border-stone-300 py-14 lg:grid-cols-[14rem_1fr]">
        <div>
          <p className="text-sm uppercase leading-none text-stone-500">
            Why this exists
          </p>
        </div>
        <div className="max-w-3xl space-y-6 text-lg leading-8 text-stone-700">
          <p>
            People often argue about world politics as if they are only
            disagreeing about facts. Just as often, they are disagreeing about
            priors: whether order is fragile or resilient, whether institutions
            discipline power or disguise it, whether restraint is prudence or
            abdication, and what kinds of risk deserve priority.
          </p>
          <p>
            The IR Worldview Inventory gives those priors a careful language. It
            is designed for readers, students, analysts, and curious citizens who
            want to examine their own habits of interpretation without being
            reduced to a quiz type.
          </p>
        </div>
      </section>

      <section className="border-b border-stone-300 py-14">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm uppercase leading-none text-stone-500">
            How the experience works
          </p>
          <h2 className="font-serif text-4xl leading-tight text-stone-950">
            Four core surfaces, each built to make political judgment easier to
            inspect.
          </h2>
        </div>

        <div className="mt-12 divide-y divide-stone-300 border-y border-stone-300">
          {coreSurfaces.map((surface, index) => (
            <section
              key={surface.title}
              className="grid gap-5 py-8 md:grid-cols-[5rem_13rem_1fr]"
            >
              <p className="font-serif text-3xl leading-none text-stone-400">
                {String(index + 1).padStart(2, "0")}
              </p>
              <div>
                <p className="mb-3 text-sm uppercase leading-none text-stone-500">
                  {surface.eyebrow}
                </p>
                <h3 className="font-serif text-2xl leading-tight text-stone-950">
                  {surface.title}
                </h3>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-stone-700">
                {surface.body}
              </p>
            </section>
          ))}
        </div>
      </section>

      <section className="grid gap-10 border-b border-stone-300 py-14 lg:grid-cols-[14rem_1fr]">
        <div>
          <p className="text-sm uppercase leading-none text-stone-500">
            Methodology and guardrails
          </p>
        </div>
        <div className="max-w-3xl">
          <h2 className="font-serif text-3xl leading-tight text-stone-950">
            The point is disciplined interpretation, not false certainty.
          </h2>
          <div className="mt-8 space-y-5">
            {guardrails.map((guardrail) => (
              <p
                key={guardrail}
                className="border-l border-stone-300 pl-5 text-lg leading-8 text-stone-700"
              >
                {guardrail}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-10 py-14 lg:grid-cols-[14rem_1fr]">
        <div>
          <p className="text-sm uppercase leading-none text-stone-500">Links</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <a
            href={irWorldviewLinks.live}
            target="_blank"
            rel="noreferrer"
            className="border-t border-stone-300 pt-5 text-stone-950 hover:border-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900"
          >
            <p className="text-sm uppercase leading-none text-stone-500">
              Live app
            </p>
            <p className="mt-4 font-serif text-2xl leading-tight">
              Open the Vercel friend trial
            </p>
          </a>
          <a
            href={irWorldviewLinks.github}
            target="_blank"
            rel="noreferrer"
            className="border-t border-stone-300 pt-5 text-stone-950 hover:border-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900"
          >
            <p className="text-sm uppercase leading-none text-stone-500">
              GitHub repo
            </p>
            <p className="mt-4 font-serif text-2xl leading-tight">
              Review the code and project history
            </p>
          </a>
        </div>
      </section>
    </article>
  );
}
