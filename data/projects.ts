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
  projectStatusLabels,
  projectTierLabels,
  projectTypeLabels,
} from "./types";

// Re-export the types and label maps so pages can keep importing everything
// from "@/data/projects".
export type {
  Project,
  ProjectDetail,
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
    isAvailable: true,
    year: "2026",
    dek: "A guided questionnaire that shows which schools of international-relations theory most closely match your assumptions.",
    description:
      "A guided questionnaire that shows which schools of international-relations theory most closely match your assumptions. It then tests that result against security, technology, and AI-governance scenarios.",
    tags: ["IR theory", "AI governance"],
    entities: ["ai-governance", "great-power-competition"],
    links: [
      { label: "Open the inventory", href: "https://irworldview.jhyip.com" },
      { label: "Source code", href: "https://github.com/yippy141/ir-worldview-app" },
    ],
    detail: {
      whatYouCanExplore:
        "Answer the questionnaire to get an IR Foundation result, then test it against harder security, technology, and AI-governance scenarios.",
    },
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
    isAvailable: false,
    year: "2026",
    dek: "A searchable map of the organizations building AI-safety capacity across Asia.",
    description:
      "A searchable map of the organizations building AI-safety capacity across Asia. Filter by country, institution type, and area of work, then inspect the source behind each entry.",
    tags: ["compute", "AI governance"],
    entities: ["ai-safety", "ai-governance", "compute", "asia-pacific"],
    links: [
      { label: "Open the atlas", href: "https://aisafety.jhyip.com" },
      { label: "Source code", href: "https://github.com/yippy141/asia-ai-safety-atlas" },
    ],
    detail: {
      whatYouCanExplore:
        "Filter by country, institution type, and area of work, then inspect the source behind each entry.",
    },
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
    id: "aicc",
    slug: "ai-conversion-atlas",
    node: "AI Conversion",
    title: "AI Conversion Atlas",
    tier: "lab",
    type: "research",
    status: "in-progress",
    isAvailable: false,
    year: "2026",
    dek: "A research atlas on which societies can convert frontier AI capability into real industrial, scientific, strategic, and public-welfare outcomes.",
    description:
      "The project separates frontier access from deployment, adaptation, distribution, and realized outcomes, beginning with a China-US pilot on manufacturing, robotics, compute, and energy.",
    tags: ["AI conversion", "industrial capability"],
    entities: [
      "ai-governance",
      "great-power-competition",
      "compute",
      "industrial-capability",
      "china",
      "supply-chains",
      "source-backed-atlas",
    ],
    links: [
      { label: "Open the atlas", href: "https://aiconversion.jhyip.com" },
      { label: "Source code", href: "https://github.com/yippy141/ai-conversion-atlas" },
      { label: "Read the launch essay", href: "https://substack.com/@yippy2/p/ai-conversion-atlas" },
    ],
    detail: {
      whatYouCanExplore:
        "Compare frontier access, conversion capacity, adaptation capacity, distribution quality, and realized outcomes without collapsing them into one readiness score.",
      evidenceAndLimits:
        "V0 treats China-US claims as hypotheses to test. Missing data are labeled as missing, and qualitative coding is marked explicitly.",
      currentStatus: "V0 pilot in progress. Public links are launch placeholders.",
    },
    preview: {
      kind: "none",
      posters: [],
      alt: "Placeholder preview card for the AI Conversion Atlas.",
    },
    x: 69,
    y: 43,
    r: 10,
    video: null,
    homeNode: {
      coordinates: { top: "43%", left: "69%" },
      size: "md",
      accentColor: "amber",
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
    isAvailable: false,
    year: "2026",
    dek: "A map of Chinese semiconductor-equipment makers and the production steps they serve.",
    description:
      "A map of Chinese semiconductor-equipment makers, the production steps they serve, and the areas where foreign tools still matter.",
    tags: ["semiconductors", "export controls"],
    entities: ["semiconductors", "export-controls", "compute", "china"],
    links: [
      { label: "Open the atlas", href: "https://chinatooling.jhyip.com" },
      { label: "Source code", href: "https://github.com/yippy141/china-semiconductor-tooling-talent-atlas" },
    ],
    detail: {
      whatYouCanExplore:
        "Trace each equipment maker to the production steps it serves, and see the areas where foreign tools still matter.",
    },
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
    isAvailable: false,
    year: "2026",
    dek: "A map of China's commercial space companies, launches, and constellations.",
    description:
      "A map of China's commercial space companies, launches, constellations, and links to state industrial and security priorities.",
    tags: ["commercial space", "compute"],
    entities: ["space", "china", "industrial-capability"],
    links: [],
    detail: {
      whatYouCanExplore:
        "Browse companies, launches, and constellations, and their links to state industrial and security priorities.",
    },
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
    isAvailable: false,
    year: "2026",
    dek: "A tracker for mining, refining, metal, and magnet projects outside China.",
    description:
      "A tracker for mining, refining, metal, and magnet projects outside China. It separates announcements from operating capacity and shows where skills and processing know-how remain bottlenecks.",
    tags: ["rare earths", "supply chains"],
    entities: ["rare-earths", "supply-chains", "industrial-capability"],
    links: [
      { label: "Open the atlas", href: "https://reetalent.jhyip.com" },
      { label: "Source code", href: "https://github.com/yippy141/mine-to-magnet-capability-tracker" },
    ],
    detail: {
      whatYouCanExplore:
        "See which projects have become operating capacity and which are only announced, and where skills and processing know-how remain bottlenecks.",
      evidenceAndLimits:
        "The tracker separates announcements from operating capacity. A project that has only been announced is labeled as such, not counted as output.",
    },
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
    isAvailable: true,
    year: "2026",
    dek: "An index for comparing how private companies can shape foreign policy and conflict risk.",
    description:
      "An index for comparing how private companies can shape foreign policy and conflict risk. The current release applies the framework to the Philippines and exposes the weights, sources, and sensitivity tests.",
    tags: ["private-sector influence", "foreign policy"],
    entities: ["private-sector-influence", "philippines"],
    links: [
      { label: "Explore the PSII dashboard", href: "https://psii.jhyip.com" },
      { label: "Source code", href: "https://github.com/yippy141/psii-dashboard" },
    ],
    detail: {
      whatYouCanExplore:
        "Open the weights, sources, and sensitivity tests behind the index. The current release applies the framework to the Philippines.",
      evidenceAndLimits:
        "The index exposes its weights and sources, and the sensitivity tests show how much a ranking depends on those choices.",
    },
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
    node: "Private Influence",
    title: "Private Sector Influence in Asymmetric Conflict",
    tier: "lab",
    type: "research",
    status: "published",
    isAvailable: true,
    year: "2025",
    dek: "A published chapter on how businesses can raise, lower, or redirect conflict risk.",
    description:
      "A published chapter on how businesses can raise, lower, or redirect conflict risk, using the Philippines in the South China Sea as the case study. Published as Chapter 5 of Good Governance in East Asia and Latin America (Springer Nature, 2025).",
    tags: ["maritime", "foreign policy"],
    entities: ["philippines", "private-sector-influence", "asia-pacific"],
    links: [
      { label: "Read the chapter (Springer)", href: "https://doi.org/10.1007/978-3-032-00506-9_5" },
    ],
    detail: {
      myRole: "Sole author of the chapter, including the field research.",
    },
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
    isAvailable: true,
    year: "2026",
    dek: "Essays and notes on technology, power, and strategy.",
    description: "Essays and notes on technology, power, and strategy.",
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
  ["aisa", "aicc"],
  ["aicc", "irwv"],
  ["aicc", "semi"],
  ["aicc", "magnet"],
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
