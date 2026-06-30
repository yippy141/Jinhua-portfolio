"use client";

import { motion, useReducedMotion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import type { LocalizedProject } from "@/data/i18n";
import type { Locale } from "@/i18n/routing";
import { Link as IntlLink } from "@/i18n/navigation";

// The filter bar mixes two axes on purpose: Flagship and Lab read the project
// `tier`, while Research and Writing read the project `type`. All shows
// everything.
const filters = ["all", "flagship", "lab", "research", "writing"] as const;
type Filter = (typeof filters)[number];

function matchesFilter(project: LocalizedProject, filter: Filter): boolean {
  switch (filter) {
    case "all":
      return true;
    case "flagship":
      return project.tier === "flagship";
    case "lab":
      return project.tier === "lab";
    case "research":
      return project.type === "research";
    case "writing":
      return project.type === "essay";
  }
}

// Flagships sort to the top, then labs, then anything still at the concept
// stage. Within a tier, projects keep their data-file order.
const tierRank: Record<LocalizedProject["tier"], number> = {
  flagship: 0,
  lab: 1,
  concept: 2,
};

const zhTagLabels: Record<string, string> = {
  "IR theory": "国际关系理论",
  "AI governance": "人工智能治理",
  compute: "算力",
  semiconductors: "半导体",
  "export controls": "出口管制",
  "commercial space": "商业航天",
  "rare earths": "稀土",
  "supply chains": "供应链",
  "private-sector influence": "私营部门影响",
  "foreign policy": "外交政策",
  maritime: "海事",
  essays: "文章",
  notes: "笔记",
};

function localizeTag(locale: Locale, tag: string): string {
  if (locale !== "zh-Hans") return tag;
  return zhTagLabels[tag] ?? tag;
}

type ArchiveListProps = {
  projects: LocalizedProject[];
  showDescriptions: boolean;
};

export function ArchiveList({
  projects,
  showDescriptions,
}: ArchiveListProps) {
  const prefersReducedMotion = useReducedMotion();
  const locale = useLocale() as Locale;
  const t = useTranslations("archiveList");
  const projectText = useTranslations("projects");
  const [active, setActive] = useState<Filter>("all");

  const rows = projects
    .filter((project) => matchesFilter(project, active))
    .sort((a, b) => tierRank[a.tier] - tierRank[b.tier]);
  const rowBase =
    "group grid gap-3 rounded-[3px] px-0 py-6 transition-colors duration-200 sm:px-4 md:grid-cols-[8.5rem_1fr_11rem] md:gap-9";
  const rowInteractive =
    `${rowBase} hover:bg-paper-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oxblood`;

  return (
    <div className="mt-12">
      {/* Filter bar + count */}
      <div className="flex flex-col gap-4 border-y border-rule py-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="flex flex-wrap gap-1.5"
          role="group"
          aria-label={t("filterLabel")}
        >
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
                {t(`filters.${filter}`)}
              </button>
            );
          })}
        </div>
        <p className="font-sans text-[13px] text-ink-2">
          {rows.length}{" "}
          {rows.length === 1 ? t("projectSingular") : t("projectPlural")}
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
        {rows.map((project) => {
          const rowContent = (
            <>
              {/* type + status */}
              <div className="flex flex-row items-baseline gap-3 md:flex-col md:gap-1.5 md:pt-1.5">
                <span
                  className={`font-sans text-[13px] ${
                    project.tier === "flagship" ? "text-oxblood" : "text-ink-2"
                  }`}
                >
                  {projectText(`types.${project.type}`)}
                </span>
                <span className="font-sans text-[13px] text-ink-2">
                  {projectText(`statuses.${project.status}`)}
                </span>
              </div>

              {/* title + dek + tags */}
              <div>
                <h2 className="font-serif text-2xl font-medium leading-snug text-ink">
                  {project.title}
                </h2>
                {showDescriptions && project.hasLocalizedEditorial ? (
                  <p className="mt-2 max-w-[52ch] font-serif text-base leading-relaxed text-ink-2">
                    {project.dek}
                  </p>
                ) : null}
                {project.tags.length > 0 && (
                  <p className="mt-3 font-sans text-[13px] text-ink-2">
                    {project.tags
                      .map((tag) => localizeTag(locale, tag))
                      .join(" · ")}
                  </p>
                )}
              </div>

              {/* type + year + open affordance */}
              <div className="flex flex-row items-center justify-between gap-3 md:flex-col md:items-end md:justify-start md:gap-3 md:pt-1">
                <span className="font-sans text-[13px] text-ink-2">
                  {project.year}
                </span>
                <span
                  aria-hidden={project.isAvailable ? "true" : undefined}
                  className={`font-sans text-[13px] ${
                    project.isAvailable
                      ? "text-oxblood transition-transform duration-200 group-hover:translate-x-0.5"
                      : "text-ink-2"
                  }`}
                >
                  {project.isAvailable
                    ? `${t("open")} →`
                    : projectText("availableShortly")}
                </span>
              </div>
            </>
          );

          return (
            <li key={project.slug} className="border-b border-rule">
              {project.isAvailable ? (
                <IntlLink
                  href={`/projects/${project.slug}`}
                  className={rowInteractive}
                >
                  {rowContent}
                </IntlLink>
              ) : (
                <div className={rowBase}>{rowContent}</div>
              )}
            </li>
          );
        })}
      </motion.ul>
    </div>
  );
}
