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

const enMessages = readJson("messages/en.json");
const zhMessages = readJson("messages/zh-Hans.json");
const enKeys = flattenKeys(enMessages).sort();
const zhKeys = flattenKeys(zhMessages).sort();

assert(
  JSON.stringify(enKeys) === JSON.stringify(zhKeys),
  "messages/en.json and messages/zh-Hans.json do not have matching keys.",
);

const zhContent = readText("data/i18n/zh-Hans.ts");
const approvedChineseCopy = [
  "叶锦华｜研究与项目",
  "叶锦华的个人网站，记录他围绕人工智能、半导体、关键矿产、国际关系与科技政策所做的研究、工具和写作。",
  "我研究技术如何改变权力。",
  "我是叶锦华（Jinhua Yip），做科技政策研究。",
  "研究、工具与写作",
  "这里放着我做的互动工具、研究框架和文章，主题包括国际关系、人工智能治理、政治经济和战略影响。",
  "全部项目",
  "这里是我正在做和已经完成的项目。",
  "联系我",
  "如果你想聊科技政策、数据可视化，或者有合作想法，欢迎来信。",
  "中文介绍正在整理中。",
];

for (const copy of approvedChineseCopy) {
  assert(
    zhContent.includes(copy),
    `Missing approved Chinese copy in data/i18n/zh-Hans.ts: ${copy}`,
  );
}

const zhMessagesText = readText("messages/zh-Hans.json");
for (const copy of ["叶锦华", "我的一些项目。", "下潜", "跳过开场"]) {
  assert(
    zhMessagesText.includes(copy),
    `Missing approved Chinese UI copy in messages/zh-Hans.json: ${copy}`,
  );
}

const projectsText = readText("data/projects.ts");
const projectSlugs = [...projectsText.matchAll(/slug: "([^"]+)"/g)].map(
  (match) => match[1],
);

for (const slug of projectSlugs) {
  const slugIndex = zhContent.indexOf(`"${slug}"`);
  assert(slugIndex >= 0, `Missing explicit Chinese project entry for ${slug}.`);
  const nextSlugIndex = projectSlugs
    .map((nextSlug) => zhContent.indexOf(`"${nextSlug}"`, slugIndex + 1))
    .filter((index) => index > slugIndex)
    .sort((a, b) => a - b)[0];
  const entry = zhContent.slice(
    slugIndex,
    nextSlugIndex > 0 ? nextSlugIndex : zhContent.length,
  );
  assert(
    entry.includes("pendingProject(") || entry.includes("translationStatus: \"pending\""),
    `Chinese project entry for ${slug} is not explicitly marked pending.`,
  );
}

for (const structuralKey of [
  "coordinates",
  "homeNode",
  "preview:",
  "links:",
  "entities:",
  " x:",
  " y:",
  " r:",
]) {
  assert(
    !zhContent.includes(structuralKey),
    `Chinese overlay appears to duplicate structural project data: ${structuralKey}`,
  );
}

console.log("i18n validation passed.");
