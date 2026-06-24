import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";

import { fontSans, fontSerif } from "@/app/fonts";
import "@/app/globals.css";
import { getLocaleContent } from "@/data/i18n";
import { publicPath } from "@/i18n/paths";
import { isLocale, routing } from "@/i18n/routing";
import { setStaticLocale, type LocaleParams } from "@/i18n/locale";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : routing.defaultLocale;
  const content = getLocaleContent(locale);

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://jinhuayip.com",
    ),
    title: {
      default: content.site.title,
      template: locale === "en" ? "%s | Jinhua Yip" : "%s",
    },
    description: content.site.description,
    openGraph: {
      type: "website",
      siteName: content.site.title,
      title: content.site.title,
      description: content.site.description,
      url: publicPath(locale, "/"),
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt:
            locale === "en"
              ? "Jinhua Yip: research, essays, and editorial projects"
              : "叶锦华｜研究与项目",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: content.site.title,
      description: content.site.description,
      images: ["/og.png"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: LocaleParams;
}>) {
  const locale = await setStaticLocale(params);
  const skip = await getTranslations({ locale, namespace: "skip" });
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${fontSerif.variable} ${fontSans.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
        >
          {skip("content")}
        </a>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
