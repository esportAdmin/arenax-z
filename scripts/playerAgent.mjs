import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import puppeteer from "puppeteer";
import { createClient } from "@supabase/supabase-js";

function loadLocalEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separator = line.indexOf("=");
    if (separator === -1) {
      continue;
    }

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadLocalEnvFile(path.join(process.cwd(), ".env.local"));
loadLocalEnvFile(path.join(process.cwd(), ".env"));

const BASE_URL = (process.env.QA_BASE_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "http://localhost:3000").replace(/\/$/, "");
const HEADLESS = process.env.QA_HEADLESS !== "false";
const TIMEOUT_MS = Number(process.env.QA_TIMEOUT_MS ?? 45000);
const OUTPUT_DIR = process.env.QA_OUTPUT_DIR
  ? path.resolve(process.env.QA_OUTPUT_DIR)
  : path.join(process.cwd(), "artifacts", "player-agent");
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SERVICE_ROLE_KEY =
  process.env.QA_BOOTSTRAP_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const CAN_BOOTSTRAP_ACCOUNT =
  SUPABASE_URL.length > 0 && SERVICE_ROLE_KEY.length > 0 && SERVICE_ROLE_KEY !== "REPLACE_ME";
const AUTH_MODE = process.env.QA_AUTH_MODE ?? "local-qa";
const OAUTH_PROVIDER = (process.env.QA_OAUTH_PROVIDER ?? "discord").toLowerCase();
const OAUTH_WAIT_MS = Number(process.env.QA_OAUTH_WAIT_MS ?? 180000);
const VERCEL_PROTECTION_BYPASS = process.env.QA_VERCEL_PROTECTION_BYPASS ?? "";
const BYPASS_PLACEHOLDERS = new Set([
  "TON_SECRET_VERCEL",
  "YOUR_VERCEL_SECRET",
  "REPLACE_ME",
  "<secret>",
]);
const LOCAL_QA_URL = `${BASE_URL}/api/auth/local-qa?redirect=${encodeURIComponent("/dashboard")}`;
const DEV_BYPASS_URL = `${BASE_URL}/api/auth/dev-bypass?redirect=${encodeURIComponent("/dashboard")}`;
const USER_DATA_DIR = process.env.QA_USER_DATA_DIR
  ? path.resolve(process.env.QA_USER_DATA_DIR)
  : path.join(OUTPUT_DIR, "browser-profile");

const credentials = {
  email:
    process.env.QA_E2E_EMAIL ??
    `qa-agent+${Date.now()}-${randomUUID().slice(0, 8)}@example.com`,
  password:
    process.env.QA_E2E_PASSWORD ?? `ArenaX!${randomUUID().replace(/-/g, "").slice(0, 12)}`,
  username: process.env.QA_E2E_USERNAME ?? `agent_${randomUUID().slice(0, 8)}`,
};

const APP_ROUTES = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Play", path: "/play" },
  { name: "Clubs", path: "/clubs" },
  { name: "War Map", path: "/war-map" },
  { name: "War Room", path: "/wars" },
  { name: "Leaderboard", path: "/leaderboard" },
  { name: "Live Calls", path: "/live-calls" },
  { name: "Profile", path: "/profile" },
  { name: "Rewards", path: "/rewards" },
];

