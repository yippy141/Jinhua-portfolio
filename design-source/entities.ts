// data/entities.ts
//
// The ideas your work is about. These are the nodes of the concept graph and
// the drifting objects on the homepage. To add an idea, copy an entry, give it
// a unique id, and link it to related ideas. Keep glosses to one plain sentence.

import type { Entity } from "./types";

export const entities: Entity[] = [
  // ---- Themes -------------------------------------------------------------
  {
    id: "great-power-competition",
    label: "Great-power competition",
    kind: "theme",
    gloss: "The strategic contest between the US and China that runs under most of my work.",
    related: ["ai-governance", "supply-chains", "export-controls", "china"],
  },
  {
    id: "ai-governance",
    label: "AI governance",
    kind: "theme",
    gloss: "How states, firms, and institutions try to steer AI development and deployment.",
    related: ["ai-safety", "great-power-competition", "compute", "asia-pacific"],
  },
  {
    id: "ai-safety",
    label: "AI safety",
    kind: "theme",
    gloss: "Technical and institutional work to make advanced AI systems reliable and controllable.",
    related: ["ai-governance", "compute", "asia-pacific"],
  },
  {
    id: "export-controls",
    label: "Export controls",
    kind: "theme",
    gloss: "Restrictions on the flow of strategic technology, especially compute and chipmaking tools.",
    related: ["semiconductors", "compute", "great-power-competition", "supply-chains"],
  },
  {
    id: "supply-chains",
    label: "Supply chains",
    kind: "theme",
    gloss: "The physical and industrial chains behind strategic goods, where bottlenecks really sit.",
    related: ["semiconductors", "rare-earths", "industrial-capability", "aviation"],
  },
  {
    id: "industrial-capability",
    label: "Industrial capability",
    kind: "theme",
    gloss: "The gap between policy announcements and real operating capacity to build things.",
    related: ["supply-chains", "rare-earths", "semiconductors", "space"],
  },
  {
    id: "private-sector-influence",
    label: "Private-sector influence",
    kind: "theme",
    gloss: "How firms, investors, and commercial networks shape foreign policy and conflict.",
    related: ["philippines", "great-power-competition"],
  },

  // ---- Technologies -------------------------------------------------------
  {
    id: "compute",
    label: "Compute",
    kind: "technology",
    gloss: "The chips and clusters that train and run AI, and a central choke point in the race.",
    related: ["semiconductors", "ai-governance", "export-controls"],
  },
  {
    id: "semiconductors",
    label: "Semiconductors",
    kind: "technology",
    gloss: "Chips and the tools that make them, where China's indigenization runs into limits.",
    related: ["compute", "export-controls", "supply-chains", "industrial-capability", "china"],
  },
  {
    id: "rare-earths",
    label: "Rare earths",
    kind: "technology",
    gloss: "Critical minerals and the mine-to-magnet conversion problem behind clean tech and defense.",
    related: ["supply-chains", "industrial-capability", "export-controls"],
  },

  // ---- Domains ------------------------------------------------------------
  {
    id: "space",
    label: "Commercial space",
    kind: "domain",
    gloss: "China's hybrid strategic-industrial space sector, not a US-style private market.",
    related: ["china", "industrial-capability", "great-power-competition"],
  },
  {
    id: "aviation",
    label: "Aviation",
    kind: "domain",
    gloss: "Commercial aircraft order books, deliveries, and the supplier reality behind the headlines.",
    related: ["supply-chains", "industrial-capability"],
  },
  {
    id: "climate",
    label: "Climate systems",
    kind: "domain",
    gloss: "Large-scale climate patterns like El Nino and La Nina and their global effects.",
    related: ["asia-pacific"],
  },

  // ---- Places -------------------------------------------------------------
  {
    id: "china",
    label: "China",
    kind: "place",
    gloss: "The deep-dive geography across most of my work, from AI to space to chips.",
    related: ["great-power-competition", "semiconductors", "space", "ai-governance"],
  },
  {
    id: "asia-pacific",
    label: "Asia-Pacific",
    kind: "place",
    gloss: "The wider region beyond the US/UK/EU lens, including Japan, Korea, Singapore, and ASEAN.",
    related: ["china", "ai-governance", "philippines"],
  },
  {
    id: "philippines",
    label: "Philippines",
    kind: "place",
    gloss: "The case at the center of my capstone on private-sector influence in asymmetric conflict.",
    related: ["private-sector-influence", "asia-pacific"],
  },

  // ---- Method -------------------------------------------------------------
  {
    id: "source-backed-atlas",
    label: "Source-backed atlas",
    kind: "method",
    gloss: "The recurring form of my work: a public, source-traceable map of a hard domain.",
    related: ["ai-governance", "semiconductors", "rare-earths", "space"],
  },
];
