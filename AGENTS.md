<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Read the constitution first

Before doing any design or content work in this repo, read `CONSTITUTION.md` at the repo root in full. It is the single source of truth for how everything looks, sounds, and behaves. If anything here or anywhere else disagrees with it, `CONSTITUTION.md` wins.

This repo is a premium personal portfolio site.

## Product stance
- The homepage may be artistic and atmospheric.
- Inner pages must remain editorial, legible, and calm.
- Prefer clarity over spectacle.
- Motion should feel slow, intelligent, and restrained.
- Do not make the site feel like SaaS, a game UI, or a generic developer portfolio.

## Technical rules
- Keep dependencies minimal.
- Use Next.js App Router, TypeScript, Tailwind, and Motion.
- React Three Fiber is homepage-only and optional.
- Preserve progressive enhancement.
- Respect reduced motion.
- Keep project content in a typed local data file.

## Working style
- Make the smallest coherent diff.
- Do not rewrite unrelated files.
- Explain changes for a beginner.
- End each implementation pass with review notes and a commit message.

## Environment limits
Your sandbox cannot fetch Google Fonts or other external assets at build
time. This is a sandbox limitation, not a bug in this repo. Never remove,
replace, or work around next/font or any font loading to make your local
build pass. If the build fails only on font fetching, note it in your
review notes and rely on the Vercel preview build as the real test.
