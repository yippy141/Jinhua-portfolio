import { Libre_Franklin, Spectral } from "next/font/google";

// Editorial type system (V2.2). Preserve the existing Latin setup.
export const fontSerif = Spectral({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const fontSans = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