const BANNED_ACTION_PATTERNS = [
  "ax",
  "arenax",
  "home",
  "dashboard",
  "games",
  "clubs",
  "wars",
  "leaderboard",
  "store",
  "rewards",
  "subscription",
  "enter platform",
  "live calls",
  "about",
  "careers",
  "press kit",
  "contact",
  "documentation",
  "faq",
  "legal notice",
  "return to profile",
  "accept all",
  "essential only",
  "dismiss",
  "sign in",
  "launch app",
  "upgrade",
  "share",
  "continue with twitch",
  "admin email fallback",
  "logout",
  "sign out",
  "delete",
  "remove",
  "ban",
  "discord",
  "google",
  "privacy",
  "terms",
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function slugify(value) {
  return (value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function ensureOutputDir() {
  await fsp.mkdir(OUTPUT_DIR, { recursive: true });
}

async function writeJsonReport(payload) {
  const filePath = path.join(OUTPUT_DIR, "player-agent-report.json");
  await fsp.writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");
  return filePath;
}

async function writeMarkdownReport(report) {
  const lines = [
    "# ArenaX Player Agent Report",
    "",
    `- Base URL: ${report.baseUrl}`,
    `- Generated at: ${report.generatedAt}`,
    `- Headless: ${report.headless}`,
    `- Auth status: ${report.authentication.status}`,
    `- Auth method: ${report.authentication.method}`,
    `- Account email: ${report.authentication.email}`,
    `- Runtime issues: ${report.summary.runtimeIssues}`,
    `- Interactions tested: ${report.summary.interactionsTested}`,
    "",
    "## Authentication",
    "",
    `- Final URL: ${report.authentication.finalUrl ?? "N/A"}`,
    `- Note: ${report.authentication.note ?? "N/A"}`,
    `- Screenshot: ${report.authentication.screenshot ?? "N/A"}`,
    "",
    "## Route Coverage",
    "",
  ];

  for (const route of report.routes) {
    lines.push(`### ${route.name} \`${route.path}\``);
    lines.push("");
    lines.push(`- Final URL: ${route.finalUrl}`);
    lines.push(`- Title: ${route.title || "N/A"}`);
    lines.push(`- H1: ${route.heading || "N/A"}`);
    lines.push(`- Console/runtime issues: ${route.consoleIssues.length}`);
    lines.push(`- Actionables discovered: ${route.actionablesCount}`);
    lines.push(`- Interactions exercised: ${route.interactions.length}`);
    lines.push(`- Screenshot: ${route.screenshot ?? "N/A"}`);

    if (route.consoleIssues.length > 0) {
      lines.push("- Console issues:");
      for (const issue of route.consoleIssues) {
        lines.push(`  - [${issue.type}] ${issue.text}`);
      }
    }

    if (route.interactions.length > 0) {
      lines.push("- Interactions:");
      for (const interaction of route.interactions) {
        lines.push(
          `  - ${interaction.label}: ${interaction.status} -> ${interaction.afterPath} (${interaction.afterTitle})`,
        );
      }
    }

    lines.push("");
  }

  const filePath = path.join(OUTPUT_DIR, "player-agent-report.md");
  await fsp.writeFile(filePath, lines.join("\n"), "utf8");
  return filePath;
}

async function takeScreenshot(page, fileName) {
  const filePath = path.join(OUTPUT_DIR, fileName);

  try {
    await page.evaluate(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollLeft = 0;
      document.body.scrollLeft = 0;
    });
    await sleep(120);
    await page.screenshot({ path: filePath, fullPage: true });
    return filePath;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (!message.includes("0 width")) {
      return null;
    }

    try {
      await page.setViewport({
        width: 1440,
        height: 1080,
        deviceScaleFactor: 1,
      });
      await page.evaluate(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        document.documentElement.scrollLeft = 0;
        document.body.scrollLeft = 0;
      });
      await sleep(250);
      await page.screenshot({ path: filePath, fullPage: true });
      return filePath;
    } catch {
      return null;
    }
  }
}

async function createInstrumentedPage(browser) {
  const page = await browser.newPage();
  const consoleIssues = [];
  const ignoredIssuePatterns = [
    /\/_next\/static\/chunks\//i,
    /\?_rsc=/i,
  ];

  function shouldIgnoreIssueText(text) {
    const normalized = text ?? "";

    if (normalized.includes("data-player-agent-id")) {
      return true;
    }

    return ignoredIssuePatterns.some((pattern) => pattern.test(normalized));
  }

  await page.setViewport({
    width: 1440,
    height: 1080,
    deviceScaleFactor: 1,
  });
  await page.setCacheEnabled(false);
  if (typeof page.setBypassServiceWorker === "function") {
    await page.setBypassServiceWorker(true);
  }

  page.on("console", (message) => {
    const type = message.type();
    if (!["error", "warning"].includes(type)) {
      return;
    }

    if (
      type === "error" &&
      message.text() === "Failed to load resource: the server responded with a status of 400 ()"
    ) {
      return;
    }

    if (shouldIgnoreIssueText(message.text())) {
      return;
    }

    consoleIssues.push({
      type,
      text: message.text(),
    });
  });

  page.on("pageerror", (error) => {
    if (shouldIgnoreIssueText(error.message)) {
      return;
    }

    consoleIssues.push({
      type: "pageerror",
      text: error.message,
    });
  });

  page.on("response", (response) => {
    const status = response.status();
    if (status < 400) {
      return;
    }

    const url = response.url();
    if (shouldIgnoreIssueText(url)) {
      return;
    }

    consoleIssues.push({
      type: "response",
      text: `${response.request().method()} ${url} -> ${status}`,
    });
  });

  page.on("requestfailed", (request) => {
    const text = `${request.method()} ${request.url()} -> ${request.failure()?.errorText ?? "failed"}`;
    if (shouldIgnoreIssueText(text)) {
      return;
    }

    consoleIssues.push({
      type: "requestfailed",
      text,
    });
  });

  return { page, consoleIssues };
}

async function gotoStable(page, routePath) {
  return page.goto(`${BASE_URL}${routePath}`, {
    waitUntil: "networkidle2",
    timeout: TIMEOUT_MS,
  });
}

async function setVercelBypassCookie(page) {
  if (!VERCEL_PROTECTION_BYPASS) {
    return;
  }

  if (BYPASS_PLACEHOLDERS.has(VERCEL_PROTECTION_BYPASS)) {
    throw new Error(
      "QA_VERCEL_PROTECTION_BYPASS still contains a placeholder. Paste the real Vercel Protection Bypass secret before running the player agent.",
    );
  }

  const bypassUrl = new URL(BASE_URL);
  bypassUrl.searchParams.set("x-vercel-set-bypass-cookie", "true");
  bypassUrl.searchParams.set(
    "x-vercel-protection-bypass",
    VERCEL_PROTECTION_BYPASS,
  );

  await page.goto(bypassUrl.toString(), {
    waitUntil: "networkidle2",
    timeout: TIMEOUT_MS,
  });
}

async function getSnapshot(page) {
  return page.evaluate(() => {
    const heading = document.querySelector("h1")?.textContent?.trim() ?? "";
    const actionables = Array.from(
      document.querySelectorAll("a, button, [role='button']"),
    )
      .map((element) => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        const text = (element.textContent ?? "").replace(/\s+/g, " ").trim();
        const href =
          element instanceof HTMLAnchorElement ? element.getAttribute("href") : null;
        const disabled =
          element instanceof HTMLButtonElement
            ? element.disabled
            : element.getAttribute("aria-disabled") === "true";
        const visible =
          rect.width > 0 &&
          rect.height > 0 &&
          style.visibility !== "hidden" &&
          style.display !== "none";

        return {
          text,
          href,
          disabled,
          visible,
          tagName: element.tagName.toLowerCase(),
        };
      })
      .filter((entry) => entry.visible);

    return {
      title: document.title,
      heading,
      actionables,
    };
  });
}

