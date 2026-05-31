# Implementation Handoff — Jinhua Yip Hub

Prepared for: Jinhua + the product-manager AI + Claude Code / Codex.
Purpose: turn the approved **Front Door A (Living Graph)** + **Reading Room** design into the real Next.js hub, without losing the look.
Companion files: `CONSTITUTION.md`, `INFORMATION_ARCHITECTURE.md`. This doc sits between them and the code.

---

## 0. TL;DR for the build agent

1. The design is approved as two registers: **deep-water front door** (`/`) and **warm-paper reading room** (`/archive`, project pages, etc.).
2. All copy and project data live in **one file** the human edits: `content.js` here → `data/content.ts` (or keep `data/projects.ts`) in the repo. Layout never hard-codes copy.
3. **Three fonts, six colors, nothing else.** Tokens are in `tokens.css`. Wire them into Tailwind + CSS variables exactly.
4. The homepage nodes are the **real project graph**, not decoration. Same data drives `/map`.
5. **The evidence-contract UI (source drawer, confidence badges, status tags) does NOT appear on the hub archive.** It belongs inside the atlas data-products. See §6 — this is a deliberate change from a literal reading of the constitution, with reasoning.

---

## 1. What changed from the first concept, and why

| Feedback | Resolution in this build |
|---|---|
| Node codes ("WR", "RE-MAG") meant nothing | Nodes now show **readable labels** ("Writing", "Rare Earths", "Philippines · SCS"). The short code is gone from the UI. |
| Want whale taxonomy / animated whales, but distinct from the graph | Added a **back layer**: faint *italic Newsreader* species names + low-opacity whale silhouettes, drifting. Visually separate from the **sharp mono** node labels and the **bright upright serif** hero. Three registers, never blurred. |
| "Why are we talking about source records on my personal site?" | **Removed** the evidence machinery from the hub. Archive now uses plain human status ("Beta · live trial", "In progress", "Published"). |
| Footer text crushed | Footers rebuilt with explicit spacing + `white-space: nowrap`; QA'd. |
| Easy modular edits | Everything text/project-shaped is in `content.js`, heavily commented. Adding a project = copy one block. |
| Discreet social everywhere | `SocialCluster` (email · LinkedIn · Substack · GitHub) in every nav + both footers. Present, quiet, easy to find. |

---

## 2. File map (this prototype → the repo)

| Prototype file | Role | Becomes in the Next.js hub |
|---|---|---|
| `tokens.css` | fonts + color tokens + shared primitives | `app/globals.css` + Tailwind `@theme` tokens |
| `content.js` | **all copy + projects** | `data/projects.ts` + `data/entities.ts` (typed) |
| `icons.jsx` | line icons + `SocialCluster` | `components/icons.tsx`, `components/social-cluster.tsx` |
| `frontdoor-a.jsx` | the `/` front door | `app/page.tsx` + `components/sea-scene.tsx` |
| `readingroom.jsx` | the `/archive` index | `app/(editorial)/archive/page.tsx` |
| `artboards.css` | all layout CSS | colocated CSS / Tailwind classes |

> The `design-canvas.jsx` + `canvas-app.jsx` files are presentation scaffolding only. Do **not** port them.

---

## 3. Tokens (authoritative — copy verbatim)

Already in `tokens.css`. The non-negotiables:

- Fonts: **Newsreader** (voice/headlines/body), **IBM Plex Sans** (UI/labels), **IBM Plex Mono** (data/metadata). Load with `next/font/google`, variables `--font-serif / --font-sans / --font-mono`.
- Reading room: paper `#F4F0E6`, panel `#ECE7D9`, ink `#1E1A16`, ink-2 `#5A5249`, rule `#D8D1BE`.
- Deep water: paper `#07100F`, panel `#0C1A17`, ink `#EDEFEA`, ink-2 `#9DB0A8`, rule `#1C2B27`.
- Accent: oxblood `#7E2B22` (light) / `#C2685C` (on dark). Teal `#356B66`, sonar highlight `#4FB3BF` — **rare**, front door only.
- Radius ≤ 4px. Hairline 1px borders. Almost no shadows in the reading room.

---

## 4. The data model (`content.js` → typed `projects.ts`)

Each project object already carries every field the whole site derives from:

```ts
type Project = {
  id: string;            // stable key + route slug
  node: string;          // readable label on the homepage graph
  title: string;         // full title (archive + project page)
  tier: "flagship" | "lab" | "research" | "essay";
  status: string;        // human label, e.g. "In progress"
  type: string;          // "Instrument" | "Atlas" | "Tracker" | ...
  year: string;
  dek: string;           // one line
  tags: string[];        // entity vocabulary (topic tags)
  href: string;          // link target
  video: string | null;  // hover-dossier screen recording (null = placeholder)
  x: number; y: number;  // homenode position, % of 1440×900
  r: number;             // node radius px
};
```

