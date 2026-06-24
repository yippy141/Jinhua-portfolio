import type { Metadata } from "next";

import { getLocaleContent } from "@/data/i18n";
import { Link } from "@/i18n/navigation";
import { localizedMetadata } from "@/i18n/metadata";
import { setStaticLocale, type LocaleParams } from "@/i18n/locale";
import { isLocale, routing } from "@/i18n/routing";

type AboutPageProps = {
  params: LocaleParams;
};

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : routing.defaultLocale;
  const content = getLocaleContent(locale).pages.about;
  return localizedMetadata(locale, "/about", content.metadata);
}

function LinkedSentence({
  sentence,
  linkLabel,
}: {
  sentence: string;
  linkLabel: string;
}) {
  const [before = "", after = ""] = sentence.split(linkLabel);

  return (
    <>
      {before}
      <Link
        href="/methodology"
        className="text-oxblood underline underline-offset-4 transition-colors duration-200 hover:text-oxblood-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-oxblood"
      >
        {linkLabel}
      </Link>
      {after}
    </>
  );
}

export default async function AboutPage({ params }: AboutPageProps) {
  const locale = await setStaticLocale(params);
  const content = getLocaleContent(locale).pages.about;

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-14 sm:px-8 sm:py-20">
      <h1 className="font-serif text-4xl font-medium leading-tight tracking-tight text-ink sm:text-5xl">
        {content.heading}
      </h1>

      <div className="mt-10 space-y-6 font-serif text-[1.0625rem] leading-[1.65] text-ink sm:text-lg">
        {content.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}

        <p className="font-sans text-base leading-[1.6] text-ink-2">
          <LinkedSentence
            sentence={content.methodologySentence}
            linkLabel={content.methodologyLinkLabel}
          />
        </p>
      </div>
    </div>
  );
}