async function fillInputByPlaceholder(page, placeholder, value) {
  const selector = `input[placeholder="${placeholder}"]`;
  await page.waitForSelector(selector, { timeout: 8000 });
  await page.click(selector, { clickCount: 3 });
  await page.keyboard.press("Backspace");
  await page.type(selector, value);
}

async function hasPlaceholder(page, placeholder) {
  const selector = `input[placeholder="${placeholder}"]`;
  return page.$(selector).then((handle) => Boolean(handle));
}

async function clickText(page, labels) {
  return page.evaluate((candidates) => {
    const normalize = (value) => (value ?? "").replace(/\s+/g, " ").trim().toLowerCase();
    const wanted = candidates.map(normalize);
    const elements = Array.from(document.querySelectorAll("a, button, [role='button']"));
    const match = elements.find((element) => {
      const text = normalize(element.textContent ?? "");
      return wanted.some((label) => text.includes(label));
    });

    if (!(match instanceof HTMLElement)) {
      return null;
    }

    match.scrollIntoView({ block: "center", inline: "center" });
    match.click();
    return (match.textContent ?? "").replace(/\s+/g, " ").trim();
  }, labels);
}

async function waitForPathChange(page, previousPath, timeoutMs = 6000) {
  try {
    await page.waitForFunction(
      (pathValue) => window.location.pathname !== pathValue,
      { timeout: timeoutMs },
      previousPath,
    );
  } catch {
    await sleep(900);
  }
}

