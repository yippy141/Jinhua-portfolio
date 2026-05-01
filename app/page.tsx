import Link from "next/link";

import { HomeSceneClient } from "@/components/home-scene-client";
import { projects, projectTypeLabels } from "@/data/projects";

const navigation = [
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About" },
  { href: "/research", label: "Research" },
];

const featuredProjectSlugs = new Set(["ir-worldview-inventory", "psii"]);

const featuredProjects = projects.filter((project) =>
  featuredProjectSlugs.has(project.slug),
);

export default function Home() {
  return (
    <main
      id="main"
      className="relative isolate min-h-screen overflow-hidden bg-[#070807] text-stone-50"
    >
      <HomeSceneClient />

      <div className="pointer-events-none absolute inset-0 z-[-50] bg-[linear-gradient(115deg,rgba(7,8,7,1)_0%,rgba(13,25,21,0.92)_42%,rgba(20,18,25,0.9)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-[-30] opacity-40 [background-image:linear-gradient(rgba(250,250,248,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(250,250,248,0.035)_1px,transparent_1px)] [background-size:86px_86px]" />
      <div className="pointer-events-none absolute inset-0 z-[-20] opacity-30 [background-image:repeating-linear-gradient(170deg,transparent_0,transparent_36px,rgba(231,229,228,0.05)_37px,transparent_39px)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[-10] h-1/2 bg-[linear-gradient(0deg,rgba(7,8,7,0.92)_0%,rgba(7,8,7,0)_100%)]" />

      <header className="absolute inset-x-0 top-0 z-40">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-6 py-6 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10">
          <Link
            href="/"
            className="w-fit font-serif text-2xl leading-none text-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-100"
          >
            Jinhua Yip
          </Link>
          <nav aria-label="Primary navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm uppercase leading-none text-stone-300">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="underline-offset-4 hover:text-stone-50 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <section className="relative z-20 flex min-h-screen items-end px-6 pb-12 pt-36 sm:px-8 sm:pb-16 lg:px-10">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(24rem,0.42fr)] lg:items-end">
          <div>
            <p className="mb-6 text-sm uppercase leading-none text-stone-400">
              Yippy&apos;s Sea of Consciousness
            </p>
            <h1 className="max-w-5xl font-serif text-5xl leading-[1.03] text-stone-50 sm:text-7xl lg:text-8xl">
              Welcome to my personal repository
            </h1>
          </div>
          <div className="grid gap-8">
            <p className="max-w-xl text-lg leading-8 text-stone-300">
              A shifting home of my ideas, projects, questions, and interests:
              international affairs, history, aviation, marine life, and
              speculative futures.
            </p>

            <div className="grid gap-3 lg:hidden" aria-label="Featured projects">
              {featuredProjects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="group border border-stone-100/15 bg-stone-100/[0.04] px-4 py-4 text-left backdrop-blur-sm transition hover:border-stone-100/35 hover:bg-stone-100/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-100"
                >
                  <span className="text-xs uppercase leading-none text-stone-400">
                    {projectTypeLabels[project.type]} / {project.year}
                  </span>
                  <span className="mt-3 block font-serif text-2xl leading-tight text-stone-50">
                    {project.title}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-stone-300">
                    {project.dek}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
