import type { MetadataRoute } from "next";

import { projects } from "@/data/projects";
import {
  absoluteUrl,
  completedCorePaths,
  englishCorePaths,
  publicPath,
} from "@/i18n/paths";

function alternatesFor(pathname: string) {
  return {
    languages: {
      en: absoluteUrl(publicPath("en", pathname)),
      "zh-Hans": absoluteUrl(publicPath("zh-Hans", pathname)),
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const englishCore = englishCorePaths.map((pathname) => ({
    url: absoluteUrl(publicPath("en", pathname)),
    ...(completedCorePaths.includes(
      pathname as (typeof completedCorePaths)[number],
    )
      ? { alternates: alternatesFor(pathname) }
      : {}),
  }));

  const chineseCore = completedCorePaths.map((pathname) => ({
    url: absoluteUrl(publicPath("zh-Hans", pathname)),
    alternates: alternatesFor(pathname),
  }));

  const availableProjects = projects.filter((project) => project.isAvailable);

  const englishProjects = availableProjects.map((project) => ({
    url: absoluteUrl(publicPath("en", `/projects/${project.slug}`)),
    alternates: alternatesFor(`/projects/${project.slug}`),
  }));

  const chineseProjects = availableProjects.map((project) => ({
    url: absoluteUrl(publicPath("zh-Hans", `/projects/${project.slug}`)),
    alternates: alternatesFor(`/projects/${project.slug}`),
  }));

  return [...englishCore, ...chineseCore, ...englishProjects, ...chineseProjects];
}