async function waitForDashboard(page) {
  try {
    await page.waitForFunction(
      () => window.location.pathname.startsWith("/dashboard"),
      { timeout: 8000 },
    );
  } catch {
    await sleep(1200);
  }
}

async function waitForDashboardWithTimeout(page, timeoutMs) {
  try {
    await page.waitForFunction(
      () => window.location.pathname.startsWith("/dashboard"),
      { timeout: timeoutMs },
    );
    return true;
  } catch {
    return false;
  }
}

async function ensureSignupMode(page) {
  if (await hasPlaceholder(page, "Username")) {
    return true;
  }

  await clickText(page, ["Create your account", "Create account"]);

  try {
    await page.waitForSelector('input[placeholder="Username"]', {
      timeout: 4000,
    });
    return true;
  } catch {
    return false;
  }
}

async function bootstrapAccountIfPossible() {
  if (!CAN_BOOTSTRAP_ACCOUNT) {
    return {
      attempted: false,
      created: false,
      note: "Service role bootstrap unavailable.",
    };
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const { error } = await supabase.auth.admin.createUser({
    email: credentials.email,
    password: credentials.password,
    email_confirm: true,
    user_metadata: {
      username: credentials.username,
    },
  });

  if (error && !error.message.toLowerCase().includes("already")) {
    return {
      attempted: true,
      created: false,
      note: error.message,
    };
  }

  return {
    attempted: true,
    created: true,
    note: error ? "Account already existed, reusing it." : "Account created with admin bootstrap.",
  };
}

async function authenticateWithOAuthAssisted(page) {
  const authResult = {
    status: "failed",
    method: `oauth-manual-${OAUTH_PROVIDER}`,
    email: credentials.email,
    finalUrl: "",
    note: "",
    screenshot: null,
  };

  await gotoStable(page, "/login");
  await sleep(1200);

  if (new URL(page.url()).pathname.startsWith("/dashboard")) {
    authResult.status = "authenticated";
    authResult.method = `oauth-session-reused-${OAUTH_PROVIDER}`;
    authResult.finalUrl = page.url();
    authResult.note = "A persisted OAuth session was already available in the browser profile.";
    authResult.screenshot = await takeScreenshot(page, "auth-oauth-session-reused.png");
    return authResult;
  }

  const loginIsRedirectingWithActiveSession = await page.evaluate(() => {
    const text = document.body?.textContent?.replace(/\s+/g, " ").trim() ?? "";
    return text.includes("Opening your command center");
  });

  if (loginIsRedirectingWithActiveSession) {
    const authenticated = await waitForDashboardWithTimeout(page, 15000);
    authResult.finalUrl = page.url();

    if (authenticated) {
      authResult.status = "authenticated";
      authResult.method = `oauth-session-reused-${OAUTH_PROVIDER}`;
      authResult.note =
        "The login screen detected an active session and forwarded the agent into the dashboard.";
      authResult.screenshot = await takeScreenshot(
        page,
        "auth-oauth-session-reused.png",
      );
      return authResult;
    }
  }

  const providerLabels =
    OAUTH_PROVIDER === "twitch"
      ? ["Continue with Twitch", "Enter with Twitch"]
      : ["Continue with Discord", "Enter with Discord"];

  let clicked = null;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    if (new URL(page.url()).pathname.startsWith("/dashboard")) {
      authResult.status = "authenticated";
      authResult.method = `oauth-session-reused-${OAUTH_PROVIDER}`;
      authResult.finalUrl = page.url();
      authResult.note =
        "A persisted OAuth session was detected after the login screen finished settling.";
      authResult.screenshot = await takeScreenshot(
        page,
        "auth-oauth-session-reused.png",
      );
      return authResult;
    }

    clicked = await clickText(page, providerLabels);
    if (clicked) {
      break;
    }

    await sleep(750);
  }

  if (!clicked) {
    authResult.status = "blocked";
    authResult.note = `None of these provider buttons were found on /login: ${providerLabels.join(", ")}.`;
    authResult.finalUrl = page.url();
    authResult.screenshot = await takeScreenshot(page, "auth-oauth-provider-missing.png");
    return authResult;
  }

  const authenticated = await waitForDashboardWithTimeout(page, OAUTH_WAIT_MS);
  authResult.finalUrl = page.url();

  if (authenticated) {
    authResult.status = "authenticated";
    authResult.note =
      "OAuth sign-in completed and the agent reached the dashboard using the persisted browser profile.";
    authResult.screenshot = await takeScreenshot(page, "auth-oauth-dashboard.png");
    return authResult;
  }

  authResult.status = "blocked";
  authResult.note =
    "OAuth flow did not return to /dashboard in time. Complete the provider login manually in the opened browser window, then rerun the agent with the same browser profile.";
  authResult.screenshot = await takeScreenshot(page, "auth-oauth-blocked.png");
  return authResult;
}

