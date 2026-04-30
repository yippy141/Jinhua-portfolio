import Link from "next/link";

const navItems = [
  { href: "/archive", label: "Archive" },
  { href: "/research", label: "Research" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-stone-300/70 bg-stone-50/90">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-6 py-6 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10">
        <Link
          href="/"
          className="w-fit font-serif text-2xl leading-none text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900"
        >
          Jinhua Yip
        </Link>
        <nav aria-label="Primary navigation">
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm uppercase leading-none text-stone-600">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="underline-offset-4 hover:text-stone-950 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
