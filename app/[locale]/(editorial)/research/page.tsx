import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { getLocaleContent, getLocalizedProjects } from "@/data/i18n";
import { Link } from "@/i18n/navigation";
import { localizedMetadata } from "@/i18n/metadata";
import { setStaticLocale, type LocaleParams } from "@/i18n/locale";
import { isLocale, routing } from "@/i18n/routing";
import type { ProjectSlug } from "@/data/projects";

type ResearchPageProps = {
  params: LocaleParams;
};

export async function generateMetadata({
  params,
}: ResearchPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : routing.defaultLocale;
  const content = getLocaleContent(locale).pages.research;
  return localizedMetadata(locale, "/research", content.metadata);
}

export default async function ResearchPage({ params }: ResearchPageProps) {
  const locale = await setStaticLocale(params);
  const content = getLocaleContent(locale).pages.research;
  const t = await getTranslations({ locale, namespace: "projects" });
  const projects = getLocalizedProjects(locale);

  function getProjectsBySlugs(slugs: readonly ProjectSlug[]) {
    const slugSet = new Set<string>(slugs);
    return projects.filter((project) => slugSet.has(project.slug));
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-8 sm:py-18 lg:px-10">
      <div className="max-w-3xl">
        <p className="mb-4 font-sans text-sm text-oxblood">{content.label}</p>
        <h1 className="font-serif text-4xl font-medium leading-tight tracking-tight text-ink sm:text-5xl">
          {content.heading}
        </h1>
        <p className="mt-6 font-serif text-lg leading-relaxed text-ink-2">
          {content.introduction}
        </p>
      </div>

      <div className="mt-14 space-y-14">
        {content.groups.map((group) => {
          const groupProjects = getProjectsBySlugs(group.slugs);

          return (
            <section key={group.title}>
              <h2 className="border-b border-rule pb-4 font-sans text-sm text-ink-2">
                {group.title}
              </h2>
              <div className="grid gap-8 pt-8 md:grid-cols-2">
                {groupProjects.map((project) => (
                  <article
                    key={project.slug}
                    className="border-t border-rule pt-5"
                  >
                    <p className="mb-4 font-sans text-[13px] text-ink-2">
                      {t(`types.${project.type}`)} ·{" "}
                      {t(`statuses.${project.status}`)}
                      {!project.isAvailable ? ` · ${t("availableShortly")}` : ""}
                    </p>
                    <h3 className="font-serif text-2xl font-medium leading-tight text-ink">
                      {project.isAvailable ? (
                        <Link
                          href={`/projects/${project.slug}`}
                          className="transition-colors duration-200 hover:text-oxblood hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-oxblood"
                        >
                          {project.title}
                        </Link>
                      ) : (
                        project.title
                      )}
                    </h3>
                    {project.hasLocalizedEditorial ? (
                      <p className="mt-4 font-serif text-base leading-relaxed text-ink-2">
                        {project.dek}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
