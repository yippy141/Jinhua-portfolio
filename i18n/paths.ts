import type { Locale } from "./routing";

export const productionBaseUrl = "https://www.jhyip.com";

export const completedCorePaths = [
  "/",
  "/about",
  "/research",
  "/archive",
  "/contact",
] as const;

export const englishCorePaths = [
  ...completedCorePaths,
  "/methodology",
] as const;

export function publicPath(locale: Locale, pathname: string): string {
  const normalized = pathname === "" ? "/" : pathname;
  if (locale === "en") return normalized;
  if (normalized === "/") return "/zh";
  return `/zh${normalized}`;
}

export function absoluteUrl(pathname: string): string {
  return new URL(pathname, productionBaseUrl).toString();
}

export function localizedAlternates(pathname: string) {
  return {
    en: publicPath("en", pathname),
    "zh-Hans": publicPath("zh-Hans", pathname),
  };
}
