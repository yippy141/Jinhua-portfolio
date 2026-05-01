export type ProjectType = "tool" | "research" | "publication" | "essay";

export type ProjectStatus = "live" | "beta" | "published" | "in-progress";

export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectPreview = {
  kind: "image" | "video" | "none";
  poster: string | null;
  alt: string;
};

export type ProjectHomeNode = {
  coordinates: {
    top: string;
    left: string;
  };
  size: "sm" | "md" | "lg";
  accentColor: string;
};

export type Project = {
  slug: string;
  title: string;
  type: ProjectType;
  status: ProjectStatus;
  year: string;
  dek: string;
  description: string;
  tags: string[];
  links: ProjectLink[];
  preview: ProjectPreview;
  homeNode: ProjectHomeNode;
};

export const projectTypeLabels = {
  tool: "Tool",
  research: "Research",
  publication: "Publication",
  essay: "Essay",
} as const satisfies Record<ProjectType, string>;

export const projectStatusLabels = {
  live: "Live",
  beta: "Beta",
  published: "Published",
  "in-progress": "In Progress",
} as const satisfies Record<ProjectStatus, string>;

export const projects = [
  {
    slug: "ir-worldview-inventory",
    title: "IR Worldview Inventory",
    type: "tool",
    status: "beta",
    year: "2026",
    dek: "A reflective instrument for mapping assumptions in international relations.",
    description:
      "A beta project for helping readers articulate the theories, instincts, and historical priors shaping how they interpret world affairs.",
    tags: [
      "international relations",
      "political theory",
      "interactive tool",
      "worldview mapping",
    ],
    links: [
      {
        label: "Live friend trial",
        href: "https://ir-worldview-inventory.vercel.app",
      },
      {
        label: "GitHub",
        href: "https://github.com/jinhuayip/ir-worldview-inventory",
      },
    ],
    preview: {
      kind: "image",
      poster: "/previews/ir-worldview-inventory.svg",
      alt: "Archival preview card for the IR Worldview Inventory.",
    },
    homeNode: {
      coordinates: {
        top: "58%",
        left: "18%",
      },
      size: "lg",
      accentColor: "amber",
    },
  },
  {
    slug: "psii",
    title: "PSII",
    type: "research",
    status: "in-progress",
    year: "2026",
    dek: "A research framework for tracking private-sector influence in foreign policy and asymmetric conflict.",
    description:
      "An in-progress index that emerged from the Philippines chapter, built to study how firms, investors, and commercial networks can shape political incentives, information environments, and foreign-policy behavior.",
    tags: [
      "private sector influence",
      "foreign policy",
      "asymmetric conflict",
      "Philippines",
    ],
    links: [],
    preview: {
      kind: "image",
      poster: "/previews/psii.svg",
      alt: "Archival preview card for the Private Sector Influence Index.",
    },
    homeNode: {
      coordinates: {
        top: "34%",
        left: "68%",
      },
      size: "lg",
      accentColor: "emerald",
    },
  },
  {
    slug: "philippines-south-china-sea",
    title: "The Philippines in the South China Sea",
    type: "publication",
    status: "published",
    year: "2025",
    dek: "A published analysis of Philippine strategy, maritime pressure, and regional order.",
    description:
      "An editorial research piece examining the Philippines' position in the South China Sea and the pressures shaping its strategic choices.",
    tags: [
      "Philippines",
      "South China Sea",
      "maritime security",
      "regional order",
    ],
    links: [],
    preview: {
      kind: "image",
      poster: "/previews/philippines-south-china-sea.svg",
      alt: "Archival preview card for the Philippines in the South China Sea publication.",
    },
    homeNode: {
      coordinates: {
        top: "76%",
        left: "45%",
      },
      size: "md",
      accentColor: "stone",
    },
  },
  {
    slug: "personal-substack",
    title: "Personal Substack",
    type: "essay",
    status: "published",
    year: "2026",
    dek: "Writing and analysis on geopolitics, technology, and political economy.",
    description: "An ongoing collection of essays, research notes, and commentary focusing on international relations, AI governance, and strategic competition.",
    tags: ["Writing", "Geopolitics", "Tech Policy"],
    links: [
      {
        label: "Read on Substack",
        href: "https://substack.com/@yippy2",
      },
    ],
    preview: {
      kind: "image",
      poster: null,
      alt: "Archival preview card for the Personal Substack.",
    },
    homeNode: {
      coordinates: {
        top: "22%",
        left: "35%",
      },
      size: "sm",
      accentColor: "stone",
    },
  },
] as const satisfies readonly Project[];

export type ProjectSlug = (typeof projects)[number]["slug"];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
