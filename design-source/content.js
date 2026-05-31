/* ═══════════════════════════════════════════════════════════════════════
   content.js  ·  SINGLE SOURCE OF TRUTH FOR ALL COPY + PROJECTS
   ───────────────────────────────────────────────────────────────────────
   Edit THIS file to change text, projects, links, or node positions.
   You never need to touch the layout / component files to update content.

   In the real Next.js hub this maps 1:1 to data/projects.ts +
   data/entities.ts. Field names are kept identical so the handoff is clean.
   ═══════════════════════════════════════════════════════════════════════ */
window.CONTENT = {

  /* ── Identity ───────────────────────────────────────────────────────── */
  brand: {
    name: "Jinhua Yip",
    tagline: "INTELLIGENCE ATLASES",
  },

  /* ── Primary navigation (order matters) ─────────────────────────────── */
  nav: ["Archive", "Research", "Map", "About", "CV"],

  /* ── Social / contact. Discreet on every page, never blatant. ───────── */
  social: [
    { id: "email",    label: "Email",    href: "mailto:jhyip16@outlook.com" },
    { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/jinhua-yip-88924513b/" },
    { id: "substack", label: "Substack", href: "https://substack.com/@yippy2" },
    { id: "github",   label: "GitHub",   href: "https://github.com/yippy141" },
  ],

  /* ── Front door (deep water) copy ───────────────────────────────────── */
  hero: {
    eyebrow: "The Atlases · No. 02",
    headline: "Source-backed maps of frontier technology and great-power competition.",
    positioning: "AI governance · semiconductors · rare earths · the maritime grey-zone.",
    ctaPrimary: "Enter the archive",
    ctaHint: "or drift the graph · hover a node",
  },
  frontFooter: [
    "22.5°N · 114.1°E",
    "EACH NODE IS A REAL PROJECT",
    "DRAG TO EXPLORE · HOVER TO OPEN",
  ],

  /* ── Reading room (warm paper) copy ─────────────────────────────────── */
  archive: {
    eyebrow: "The Atlases · Index",
    headline: "Maps, tools, and writing on technology and power.",
    lede: "A family of projects on AI governance, semiconductors, rare earths, and the maritime grey-zone. Built to be useful to a newcomer and a specialist alike.",
    filters: ["All", "Flagship", "Lab", "Research", "Writing"],
  },

  /* ── Faint whale taxonomy drifting behind the graph (front door) ──────
     Distinct register: large faint ITALIC SERIF, never mono.
     Add / remove freely. */
  taxonomy: [
    "Cetacea", "Mysticeti", "Odontoceti", "Balaenoptera musculus",
    "Physeter macrocephalus", "Megaptera novaeangliae", "Orcinus orca",
    "Monodon monoceros", "Eschrichtius robustus", "Delphinapterus leucas",
  ],

  /* ── PROJECTS ─────────────────────────────────────────────────────────
     ONE object per project. Fields:
       id        short stable key
       node      readable label shown on the homepage graph (keep it human)
       title     full title used in the archive + project page
       tier      "flagship" | "lab" | "research" | "essay"  (drives accent)
       status    plain human label shown in the archive
       type      kind of artifact (shown as metadata)
       year
       dek       one-line description
       tags      topic tags (the entity vocabulary)
       href      where the node / archive row links to
       video     screen-recording for the hover dossier (null = placeholder)
       x, y      homenode position, % of the 1440×900 front door
       r         node radius in px
     To add a project: copy a block, change the fields, set x/y. Done. */
  projects: [
    {
      id: "irwv", node: "IR Worldview", title: "IR Worldview Inventory",
      tier: "flagship", status: "Beta · live trial", type: "Instrument", year: "2026",
      dek: "A reflective instrument that maps the theories and priors shaping how readers read world affairs.",
      tags: ["IR theory", "AI governance"], href: "https://ir-worldview-inventory.vercel.app",
      video: "videos/ir-worldview-loop.mp4",       /* you have this one */
      x: 55, y: 33, r: 14,
    },
    {
      id: "aisa", node: "AI Safety Atlas", title: "Asia AI Safety Atlas",
      tier: "lab", status: "In progress", type: "Atlas", year: "2026",
      dek: "A source-traceable map of AI safety and governance capacity across the region.",
      tags: ["compute", "AI governance"], href: "#",
      video: null,
      x: 78, y: 23, r: 9,
    },
    {
      id: "semi", node: "Semiconductors", title: "China Semiconductor Atlas",
      tier: "lab", status: "In progress", type: "Atlas", year: "2026",
      dek: "Tooling, fabs, and chokepoints across the semiconductor stack, with export-control context.",
      tags: ["semiconductors", "export controls"], href: "#",
      video: null,
      x: 85, y: 47, r: 9,
    },
    {
      id: "space", node: "Commercial Space", title: "Celestial Dragon Atlas",
      tier: "lab", status: "In progress", type: "Atlas", year: "2026",
      dek: "China's commercial space sector: launch cadence, constellations, and dual-use capacity.",
      tags: ["commercial space", "compute"], href: "#",
      video: null,
      x: 91, y: 30, r: 7,
    },
    {
      id: "magnet", node: "Rare Earths", title: "Mine-to-Magnet Capability Tracker",
      tier: "lab", status: "In progress", type: "Tracker", year: "2026",
      dek: "Whether allied rare-earth announcements can become operating mine-to-magnet capacity.",
      tags: ["rare earths", "supply chains"], href: "#",
      video: null,
      x: 71, y: 61, r: 8,
    },
    {
      id: "psii", node: "PSII", title: "PSII Dashboard",
      tier: "lab", status: "Beta", type: "Dashboard", year: "2026",
      dek: "A versioned index of private-sector influence in foreign policy, rebuilt from the SAIS capstone.",
      tags: ["private-sector influence", "foreign policy"], href: "https://psii-dashboard.vercel.app",
      video: null,
      x: 60, y: 70, r: 8,
    },
    {
      id: "phsc", node: "Philippines · SCS", title: "The Philippines in the South China Sea",
      tier: "research", status: "Published · 2025", type: "Essay", year: "2025",
      dek: "Grey-zone coercion in the West Philippine Sea: vessel tracking, statecraft, and norm erosion.",
      tags: ["maritime", "foreign policy"], href: "#",
      video: null,
      x: 83, y: 66, r: 7,
    },
    {
      id: "writing", node: "Writing", title: "Writing",
      tier: "essay", status: "Ongoing", type: "Essays", year: "2026",
      dek: "Essays and notes on power, technology, and strategic choice.",
      tags: ["essays", "notes"], href: "https://substack.com/@yippy2",
      video: null,
      x: 67, y: 83, r: 6,
    },
  ],

  /* ── Graph links: which projects share an idea (drawn as hairlines) ──── */
  links: [
    ["irwv","aisa"], ["irwv","psii"], ["irwv","writing"], ["aisa","semi"],
    ["semi","magnet"], ["semi","space"], ["aisa","space"], ["magnet","psii"],
    ["psii","phsc"], ["phsc","writing"],
  ],
};