async function authenticate(page) {
  if (AUTH_MODE === "local-qa") {
    const authResult = {
      status: "failed",
      method: "local-qa",
      email: credentials.email,
      finalUrl: "",
      note: "",
      screenshot: null,
    };

    await page.goto(LOCAL_QA_URL, {
      waitUntil: "networkidle2",
      timeout: TIMEOUT_MS,
    });

    const authenticated = await waitForDashboardWithTimeout(page, 15000);
    authResult.finalUrl = page.url();

    if (authenticated || new URL(page.url()).pathname.startsWith("/dashboard")) {
      authResult.status = "authenticated";
      authResult.note =
        "Local QA session used a real Supabase auth cookie without external OAuth.";
      authResult.screenshot = await takeScreenshot(page, "auth-local-qa-dashboard.png");
      return authResult;
    }

    authResult.status = "blocked";
    authResult.note =
      "Local QA sign-in did not land on the dashboard. Check /api/auth/local-qa and the service-role configuration.";
    authResult.screenshot = await takeScreenshot(page, "auth-local-qa-blocked.png");
    return authResult;
  }

  if (AUTH_MODE === "dev-bypass") {
    const authResult = {
      status: "failed",
      method: "dev-bypass",
      email: credentials.email,
      finalUrl: "",
      note: "",
      screenshot: null,
    };

    await page.goto(DEV_BYPASS_URL, {
      waitUntil: "networkidle2",
      timeout: TIMEOUT_MS,
    });

    const authenticated = await waitForDashboardWithTimeout(page, 15000);
    authResult.finalUrl = page.url();

    if (authenticated || new URL(page.url()).pathname.startsWith("/dashboard")) {
      authResult.status = "authenticated";
      authResult.note = "Local QA bypass cookie granted access without external OAuth.";
      authResult.screenshot = await takeScreenshot(page, "auth-dev-bypass-dashboard.png");
      return authResult;
    }

    authResult.status = "blocked";
    authResult.note =
      "Local QA bypass did not land on the dashboard. Check the dev auth cookie and middleware.";
    authResult.screenshot = await takeScreenshot(page, "auth-dev-bypass-blocked.png");
    return authResult;
  }

  if (AUTH_MODE === "oauth-manual") {
    return authenticateWithOAuthAssisted(page);
  }

  const authResult = {
    status: "failed",
    method: "unknown",
    email: credentials.email,
    finalUrl: "",
    note: "",
    screenshot: null,
  };

  const bootstrap = await bootstrapAccountIfPossible();
  authResult.note = bootstrap.note;

  await gotoStable(page, "/auth");

  if (new URL(page.url()).pathname.startsWith("/dashboard")) {
    authResult.status = "authenticated";
    authResult.method = "existing-session";
    authResult.finalUrl = page.url();
    authResult.screenshot = await takeScreenshot(page, "auth-existing-session.png");
    return authResult;
  }

  if (!bootstrap.created) {
    const signupModeReady = await ensureSignupMode(page);
    await sleep(350);

    if (signupModeReady) {
      await fillInputByPlaceholder(page, "Username", credentials.username);
    }

    await fillInputByPlaceholder(page, "Email", credentials.email);
    await fillInputByPlaceholder(page, "Password", credentials.password);
    await takeScreenshot(page, "auth-signup-form.png");

    await clickText(page, ["Create Account with Email", "Continue with Email"]);
    await waitForDashboard(page);
  }

  if (!new URL(page.url()).pathname.startsWith("/dashboard")) {
    if (new URL(page.url()).pathname.startsWith("/auth")) {
      await clickText(page, ["Sign in instead"]);
      await sleep(350);
    } else {
      await gotoStable(page, "/auth");
    }

    await fillInputByPlaceholder(page, "Email", credentials.email);
    await fillInputByPlaceholder(page, "Password", credentials.password);
    await takeScreenshot(page, "auth-signin-form.png");
    await clickText(page, ["Continue with Email"]);
    await waitForDashboard(page);
  }

  const currentPath = new URL(page.url()).pathname;
  authResult.finalUrl = page.url();

  if (currentPath.startsWith("/dashboard")) {
    authResult.status = "authenticated";
    authResult.method = bootstrap.created ? "bootstrap-and-signin" : "ui-signup-and-signin";
    authResult.screenshot = await takeScreenshot(page, "auth-dashboard.png");
    authResult.note = bootstrap.created
      ? bootstrap.note
      : "Account created through the UI and immediately reused for sign-in.";
    return authResult;
  }

  authResult.status = "blocked";
  authResult.method = bootstrap.attempted ? "bootstrap-failed" : "ui-signup-blocked";
  authResult.note =
    "Account flow did not reach the dashboard. This usually means email confirmation or a runtime auth issue blocked the session.";
  authResult.screenshot = await takeScreenshot(page, "auth-blocked.png");
  return authResult;
}

