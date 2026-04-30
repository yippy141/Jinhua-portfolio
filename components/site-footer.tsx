import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-300/70 bg-stone-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-sm leading-6 text-stone-600 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
        <p>Selected research, essays, and editorial projects.</p>
        <Link
          href="/contact"
          className="w-fit text-stone-800 underline underline-offset-4 hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900"
        >
          Contact
        </Link>
      </div>
    </footer>
  );
}
