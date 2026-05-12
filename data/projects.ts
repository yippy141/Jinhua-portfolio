export type ProjectType = "tool" | "research" | "publication" | "essay";

export type ProjectStatus = "live" | "beta" | "published" | "in-progress";

export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectPreview = {
  kind: "image" | "video" | "none";
  posters: readonly string[];
  alt: string;
  video?: string | null;
};

export type ProjectHomeVariant = "viewport" | "triptych" | "folio" | "note";

export type ProjectHomeNode = {
  coordinates: {
    top: string;
    left: string;
  };
  size: "sm" | "md" | "lg";
  accentColor: string;
  variant: ProjectHomeVariant;
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
      kind: "video",
      posters: [
        "/previews/ir-worldview-poster-1.png",
        "/previews/ir-worldview-poster-2.png",
      ],
      video: "/previews/ir-worldview-loop.mp4",
      alt: "Archival preview card for the IR Worldview Inventory.",
    },
    homeNode: {
      coordinates: {
        top: "58%",
        left: "18%",
      },
      size: "lg",
      accentColor: "amber",
      variant: "viewport",
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
      posters: ["/previews/psii.svg"],
      alt: "Archival preview card for the Private Sector Influence Index.",
    },
    homeNode: {
      coordinates: {
        top: "34%",
        left: "68%",
      },
      size: "lg",
      accentColor: "emerald",
      variant: "triptych",
    },
  },
  {
    slug: "psii",
    title: "PSII",
    type: "research",
    status: "beta", // Changed from "in-progress"
    year: "2026",
    dek: "An interactive research dashboard translating my SAIS capstone into a versioned annual index prototype.",
    description:
      "The project separates the archival 2023 publication from PSII Core v2, a rebuilt structural screening tool with source manifests, release metadata, country cards, and robustness checks.",
    tags: [
      "private sector influence",
      "foreign policy",
      "asymmetric conflict",
      "interactive dashboard",
    ],
    links: [
      {
        label: "Explore the PSII dashboard",
        href: "https://psii-dashboard.vercel.app", // Your new Vercel link
      },
    ],
    preview: {
      kind: "image",
      posters: ["/previews/psii.svg"],
      alt: "Archival preview card for the Private Sector Influence Index.",
    },
    homeNode: {
      coordinates: {
        top: "34%",
        left: "68%",
      },
      size: "lg",
      accentColor: "emerald",
      variant: "triptych",
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
      kind: "none",
      posters: [],
      alt: "Archival preview card for the Personal Substack.",
    },
    homeNode: {
      coordinates: {
        top: "22%",
        left: "35%",
      },
      size: "sm",
      accentColor: "stone",
      variant: "note",
    },
  },
  {
    slug: "mine-to-magnet-capability-tracker",
    title: "Mine-to-Magnet Capability Tracker",
    type: "tool",
    status: "in-progress",
    year: "2026",
    dek: "A source-driven tracker of whether U.S. and allied rare-earth initiatives can become operating mine-to-magnet capacity.",
    description:
      "An editorial intelligence product auditing the conversion problem between critical-minerals policy announcements and real industrial capability, with special attention to skilled labor, tacit process know-how, plant commissioning, QA, and environmental constraints.",
    tags: [
      "rare earths",
      "critical minerals",
      "workforce",
      "industrial policy",
      "supply chains",
    ],
    links: [],
    preview: {
      kind: "image",
      posters: ["/previews/mine-to-magnet-capability-tracker.svg"],
      alt: "Editorial preview card for the Mine-to-Magnet Capability Tracker.",
    },
    homeNode: {
      coordinates: {
        top: "72%",
        left: "78%",
      },
      size: "md",
      accentColor: "sky",
      variant: "folio",
    },
  },
] as const satisfies readonly Project[];

export type ProjectSlug = (typeof projects)[number]["slug"];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
