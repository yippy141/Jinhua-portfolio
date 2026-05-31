# INFORMATION ARCHITECTURE

How the whole thing is shaped, why, and how the pieces connect. Written to be read by a person with limited coding experience. The technical and organizational decisions are explained in plain language first, code second.

Last updated: 2026-05-31

---

## 1. The shape in one paragraph

One website is the hub, at your own domain. The hub has two faces: an artistic front door called the Sea of Consciousness, and a calm editorial archive that presents your research seriously. Your bigger apps stay as separate satellites on their own subdomains, each keeping its own design. The hub does not try to absorb them. What ties everything together is not a shared coat of paint. It is three things: a named series, a shared evidence standard, and a concept graph that links projects by the ideas they share. That last piece is the part no other portfolio has.

You do not need a second "research analyst" website. The editorial archive is your research-analyst face. It just lives one click inside the hub instead of on a separate address.

---

## 2. The hub: routes and the two faces

The hub is a single Next.js app. These are its pages.

**Front door**

- `/` Sea of Consciousness. The atmospheric homepage. Deep water, slow drifting nodes, your motifs. Its one job is to earn attention and then send people inward fast. Every drifting node links to a real page.

**The reading room (your research-analyst face)**

- `/archive` The index of everything. A calm, filterable list of all projects and writing. This is the spine of the serious layer.
- `/projects/[slug]` One page per project. What it is, why you built it, how it works, current status, links out, and the entities it touches.
- `/research` Writing and publications. Your capstone chapter, Substack pieces, notes.
- `/about` Who you are and, in the first two sentences, what you do. A hiring manager should understand your work before they scroll. This page does more for the job search than any animation.
- `/methodology` The shared evidence standard, explained for readers. Every atlas links here. This page is your credibility, written down once.
- `/map` The concept graph. The interactive view of how your projects connect through shared ideas. More on this below.
- `/contact`

The front door is allowed to be unusual. The reading room must stay legible, calm, and editorial. The constitution holds both registers so they never blur.

---

## 3. The connective tissue: what makes this integrated, not just a list

A hub with links to projects is a menu. These three moves turn it into one body of work.

**Move one: name the series.** You are building a family of atlases, and several of them already carry the word in their name. Present them as a deliberate series with shared standards: "The Atlases." A reader who trusts one immediately understands the others. This is a framing decision, mostly copy on the homepage and about page. It costs almost nothing and changes how the whole thing reads.

**Move two: the shared evidence spine.** One methodology page that every atlas links back to, plus the shared components from the constitution (the source drawer, the confidence badge, the status tags). When every project visibly obeys the same standard, the rigor compounds. Six dashboards become one disciplined practice. This is both the thematic glue and the thing that makes a governance employer take you seriously.

**Move three: the concept graph.** This is the original idea and the most distinctive thing on the site. Your projects share ideas. China, compute, semiconductors, rare earths, export controls, space, AI governance. These are entities. Each project touches several of them. The concept graph is a view where clicking an entity like "compute" surfaces every project that touches it: the AI Stack, the Semiconductor atlas, the AI Race model, the AI Safety atlas. It is a knowledge graph of your own knowledge graphs.

And here is the payoff that ties art to substance: the drifting objects on your Sea of Consciousness homepage are not random decoration. They are the real entity graph. The same data that powers the concept-graph page powers the homepage motion. The art finally argues for how you think instead of competing with the content.

---

## 4. The data model, in plain language

Everything on the hub is generated from three small lists kept in plain text files. You edit the lists, the website updates itself. You do not touch layout code to add a project.

Think of three lists:

1. **Entities** (`data/entities.ts`). The ideas your work is about. Each entity has an id, a label, a kind (theme, place, technology, and so on), a one-line gloss, and a list of related entities. This is the vocabulary of your practice.

2. **Projects** (`data/projects.ts`). Each project has a title, a short description, a status, links, a tier (flagship, lab, or concept), and crucially a list of entity ids it touches. That last list is what wires a project into the graph.

3. **Types** (`data/types.ts`). The shape rules for the two lists above, so the editor catches your typos. You rarely change this.

From those three lists, the site derives, automatically:

