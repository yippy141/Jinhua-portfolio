import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cwd } from "node:process";

const root = cwd();

function readJson(path) {
  return JSON.parse(readFileSync(join(root, path), "utf8"));
}

function readText(path) {
  return readFileSync(join(root, path), "utf8");
}

function flattenKeys(value, prefix = "") {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [prefix];
  }

  return Object.entries(value).flatMap(([key, child]) =>
    flattenKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function sliceBraced(text, openIndex) {
  let depth = 0;
  let quote = "";
  let escaped = false;

  for (let i = openIndex; i < text.length; i++) {
    const char = text[i];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = "";
      }
      continue;
    }

    if (char === "\"" || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === "{") {
      depth++;
    } else if (char === "}") {
      depth--;
      if (depth === 0) return text.slice(openIndex, i + 1);
    }
  }

  throw new Error("Could not read braced object.");
}

function projectEntry(text, slug) {
  const start = text.indexOf(`"${slug}": {`);
  assert(start >= 0, `Missing explicit Chinese project entry for ${slug}.`);
  return sliceBraced(text, text.indexOf("{", start));
}

function sharedProjectBlock(projectsText, slug, allSlugs) {
  const slugIndex = projectsText.indexOf(`slug: "${slug}"`);
  assert(slugIndex >= 0, `Missing shared project data for ${slug}.`);
  const nextSlugIndex = allSlugs
    .map((nextSlug) => projectsText.indexOf(`slug: "${nextSlug}"`, slugIndex + 1))
    .filter((index) => index > slugIndex)
    .sort((a, b) => a - b)[0];
  return projectsText.slice(
    slugIndex,
    nextSlugIndex > 0 ? nextSlugIndex : projectsText.length,
  );
}

const enMessages = readJson("messages/en.json");
const zhMessages = readJson("messages/zh-Hans.json");
const enKeys = flattenKeys(enMessages).sort();
const zhKeys = flattenKeys(zhMessages).sort();

assert(
  JSON.stringify(enKeys) === JSON.stringify(zhKeys),
  "messages/en.json and messages/zh-Hans.json do not have matching keys.",
);

const enContent = readText("data/i18n/en.ts");
const zhContent = readText("data/i18n/zh-Hans.ts");
const projectsText = readText("data/projects.ts");
const placesText = readText("data/places.ts");

const projectSlugs = [...projectsText.matchAll(/slug: "([^"]+)"/g)].map(
  (match) => match[1],
);

assert(projectSlugs.length === 9, "Expected exactly nine shared projects.");

for (const slug of projectSlugs) {
  const entry = projectEntry(zhContent, slug);

  for (const field of ["title", "node", "dek", "description", "tags"]) {
    assert(
      entry.includes(`${field}:`),
      `Chinese project entry for ${slug} is missing ${field}.`,
    );
  }

  assert(
    /tags:\s*\[[\s\S]*?"[^"]+"/.test(entry),
    `Chinese project entry for ${slug} has no tag values.`,
  );
  assert(
    entry.includes('translationStatus: "complete"'),
    `Chinese project entry for ${slug} is not marked complete.`,
  );

  const sharedBlock = sharedProjectBlock(projectsText, slug, projectSlugs);
  const sharedLabels = new Set(
    [...sharedBlock.matchAll(/label: "([^"]+)"/g)].map((match) => match[1]),
  );
  const linkLabelsIndex = entry.indexOf("linkLabels:");
  if (linkLabelsIndex >= 0) {
    const labelsObjectStart = entry.indexOf("{", linkLabelsIndex);
    const labelsObject = sliceBraced(entry, labelsObjectStart);
    const localizedKeys = [...labelsObject.matchAll(/"([^"]+)":/g)].map(
      (match) => match[1],
    );
    for (const label of localizedKeys) {
      assert(
        sharedLabels.has(label),
        `Chinese link label for ${slug} does not match a shared link label: ${label}`,
      );
    }
  }
}

for (const required of [
  "methodology:",
  "sourceRecordFields:",
  "evidenceClasses:",
  "confidenceLevels:",
  "claimStatuses:",
]) {
  assert(enContent.includes(required), `English content is missing ${required}`);
  assert(zhContent.includes(required), `Chinese content is missing ${required}`);
}

const placeIds = [...placesText.matchAll(/id: "([^"]+)"/g)].map(
  (match) => match[1],
);
const placeTextIndex = zhContent.indexOf("const placeText = {");
assert(placeTextIndex >= 0, "Chinese place text overlay is missing.");
const placeTextObject = sliceBraced(
  zhContent,
  zhContent.indexOf("{", placeTextIndex),
);
const placeOverlayIds = new Set(
  [...placeTextObject.matchAll(/^\s*(?:"([^"]+)"|([A-Za-z]\w*)):\s*{/gm)].map(
    (match) => match[1] ?? match[2],
  ),
);

for (const id of placeIds) {
  assert(placeOverlayIds.has(id), `Chinese place overlay is missing ${id}.`);
}

const pendingNotice = ["中文介绍", "正在整理中。"].join("");
for (const [path, text] of [
  ["data/i18n/zh-Hans.ts", zhContent],
  ["messages/zh-Hans.json", readText("messages/zh-Hans.json")],
]) {
  assert(!text.includes(pendingNotice), `${path} still contains the pending notice.`);
}

for (const structuralKey of [
  "coordinates",
  "homeNode",
  "preview:",
  "links:",
  "href:",
  "entities:",
  "labelOnly",
  "priority:",
  " x:",
  " y:",
  " r:",
]) {
  assert(
    !zhContent.includes(structuralKey),
    `Chinese overlay appears to duplicate structural data: ${structuralKey}`,
  );
}

console.log("i18n validation passed.");
