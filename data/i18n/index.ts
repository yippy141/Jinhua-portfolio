import {
  getProjectBySlug,
  projects,
  type Project,
  type ProjectSlug,
} from "@/data/projects";
import type { Locale } from "@/i18n/routing";

import { enContent } from "./en";
import { zhHansContent } from "./zh-Hans";
import type { LocaleContent, LocalizedProject } from "./types";

const contentByLocale = {
  en: enContent,
  "zh-Hans": zhHansContent,
} satisfies Record<Locale, LocaleContent>;

export function getLocaleContent(locale: Locale): LocaleContent {
  return contentByLocale[locale];
}

function localizeProject(locale: Locale, project: Project): LocalizedProject {
  const overlay = contentByLocale[locale].projects[project.slug as ProjectSlug];

  return {
    ...project,
    title: overlay.title,
    node: overlay.node ?? project.node,
    dek: overlay.dek ?? project.dek,
    description: overlay.description ?? project.description,
    tags: overlay.tags ?? project.tags,
    detail: overlay.detail ?? project.detail,
    translationStatus: overlay.translationStatus,
    pendingNotice: overlay.pendingNotice,
    hasLocalizedEditorial: overlay.translationStatus === "complete",
  };
}

export function getLocalizedProjects(locale: Locale): LocalizedProject[] {
  return projects.map((project) => localizeProject(locale, project));
}

export function getLocalizedProjectBySlug(
  locale: Locale,
  slug: string,
): LocalizedProject | undefined {
  const project = getProjectBySlug(slug);
  return project ? localizeProject(locale, project) : undefined;
}

export type {
  LocaleContent,
  LocalizedProject,
  ProjectContentOverlay,
  TranslationStatus,
} from "./types";
