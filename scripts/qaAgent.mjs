import fs from "node:fs/promises";
import path from "node:path";

import puppeteer from "puppeteer";

const BASE_URL = (process.env.QA_BASE_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "http://localhost:3000").replace(/\/$/, "");

const HEADLESS = process.env.QA_HEADLESS !== "false";
const OUTPUT_DIR = process.env.QA_OUTPUT_DIR
  ? path.resolve(process.env.QA_OUTPUT_DIR)
  : path.join(process.cwd(), "artifacts", "qa-agent");
const SESSION_COOKIE = process.env.QA_COOKIE ?? "";
const VERCEL_PROTECTION_BYPASS = process.env.QA_VERCEL_PROTECTION_BYPASS ?? "";
const TIMEOUT_MS = Number(process.env.QA_TIMEOUT_MS ?? 45000);

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const ROUTES = [
  {
    name: "Landing",
    path: "/",
    actions: [
      { label: "Start Your First Mission", expectedPathStartsWith: ["/auth", "/dashboard"] },
      { label: "Explore Live War Map", expectedPathStartsWith: ["/war-map"] },
      { label: "Open clubs", expectedPathStartsWith: ["/clubs"] },
      { label: "Open live calls", expectedPathStartsWith: ["/live-calls"] },
      { label: "Watch live wars", expectedPathStartsWith: ["/wars"] },
      { label: "View leaderboard", expectedPathStartsWith: ["/leaderboard"] },
    ],
  },
  {
    name: "Login",
    path: "/login",
    actions: [
      { label: "Continue with Discord", expectedPathStartsWith: ["/oauth2/authorize", "/login", "/dashboard", "/auth"] },
      { label: "Continue with Twitch", expectedPathStartsWith: ["/oauth2/authorize", "/login", "/dashboard", "/auth"] },
    ],
  },
  { name: "Clubs", path: "/clubs" },
  { name: "War Map", path: "/war-map" },
  { name: "Leaderboard", path: "/leaderboard" },
  { name: "Live Calls", path: "/live-calls" },
  { name: "Rewards", path: "/rewards" },
];

function parseCookieHeader(cookieHeader) {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((cookie) => {
      const separator = cookie.indexOf("=");
      if (separator === -1) {
        return null;
      }

      return {
        name: cookie.slice(0, separator),
        value: cookie.slice(separator + 1),
        domain: "localhost",
        path: "/",
        httpOnly: false,
        secure: false,
      };
    })
    .filter(Boolean);
}

async function ensureOutputDir() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
}

