"use client";

import { useTranslations } from "next-intl";

import { SocialCluster } from "@/components/icons";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Link } from "@/i18n/navigation";

// The portfolio name + navigation, shared by the surface and the depths so the
// chrome is identical across the intro.
export function SeaNav() {
  const nav = useTranslations("nav");
  const surface = useTranslations("sea.surface");
  const navItems = [
    { href: "/about", label: nav("about") },
    { href: "/research", label: nav("research") },
    { href: "/archive", label: nav("archive") },
    { href: "/contact", label: nav("contact") },
  ];

  return (
    <header
      id="sea-nav"
      className="relative z-20 flex flex-col gap-5 px-6 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:py-8"
    >
      <Link
        href="/"
        className="block w-fit rounded-[3px] font-serif text-2xl leading-none text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sonar"
      >
        {surface("name")}
      </Link>

      <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
        <nav aria-label="Primary">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-[15px] text-ink/80">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-[2px] underline-offset-4 transition-colors duration-200 hover:text-ink hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sonar"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <LanguageSwitcher className="hover:text-ink focus-visible:outline-sonar" />
        <SocialCluster size={16} />
      </div>
    </header>
  );
}
