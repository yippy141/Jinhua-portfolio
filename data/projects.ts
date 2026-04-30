export type ProjectStatus =
  | "Live/Beta"
  | "In Progress"
  | "Published"
  | "Active Publication/Substack";

export type Project = {
  slug: string;
  title: string;
  status: ProjectStatus;
  category: "Tool" | "Research" | "Essay" | "Publication";
  dek: string;
  description: string;
  year: string;
};

export const projects = [
  {
    slug: "ir-worldview-inventory",
    title: "IR Worldview Inventory",
    status: "Live/Beta",
    category: "Tool",
    dek: "A reflective instrument for mapping assumptions in international relations.",
    description:
      "A beta project for helping readers articulate the theories, instincts, and historical priors shaping how they interpret world affairs.",
    year: "2026",
  },
  {
    slug: "psii",
    title: "PSII",
    status: "In Progress",
    category: "Research",
    dek: "An in-progress research system for organizing political and strategic inquiry.",
    description:
      "A working research framework for tracking questions, sources, and arguments across a developing body of policy work.",
    year: "2026",
  },
  {
    slug: "philippines-south-china-sea",
    title: "The Philippines in the South China Sea",
    status: "Published",
    category: "Essay",
    dek: "A published analysis of Philippine strategy, maritime pressure, and regional order.",
    description:
      "An editorial research piece examining the Philippines' position in the South China Sea and the pressures shaping its strategic choices.",
    year: "2025",
  },
  {
    slug: "3-canadians",
    title: "3 Canadians",
    status: "Active Publication/Substack",
    category: "Publication",
    dek: "An active publication and Substack project.",
    description:
      "A live editorial publication with room for essays, interviews, commentary, and recurring notes.",
    year: "2026",
  },
] as const satisfies readonly Project[];

export type ProjectSlug = (typeof projects)[number]["slug"];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
