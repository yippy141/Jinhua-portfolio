import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact information for Jinhua Yi.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-14 sm:px-8 sm:py-18">
      <p className="mb-4 text-sm uppercase leading-none text-stone-500">
        Contact
      </p>
      <h1 className="font-serif text-4xl leading-tight text-stone-950 sm:text-5xl">
        For correspondence, collaborations, and editorial inquiries.
      </h1>
      <div className="mt-10 space-y-6 text-lg leading-8 text-stone-700">
        <p>
          Add the preferred email, Substack, and social links here when they are
          ready. The page is intentionally minimal so the contact path stays
          direct.
        </p>
        <p>
          Placeholder email:{" "}
          <a
            href="mailto:hello@example.com"
            className="text-stone-950 underline underline-offset-4 hover:text-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900"
          >
            hello@example.com
          </a>
        </p>
      </div>
    </div>
  );
}
