import {
  getProjectBySlug,
  projects,
  type Project,
  type ProjectSlug,
} from "@/data/projects";
import {
  lifeAnchors,
  visitedPlaces,
  type LifeAnchorPlace,
  type PlaceId,
  type VisitedPlace,
} from "@/data/places";
import type { Locale } from "@/i18n/routing";

import { enContent } from "./en";
import { zhHansContent } from "./zh-Hans";
import type { LocaleContent, LocalizedProject } from "./types";

const contentByLocale: Record<Locale, LocaleContent> = {
  en: enContent,
  "zh-Hans": zhHansContent,
};

export function getLocaleContent(locale: Locale): LocaleContent {
  return contentByLocale[locale];
}

function localizeProject(locale: Locale, project: Project): LocalizedProject {
  const overlay = contentByLocale[locale].projects[project.slug as ProjectSlug];
  const links = project.links.map((link) => ({
    ...link,
    label: overlay.linkLabels?.[link.label] ?? link.label,
  }));
  const preview = overlay.previewAlt
    ? { ...project.preview, alt: overlay.previewAlt }
    : project.preview;

  return {
    ...project,
    title: overlay.title,
    node: overlay.node ?? project.node,
    dek: overlay.dek ?? project.dek,
    description: overlay.description ?? project.description,
    tags: overlay.tags ?? project.tags,
    detail: overlay.detail ?? project.detail,
    links,
    preview,
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

export type LocalizedLifeAnchorPlace = LifeAnchorPlace & {
  label: string;
  summary: string;
};

export type LocalizedVisitedPlace = VisitedPlace & {
  label: string;
};

export function getLocalizedLifeAnchors(
  locale: Locale,
): LocalizedLifeAnchorPlace[] {
  const content = getLocaleContent(locale);

  return lifeAnchors.map((place) => {
    const overlay = content.places[place.id as PlaceId];
    return {
      ...place,
      label: overlay.name,
      summary: overlay.summary ?? place.summary,
    };
  });
}

export function getLocalizedVisitedPlaces(
  locale: Locale,
): LocalizedVisitedPlace[] {
  const content = getLocaleContent(locale);

  return visitedPlaces.map((place) => {
    const overlay = content.places[place.id as PlaceId];
    return {
      ...place,
      label: overlay.name,
    };
  });
}

export type {
  LocaleContent,
  LocalizedProject,
  MethodologyListItem,
  ProjectContentOverlay,
  TranslationStatus,
} from "./types";
