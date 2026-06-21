import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-rule bg-paper">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-10 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
        <p className="font-sans text-sm text-ink-2">
          <Link
            href="/"
            className="underline-offset-4 transition-colors duration-200 hover:text-oxblood hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-oxblood"
          >
            jinhuayip.com
          </Link>{" "}
          · Washington, DC
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm leading-6 text-ink-2">
          <span>Selected research, essays, and editorial projects.</span>
          <Link
            href="/methodology"
            className="text-oxblood underline underline-offset-4 transition-colors duration-200 hover:text-oxblood-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-oxblood"
          >
            Evidence standard
          </Link>
          <Link
            href="/contact"
            className="text-oxblood underline underline-offset-4 transition-colors duration-200 hover:text-oxblood-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-oxblood"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
