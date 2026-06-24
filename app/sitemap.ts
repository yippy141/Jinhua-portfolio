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

  const englishProjects = projects.map((project) => ({
    url: absoluteUrl(`/projects/${project.slug}`),
  }));

  return [...englishCore, ...chineseCore, ...englishProjects];
}
