import type { Metadata } from "next";

const contactLinks = [
  {
    label: "Email",
    href: "mailto:jhyip16@outlook.com",
    value: "jhyip16@outlook.com",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jinhua-yip-88924513b/",
    value: "linkedin.com/in/jinhua-yip-88924513b",
  },
  {
    label: "GitHub",
    href: "https://github.com/yippy141",
    value: "github.com/yippy141",
  },
  {
    label: "Substack",
    href: "https://substack.com/@yippy2",
    value: "substack.com/@yippy2",
  },
];

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact information for Jinhua Yip.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-14 sm:px-8 sm:py-18">
      <p aria-hidden="true" className="mb-4 text-sm uppercase leading-none text-stone-500">
        Contact
      </p>
      <h1 className="font-serif text-4xl leading-tight text-stone-950 sm:text-5xl">
        Get in touch
      </h1>

      <dl className="mt-10 divide-y divide-stone-300 border-y border-stone-300">
        {contactLinks.map((item) => (
          <div
            key={item.label}
            className="grid gap-2 py-5 text-base leading-7 sm:grid-cols-[8rem_1fr]"
          >
            <dt className="text-stone-500">{item.label}</dt>
            <dd>
              <a
                href={item.href}
                className="text-stone-950 underline underline-offset-4 hover:text-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900"
              >
                {item.value}
              </a>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
