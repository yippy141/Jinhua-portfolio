import Link from "next/link";

import { HomeSceneClient } from "@/components/home-scene-client";
import { projects, projectTypeLabels } from "@/data/projects";

const navigation = [
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About" },
  { href: "/research", label: "Research" },
];

const socialLinks = [
  {
    href: "mailto:jhyip16@outlook.com",
    label: "Email Jinhua Yip",
    icon: (
      <path d="M4.75 6.75h14.5v10.5H4.75V6.75Zm.75 1.1 6.5 5 6.5-5M5.5 16.15l4.7-4.25m3.6 0 4.7 4.25" />
    ),
  },
  {
    href: "https://www.linkedin.com/in/jinhua-yip-88924513b/",
    label: "LinkedIn",
    icon: (
      <>
        <path d="M6.5 10v7.25M10.25 17.25V10h3.15c2.05 0 3.1 1.2 3.1 3.45v3.8M10.25 12.6c.55-1.7 1.6-2.6 3.15-2.6" />
        <path d="M6.5 6.8v.05" />
      </>
    ),
  },
  {
    href: "https://github.com/yippy141",
    label: "GitHub",
    icon: (
      <path d="M12 3.75a8.25 8.25 0 0 0-2.6 16.08c.42.08.57-.18.57-.4v-1.42c-2.33.5-2.82-1-2.82-1-.38-.95-.92-1.2-.92-1.2-.76-.52.06-.5.06-.5.83.06 1.27.86 1.27.86.74 1.26 1.94.9 2.41.69.08-.54.29-.9.53-1.11-1.86-.21-3.82-.93-3.82-4.13 0-.91.33-1.66.86-2.25-.09-.21-.37-1.06.08-2.22 0 0 .7-.22 2.28.86A7.85 7.85 0 0 1 12 7.73c.7 0 1.41.1 2.08.28 1.58-1.08 2.28-.86 2.28-.86.45 1.16.17 2.01.08 2.22.53.59.86 1.34.86 2.25 0 3.21-1.96 3.91-3.83 4.12.3.26.57.78.57 1.57v2.12c0 .22.15.48.58.4A8.25 8.25 0 0 0 12 3.75Z" />
    ),
  },
  {
    href: "https://substack.com/@yippy2",
    label: "Substack",
    icon: (
      <path d="M6.25 5.75h11.5M6.25 8.75h11.5M6.25 11.75h11.5v6.5L12 15.25l-5.75 3v-6.5Z" />
    ),
  },
];

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
          <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
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

            <nav aria-label="Social links">
              <ul className="flex items-center gap-3">
                {socialLinks.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className="grid h-8 w-8 place-items-center text-stone-300 transition duration-200 hover:scale-105 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-100"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      >
                        {item.icon}
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
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

            <nav aria-label="Featured projects" className="grid gap-3 lg:hidden">
              <ul className="grid gap-3 list-none p-0 m-0">
                {projects.map((project) => (
                  <li key={project.slug}>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="group block border border-stone-100/15 bg-stone-100/[0.04] px-4 py-4 text-left backdrop-blur-sm transition hover:border-stone-100/35 hover:bg-stone-100/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-100"
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
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </section>
    </main>
  );
}
