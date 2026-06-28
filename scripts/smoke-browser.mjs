import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const baseUrl = process.env.SMOKE_BASE_URL || process.env.BASE_URL || "http://127.0.0.1:3000";
const outputDir = process.env.SMOKE_OUTPUT_DIR || "test-results/portfolio-smoke";
const sections = ["hero", "recruiters", "projects", "skills", "demos", "journey", "testimonials", "resume", "ask-ebbad", "contact"];
const projectSlugs = ["proctorai", "teletrack-enterprise", "mirrormind"];
const demoSlugs = ["proctorai", "teletrack", "mirrormind"];
const staticRoutes = [
  { path: "/sitemap.xml", label: "sitemap" },
  { path: "/robots.txt", label: "robots" },
  { path: "/opengraph-image", label: "Open Graph image" },
];
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

async function scrollToSection(page, id, label = id) {
  await page.evaluate((sectionId) => {
    const element = document.getElementById(sectionId);
    if (!element) return;
    const top = Math.max(0, window.scrollY + element.getBoundingClientRect().top - 82);
    window.scrollTo({ top, left: 0, behavior: "auto" });
  }, id);
  await page.waitForFunction((sectionId) => {
    const element = document.getElementById(sectionId);
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    const activationLine = window.innerHeight * 0.42;
    return rect.top <= activationLine && rect.bottom >= activationLine;
  }, id, { timeout: 5_000 }).catch(() => {});
  await page.waitForTimeout(550);
  await assertNoHorizontalOverflow(page, label);
}

async function assertHealthyConsole(consoleErrors, label) {
  const actionable = consoleErrors.filter((entry) => {
    const text = entry.toLowerCase();
    return !text.includes("favicon") && !text.includes("webgl warning");
  });
  assert(actionable.length === 0, `${label} console/page errors:\n${actionable.join("\n")}`);
}

async function preparePage(page) {
  await page.addInitScript(() => {
    window.localStorage.setItem("ebbad-theme", "dark");
    window.sessionStorage.setItem("ebbad-intro-seen", "true");
  });
  await page.route("**/_vercel/insights/script.js", (route) => route.fulfill({
    status: 200,
    contentType: "application/javascript",
    body: "",
  }));
  await page.route("**/_vercel/speed-insights/script.js", (route) => route.fulfill({
    status: 200,
    contentType: "application/javascript",
    body: "",
  }));
}

async function ensurePortfolioEntered(page) {
  const introButton = page.getByRole("button", { name: /enter portfolio/i });
  if (await introButton.waitFor({ state: "detached", timeout: 1_200 }).then(() => true).catch(() => false)) {
    return;
  }
  if (await introButton.isVisible().catch(() => false)) {
    await introButton.click({ force: true, timeout: 2_000 }).catch(() => page.keyboard.press("Escape"));
  }
  await introButton.waitFor({ state: "detached", timeout: 3_000 }).catch(() => {});
}

async function verifyCommandPalette(page) {
  const opener = page.locator("button[aria-label='Open command palette']").first();
  await opener.focus();
  await page.keyboard.press(process.platform === "darwin" ? "Meta+K" : "Control+K");
  await page.waitForSelector("[role='dialog'][aria-label='Command palette']");
  await page.keyboard.press("Escape");
  await page.waitForSelector("[role='dialog'][aria-label='Command palette']", { state: "detached" });
  await page.waitForFunction(() => document.activeElement?.getAttribute("aria-label") === "Open command palette", null, { timeout: 1_000 }).catch(() => {});
  const focusReturned = await opener.evaluate((button) => document.activeElement === button);
  assert(focusReturned, "Command palette did not return focus to the opener");
}

async function verifyThemeToggle(page) {
  const toggle = page.locator(".theme-toggle").first();
  const before = await page.evaluate(() => document.documentElement.dataset.theme);
  await toggle.click();
  await page.waitForFunction((oldTheme) => document.documentElement.dataset.theme !== oldTheme, before);
  const after = await page.evaluate(() => document.documentElement.dataset.theme);
  assert(after === "light" || after === "dark", "Theme toggle did not set a valid theme");
  await toggle.click();
}

async function verifyFloatingChatbot(page) {
  const trigger = page.locator("button[aria-label='Open Ask Ebbad chatbot']").first();
  if (!(await trigger.isVisible().catch(() => false))) return;

  await trigger.click();
  await page.waitForSelector("button[aria-label='Close Ask Ebbad chat']");
  const triggerHidden = await trigger.isHidden().catch(() => true);
  assert(triggerHidden, "Floating Ask Ebbad trigger remains visible while panel is open");

  const input = page.locator("input[aria-label='Ask Ebbad a question']").last();
  await input.fill("What is TeleTrack?");
  await input.press("Enter");
  await page.waitForFunction(() => document.body.innerText.includes("TeleTrack Enterprise"), null, { timeout: 10_000 });

  const inputBox = await input.boundingBox();
  const closeButton = page.locator("button[aria-label='Close Ask Ebbad chat']").first();
  const closeBox = await closeButton.boundingBox();
  assert(inputBox && inputBox.y >= 0, "Floating chat input is not reachable");
  assert(closeBox && closeBox.y >= 0, "Floating chat close button is not reachable");
  await page.keyboard.press("Escape");
  await page.waitForSelector("button[aria-label='Close Ask Ebbad chat']", { state: "detached" });
}

