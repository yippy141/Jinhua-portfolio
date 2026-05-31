// data/types.ts
//
// The shape rules for your data. These types let the code editor catch typos
// before they ever reach the website (for example, a misspelled status or a
// project pointing at an entity id that does not exist).
//
// You will rarely edit this file. You mostly edit entities.ts and projects.ts.
// Read the comments top to bottom once and it will make sense.

// ----------------------------------------------------------------------------
// ENTITIES: the ideas your work is about. These are the nodes of the concept
// graph and the drifting objects on the homepage.
// ----------------------------------------------------------------------------

// An entity id is just a short lowercase string like "compute" or "rare-earths".
// Projects refer to entities by this id. Ids must match an entry in entities.ts.
export type EntityId = string;

// What kind of idea an entity is. Used for grouping and for coloring nodes.
export type EntityKind =
  | "theme" // a cross-cutting idea, e.g. great-power competition, AI governance
  | "technology" // a technology or input, e.g. compute, semiconductors
  | "place" // a country or region, e.g. China, the Philippines
  | "domain" // a field or sector, e.g. space, aviation
  | "method"; // an approach or instrument, e.g. source-backed atlas

export type Entity = {
  id: EntityId; // unique, lowercase, hyphenated
  label: string; // how it shows on screen, e.g. "Rare earths"
  kind: EntityKind;
  gloss: string; // one plain sentence: what this is and why it matters to your work
  related: EntityId[]; // other entities this one connects to (for the graph edges)
};

// ----------------------------------------------------------------------------
// PROJECTS: the things you have built or are building. Each project lists the
// entities it touches, which is what wires it into the graph.
// ----------------------------------------------------------------------------

// How a project is positioned on the site. This is about presentation, not
// about how finished it is (that is "status" below). A flagship is polished and
// featured. A lab project is real but shown as work in progress. A concept is
// honestly labeled as not built yet.
export type ProjectTier = "flagship" | "lab" | "concept";

// What kind of thing the project is.
export type ProjectType = "tool" | "research" | "publication" | "essay";

// How finished it is.
export type ProjectStatus = "live" | "beta" | "published" | "in-progress" | "concept";

export type ProjectLink = {
  label: string;
  href: string;
};

// The preview card art on the homepage and archive.
export type ProjectPreview = {
  kind: "image" | "video" | "none";
  posters: readonly string[];
  alt: string;
  video?: string | null;
};

// The visual treatment of a project's card on the homepage.
export type ProjectHomeVariant = "viewport" | "triptych" | "folio" | "note";

// Where and how a project floats on the Sea of Consciousness homepage.
// Keeping this means the homepage nodes are driven by the same data file.
export type ProjectHomeNode = {
  coordinates: { top: string; left: string };
  size: "sm" | "md" | "lg";
  accentColor: string; // per-node accent for the homepage ONLY, does not leak into the reading room
  variant: ProjectHomeVariant;
};

export type Project = {
  slug: string; // unique, lowercase, hyphenated. Used in the URL: /projects/<slug>
  title: string;
  tier: ProjectTier; // NEW: drives the series framing and what gets featured
  type: ProjectType;
  status: ProjectStatus;
  year: string;
  dek: string; // one-line summary shown under the title
  description: string; // a short paragraph for the project page
  tags: string[]; // free-text tags for display
  entities: EntityId[]; // NEW: which concept-graph ideas this project touches
  links: ProjectLink[];
  preview: ProjectPreview;
  homeNode: ProjectHomeNode;
};

// ----------------------------------------------------------------------------
// Small display label maps, handy for the UI.
// ----------------------------------------------------------------------------

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
  "in-progress": "In progress",
  concept: "Concept",
} as const satisfies Record<ProjectStatus, string>;

export const projectTierLabels = {
  flagship: "Flagship",
  lab: "Lab",
  concept: "Concept",
} as const satisfies Record<ProjectTier, string>;
