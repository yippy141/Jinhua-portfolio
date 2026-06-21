"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import {
  projects,
  projectStatusLabels,
  projectTypeLabels,
  type Project,
} from "@/data/projects";

// The filter bar mixes two axes on purpose: Flagship and Lab read the project
// `tier`, while Research and Writing read the project `type`. All shows
// everything.
const filters = ["All", "Flagship", "Lab", "Research", "Writing"] as const;
type Filter = (typeof filters)[number];

function matchesFilter(project: Project, filter: Filter): boolean {
  switch (filter) {
    case "All":
      return true;
    case "Flagship":
      return project.tier === "flagship";
    case "Lab":
      return project.tier === "lab";
    case "Research":
      return project.type === "research";
    case "Writing":
      return project.type === "essay";
  }
}

// Flagships sort to the top, then labs, then anything still at the concept
// stage. Within a tier, projects keep their data-file order.
const tierRank: Record<Project["tier"], number> = {
  flagship: 0,
  lab: 1,
  concept: 2,
};

export function ArchiveList() {
  const prefersReducedMotion = useReducedMotion();
  const [active, setActive] = useState<Filter>("All");

  const rows = projects
    .filter((project) => matchesFilter(project, active))
    .sort((a, b) => tierRank[a.tier] - tierRank[b.tier]);

  return (
    <div className="mt-12">
      {/* Filter bar + count */}
      <div className="flex flex-col gap-4 border-y border-rule py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter projects">
          {filters.map((filter) => {
            const isOn = filter === active;
            return (
              <button
                key={filter}
                type="button"
                aria-pressed={isOn}
                onClick={() => setActive(filter)}
                className={`rounded-[3px] px-3 py-1.5 font-sans text-[13px] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oxblood ${
                  isOn ? "bg-ink text-paper" : "text-ink-2 hover:text-ink"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
        <p className="font-sans text-[13px] text-ink-2">
          {rows.length} {rows.length === 1 ? "project" : "projects"}
        </p>
      </div>

      {/* Rows */}
      <motion.ul
        key={active}
        initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="m-0 list-none p-0"
      >
        {rows.map((project) => (
          <li key={project.slug} className="border-b border-rule">
            <Link
              href={`/projects/${project.slug}`}
              className="group grid gap-3 rounded-[3px] px-0 py-6 transition-colors duration-200 hover:bg-paper-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oxblood sm:px-4 md:grid-cols-[8.5rem_1fr_11rem] md:gap-9"
            >
              {/* type + status */}
              <div className="flex flex-row items-baseline gap-3 md:flex-col md:gap-1.5 md:pt-1.5">
                <span
                  className={`font-sans text-[13px] ${
                    project.tier === "flagship" ? "text-oxblood" : "text-ink-2"
                  }`}
                >
                  {projectTypeLabels[project.type]}
                </span>
                <span className="font-sans text-[13px] text-ink-2">
                  {projectStatusLabels[project.status]}
                </span>
              </div>

              {/* title + dek + tags */}
              <div>
                <h2 className="font-serif text-2xl font-medium leading-snug text-ink">
                  {project.title}
                </h2>
                <p className="mt-2 max-w-[52ch] font-serif text-base leading-relaxed text-ink-2">
                  {project.dek}
                </p>
                {project.tags.length > 0 && (
                  <p className="mt-3 font-sans text-[13px] text-ink-2">
                    {project.tags.join(" · ")}
                  </p>
                )}
              </div>

              {/* type + year + open affordance */}
              <div className="flex flex-row items-center justify-between gap-3 md:flex-col md:items-end md:justify-start md:gap-3 md:pt-1">
                <span className="font-sans text-[13px] text-ink-2">
                  {project.year}
                </span>
                <span
                  aria-hidden="true"
                  className="font-sans text-[13px] text-oxblood transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  Open →
                </span>
              </div>
            </Link>
          </li>
        ))}
      </motion.ul>
    </div>
  );
}
