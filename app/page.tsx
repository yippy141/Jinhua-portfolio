import { SeaIntroV2 } from "@/components/sea-intro/sea-intro-v2";

// The homepage is the Sea of Consciousness front door. SeaIntroV2 owns the full
// experience: the Stratospheric Dawn surface, the cinematic dive, and the
// settled underwater depths (the existing ParticleField + FrontDoor portfolio).
//
// SeaIntroV2 is a client component whose server / pre-resolution render is the
// usable depths shell, so this page stays SSR- and no-JavaScript-friendly: the
// header, hero, project list and links are all present without scripts.
export default function HomePage() {
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
