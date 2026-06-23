# Product

> Strategic context (who / what / why). For how it looks, sounds, and behaves,
> `CONSTITUTION.md` at the repo root is the single source of truth and wins on any
> conflict. This file does not restate tokens, fonts, or voice rules; it captures
> the strategy those decisions serve.

## Register

brand

The site is a personal portfolio where the design *is* the product. A visitor's
impression is the thing being made. The homepage may be atmospheric (the "deep
water" front door); inner pages stay editorial, legible, and calm (the "reading
room").

## Users

Built for a specific reader, not a general audience:

- Think-tank and policy analysts evaluating the rigor of the work.
- AI-governance, safety, and alignment hires and the people who do that hiring.
- Journalists looking for a credible, source-traceable handle on a hard domain.
- Curious professionals who want to learn a frontier-technology domain quickly.

Context of use: arriving skeptical, short on time, allergic to hype. They are
deciding whether this person and this work can be trusted. They read like
analysts: they want the claim, then the evidence, then the limits of the
evidence.

## Product Purpose

Jinhua Yip builds source-backed intelligence products about frontier technology
and great-power competition. The recurring form is the **atlas**: a public,
source-traceable map of a hard domain (China's AI stack, semiconductor tooling,
rare-earth capability, commercial space, AI safety and governance). Each atlas is
built so a newcomer can learn the domain and a specialist can still find
something they had not been tracking.

The site exists to present these atlases and the person behind them with one
standard: **confident presentation, humble architecture.** State findings
clearly. Show the evidence and its limits honestly. Never blur a claim with a
guess.

**What success looks like:** the reader leaves trusting the work and remembering
the name. The primary outcome is earned credibility, not conversion. There is no
hard call to action; rigor and restraint do the persuading. The reading room
should make a skeptical analyst think "this person does careful work," and the
front door should make them feel they have arrived somewhere deliberate.

## Brand Personality

Three words: **rigorous, calm, source-honest.**

Voice is a sharp analyst writing a brief, not a chatbot writing a summary. Make
claims, then source them. State uncertainty plainly. Short sentences carry
weight. First person is fine on the personal site; the atlases speak in a neutral
analytical voice. (Full voice rules, including the hard "no em dashes" rule and
the AI-filler ban list, live in CONSTITUTION.md §2.)

Emotional goal: the quiet authority of a good dossier. Confidence without
swagger. The interface should feel like a precision research instrument, part
think-tank dossier, part maritime archive, never like a product trying to sell
itself.

## Anti-references

This is **not** a SaaS landing page, a personality quiz, or a developer toy. It
must never look like a generic developer portfolio, a startup marketing site, or
a dashboard demo.

Specific banned moves (CONSTITUTION.md §6 is canonical):

- Banned fonts: Inter, Roboto, Arial, Geist, Space Grotesk, Poppins, Montserrat,
  system-ui as a deliberate brand choice.
- Banned color moves: purple / indigo / violet gradients on white; neon;
  glassmorphism; pure `#000`/`#fff`; traffic-light red/yellow/green for
  confidence.
- Banned patterns: centered hero with gradient-filled headline; oversized pill
  buttons; the three-up row of rounded "feature cards" with an icon on top; emoji
  as interface icons; a generic "trusted by" logo strip; bouncy spring animation
  on serious content; glowing animated gradient borders; auto-playing carousels.

Spectacle is reserved for the homepage front door only. Everywhere else, earn
trust with rigor, not effects.

## Design Principles

1. **Confident presentation, humble architecture.** The north star. State the
   finding clearly; show the evidence and its limits honestly. Every public claim
   traces to a source record (the evidence contract, CONSTITUTION.md §4).
2. **Two registers, never blurred.** A warm-paper reading room for analysis; deep
   water for atmosphere and the front door. Serif voice carries the argument;
   mono type marks the machinery being shown honestly. Motion and spectacle stay
   on the front door.
3. **Show the work, don't praise it.** No hype adjectives, no decoration standing
   in for substance. Elegance comes from spacing, hairline rules, and restraint.
4. **Earn trust, don't transact.** No hard CTA, no growth-funnel patterns. The
   reader's confidence in the work is the conversion.
5. **Smallest coherent change.** Reuse the shared component contract
   (SourceDrawer, SourceCite, ConfidenceBadge, StatusTag, EntityChip,
   MethodologyLink) so six projects feel like one body of work. Don't reinvent
   primitives or rewrite unrelated files.

## Accessibility & Inclusion

Target: **WCAG 2.2 AA.**

- Body text ≥4.5:1 contrast; large text ≥3:1. Verify against the warm-paper and
  deep-water surfaces, not against pure white/black.
- Full keyboard operability, visible focus, semantic structure and landmarks.
- `prefers-reduced-motion` is honored everywhere, with a real still fallback for
  the homepage front door and the sea-intro sequence (not just suppressed
  animation).
- The evidence layer (SourceDrawer, ConfidenceBadge, StatusTag) must be legible
  to screen readers: confidence and status conveyed by text, never color alone.