async function writeJsonReport(filename, payload) {
  const filePath = path.join(OUTPUT_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");
  return filePath;
}

async function writeMarkdownReport(filename, report) {
  const lines = [
    "# ArenaX QA Agent Report",
    "",
    `- Base URL: ${report.baseUrl}`,
    `- Generated at: ${report.generatedAt}`,
    `- Headless: ${report.headless}`,
    `- Routes checked: ${report.routes.length}`,
    `- Failed checks: ${report.summary.failedChecks}`,
    `- Runtime errors: ${report.summary.runtimeErrors}`,
    "",
    "## Summary",
    "",
  ];

  for (const route of report.routes) {
    lines.push(`### ${route.name} \`${route.path}\``);
    lines.push("");
    lines.push(`- Final URL: ${route.finalUrl}`);
    lines.push(`- Title: ${route.title || "N/A"}`);
    lines.push(`- H1: ${route.heading || "N/A"}`);
    lines.push(`- Status: ${route.status ?? "unknown"}`);
    lines.push(`- Console/runtime issues: ${route.consoleIssues.length}`);
    lines.push(`- Click actions checked: ${route.actions.length}`);

    if (route.consoleIssues.length > 0) {
      lines.push("- Console issues:");
      for (const issue of route.consoleIssues) {
        lines.push(`  - [${issue.type}] ${issue.text}`);
      }
    }

    if (route.actions.length > 0) {
      lines.push("- Actions:");
      for (const action of route.actions) {
        lines.push(
          `  - ${action.label}: ${action.status} -> ${action.resultPath ?? "no navigation"}`
        );
      }
    }

    lines.push("");
  }

  const filePath = path.join(OUTPUT_DIR, filename);
  await fs.writeFile(filePath, lines.join("\n"), "utf8");
  return filePath;
}

async function createInstrumentedPage(browser) {
  const page = await browser.newPage();
  const consoleIssues = [];

  if (SESSION_COOKIE) {
    await page.setCookie(...parseCookieHeader(SESSION_COOKIE));
  }

  page.on("console", async (message) => {
    const type = message.type();
    if (!["error", "warning"].includes(type)) {
      return;
    }

    consoleIssues.push({
      type,
      text: message.text(),
    });
  });

  page.on("pageerror", (error) => {
    consoleIssues.push({
      type: "pageerror",
      text: error.message,
    });
  });

  page.on("requestfailed", (request) => {
    consoleIssues.push({
      type: "requestfailed",
      text: `${request.method()} ${request.url()} -> ${request.failure()?.errorText ?? "failed"}`,
    });
  });

  return { page, consoleIssues };
}

async function setVercelBypassCookie(browser) {
  if (!VERCEL_PROTECTION_BYPASS) {
    return;
  }

  const page = await browser.newPage();
  try {
    const bypassUrl = new URL(BASE_URL);
    bypassUrl.searchParams.set("x-vercel-set-bypass-cookie", "true");
    bypassUrl.searchParams.set("x-vercel-protection-bypass", VERCEL_PROTECTION_BYPASS);

    await page.goto(bypassUrl.toString(), {
      waitUntil: "networkidle2",
      timeout: TIMEOUT_MS,
    });
  } finally {
    await page.close();
  }
}

async function getPageSnapshot(page) {
  return page.evaluate(() => {
    const heading = document.querySelector("h1")?.textContent?.trim() ?? "";
    const actionables = Array.from(
      document.querySelectorAll("a, button, [role='button']")
    ).map((element) => ({
      text: (element.textContent ?? "").replace(/\s+/g, " ").trim(),
      href:
        element instanceof HTMLAnchorElement
          ? element.getAttribute("href")
          : null,
      disabled:
        element instanceof HTMLButtonElement
          ? element.disabled
          : element.getAttribute("aria-disabled") === "true",
    }));

    return {
      title: document.title,
      heading,
      actionables,
    };
  });
}

async function performActionCheck(browser, route, action) {
  const { page, consoleIssues } = await createInstrumentedPage(browser);

  try {
    await page.goto(`${BASE_URL}${route.path}`, {
      waitUntil: "networkidle2",
      timeout: TIMEOUT_MS,
    });

    const found = await page.evaluate((label) => {
      const wanted = (label ?? "").replace(/\s+/g, " ").trim().toLowerCase();
      const candidates = Array.from(
        document.querySelectorAll("a, button, [role='button']")
      );

      const match = candidates.find((element) =>
        (element.textContent ?? "")
          .replace(/\s+/g, " ")
          .trim()
          .toLowerCase()
          .includes(wanted),
      );

      if (!match) {
        return false;
      }

      match.scrollIntoView({ block: "center", inline: "center" });
      match.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        }),
      );
      return true;
    }, action.label);

    if (!found) {
      return {
        label: action.label,
        status: "missing",
        resultPath: null,
        consoleIssues,
      };
    }

    try {
      await page.waitForFunction(
        (expected) =>
          expected.some((prefix) => window.location.pathname.startsWith(prefix)),
        { timeout: 5000 },
        action.expectedPathStartsWith,
      );
    } catch {
      await sleep(1200);
    }

    const currentPath = new URL(page.url()).pathname;
    const status = action.expectedPathStartsWith.some((prefix) =>
      currentPath.startsWith(prefix),
    )
      ? "passed"
      : "unexpected";

    return {
      label: action.label,
      status,
      resultPath: currentPath,
      consoleIssues,
    };
  } finally {
    await page.close();
  }
}

async function inspectRoute(browser, route) {
  const { page, consoleIssues } = await createInstrumentedPage(browser);

  try {
    const response = await page.goto(`${BASE_URL}${route.path}`, {
      waitUntil: "networkidle2",
      timeout: TIMEOUT_MS,
    });
    await sleep(500);

    const snapshot = await getPageSnapshot(page);
    const actions = [];

    for (const action of route.actions ?? []) {
      actions.push(await performActionCheck(browser, route, action));
    }

    return {
      name: route.name,
      path: route.path,
      finalUrl: page.url(),
      title: snapshot.title,
      heading: snapshot.heading,
      status: response?.status() ?? null,
      actionables: snapshot.actionables,
      consoleIssues,
      actions,
    };
  } finally {
    await page.close();
  }
}

async function main() {
  await ensureOutputDir();

  const browser = await puppeteer.launch({
    headless: HEADLESS,
    defaultViewport: {
      width: 1440,
      height: 1080,
      deviceScaleFactor: 1,
    },
  });

  try {
    await setVercelBypassCookie(browser);

    const routes = [];

    for (const route of ROUTES) {
      console.log(`Checking ${route.name} (${route.path})...`);
      routes.push(await inspectRoute(browser, route));
    }

    const summary = {
      failedChecks: routes.reduce(
        (count, route) =>
          count +
          route.actions.filter((action) => action.status !== "passed").length,
        0,
      ),
      runtimeErrors: routes.reduce(
        (count, route) => count + route.consoleIssues.length,
        0,
      ),
    };

    const report = {
      generatedAt: new Date().toISOString(),
      baseUrl: BASE_URL,
      headless: HEADLESS,
      routes,
      summary,
    };

    const jsonPath = await writeJsonReport("qa-agent-report.json", report);
    const markdownPath = await writeMarkdownReport("qa-agent-report.md", report);

    console.log(`\nQA agent report saved to:\n- ${jsonPath}\n- ${markdownPath}`);

    if (summary.failedChecks > 0 || summary.runtimeErrors > 0) {
      process.exitCode = 1;
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error("QA agent failed:", error);
  process.exit(1);
});