- the archive cards and filters,
- each project page,
- the concept-graph page (entities and the projects under each),
- the drifting nodes on the homepage.

One edit, many surfaces. That is the whole point of the design. It is also why a novice can maintain this: adding a project is editing one object in one file.

Two cleanups are baked into the files I am giving you. First, your current `projects.ts` has two entries with the same slug `psii`, which would break the project page route. I merged them into one correct entry. Second, I added the `tier` and `entities` fields so the series framing and the graph have data to run on.

---

## 5. Satellites and when a project graduates

Your heavier apps stay independent. They keep their own repos, their own subdomains, and their own design. The hub links to them and gives each a project page, but does not redesign them.

Suggested subdomains:

```txt
worldview.<domain>   IR Worldview Inventory      flagship, your design anchor
aisafety.<domain>    Asia AI Safety Atlas        build next, the job bullseye
semis.<domain>       China Semiconductor Atlas    the lab
magnet.<domain>      Mine-to-Magnet Tracker       the lab
psii.<domain>        PSII Dashboard               the lab
space.<domain>       Celestial Dragon Atlas       the lab
```

On tiers. A **flagship** is polished to publishable and featured heavily. A **lab** project is real and shipping but presented as work in progress, proof that you build and ship across the China-tech stack. A **concept** is honestly labeled as not built yet. The discipline that matters: do not try to bring all twelve projects to a polish. Three deep plus the rest honestly labeled reads as prolific and disciplined. Twelve half-finished cards reads as scattered. A project graduates from lab to flagship when its evidence is solid, its methodology page is done, and one person who is not you can use it without help.

---

## 6. Repo strategy, the organizational question

This is the part that feels technical but is really about keeping your sanity as a solo builder using agents. Three options, and my recommendation.

**Option A, separate repos for everything (what you have now).** Simple to reason about, but you rebuild the same source drawer and confidence badge in every project. The shared components drift apart over time.

**Option B, one giant monorepo holding all projects.** In theory everything shares code. In practice a monorepo adds a build toolchain that is hard to debug when you are not a confident coder and something breaks at 1am. I would not start here.

**Option C, a template repo plus a shared kit (my recommendation).** You create one starter repo called `atlas-starter`. It bakes in the constitution, the fonts, the color tokens, and the shared components. Every new atlas is created by copying the starter. Existing repos get the constitution copied in and slowly adopt the shared components. You keep separate, simple repos, but they share a spine.

So the plan:

1. Copy `CONSTITUTION.md` into the root of every repo you already have.
2. In each repo, set `CLAUDE.md` to point at `AGENTS.md`, and `AGENTS.md` to say "read CONSTITUTION.md before any work." You already use this pointer pattern, this just adds the constitution to the chain.
3. Build the hub first, with the shared components living in it.
4. Once the components are proven in the hub, lift them into the `atlas-starter` template.
5. Revisit a real monorepo only if maintaining several repos starts to genuinely hurt. Not before.

---

## 7. Build order

Do these in order. Do not skip ahead to the homepage 3D. The connective tissue is worth more than any effect.

**Phase 0, foundation.** Drop the constitution and the three data files into the hub repo. Fix the duplicate-slug bug (the data file I gave you already fixes it). Wire the fonts and tokens. Write a real About page with a clear first-line statement of what you do.

**Phase 1, the reading room.** Finish the archive, project pages, and research page so they all generate from the data files. Editorial restraint, the constitution's type and color. No 3D yet.

**Phase 2, the spine.** Build the shared components (source drawer, confidence badge, status tags, entity chip) and the methodology page. This is the credibility layer.

**Phase 3, the graph.** Build the `/map` concept-graph page from the entities and projects data. Wire entity chips on project pages so a reader can jump across projects by idea.

**Phase 4, the front door.** Rebuild the Sea of Consciousness so its drifting nodes come from the same data, not from random points. Add the lightweight 3D enhancement last, with a still fallback for reduced motion and for devices that cannot run it.

**In parallel, the flagship build.** While the hub matures, spend your real build cycles polishing IR Worldview to publishable and standing up the Asia AI Safety Atlas, because that one is the bullseye for the AI governance roles you want.

The ready-to-use prompts for each of these phases are in `AGENT_PROMPTS.md`.
