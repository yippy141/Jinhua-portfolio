"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

import type { Locale } from "@/i18n/routing";

type LanguageSwitcherProps = {
  disabled?: boolean;
  className?: string;
};

function removePublicLocale(pathname: string): string {
  if (pathname === "/zh") return "/";
  if (pathname.startsWith("/zh/")) return pathname.slice(3) || "/";
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3) || "/";
  return pathname || "/";
}

function addPublicLocale(locale: Locale, pathname: string): string {
  const normalized = pathname === "" ? "/" : pathname;
  if (locale === "en") return normalized;
  if (normalized === "/") return "/zh";
  return `/zh${normalized}`;
}

function buildQuery(searchParams: string): string {
  const next = new URLSearchParams(searchParams);

  if (next.get("intro") === "force") {
    next.delete("intro");
  }

  next.delete("introDebug");

  const query = next.toString();
  return query ? `?${query}` : "";
}

export function LanguageSwitcher({
  disabled = false,
  className = "",
}: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("language");
  const targetLocale: Locale = locale === "zh-Hans" ? "en" : "zh-Hans";
  const internalPathname = removePublicLocale(pathname);
  const targetPathname = addPublicLocale(targetLocale, internalPathname);

  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className={`font-sans text-[13px] text-ink-2/70 ${className}`}
      >
        {t("label")}
      </span>
    );
  }

  return (
    <a
      href={targetPathname}
      aria-label={t("aria")}
      hrefLang={targetLocale}
      onClick={(event) => {
        event.preventDefault();
        router.replace(`${targetPathname}${buildQuery(window.location.search)}`);
      }}
      className={`rounded-[2px] font-sans text-[13px] text-ink-2 underline-offset-4 transition-colors duration-200 hover:text-ink hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current ${className}`}
    >
      {t("label")}
    </a>
  );
}
