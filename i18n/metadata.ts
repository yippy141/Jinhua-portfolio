import type { Metadata } from "next";

import { localizedAlternates, publicPath } from "./paths";
import type { Locale } from "./routing";

type PageMetadataInput = {
  title: string;
  description: string;
};

type LocalizedMetadataOptions = {
  alternates?: boolean;
  noindex?: boolean;
  openGraphType?: "website" | "article";
};

export function localizedMetadata(
  locale: Locale,
  pathname: string,
  input: PageMetadataInput,
  options: LocalizedMetadataOptions = {},
): Metadata {
  const canonical = publicPath(locale, pathname);
  const includeAlternates = options.alternates ?? true;

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical,
      ...(includeAlternates ? { languages: localizedAlternates(pathname) } : {}),
    },
    robots: options.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: options.openGraphType ?? "website",
      title: input.title,
      description: input.description,
      url: canonical,
    },
  };
}
