import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getProjectBySlug,
  type Project,
  projects,
  projectStatusLabels,
  projectTypeLabels,
} from "@/data/projects";

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

const psiiDimensions = [
  {
    title: "Governance & Elite Capture",
    body: "How vulnerable is a state to influence through patronage, corruption, elite concentration, weak regulatory institutions, and state-business entanglement?",
  },
  {
    title: "Economic Structure & FDI",
    body: "How much leverage can be exercised through investment patterns, ownership concentration, dependence, and commercial gatekeeping in strategic sectors?",
  },
  {
    title: "Information-Environment Control",
    body: "How much influence can be exerted through media systems, platform power, communications infrastructure, and the broader shaping of public narratives?",
  },
];

const psiiComparisonSnapshot = [
  { country: "Philippines", value: 78 },
  { country: "Indonesia", value: 62 },
  { country: "Thailand", value: 68 },
  { country: "Malaysia", value: 58 },
  { country: "Cambodia", value: 82 },
  { country: "Japan", value: 34 },
  { country: "Australia", value: 28 },
  { country: "United States", value: 42 },
];

const philippinesFindings = [
  {
    title: "Private actors are strategic variables",
    body: "Commercial actors do not simply respond to conflict. They can alter incentives, constrain policy options, and shape how states manage escalation.",
  },
  {
    title: "Governance structure matters",
    body: "The degree of elite capture, regulatory weakness, and concentration inside the domestic political economy shapes how influence travels.",
  },
  {
    title: "Infrastructure and information systems are part of the contest",
    body: "Telecoms, ports, energy systems, media environments, and platform power are not background conditions.",
  },
  {
    title: "Middle-power strategy is partly political-economic",
    body: "Questions of hedging, balancing, resilience, and alignment cannot be fully understood without looking at domestic business structures and external commercial leverage.",
  },
];

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

type ProjectMeta = {
  title: string;
  description: string;
  ogImage: string;
};

