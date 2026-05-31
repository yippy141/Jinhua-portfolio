import type { Metadata } from "next";
import { Newsreader, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Constitution fonts. Three families, nothing else.
// Newsreader = voice (headlines + long-form body, an editorial serif).
const fontSerif = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

// IBM Plex Sans = chrome (navigation, labels, buttons, captions).
const fontSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

// IBM Plex Mono = evidence (source ids, status tags, dates, code).
const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://jinhuayip.com",
  ),
  title: {
    default: "Jinhua Yip",
    template: "%s | Jinhua Yip",
  },
  description:
    "Research, essays, and editorial projects on international relations, technology, and political economy.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Jinhua Yip",
    title: "Jinhua Yip",
    description:
      "Research, essays, and editorial projects on international relations, technology, and political economy.",
    url: "/",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Jinhua Yip — research, essays, and editorial projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jinhua Yip",
    description:
      "Research, essays, and editorial projects on international relations, technology, and political economy.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSerif.variable} ${fontSans.variable} ${fontMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