async function verifyContactValidation(page) {
  await scrollToSection(page, "contact", "contact validation");
  const contactValid = await page.locator("#contact form").evaluate((form) => form.checkValidity());
  assert(contactValid === false, "Contact form should fail native validation when empty");
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
      await preparePage(page);
      const consoleErrors = [];
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      page.on("pageerror", (error) => consoleErrors.push(error.message));

      try {
        await smokeRoute(page, "/", `homepage ${viewport.name}`);
        await ensurePortfolioEntered(page);
        await page.screenshot({ path: join(outputDir, `${viewport.name}-home.png`), fullPage: true });

        const missingSections = await page.evaluate((ids) => ids.filter((id) => !document.getElementById(id)), sections);
        assert(missingSections.length === 0, `Missing sections: ${missingSections.join(", ")}`);

        for (const section of ["hero", "recruiters", "projects", "demos", "skills", "ask-ebbad", "contact"]) {
          await scrollToSection(page, section, `${viewport.name} #${section}`);
        }

        if (["laptop-1366", "laptop-1440", "mobile-390"].includes(viewport.name)) {
          await scrollToSection(page, "ask-ebbad", `${viewport.name} ask screenshot`);
          await page.screenshot({ path: join(outputDir, `${viewport.name}-ask-ebbad.png`), fullPage: false });
        }

        if (viewport.name === "laptop-1366") {
          await verifyCommandPalette(page);
          await verifyThemeToggle(page);

          const resume = page.locator("a[href='/resume/ebbad-resume.pdf']").first();
          const resumeHref = await resume.getAttribute("href");
          assert(resumeHref === "/resume/ebbad-resume.pdf", "Resume link is missing or incorrect");
          const resumeResponse = await page.request.get(new URL(resumeHref, baseUrl).toString());
          assert(resumeResponse.ok(), `Resume PDF failed to load: ${resumeResponse.status()}`);

          const codeLinks = await page.locator("a[href*='github.com/ebbad-dev']").evaluateAll((links) => links.map((link) => link.href));
          assert(codeLinks.length >= 8, `Expected multiple GitHub links, found ${codeLinks.length}`);

          for (const [label, href] of await page.locator("a[target='_blank']").evaluateAll((links) => links.map((link) => [link.textContent?.trim() || link.getAttribute("aria-label") || link.href, link.getAttribute("rel") || ""]))) {
            assert(href.includes("noopener") && href.includes("noreferrer"), `New-tab link is missing safe rel: ${label}`);
          }

          await scrollToSection(page, "ask-ebbad", "laptop-1366 Ask Ebbad prompt");
          const input = page.locator("#ask-ebbad input[aria-label='Ask Ebbad a question']").first();
          await input.fill("What is TeleTrack?");
          await input.press("Enter");
          await page.waitForFunction(() => document.body.innerText.includes("TeleTrack Enterprise"), null, { timeout: 10_000 });

          await verifyContactValidation(page);
          await verifyFloatingChatbot(page);

          await scrollToSection(page, "projects", "laptop-1366 projects screenshot");
          await page.screenshot({ path: join(outputDir, "laptop-1366-projects.png"), fullPage: false });

          await scrollToSection(page, "contact", "laptop-1366 contact screenshot");
          await page.screenshot({ path: join(outputDir, "laptop-1366-contact.png"), fullPage: false });
        }

        await assertHealthyConsole(consoleErrors, viewport.name);
      } catch (error) {
        failures.push(`${viewport.name}: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        await page.close();
      }
    }

    const routePage = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    await preparePage(routePage);
    const routeErrors = [];
    routePage.on("console", (message) => {
      if (message.type() === "error") routeErrors.push(message.text());
    });
    routePage.on("pageerror", (error) => routeErrors.push(error.message));

    for (const route of staticRoutes) {
      const response = await routePage.request.get(new URL(route.path, baseUrl).toString());
      assert(response.ok(), `${route.label} failed to load: ${response.status()}`);
    }

    const chatGet = await routePage.request.get(new URL("/api/chat", baseUrl).toString());
    assert(chatGet.status() === 405, `Chat GET should return 405, got ${chatGet.status()}`);

    for (const slug of projectSlugs) {
      await smokeRoute(routePage, `/projects/${slug}`, `case study ${slug}`);
    }
    for (const slug of demoSlugs) {
      await smokeRoute(routePage, `/demos/${slug}`, `demo ${slug}`);
    }

    await assertHealthyConsole(routeErrors, "routes");
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