const projectMeta: Partial<Record<string, ProjectMeta>> = {
  "ir-worldview-inventory": {
    title: "IR Worldview Inventory",
    description:
      "A serious editorial interactive for examining how people read world politics.",
    ogImage: "/previews/ir-worldview-poster-1.png",
  },
  psii: {
    title: "PSII — Private Sector Influence Index",
    description:
      "A comparative lens for reading governance capture, economic leverage, and information control as strategic variables.",
    ogImage: "/og.png",
  },
  "philippines-south-china-sea": {
    title: "The Philippines in the South China Sea",
    description:
      "A published chapter on how private-sector actors shape asymmetric conflict in the shadow of great-power competition.",
    ogImage: "/og.png",
  },
};

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  const meta = projectMeta[slug] ?? {
    title: project.title,
    description: project.dek,
    ogImage: "/og.png",
  };

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/projects/${slug}`,
    },
    openGraph: {
      type: "article",
      siteName: "Jinhua Yip",
      title: meta.title,
      description: meta.description,
      url: `/projects/${slug}`,
      images: [
        {
          url: meta.ogImage,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [meta.ogImage],
    },
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

  if (project.slug === "psii") {
    return <PsiiPage />;
  }

  if (project.slug === "philippines-south-china-sea") {
    return <PhilippinesSouthChinaSeaPage />;
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
          {projectTypeLabels[project.type]} /{" "}
          {projectStatusLabels[project.status]}
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
            <dd className="text-stone-900">
              {projectStatusLabels[project.status]}
            </dd>
          </div>
        </dl>
        <div className="space-y-6 text-lg leading-8 text-stone-700">
          <p>{project.description}</p>
        </div>
      </div>
    </article>
  );
}

function PsiiPage() {
  return (
    <article className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-8 sm:py-18 lg:px-10">
      <Link
        href="/archive"
        className="text-sm uppercase leading-none text-stone-600 underline underline-offset-4 hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900"
      >
        Back to archive
      </Link>

      <header className="mt-10 border-b border-stone-300 pb-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="mb-5 text-sm uppercase leading-none text-stone-500">
              Research framework / dashboard forthcoming
            </p>
            <h1 className="max-w-4xl font-serif text-5xl leading-[1.06] text-stone-950 sm:text-7xl">
              PSII — Private Sector Influence Index
            </h1>
          </div>
          <div className="max-w-xl">
            <p className="text-xl leading-8 text-stone-700">
              A comparative lens for reading governance capture, economic
              leverage, and information control as strategic variables.
            </p>
            <p className="mt-8 max-w-md text-sm leading-6 text-stone-600">
              Developed as part of my published chapter on private-sector
              influence in the South China Sea.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-10 border-b border-stone-300 py-14 lg:grid-cols-[14rem_1fr]">
        <div>
          <p className="text-sm uppercase leading-none text-stone-500">
            Why it exists
          </p>
        </div>
        <div className="max-w-3xl text-lg leading-8 text-stone-700">
          <p>
            Asymmetric conflict is often framed through military imbalance,
            alliance structure, geography, or regime type. Those lenses matter,
            but they can miss another layer of power: the firms, conglomerates,
            investors, media systems, and commercially oriented networks that
            shape what states can do, what governments are pressured to do, and
            how conflict is narrated in public. PSII was developed to make that
            layer more legible. It is a comparative framework for examining how
            private-sector influence can alter resilience, strategic choice, and
            the wider political environment around conflict.
          </p>
        </div>
      </section>

      <section className="border-b border-stone-300 py-14">
        <div className="grid gap-10 lg:grid-cols-[14rem_1fr]">
          <div>
            <p className="text-sm uppercase leading-none text-stone-500">
              Three dimensions
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {psiiDimensions.map((dimension, index) => (
              <article
                key={dimension.title}
                className="border border-stone-300 p-5"
              >
                <p className="mb-8 font-serif text-3xl leading-none text-stone-400">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="font-serif text-2xl leading-tight text-stone-950">
                  {dimension.title}
                </h3>
                <p className="mt-5 text-base leading-7 text-stone-700">
                  {dimension.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-10 border-b border-stone-300 py-14 lg:grid-cols-[14rem_1fr]">
        <div>
          <p className="text-sm uppercase leading-none text-stone-500">
            How to read it
          </p>
        </div>
        <div className="max-w-3xl text-lg leading-8 text-stone-700">
          <p>
            PSII should be read as a structured analytical lens, not a
            definitive ranking of national vulnerability. It is useful when it
            clarifies where private-sector leverage may be concentrated, how
            that leverage might travel through institutions, and what kinds of
            political-economic arrangements make influence easier or harder to
            exercise.
          </p>
        </div>
      </section>

      <section className="grid gap-10 border-b border-stone-300 py-14 lg:grid-cols-[14rem_1fr]">
        <div>
          <p className="text-sm uppercase leading-none text-stone-500">
            Comparison snapshot
          </p>
        </div>
        <PsiiComparisonChart />
      </section>

      <section className="grid gap-10 border-b border-stone-300 py-14 lg:grid-cols-[14rem_1fr]">
        <div>
          <p className="text-sm uppercase leading-none text-stone-500">
            Relation to the chapter
          </p>
        </div>
        <div className="max-w-3xl text-lg leading-8 text-stone-700">
          <p>
            <Link
              href="/projects/philippines-south-china-sea"
              className="text-stone-950 underline underline-offset-4 hover:text-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900"
            >
              PSII emerged from a larger chapter on the Philippines, the South
              China Sea, and the role of private-sector actors in asymmetric
              conflict.
            </Link>
          </p>
        </div>
      </section>

      <section className="grid gap-10 py-14 lg:grid-cols-[14rem_1fr]">
        <div>
          <p className="text-sm uppercase leading-none text-stone-500">
            Roadmap
          </p>
        </div>
        <div className="max-w-3xl text-lg leading-8 text-stone-700">
          <p>
            The next version will translate the framework into an interactive
            dashboard with clearer country comparisons, dimension-level
            breakdowns, and a more explicit methodology layer.
          </p>
        </div>
      </section>
    </article>
  );
}

function PsiiComparisonChart() {
  return (
    <div
      className="w-full max-w-3xl"
      role="img"
      aria-label="PSII composite score comparison across eight countries. Higher scores indicate greater estimated private-sector influence vulnerability. Scores range from 0 to 100."
    >
      <div className="space-y-4">
        {psiiComparisonSnapshot.map((item) => (
          <div
            key={item.country}
            className="grid gap-2 sm:grid-cols-[9rem_1fr_3rem] sm:items-center"
          >
            <p className="text-sm leading-6 text-stone-700">{item.country}</p>
            <div
              className="h-3 border border-stone-300 bg-stone-100"
              aria-hidden="true"
            >
              <div
                className="h-full bg-stone-800"
                style={{ width: `${item.value}%` }}
              />
            </div>
            <p
              className="text-sm leading-6 text-stone-500 sm:text-right"
              aria-label={`${item.value} out of 100`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhilippinesSouthChinaSeaPage() {
  return (
    <article className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-8 sm:py-18 lg:px-10">
      <Link
        href="/archive"
        className="text-sm uppercase leading-none text-stone-600 underline underline-offset-4 hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900"
      >
        Back to archive
      </Link>

      <header className="mt-10 border-b border-stone-300 pb-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <h1 className="max-w-4xl font-serif text-5xl leading-[1.06] text-stone-950 sm:text-7xl">
              The Philippines in the South China Sea
            </h1>
          </div>
          <div className="max-w-xl">
            <p className="text-xl leading-8 text-stone-700">
              A published chapter on how private-sector actors shape asymmetric
              conflict in the shadow of great-power competition.
            </p>
            <p className="mt-8 max-w-md text-sm leading-6 text-stone-600">
              Published in 2025 as part of a wider research project on
              governance, political economy, and strategic influence.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-10 border-b border-stone-300 py-14 lg:grid-cols-[14rem_1fr]">
        <div>
          <p className="text-sm uppercase leading-none text-stone-500">
            Central argument
          </p>
        </div>
        <div className="max-w-3xl text-lg leading-8 text-stone-700">
          <p>
            The chapter argues that private-sector actors are not peripheral to
            conflict dynamics. In the Philippine case, domestic conglomerates,
            foreign firms, investors, telecom infrastructure, media systems, and
            business-state networks all help shape the strategic environment in
            which the South China Sea dispute unfolds.
          </p>
        </div>
      </section>

      <section className="grid gap-10 border-b border-stone-300 py-14 lg:grid-cols-[14rem_1fr]">
        <div>
          <p className="text-sm uppercase leading-none text-stone-500">
            Why the case matters
          </p>
        </div>
        <div className="max-w-3xl text-lg leading-8 text-stone-700">
          <p>
            The Philippines is a revealing case because it sits at the
            intersection of middle-power strategy, maritime coercion, alliance
            management, and great-power competition. It is also a political
            economy in which private influence is unusually visible.
          </p>
        </div>
      </section>

      <section className="border-b border-stone-300 py-14">
        <div className="grid gap-10 lg:grid-cols-[14rem_1fr]">
          <div>
            <p className="text-sm uppercase leading-none text-stone-500">
              Key findings
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {philippinesFindings.map((finding, index) => (
              <article
                key={finding.title}
                className="border border-stone-300 p-5"
              >
                <p className="mb-8 font-serif text-3xl leading-none text-stone-400">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="font-serif text-2xl leading-tight text-stone-950">
                  {finding.title}
                </h3>
                <p className="mt-5 text-base leading-7 text-stone-700">
                  {finding.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-10 border-b border-stone-300 py-14 lg:grid-cols-[14rem_1fr]">
        <div>
          <p className="text-sm uppercase leading-none text-stone-500">
            The PSII artifact
          </p>
        </div>
        <div className="max-w-3xl text-lg leading-8 text-stone-700">
          <p>
            One artifact that came out of this chapter is{" "}
            <Link
              href="/projects/psii"
              className="text-stone-950 underline underline-offset-4 hover:text-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900"
            >
              PSII, the Private Sector Influence Index
            </Link>
            . It is an attempt to operationalize part of the chapter’s
            framework.
          </p>
        </div>
      </section>

      <section className="grid gap-10 py-14 lg:grid-cols-[14rem_1fr]">
        <div>
          <p className="text-sm uppercase leading-none text-stone-500">
            Future direction
          </p>
        </div>
        <div className="max-w-3xl text-lg leading-8 text-stone-700">
          <p>
            The next step is to turn the chapter’s analytical structure into
            interactive research tools, starting with the PSII comparison system.
          </p>
        </div>
      </section>
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
              {projectTypeLabels[project.type]} /{" "}
              {projectStatusLabels[project.status]} / Friend trial
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
