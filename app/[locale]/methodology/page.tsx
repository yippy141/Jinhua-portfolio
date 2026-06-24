import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getLocaleContent } from "@/data/i18n";
import { Link } from "@/i18n/navigation";
import { localizedMetadata } from "@/i18n/metadata";
import { setStaticLocale, type LocaleParams } from "@/i18n/locale";
import { isLocale, routing } from "@/i18n/routing";
import type { MethodologyListItem } from "@/data/i18n";

type MethodologyPageProps = {
  params: LocaleParams;
};

export async function generateMetadata({
  params,
}: MethodologyPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : routing.defaultLocale;
  const content = getLocaleContent(locale).methodology;

  return localizedMetadata(locale, "/methodology", content.metadata);
}

function MethodologyList({
  items,
}: {
  items: readonly MethodologyListItem[];
}) {
  return (
    <dl className="mt-6 divide-y divide-rule border-y border-rule">
      {items.map((item) => (
        <div
          key={item.term}
          className="grid gap-3 py-4 sm:grid-cols-[13rem_1fr] sm:gap-8"
        >
          <dt
            className={`font-data text-sm leading-6 ${
              item.className ?? "text-ink"
            }`}
          >
            {item.term}
          </dt>
          <dd className="font-serif text-lg leading-[1.65] text-ink-2">
            {item.gloss}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function MethodologySection({
  title,
  children,
}: Readonly<{
  title: string;
  children: React.ReactNode;
}>) {
  return (
    <section className="border-t border-rule pt-9">
      <h2 className="font-serif text-2xl font-medium leading-tight tracking-tight text-ink">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function MethodologyPage({
  params,
}: MethodologyPageProps) {
  const locale = await setStaticLocale(params);
  const content = getLocaleContent(locale).methodology;

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <SiteHeader />
      <main id="main" className="flex-1">
        <article className="mx-auto w-full max-w-3xl px-6 py-14 sm:px-8 sm:py-20">
          <header className="pb-10">
            <h1 className="font-serif text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl">
              {content.title}
            </h1>
            <p className="mt-6 max-w-[48ch] font-serif text-lg leading-[1.65] text-ink-2">
              {content.introduction}
            </p>
          </header>

          <div className="space-y-10 font-serif text-lg leading-[1.65] text-ink">
            <MethodologySection title={content.ruleTitle}>
              <p className="mt-5">
                {content.rule}
              </p>
            </MethodologySection>

            <MethodologySection title={content.sourceRecordTitle}>
              <MethodologyList items={content.sourceRecordFields} />
            </MethodologySection>

            <MethodologySection title={content.evidenceClassesTitle}>
              <MethodologyList items={content.evidenceClasses} />
            </MethodologySection>

            <MethodologySection title={content.confidenceTitle}>
              <MethodologyList items={content.confidenceLevels} />
            </MethodologySection>

            <MethodologySection title={content.claimStatusTitle}>
              <MethodologyList items={content.claimStatuses} />
            </MethodologySection>

            <MethodologySection title={content.limitsTitle}>
              <p className="mt-5">
                {content.limits}
              </p>
            </MethodologySection>

            <MethodologySection title={content.buildTitle}>
              <p className="mt-5">
                {content.build}
              </p>
            </MethodologySection>

            <MethodologySection title={content.correctionsTitle}>
              <p className="mt-5">
                {content.corrections.beforeLink}
                <Link
                  href="/contact"
                  className="text-oxblood underline underline-offset-4 hover:text-oxblood-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-oxblood"
                >
                  {content.corrections.linkLabel}
                </Link>
                {content.corrections.afterLink}
              </p>
            </MethodologySection>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
