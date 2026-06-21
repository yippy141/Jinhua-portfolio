import type { Metadata } from "next";
import { Spectral, Libre_Franklin } from "next/font/google";
import "./globals.css";

// Editorial type system (V2.2). Two loaded families:
//   Spectral       = display: headings, the portfolio name, project titles, and
//                    selected editorial introductions. A warm, readable serif.
//   Libre Franklin = interface + body: navigation, UI, body copy, buttons,
//                    metadata and captions. A clear humanist sans.
// A third token (--font-data) resolves to the system ui-monospace stack and is
// applied only to literal source ids, code, and tabular evidence (see globals.css).
const fontSerif = Spectral({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const fontSans = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-sans",
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
        alt: "Jinhua Yip: research, essays, and editorial projects",
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
      className={`${fontSerif.variable} ${fontSans.variable} h-full antialiased`}
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
