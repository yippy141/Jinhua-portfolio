import Link from "next/link";

import { SocialCluster } from "@/components/icons";

const navItems = [
  { href: "/about", label: "ABOUT" },
  { href: "/research", label: "RESEARCH" },
  { href: "/archive", label: "ARCHIVE" },
  { href: "/contact", label: "CONTACT" },
];

// The portfolio name + navigation, shared by the surface and the depths so the
// chrome is identical across the intro. Kept as a server component (no client
// state) so it can render in either tree.
export function SeaNav() {
  return (
    <header className="relative z-20 flex flex-col gap-5 px-6 py-6 sm:px-8 lg:flex-row lg:items-start lg:justify-between lg:px-12 lg:py-8">
      <Link
        href="/"
        className="block w-fit rounded-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sonar"
      >
        <span className="block font-serif text-2xl leading-none text-ink">
          Jinhua Yip
        </span>
        <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-[0.24em] text-ink-2">
          Intelligence Atlases
        </span>
      </Link>

      <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
        <nav aria-label="Primary">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-xs uppercase tracking-[0.12em] text-ink-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-[2px] transition-colors duration-200 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sonar"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <SocialCluster size={15} />
      </div>
    </header>
  );
}
