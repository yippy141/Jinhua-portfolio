import type { ReactNode } from "react";

// Shared line icons. 1.4px stroke, currentColor, discreet.
export type IconName = "email" | "linkedin" | "github" | "substack" | "arrow";

const ICON_PATHS: Record<IconName, ReactNode> = {
  email: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="M3.5 6.5 L12 13 L20.5 6.5" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="1" />
      <path d="M7 10v7M7 7.2v.01M11 17v-7M11 12.4c.5-1.6 1.5-2.4 3-2.4 1.9 0 3 1.1 3 3.2V17" />
    </>
  ),
  github: (
    <path d="M9 19c-4 1.2-4-2.2-6-2.6m12 4.6v-3.2c0-.9-.3-1.5-.7-1.9 2.4-.3 4.7-1.2 4.7-5.3a4 4 0 0 0-1.1-2.9 3.7 3.7 0 0 0-.1-2.8s-.9-.3-3 1.1a10 10 0 0 0-5.4 0C7.3 4.9 6.4 5.2 6.4 5.2a3.7 3.7 0 0 0-.1 2.8A4 4 0 0 0 5.2 11c0 4 2.3 4.9 4.6 5.3-.3.3-.6.8-.7 1.5V21" />
  ),
  substack: <path d="M5 5h14M5 9h14M5 13h14v7l-7-3.2L5 20z" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
};

export function Icon({
  name,
  size = 16,
  stroke = 1.4,
  className,
}: {
  name: IconName;
  size?: number;
  stroke?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

// Discreet social cluster, present on every page (constitution + handoff).
export const socialLinks = [
  { id: "email", label: "Email", href: "mailto:jhyip16@outlook.com" },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jinhua-yip-88924513b/",
  },
  { id: "substack", label: "Substack", href: "https://substack.com/@yippy2" },
  { id: "github", label: "GitHub", href: "https://github.com/yippy141" },
] as const satisfies readonly { id: IconName; label: string; href: string }[];

export function SocialCluster({
  size = 15,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <ul className={`flex list-none items-center gap-1 p-0 ${className}`}>
      {socialLinks.map((social) => (
        <li key={social.id}>
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            title={social.label}
            className="grid h-8 w-8 place-items-center rounded-[2px] text-ink-2 transition-colors duration-200 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sonar"
          >
            <Icon name={social.id} size={size} />
          </a>
        </li>
      ))}
    </ul>
  );
}