async function discoverActionables(page) {
  return page.evaluate((bannedPatterns) => {
    const banned = bannedPatterns.map((pattern) => pattern.toLowerCase());
    const elements = Array.from(document.querySelectorAll("a, button, [role='button']"));

    return elements
      .map((element, index) => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        const text = (element.textContent ?? "").replace(/\s+/g, " ").trim();
        const href =
          element instanceof HTMLAnchorElement ? element.getAttribute("href") ?? "" : "";
        const disabled =
          element instanceof HTMLButtonElement
            ? element.disabled
            : element.getAttribute("aria-disabled") === "true";
        const visible =
          rect.width > 0 &&
          rect.height > 0 &&
          style.visibility !== "hidden" &&
          style.display !== "none";

        if (!(element instanceof HTMLElement)) {
          return null;
        }

        element.setAttribute("data-player-agent-id", `player-agent-${index}`);

        return {
          id: `player-agent-${index}`,
          text,
          href,
          disabled,
          visible,
          banned: banned.some((pattern) => text.toLowerCase().includes(pattern)),
        };
      })
      .filter(
        (entry) =>
          entry &&
          entry.visible &&
          !entry.disabled &&
          entry.text.length >= 3 &&
          !entry.banned &&
          !entry.href.startsWith("http"),
      )
      .slice(0, 12);
  }, BANNED_ACTION_PATTERNS);
}

