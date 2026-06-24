# Phase 1 Architecture Plan: Simplified Chinese Edition

This is an implementation plan for a later Phase 1. It is not implemented in
Phase 0.

## Current Repo State

- Framework: Next `16.2.4`, App Router, TypeScript, Tailwind, Motion.
- No `next-intl` dependency is installed.
- English public URLs are currently unprefixed: `/`, `/about`, `/research`,
  `/archive`, `/contact`, `/methodology`, and `/projects/[slug]`.
- `/lab/sea-intro` is an internal diagnostic route, not a public content route.
- Shared project structure currently lives in `data/projects.ts`.
- The homepage uses `SeaIntroV2` and stores intro completion in
  `sessionStorage` under `SESSION_KEY = "sea-intro-complete"`.
- Static project routes are generated from `projects.map((project) => ({
  slug: project.slug
}))`.
- `next/font` is configured in `app/layout.tsx` for Latin text. Do not remove
  it or work around sandbox font-fetch failures.

## Routing Architecture

Add `next-intl` in Phase 1 and wire it through `next.config.ts`.

Use `proxy.ts`, not `middleware.ts`, because Next 16 renamed middleware to
proxy.

Use this exact routing intent:

```ts
const routing = defineRouting({
  locales: ["en", "zh-Hans"],
  defaultLocale: "en",
  localePrefix: {
    mode: "as-needed",
    prefixes: {
      "zh-Hans": "/zh",
    },
  },
  localeDetection: false,
  localeCookie: false,
});
```

Public prefixes:

- English: none
- `zh-Hans`: `/zh`

English must remain at:

- `/`
- `/about`
- `/research`
- `/archive`
- `/contact`
- `/methodology`
- `/projects/[slug]`

Chinese must use:

- `/zh`
- `/zh/about`
- `/zh/research`
- `/zh/archive`
- `/zh/contact`
- `/zh/methodology`
- `/zh/projects/[slug]`

Keep all project slugs unlocalized.

Additional routing rules:

- Keep `/` English. Do not auto-redirect `/` to `/zh` based on browser
  language, cookies, or prior locale state.
- Treat `/en/...` as non-public. If requested, redirect to the equivalent
  unprefixed English URL.
- Move public route content under locale-aware App Router segments so both
  English and Chinese can receive a locale param while public English URLs stay
  unprefixed.
- Add `generateStaticParams` for locales and keep project
  `generateStaticParams` slug-driven.
- Call `setRequestLocale(locale)` in layouts and pages that use `next-intl` APIs
  and should remain statically rendered.
- Create locale-aware navigation wrappers in `i18n/navigation.ts` and use them
  for internal links.
- Add a language switcher that keeps the current pathname and preserves query
  parameters, including `intro`, `introDebug`, and `diveTarget`.
- Preserve `SeaIntroV2` session behavior by keeping
  `SESSION_KEY = "sea-intro-complete"` shared across locales.
- Hide or disable the language switcher while the dive transition is active.

## Lab Route

- `/lab/sea-intro` is an internal diagnostic route.
- It must be `noindex`.
- It must not appear in the sitemap.
- A Chinese-prefixed internal equivalent is not a public acceptance
  requirement.

## Content Architecture

- Keep shared structural data in `data/projects.ts`.
- Put localized editorial overlays in `data/i18n/en.ts` and
  `data/i18n/zh-Hans.ts`.
- Add a typed accessor that merges structural project data with locale-specific
  text.
- Do not modify `data/projects.ts` or `data/types.ts` merely to duplicate
  Chinese strings.
- Only modify structural types if TypeScript genuinely requires a generic
  localized-content interface.
- Keep long editorial prose in locale-specific typed content files, not messages
  JSON.
- Use messages JSON only for short reusable UI strings: nav labels, buttons,
  filters, project type labels, project status labels, section headings, skip
  links, language switch labels, and compact controls.
- Keep Chinese project titles as the English titles until explicitly approved in
  `docs/i18n/CHINESE_COPY_V0.md` or a later approved copy file.
- Do not use one generic Chinese description across projects.
- Missing Chinese editorial content should fail visibly in development instead
  of silently falling back to generic Chinese prose.

Shared data includes:

- ids
- slugs
- routes
- coordinates
- preview media
- external links
- source ids
- status values
- project geometry

## Metadata And Sitemap

- Localize metadata per locale:
  - English metadata remains current.
  - Chinese metadata uses `叶锦华｜研究与项目` as the site title.
  - Chinese metadata uses the approved V0 SEO description.
- Add canonical and alternate metadata for English and Chinese pages.
- Add `app/sitemap.ts` with English and Chinese URL pairs plus language
  alternates for all public static pages and project pages.
- Exclude `/lab/sea-intro` from the sitemap.

## Fonts And Tokens

- Do not add a Chinese Google font or CJK `next/font` family in Phase 1.
- Preserve the existing `next/font` setup for Latin text.
- Add language-specific CSS system stacks in `app/globals.css`.
- No CJK webfont payload should be introduced.

Use this stack intent:

```css
:lang(zh-Hans) {
  --font-sans:
    "PingFang SC",
    "Noto Sans CJK SC",
    "Source Han Sans SC",
    "Microsoft YaHei",
    sans-serif;

  --font-serif:
    "Songti SC",
    "Noto Serif CJK SC",
    "Source Han Serif SC",
    serif;
}
```

