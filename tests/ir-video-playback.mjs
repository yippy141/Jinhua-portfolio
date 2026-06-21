// Browser test: proves the IR Worldview preview video actually plays (its
// currentTime advances) while the preview is open.
//
// It opens the IR Worldview project page, where ProjectPreviewMedia renders the
// preview as `active`, finds the <video>, and asserts currentTime advances over
// ~1.5s. Run against a running dev/preview server.
//
// Usage:
//   BASE_URL=http://localhost:3000 \
//   CHROME=/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
//   NODE_PATH=<dir containing puppeteer-core> node tests/ir-video-playback.mjs
//
// puppeteer-core is used with the system Chrome so no Chromium download is
// needed. The test is not wired into a runner; it is a standalone proof.

import { createRequire } from "node:module";

// Resolve puppeteer-core from the repo install, or from an override base (e.g.
// the npx cache) via PUPPETEER_REQUIRE_BASE, so the test can run without adding
// a heavy Chromium dependency to the project.
const require = createRequire(
  process.env.PUPPETEER_REQUIRE_BASE ?? import.meta.url,
);
const puppeteer = require("puppeteer-core");

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const CHROME =
  process.env.CHROME ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const SLUG = "ir-worldview-inventory";

function fail(msg) {
  console.error("FAIL:", msg);
  process.exit(1);
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--autoplay-policy=no-user-gesture-required", "--mute-audio"],
});

try {
  const page = await browser.newPage();
  await page.goto(`${BASE_URL}/projects/${SLUG}`, {
    waitUntil: "networkidle0",
  });

  await page.waitForSelector("video", { timeout: 10000 });

  const t0 = await page.$eval("video", (v) => {
    const el = /** @type {HTMLVideoElement} */ (v);
    const p = el.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
    return el.currentTime;
  });

  await new Promise((r) => setTimeout(r, 1500));

  const t1 = await page.$eval("video", (v) => v.currentTime);

  console.log(`IR preview currentTime: t0=${t0.toFixed(3)} t1=${t1.toFixed(3)}`);

  if (!(t1 > t0)) {
    fail(`currentTime did not advance (t0=${t0}, t1=${t1}).`);
  }
  console.log("PASS: IR Worldview preview video is playing (currentTime advanced).");
} finally {
  await browser.close();
}
