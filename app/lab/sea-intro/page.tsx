import type { Metadata } from "next";

import { SeaIntro } from "@/components/sea-intro/sea-intro";

// Stage A technical spike. Exercises the full Surface -> Dive -> Depths sequence
// in isolation, away from the live homepage, so the camera path, dark-satellite
// grade, and water veil can be tuned before any homepage change.
export const metadata: Metadata = {
  title: "Sea Intro (lab)",
  robots: { index: false, follow: false },
};

export default function SeaIntroLabPage() {
  return (
    <main
      id="main"
      data-theme="dark"
      className="relative isolate flex min-h-screen flex-col overflow-hidden bg-paper text-ink"
    >
      <SeaIntro />
    </main>
  );
}