**Required cleanups when porting (from the repo you sent):**
1. **Delete the duplicate `psii` entry** in `data/projects.ts`. There are two; keep the dashboard one. The route `/projects/psii` currently collides.
2. **Replace `Geist`/`Geist_Mono`** in `app/layout.tsx` with the three constitution fonts.
3. **Replace `#fafaf8` / stone** values in `globals.css` with the paper/ink tokens.
4. Add the `tier`, `node`, `x/y/r`, and `tags` fields (the graph + series framing need them).

The graph links live in `content.links` as `[idA, idB]` pairs. `/map` and the homepage both read this same array.

---

## 5. Front door behavior spec (for the real three.js build — Phase 4)

The prototype fakes motion with CSS so we could lock the look. The production version:

- **Nodes = projects**, positioned from `x/y`, connected by `links`. Flagship node in oxblood, others ink-2; hovered node + its edges light **sonar teal**.
- **Hover/focus a node →** dossier card expands with: type · year, status, a **muted looping video** (`video` field; `IR Worldview` has a real clip, the rest are placeholders), title, dek, "Open project →".
- **Back layer:** drifting italic-serif species names + whale silhouettes from `content.taxonomy`. Swap in Jinhua's own whale SVGs by replacing the `<path>` in `WhaleSilhouette` (or dropping an `<img>` into `.whale-drift`).
- **Motion:** slow, tidal, 400–900ms ambient; UI feedback 150–250ms; easing `cubic-bezier(0.22,1,0.36,1)`. No spring/bounce.
- **Reduced motion / low-power / no-WebGL:** render a **still** version — nodes laid out statically, no drift, taxonomy static. This is a hard requirement (constitution §3.4).
- Keyboard: nodes are tabbable; Enter opens; Esc closes the dossier.

---

## 6. Deliberate divergence from the constitution (decide before building)

The constitution says the evidence contract (SourceDrawer, ConfidenceBadge, StatusTag) appears across **every** surface. I removed it from the **hub** because:

- On a personal portfolio, "evidence_class: press_release / confidence: medium" reads as machinery without a job. Jinhua flagged exactly this confusion.
- The contract earns its keep **inside an atlas** — where there are real claims, sources, and uncertainty to expose. That is where a governance employer wants to see the rigor.

**Recommendation:** keep the evidence components in the shared kit and use them **inside the atlas products** (IR Worldview, Semiconductor Atlas, etc.), and on the **`/methodology`** page that explains the standard. Keep the hub archive plain. If the PM wants the contract on the hub too, the minimal compliant version is a single quiet "Methodology" link in the footer (already room for it) — not per-row badges.

A second, smaller divergence: I allow **one** motion primitive in the reading room (entity-chip hover highlighting its related projects, source-drawer slide-in inside atlases) rather than zero. Tidal and quiet. This keeps the instrument feeling alive. Reject if you want strict stillness.

---

## 7. Build order (maps to IA §7, token-efficient)

Do these as **separate** Claude Code / Codex sessions, each starting by reading `CONSTITUTION.md`:

- **Phase 0 — Foundation patch.** Fonts + tokens into `layout.tsx`/`globals.css`/Tailwind. Fix the `psii` duplicate. Extend the `Project` type with the new fields. Small, surgical PR.
- **Phase 1 — Reading room.** Build `/archive` from `readingroom.jsx`, then `/projects/[slug]` and `/about` from the same data. Editorial restraint only, no 3D.
- **Phase 2 — The spine (for atlases, not the hub).** Build SourceDrawer / ConfidenceBadge / StatusTag / EntityChip + `/methodology`. Wire entity chips to surface related projects.
- **Phase 3 — `/map`.** The concept graph from `content.links`. Static layout first.
- **Phase 4 — Front door engine.** Replace the CSS mock in `frontdoor-a.jsx` with three.js per §5, fed by the same data. Build the reduced-motion still fallback **first**, then layer WebGL on top.

Each phase ends with: review in browser → commit with a clear message.

---

## 8. QA checklist (run before every merge)

- [ ] No banned fonts (Inter, Roboto, Geist, Space Grotesk, Poppins) anywhere, incl. fallbacks.
- [ ] No pure `#000`/`#fff`. No glass/frosted blur. No glowing gradient borders. No centered gradient hero.
- [ ] Only the six token colors + the two accents. No stray hex.
- [ ] Footers and metadata rows have real spacing, no crushed text.
- [ ] Social cluster present + reachable on every page.
- [ ] Front door has a working still fallback for `prefers-reduced-motion`.
- [ ] Every node links somewhere real; no dead `#` in production.
- [ ] Voice: no em dashes, no AI filler words (constitution §2).
