import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Link } from "@/i18n/navigation";
import { localizedMetadata } from "@/i18n/metadata";
import { setStaticLocale, type LocaleParams } from "@/i18n/locale";
import { isLocale, routing } from "@/i18n/routing";

const sourceRecordFields = [
  {
    term: "source",
    gloss: "The publication or document the claim comes from, with a link out.",
  },
  {
    term: "published / retrieved",
    gloss: "When the source was published and when it was last checked.",
  },
  {
    term: "evidence class",
    gloss: "What kind of source it is. The ladder is below.",
  },
  {
    term: "confidence",
    gloss: "How much weight the claim deserves, stated plainly.",
  },
  {
    term: "locator",
    gloss:
      "The page, table, row, or timestamp the claim came from, so a reader can check it.",
  },
  {
    term: "uncertainty note",
    gloss: "What is unclear, when something is.",
  },
];

const evidenceClasses = [
  {
    term: "official",
    gloss: "Primary documents: official reports, order books, filings.",
  },
  {
    term: "press_release",
    gloss: "A company or government announcement.",
  },
  {
    term: "filing",
    gloss: "An investor or regulatory filing.",
  },
  {
    term: "regulator",
    gloss: "A regulator or standards body.",
  },
  {
    term: "media_context",
    gloss: "Reputable media, used for context rather than as primary proof.",
  },
  {
    term: "third_party_dataset",
    gloss: "An external dataset, used within its rights.",
  },
  {
    term: "manual_estimate",
    gloss: "My own estimate, always labeled as one.",
  },
  {
    term: "mock",
    gloss: "A placeholder. Never shown as real data.",
  },
];

const confidenceLevels = [
  {
    term: "high",
    gloss: "Multiple strong primary sources agree.",
    className: "text-confidence-high",
  },
  {
    term: "medium",
    gloss: "The direction is clear, but sourcing is thin or partly secondary.",
    className: "text-confidence-medium",
  },
  {
    term: "low",
    gloss: "A single weak source, or an inference.",
    className: "text-confidence-low",
  },
];

const claimStatuses = [
  {
    term: "confirmed",
    gloss: "Confirmed by a primary source.",
  },
  {
    term: "reported",
    gloss: "Announced or reported, not yet confirmed in primary records.",
  },
  {
    term: "projected",
    gloss: "Forward-looking: a plan, target, or forecast.",
  },
  {
    term: "mock",
    gloss:
      "A placeholder, visibly labeled and styled so it cannot be mistaken for real.",
  },
];

type MethodologyPageProps = {
  params: LocaleParams;
};

export async function generateMetadata({
  params,
}: MethodologyPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : routing.defaultLocale;

  return localizedMetadata(
    locale,
    "/methodology",
    {
      title: "Methodology",
      description: "The evidence standard that governs every atlas on this site.",
    },
    {
      alternates: false,
      noindex: locale === "zh-Hans",
    },
  );
}

function MethodologyList({
  items,
}: {
  items: { term: string; gloss: string; className?: string }[];
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
  await setStaticLocale(params);

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <SiteHeader />
      <main id="main" className="flex-1">
        <article className="mx-auto w-full max-w-3xl px-6 py-14 sm:px-8 sm:py-20">
          <header className="pb-10">
            <h1 className="font-serif text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl">
              Methodology
            </h1>
            <p className="mt-6 max-w-[48ch] font-serif text-lg leading-[1.65] text-ink-2">
              Every atlas on this site follows one evidence standard. This page
              states it once, so the standard does not vary from project to
              project.
            </p>
          </header>

          <div className="space-y-10 font-serif text-lg leading-[1.65] text-ink">
            <MethodologySection title="The rule">
              <p className="mt-5">
                Every public claim traces to a source record. If a number or a
                statement appears in an atlas, a record behind it names the
                source, when it was published, when it was retrieved, and how
                much weight it deserves. No orphan facts.
              </p>
            </MethodologySection>

            <MethodologySection title="What a source record contains">
              <MethodologyList items={sourceRecordFields} />
            </MethodologySection>

            <MethodologySection title="Evidence classes, strongest to weakest">
              <MethodologyList items={evidenceClasses} />
            </MethodologySection>

            <MethodologySection title="Confidence, in plain words">
              <MethodologyList items={confidenceLevels} />
            </MethodologySection>

            <MethodologySection title="Claim status">
              <MethodologyList items={claimStatuses} />
            </MethodologySection>

            <MethodologySection title="Limits">
              <p className="mt-5">
                These atlases work from the public record. They are not
                real-time, and they carry no privileged information. Where the
                record is thin, the atlas says so rather than filling the gap. An
                absence in an atlas means the public record is thin, not that the
                thing does not exist.
              </p>
            </MethodologySection>

            <MethodologySection title="How these are built">
              <p className="mt-5">
                These projects are built with AI assistance for code and data
                structuring. Source selection and analysis are my own judgment.
              </p>
            </MethodologySection>

            <MethodologySection title="Corrections">
              <p className="mt-5">
                If you find an error,{" "}
                <Link
                  href="/contact"
                  className="text-oxblood underline underline-offset-4 hover:text-oxblood-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-oxblood"
                >
                  tell me
                </Link>. Each atlas carries a last-updated date, and corrections
                are noted.
              </p>
            </MethodologySection>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