Chinese typography rules:

- Chinese body line height should generally be `1.7` to `1.85`.
- Do not simulate Chinese italics.
- Do not inherit English letter spacing into Chinese navigation.
- Do not copy English hard line breaks into Chinese headings.

## Updated Phase 1 File Impact

Modify:

- `package.json`
- `package-lock.json`
- `next.config.ts`
- `app/globals.css`
- `app/layout.tsx`

Move or add locale route structure:

- `app/[locale]/layout.tsx`
- `app/[locale]/page.tsx`
- `app/[locale]/(editorial)/layout.tsx`
- `app/[locale]/(editorial)/about/page.tsx`
- `app/[locale]/(editorial)/archive/page.tsx`
- `app/[locale]/(editorial)/contact/page.tsx`
- `app/[locale]/(editorial)/research/page.tsx`
- `app/[locale]/(editorial)/projects/[slug]/page.tsx`
- `app/[locale]/methodology/page.tsx`

Keep or update as internal diagnostic route:

- `app/lab/sea-intro/page.tsx`

Modify navigation and content consumers:

- `components/site-header.tsx`
- `components/site-footer.tsx`
- `components/archive-list.tsx`
- `components/sea-intro/sea-nav.tsx`
- `components/sea-intro/surface-menu.tsx`
- `components/sea-intro/home-scene.tsx`
- `components/sea-intro/project-drift-field.tsx`
- `components/sea-intro/dive-aperture.tsx`

Add:

- `proxy.ts`
- `i18n/routing.ts`
- `i18n/navigation.ts`
- `i18n/request.ts`
- `messages/en.json`
- `messages/zh-Hans.json`
- `data/i18n/types.ts`
- `data/i18n/en.ts`
- `data/i18n/zh-Hans.ts`
- `data/i18n/index.ts`
- `components/language-switcher.tsx`
- `app/sitemap.ts`

Do not modify by default:

- `data/projects.ts`
- `data/types.ts`

Only touch these structural data files if TypeScript requires a shared generic
localized-content interface or another non-duplicative structural change.

## Acceptance Criteria

- Current English public URLs still work: `/`, `/about`, `/research`,
  `/archive`, `/contact`, `/methodology`, `/projects/[slug]`.
- Chinese equivalents work: `/zh`, `/zh/about`, `/zh/research`, `/zh/archive`,
  `/zh/contact`, `/zh/methodology`, `/zh/projects/[slug]`.
- `/en/...` is not a public URL and redirects to the unprefixed English
  equivalent if requested.
- Locale-aware navigation renders correct links for the active locale.
- Locale switcher preserves the current path and query string.
- Switching language does not restart the dive when the visitor is already in
  the settled depths.
- The language switch is disabled or hidden while the dive transition is active.
- English and Chinese pages share the same project ids, slugs, coordinates,
  preview media, and links.
- `/zh` pages use `html lang="zh-Hans"`.
- Chinese navigation has no artificial tracking.
- Homepage CTA renders `下潜` in Chinese and `Dive in` in English.
- Chinese metadata uses `叶锦华｜研究与项目`; English metadata remains current.
- Sitemap includes localized alternates for every public static page and
  project page.
- `/lab/sea-intro` is excluded from sitemap and search indexing.
- No CJK webfont payload is introduced.
- Chinese project titles remain English unless explicitly approved in
  `CHINESE_COPY_V0.md`.
- English may remain the temporary fallback only for explicitly unapproved
  project titles.
- No generic Chinese project descriptions are shipped.
- Missing Chinese editorial content fails visibly in development instead of
  silently falling back to generic Chinese prose.
- `npm run lint` is checked. Existing failures are recorded as pre-existing
  unless Phase 1 touches them.
- `next build` is checked. If it fails only on Google Font fetching in the
  sandbox, record that and use the Vercel preview build as the real test.

## Architectural Risks

- Route moves are broad even though public English URLs must remain stable. The
  migration should be done in one focused pass, with URL checks before and
  after.
- `localeDetection: false` and `localeCookie: false` are important. Browser,
  cookie, or prior-locale redirects could move `/` away from English.
- Query-preserving locale switching needs explicit handling. It must not drop
  homepage debug and dive parameters.
- The homepage is client-heavy. Locale data should be passed cleanly so the
  no-JavaScript and returning-visitor depths shell remains usable.
- Language switching during the dive could interrupt a locked transition unless
  the switcher is hidden or disabled.
- Project content is shared by several surfaces. The localized data layer must
  avoid duplicating geometry, slugs, links, preview media, and status values.
- Chinese typography can inherit English letter spacing or hard line breaks if
  CSS and component copy are not reviewed carefully.
- Existing lint failures are already present outside this i18n work. Phase 1
  should distinguish pre-existing failures from regressions.

## Rollback Strategy

- Revert the Phase 1 commit or PR as one unit.
- Remove `next-intl`, `proxy.ts`, `i18n/*`, `messages/*`, `data/i18n/*`,
  `components/language-switcher.tsx`, and `app/sitemap.ts`.
- Move public route files back from `app/[locale]` to their current locations.
- Restore direct `next/link` imports where replaced by locale-aware navigation.
- Restore the previous `app/globals.css` font-token behavior if the
  language-specific stacks cause regressions.
- Keep Phase 0 documentation files unless the product decision itself changes.
