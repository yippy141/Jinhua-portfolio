import type { Metadata } from "next";

import { ArchiveList } from "@/components/archive-list";
import { getLocaleContent, getLocalizedProjects } from "@/data/i18n";
import { localizedMetadata } from "@/i18n/metadata";
import { setStaticLocale, type LocaleParams } from "@/i18n/locale";
import { isLocale, routing } from "@/i18n/routing";

type ArchivePageProps = {
  params: LocaleParams;
};

export async function generateMetadata({
  params,
}: ArchivePageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : routing.defaultLocale;
  const content = getLocaleContent(locale).pages.archive;
  return localizedMetadata(locale, "/archive", content.metadata);
}

export default async function ArchivePage({ params }: ArchivePageProps) {
  const locale = await setStaticLocale(params);
  const content = getLocaleContent(locale).pages.archive;
  const projects = getLocalizedProjects(locale);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-8 sm:py-20 lg:px-10">
      <header className="grid gap-8 md:grid-cols-[1.35fr_1fr] md:items-end md:gap-14">
        <div>
          <p className="font-sans text-sm text-oxblood">{content.label}</p>
          <h1 className="mt-3 max-w-[14ch] font-serif text-4xl font-medium leading-[1.06] tracking-tight text-ink sm:text-5xl">
            {content.heading}
          </h1>
        </div>
        <p className="max-w-[44ch] font-serif text-lg leading-relaxed text-ink-2">
          {content.introduction}
        </p>
      </header>

      <ArchiveList
        projects={projects}
        showDescriptions={locale === "en"}
      />
    </div>
  );
}
