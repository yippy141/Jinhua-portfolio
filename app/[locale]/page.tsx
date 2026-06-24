import type { Metadata } from "next";

import { SeaIntroV2 } from "@/components/sea-intro/sea-intro-v2";
import { getLocaleContent } from "@/data/i18n";
import { localizedMetadata } from "@/i18n/metadata";
import { setStaticLocale, type LocaleParams } from "@/i18n/locale";
import { isLocale, routing } from "@/i18n/routing";

type HomePageProps = {
  params: LocaleParams;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : routing.defaultLocale;
  const content = getLocaleContent(locale);
  const metadata = localizedMetadata(locale, "/", {
    title: content.site.title,
    description: content.site.description,
  });

  return {
    ...metadata,
    title: {
      absolute: content.site.title,
    },
  };
}

// The homepage is the Sea of Consciousness front door. SeaIntroV2 owns the full
// experience: the Stratospheric Dawn surface, the cinematic dive, and the
// settled underwater depths (the existing ParticleField + FrontDoor portfolio).
//
// SeaIntroV2 is a client component whose server / pre-resolution render is the
// usable depths shell, so this page stays SSR- and no-JavaScript-friendly: the
// header, hero, project list and links are all present without scripts.
export default async function HomePage({
  params,
}: HomePageProps) {
  await setStaticLocale(params);

  return (
    <main
      id="main"
      data-theme="dark"
      className="relative isolate flex min-h-screen flex-col overflow-hidden bg-paper text-ink"
    >
      <SeaIntroV2 />
    </main>
  );
}
