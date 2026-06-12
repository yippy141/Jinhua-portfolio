// data/projects.ts
//
// SINGLE SOURCE OF TRUTH for every project on the site.
//
// One object per project. The same objects drive three things:
//   1. the homepage graph (the x / y / r / node / video fields),
//   2. the archive and project pages (title, dek, description, status, ...),
//   3. the concept graph (the `entities` a project touches).
//
// To add a project: copy a block, change the fields, give it a unique id and
// slug, and set its x / y position. You never edit a layout file to add one.
//
// The shape rules live in ./types.ts. The ideas referenced by `entities` live
// in ./entities.ts.

import {
  type Project,
  type ProjectHomeVariant,
  projectStatusLabels,
  projectTierLabels,
  projectTypeLabels,
} from "./types";

// Re-export the types and label maps so pages can keep importing everything
// from "@/data/projects".
export type {
  Project,
  ProjectHomeVariant,
  ProjectLink,
  ProjectPreview,
  ProjectStatus,
  ProjectTier,
  ProjectType,
} from "./types";
export { projectStatusLabels, projectTierLabels, projectTypeLabels };

export const projects = [
  {
    id: "irwv",
    slug: "ir-worldview-inventory",
    node: "IR Worldview",
    title: "IR Worldview Inventory",
    tier: "flagship",
    type: "tool",
    status: "beta",
    year: "2026",
    dek: "A reflective instrument that maps the theories and priors shaping how readers read world affairs.",
    description:
      "A reflective instrument that helps a reader name the theories, instincts, and historical priors behind how they read world affairs. It builds an IR Foundation result, then tests it against harder security, technology, and AI governance questions.",
    tags: ["IR theory", "AI governance"],
    entities: ["ai-governance", "great-power-competition"],
    links: [
      { label: "Live friend trial", href: "https://ir-worldview-app-yippy141s-projects.vercel.app/" },
      { label: "Source code", href: "https://github.com/yippy141/ir-worldview-app" },
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
    x: 55,
    y: 33,
    r: 14,
    video: "/previews/ir-worldview-loop.mp4",
    homeNode: {
      coordinates: { top: "33%", left: "55%" },
      size: "lg",
      accentColor: "amber",
      variant: "viewport",
    },
  },
  {
    id: "aisa",
    slug: "asia-ai-safety-atlas",
    node: "AI Safety Atlas",
    title: "Asia AI Safety Atlas",
    tier: "lab",
    type: "research",
    status: "in-progress",
    year: "2026",
    dek: "A source-traceable map of AI safety and governance capacity across the region.",
    description:
      "A source-traceable map of AI safety and governance capacity across the Asia-Pacific. It tracks institutions, talent, and compute, and shows where the public record is thin.",
    tags: ["compute", "AI governance"],
    entities: ["ai-safety", "ai-governance", "compute", "asia-pacific"],
    links: [
      { label: "Open the atlas", href: "https://asia-ai-safety-atlas.vercel.app" },
      { label: "Source code", href: "https://github.com/yippy141/asia-ai-safety-atlas" },
    ],
    preview: {
      kind: "none",
      posters: [],
      alt: "Placeholder preview card for the Asia AI Safety Atlas.",
    },
    x: 78,
    y: 23,
    r: 9,
    video: null,
    homeNode: {
      coordinates: { top: "23%", left: "78%" },
      size: "md",
      accentColor: "emerald",
      variant: "folio",
    },
  },
  {
    id: "semi",
    slug: "china-semiconductor-atlas",
    node: "Semiconductors",
    title: "China Semiconductor Atlas",
    tier: "lab",
    type: "research",
    status: "in-progress",
    year: "2026",
    dek: "Tooling, fabs, and chokepoints across the semiconductor stack, with export-control context.",
    description:
      "A map of the semiconductor stack: tooling, fabs, and the chokepoints where China's indigenization runs into limits, set against the export-control regime that shapes them.",
    tags: ["semiconductors", "export controls"],
    entities: ["semiconductors", "export-controls", "compute", "china"],
    links: [
      {
        label: "Open the atlas",
        href: "https://china-semiconductor-tooling-talent-atlas-yippy141s-projects.vercel.app",
      },
      {
        label: "Source code",
        href: "https://github.com/yippy141/china-semiconductor-tooling-talent-atlas",
      },
    ],
    preview: {
      kind: "none",
      posters: [],
      alt: "Placeholder preview card for the China Semiconductor Atlas.",
    },
    x: 85,
    y: 47,
    r: 9,
    video: null,
    homeNode: {
      coordinates: { top: "47%", left: "85%" },
      size: "md",
      accentColor: "sky",
      variant: "triptych",
    },
  },
  {
    id: "space",
    slug: "celestial-dragon-atlas",
    node: "Commercial Space",
    title: "Celestial Dragon Atlas",
    tier: "lab",
    type: "research",
    status: "in-progress",
    year: "2026",
    dek: "China's commercial space sector: launch cadence, constellations, and dual-use capacity.",
    description:
      "A read on China's commercial space sector as a hybrid strategic-industrial system rather than a Western-style private market, covering launch cadence, constellations, and dual-use capacity.",
    tags: ["commercial space", "compute"],
    entities: ["space", "china", "industrial-capability"],
    links: [],
    preview: {
      kind: "none",
      posters: [],
      alt: "Placeholder preview card for the Celestial Dragon Atlas.",
    },
    x: 91,
    y: 30,
    r: 7,
    video: null,
    homeNode: {
      coordinates: { top: "30%", left: "91%" },
      size: "sm",
      accentColor: "stone",
      variant: "note",
    },
  },
  {
    id: "magnet",
    slug: "mine-to-magnet-capability-tracker",
    node: "Rare Earths",
    title: "Allied Rare Earths Atlas",
    tier: "lab",
    type: "tool",
    status: "in-progress",
    year: "2026",
    dek: "Whether allied rare-earth announcements can become operating mine-to-magnet capacity.",
    description:
      "A source-driven tracker of whether US and allied rare-earth announcements can become operating mine-to-magnet capacity, with attention to skilled labor, process know-how, plant commissioning, and environmental limits.",
    tags: ["rare earths", "supply chains"],
    entities: ["rare-earths", "supply-chains", "industrial-capability"],
    links: [
      {
        label: "Open the atlas",
        href: "https://mine-to-magnet-capability-tracker-yippy141s-projects.vercel.app/",
      },
      { label: "Source code", href: "https://github.com/yippy141/mine-to-magnet-capability-tracker" },
    ],
    preview: {
      kind: "image",
      posters: ["/previews/mine-to-magnet-capability-tracker.svg"],
      alt: "Editorial preview card for the Allied Rare Earths Atlas.",
    },
    x: 71,
    y: 61,
    r: 8,
    video: null,
    homeNode: {
      coordinates: { top: "61%", left: "71%" },
      size: "md",
      accentColor: "sky",
      variant: "folio",
    },
  },
  {
    id: "psii",
    slug: "psii",
    node: "PSII",
    title: "PSII Dashboard",
    tier: "lab",
    type: "tool",
    status: "beta",
    year: "2026",
    dek: "A versioned index of private-sector influence in foreign policy, rebuilt from the SAIS capstone.",
    description:
      "A versioned index of private-sector influence in foreign policy, rebuilt from a SAIS capstone on the Philippines. It separates the archival 2023 publication from a structural screening tool with source manifests, country cards, and robustness checks.",
    tags: ["private-sector influence", "foreign policy"],
    entities: ["private-sector-influence", "philippines"],
    links: [
      { label: "Explore the PSII dashboard", href: "https://psii-dashboard.vercel.app" },
    ],
    preview: {
      kind: "image",
      posters: ["/previews/psii.svg"],
      alt: "Archival preview card for the PSII Dashboard.",
    },
    x: 60,
    y: 70,
    r: 8,
    video: null,
    homeNode: {
      coordinates: { top: "70%", left: "60%" },
      size: "md",
      accentColor: "emerald",
      variant: "triptych",
    },
  },
  {
    id: "phsc",
    slug: "philippines-south-china-sea",
    node: "Philippines · SCS",
    title: "The Philippines in the South China Sea",
    tier: "lab",
    type: "research",
    status: "published",
    year: "2025",
    dek: "A sole-authored Springer chapter on how private-sector actors shape the Philippines' position in the South China Sea dispute.",
    description:
      "A published book chapter examining how private-sector actors, from multinational corporations to domestic business elites and industry associations, influence strategy and outcomes in the asymmetric conflict between the Philippines and China in the South China Sea. Published as Chapter 5 of Good Governance in East Asia and Latin America (Springer Nature, 2025). The chapter's framework seeded the PSII Dashboard.",
    tags: ["maritime", "foreign policy"],
    entities: ["philippines", "private-sector-influence", "asia-pacific"],
    links: [
      { label: "Read the chapter (Springer)", href: "https://doi.org/10.1007/978-3-032-00506-9_5" },
    ],
    preview: {
      kind: "image",
      posters: ["/previews/philippines-south-china-sea.svg"],
      alt: "Editorial preview card for the Philippines in the South China Sea.",
    },
    x: 83,
    y: 66,
    r: 7,
    video: null,
    homeNode: {
      coordinates: { top: "66%", left: "83%" },
      size: "sm",
      accentColor: "sky",
      variant: "folio",
    },
  },
  {
    id: "writing",
    slug: "personal-substack",
    node: "Writing",
    title: "Writing",
    tier: "lab",
    type: "essay",
    status: "published",
    year: "2026",
    dek: "Essays and notes on power, technology, and strategic choice.",
    description:
      "An ongoing collection of essays and notes on power, technology, and strategic choice, published on Substack.",
    tags: ["essays", "notes"],
    entities: ["great-power-competition", "ai-governance"],
    links: [{ label: "Read on Substack", href: "https://substack.com/@yippy2" }],
    preview: {
      kind: "none",
      posters: [],
      alt: "Placeholder preview card for Writing.",
    },
    x: 67,
    y: 83,
    r: 6,
    video: null,
    homeNode: {
      coordinates: { top: "83%", left: "67%" },
      size: "sm",
      accentColor: "stone",
      variant: "note",
    },
  },
] as const satisfies readonly Project[];

// A stable key for each project, used in the URL: /projects/<slug>
export type ProjectSlug = (typeof projects)[number]["slug"];

// The short graph key used by projectLinks below.
export type ProjectId = (typeof projects)[number]["id"];

// Graph edges: which projects share an idea. The homepage and /map draw these
// as hairlines. Each pair is two project ids from the list above.
export const projectLinks = [
  ["irwv", "aisa"],
  ["irwv", "psii"],
  ["irwv", "writing"],
  ["aisa", "semi"],
  ["semi", "magnet"],
  ["semi", "space"],
  ["aisa", "space"],
  ["magnet", "psii"],
  ["psii", "phsc"],
  ["phsc", "writing"],
] as const satisfies readonly (readonly [ProjectId, ProjectId])[];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
