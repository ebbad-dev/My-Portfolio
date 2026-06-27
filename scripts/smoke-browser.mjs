import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const baseUrl = process.env.SMOKE_BASE_URL || process.env.BASE_URL || "http://127.0.0.1:3000";
const outputDir = process.env.SMOKE_OUTPUT_DIR || "test-results/portfolio-smoke";
const sections = ["hero", "recruiters", "projects", "skills", "demos", "journey", "testimonials", "resume", "ask-ebbad", "contact"];
const projectSlugs = ["proctorai", "teletrack-enterprise", "mirrormind"];
const demoSlugs = ["proctorai", "teletrack", "mirrormind"];
const viewports = [
  { name: "laptop-1366", width: 1366, height: 768 },
  { name: "laptop-1440", width: 1440, height: 900 },
  { name: "desktop-1920", width: 1920, height: 1080 },
  { name: "mobile-390", width: 390, height: 844 },
];

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    console.warn("[smoke] Playwright is not installed. Skipping browser smoke test.");
    console.warn("[smoke] To enable it locally: npm install -D playwright && npx playwright install chromium");
    return null;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function assertNoHorizontalOverflow(page, label) {
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  assert(metrics.scrollWidth <= metrics.clientWidth + 2, `${label} has horizontal overflow: ${metrics.scrollWidth}px > ${metrics.clientWidth}px`);
}

async function smokeRoute(page, path, label) {
  const response = await page.goto(new URL(path, baseUrl).toString(), { waitUntil: "networkidle" });
  assert(response?.ok(), `${label} failed to load: ${response?.status()}`);
  await assertNoHorizontalOverflow(page, label);
}

async function run() {
  const playwright = await loadPlaywright();
  if (!playwright) return;

  await mkdir(outputDir, { recursive: true });
  const browser = await playwright.chromium.launch();
  const failures = [];

  try {
    for (const viewport of viewports) {
      const page = await browser.newPage({ viewport });
      const consoleErrors = [];
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      page.on("pageerror", (error) => consoleErrors.push(error.message));

      try {
        await smokeRoute(page, "/", `homepage ${viewport.name}`);
        await page.screenshot({ path: join(outputDir, `${viewport.name}-home.png`), fullPage: true });

        const missingSections = await page.evaluate((ids) => ids.filter((id) => !document.getElementById(id)), sections);
        assert(missingSections.length === 0, `Missing sections: ${missingSections.join(", ")}`);

        for (const section of ["hero", "recruiters", "projects", "demos", "skills", "ask-ebbad", "contact"]) {
          await page.evaluate((id) => document.getElementById(id)?.scrollIntoView({ block: "start" }), section);
          await page.waitForTimeout(180);
          await assertNoHorizontalOverflow(page, `${viewport.name} #${section}`);
        }

        if (viewport.name === "laptop-1366") {
          await page.keyboard.press(process.platform === "darwin" ? "Meta+K" : "Control+K");
          await page.waitForSelector("[role='dialog'][aria-label='Command palette']");
          await page.keyboard.press("Escape");

          const resumeHref = await page.locator("a[href='/resume/ebbad-resume.pdf']").first().getAttribute("href");
          assert(resumeHref === "/resume/ebbad-resume.pdf", "Resume link is missing or incorrect");

          const codeLinks = await page.locator("a[href*='github.com/ebbad-dev']").evaluateAll((links) => links.map((link) => link.href));
          assert(codeLinks.length >= 8, `Expected multiple GitHub links, found ${codeLinks.length}`);

          await page.evaluate(() => document.getElementById("ask-ebbad")?.scrollIntoView({ block: "center" }));
          const input = page.locator("#ask-ebbad input[aria-label='Ask Ebbad a question']").first();
          await input.fill("What is TeleTrack?");
          await input.press("Enter");
          await page.waitForFunction(() => document.body.innerText.includes("TeleTrack Enterprise"), null, { timeout: 10_000 });

          const contactValid = await page.locator("#contact form").evaluate((form) => form.checkValidity());
          assert(contactValid === false, "Contact form should fail native validation when empty");
        }

        assert(consoleErrors.length === 0, `${viewport.name} console/page errors:\n${consoleErrors.join("\n")}`);
      } catch (error) {
        failures.push(`${viewport.name}: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        await page.close();
      }
    }

    const routePage = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    const routeErrors = [];
    routePage.on("console", (message) => {
      if (message.type() === "error") routeErrors.push(message.text());
    });
    routePage.on("pageerror", (error) => routeErrors.push(error.message));

    for (const slug of projectSlugs) {
      await smokeRoute(routePage, `/projects/${slug}`, `case study ${slug}`);
    }
    for (const slug of demoSlugs) {
      await smokeRoute(routePage, `/demos/${slug}`, `demo ${slug}`);
    }

    assert(routeErrors.length === 0, `Route console/page errors:\n${routeErrors.join("\n")}`);
    await routePage.close();
  } finally {
    await browser.close();
  }

  if (failures.length) {
    throw new Error(`Browser smoke failures:\n${failures.join("\n")}`);
  }

  console.log(`[smoke] Browser smoke checks passed for ${baseUrl}`);
  console.log(`[smoke] Screenshots written to ${outputDir}`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
