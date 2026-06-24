import type { Metadata } from "next";

import { getLocaleContent } from "@/data/i18n";
import { localizedMetadata } from "@/i18n/metadata";
import { setStaticLocale, type LocaleParams } from "@/i18n/locale";
import { isLocale, routing } from "@/i18n/routing";

const contactLinks = [
  {
    label: "Email",
    href: "mailto:jhyip16@outlook.com",
    value: "jhyip16@outlook.com",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jinhua-yip-88924513b/",
    value: "linkedin.com/in/jinhua-yip-88924513b",
  },
  {
    label: "GitHub",
    href: "https://github.com/yippy141",
    value: "github.com/yippy141",
  },
  {
    label: "Substack",
    href: "https://substack.com/@yippy2",
    value: "substack.com/@yippy2",
  },
];

type ContactPageProps = {
  params: LocaleParams;
};

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : routing.defaultLocale;
  const content = getLocaleContent(locale).pages.contact;
  return localizedMetadata(locale, "/contact", content.metadata);
}

export default async function ContactPage({ params }: ContactPageProps) {
  const locale = await setStaticLocale(params);
  const content = getLocaleContent(locale).pages.contact;

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-14 sm:px-8 sm:py-18">
      <p aria-hidden="true" className="mb-4 font-sans text-sm text-oxblood">
        {locale === "en" ? "Contact" : "联系"}
      </p>
      <h1 className="font-serif text-4xl font-medium leading-tight tracking-tight text-ink sm:text-5xl">
        {content.heading}
      </h1>
      {content.introduction ? (
        <p className="mt-5 max-w-[44ch] font-serif text-lg leading-relaxed text-ink-2">
          {content.introduction}
        </p>
      ) : null}

      <dl className="mt-10 divide-y divide-rule border-y border-rule">
        {contactLinks.map((item) => (
          <div
            key={item.label}
            className="grid gap-2 py-5 text-base leading-7 sm:grid-cols-[8rem_1fr]"
          >
            <dt className="font-sans text-ink-2">{item.label}</dt>
            <dd>
              <a
                href={item.href}
                className="text-ink underline underline-offset-4 transition-colors duration-200 hover:text-oxblood focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-oxblood"
              >
                {item.value}
              </a>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
