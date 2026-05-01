import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-stone-50 text-stone-950">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-4 focus:z-50 focus:bg-stone-950 focus:px-4 focus:py-2 focus:text-sm focus:text-stone-50"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