async function clickByAgentId(page, id) {
  return page.evaluate((actionId) => {
    const element = document.querySelector(`[data-player-agent-id="${actionId}"]`);
    if (!(element instanceof HTMLElement)) {
      return false;
    }

    element.scrollIntoView({ block: "center", inline: "center" });
    element.click();
    return true;
  }, id);
}

async function exercisePageInteractions(page, routePath) {
  const initialCandidates = await discoverActionables(page);
  const interactions = [];
  const exercisedLabels = new Set();

  for (let index = 0; index < 4; index += 1) {
    const candidates = await discoverActionables(page);
    const candidate = candidates.find((entry) => !exercisedLabels.has(entry.text));

    if (!candidate) {
      break;
    }

    exercisedLabels.add(candidate.text);

    const beforePath = new URL(page.url()).pathname;
    const beforeTitle = await page.title();
    const clicked = await clickByAgentId(page, candidate.id);

    if (!clicked) {
      interactions.push({
        label: candidate.text,
        status: "missing",
        afterPath: beforePath,
        afterTitle: beforeTitle,
      });
      continue;
    }

    await waitForPathChange(page, beforePath, 2500);

    const afterPath = new URL(page.url()).pathname;
    const afterTitle = await page.title();
    const status = afterPath === beforePath ? "acted" : "navigated";

    interactions.push({
      label: candidate.text,
      status,
      afterPath,
      afterTitle,
    });

    if (afterPath !== routePath) {
      await gotoStable(page, routePath);
    } else {
      await sleep(500);
    }
  }

  return {
    interactions,
    actionablesCount: initialCandidates.length,
  };
}

async function inspectRoute(browser, route) {
  const { page, consoleIssues } = await createInstrumentedPage(browser);

  try {
    await gotoStable(page, route.path);
    await sleep(700);

    const snapshot = await getSnapshot(page);
    const interactionReport = await exercisePageInteractions(page, route.path);
    const screenshot = await takeScreenshot(page, `${slugify(route.name)}.png`);

    return {
      name: route.name,
      path: route.path,
      finalUrl: page.url(),
      title: snapshot.title,
      heading: snapshot.heading,
      actionablesCount: interactionReport.actionablesCount,
      interactions: interactionReport.interactions,
      consoleIssues,
      screenshot,
    };
  } finally {
    await page.close();
  }
}

async function main() {
  await ensureOutputDir();
  await fsp.mkdir(USER_DATA_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: HEADLESS,
    userDataDir: USER_DATA_DIR,
    defaultViewport: {
      width: 1440,
      height: 1080,
      deviceScaleFactor: 1,
    },
  });

  try {
    const { page, consoleIssues } = await createInstrumentedPage(browser);
    await setVercelBypassCookie(page);
    const authentication = await authenticate(page);
    const routes = [];

    if (authentication.status === "authenticated") {
      for (const route of APP_ROUTES) {
        console.log(`Exercising ${route.name} (${route.path})...`);
        routes.push(await inspectRoute(browser, route));
      }
    }

    await page.close();

    const runtimeIssues =
      consoleIssues.length +
      routes.reduce((count, route) => count + route.consoleIssues.length, 0);
    const interactionsTested = routes.reduce(
      (count, route) => count + route.interactions.length,
      0,
    );

    const report = {
      generatedAt: new Date().toISOString(),
      baseUrl: BASE_URL,
      headless: HEADLESS,
      authMode: AUTH_MODE,
      oauthProvider: OAUTH_PROVIDER,
      authentication: {
        ...authentication,
        consoleIssues,
      },
      routes,
      summary: {
        runtimeIssues,
        interactionsTested,
      },
    };

    const jsonPath = await writeJsonReport(report);
    const markdownPath = await writeMarkdownReport(report);

    console.log(`\nPlayer agent report saved to:\n- ${jsonPath}\n- ${markdownPath}`);

    if (authentication.status !== "authenticated" || runtimeIssues > 0) {
      process.exitCode = 1;
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error("Player agent failed:", error);
  process.exit(1);
});
