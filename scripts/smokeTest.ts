/**
 * scripts/smokeTest.ts
 * ─────────────────────────────────────────────────────────────────────
 * Validation pré-prod complète :
 *   A — Health
 *   B — Queue flow (join → status → leave)
 *   C — Concurrence queue (atomicité join_queue_atomic)
 *   D — Friends (structure de réponse)
 *   E — Rate limiting
 *   F — Analytics batch
 *   G — GDPR export
 *
 * Usage :
 *   TEST_COOKIE="sb-xxx-auth-token=..." \
 *   NEXT_PUBLIC_APP_URL=http://localhost:3000 \
 *   npx tsx scripts/smokeTest.ts
 *
 * TEST_COOKIE : DevTools → Application → Cookies → copier la valeur
 *   complète "sb-<ref>-auth-token"
 * ─────────────────────────────────────────────────────────────────────
 */

export {};

const BASE   = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
const COOKIE = process.env.TEST_COOKIE ?? "";

if (!COOKIE) {
  console.error("❌  TEST_COOKIE manquant — exporter la session Supabase depuis les DevTools.");
  process.exit(1);
}

const H: Record<string, string> = {
  "Content-Type": "application/json",
  cookie: COOKIE,
};

let passed = 0;
let failed = 0;

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

async function test(label: string, fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
    console.log(`  ✅  ${label}`);
    passed++;
  } catch (err) {
    console.error(`  ❌  ${label} —`, err instanceof Error ? err.message : err);
    failed++;
  }
}

async function api(
  method: string,
  path:   string,
  body?:  unknown,
): Promise<{ status: number; data: unknown }> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: H,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let data: unknown;
  try { data = await res.json(); } catch { data = null; }
  return { status: res.status, data };
}

// ─────────────────────────────────────────────
// BLOC A — Health
// ─────────────────────────────────────────────
async function smokeHealth() {
  console.log("\n📡  Bloc A — Health");

  await test("GET /api/health → 200 + champ status", async () => {
    const { status, data } = await api("GET", "/api/health");
    if (status !== 200 && status !== 503) throw new Error(`HTTP ${status}`);
    if (!(data as Record<string, unknown>).status) throw new Error("champ 'status' absent");
  });

  await test("GET /api/health sans auth → 200 (route publique)", async () => {
    const res = await fetch(`${BASE}/api/health`);
    if (res.status !== 200 && res.status !== 503) throw new Error(`HTTP ${res.status}`);
  });
}

// ─────────────────────────────────────────────
// BLOC B — Queue flow
// ─────────────────────────────────────────────
async function smokeQueue() {
  console.log("\n🎮  Bloc B — Queue flow");

  // S'assurer de ne pas être déjà en queue
  await api("POST", "/api/queue/leave", {}).catch(() => {});

  let sessionId: string | null = null;

  await test("POST /api/queue/join → 200 + session_id", async () => {
    const { status, data } = await api("POST", "/api/queue/join", { queue_type: "ranked" });
    if (status !== 200) throw new Error(`HTTP ${status}: ${JSON.stringify(data)}`);
    const d = data as Record<string, unknown>;
    if (!d.session_id) throw new Error("session_id absent");
    sessionId = d.session_id as string;
  });

  await test("GET /api/queue/status → in_queue: true", async () => {
    const { status, data } = await api("GET", "/api/queue/status");
    if (status !== 200) throw new Error(`HTTP ${status}`);
    if (!(data as Record<string, unknown>).in_queue) throw new Error("in_queue devrait être true");
  });

  await test("POST /api/queue/join (double) → 409 Already in queue", async () => {
    const { status } = await api("POST", "/api/queue/join", { queue_type: "ranked" });
    if (status !== 409) throw new Error(`Attendu 409, reçu ${status}`);
  });

  await test("POST /api/queue/leave → 200 + success", async () => {
    const { status, data } = await api("POST", "/api/queue/leave", { session_id: sessionId });
    if (status !== 200) throw new Error(`HTTP ${status}: ${JSON.stringify(data)}`);
    if (!(data as Record<string, unknown>).success) throw new Error("success absent");
  });

  await test("GET /api/queue/status → in_queue: false après leave", async () => {
    const { status, data } = await api("GET", "/api/queue/status");
    if (status !== 200) throw new Error(`HTTP ${status}`);
    if ((data as Record<string, unknown>).in_queue) throw new Error("in_queue devrait être false");
  });
}

// ─────────────────────────────────────────────
// BLOC C — Atomicité queue (20 joins simultanés)
// ─────────────────────────────────────────────
async function smokeConcurrency() {
  console.log("\n⚡  Bloc C — Concurrence queue (20 joins simultanés)");

  await api("POST", "/api/queue/leave", {}).catch(() => {});

  const results = await Promise.all(
    Array.from({ length: 20 }, () =>
      fetch(`${BASE}/api/queue/join`, {
        method:  "POST",
        headers: H,
        body:    JSON.stringify({ queue_type: "ranked" }),
      }),
    ),
  );

  const byStatus: Record<number, number> = {};
  for (const r of results) {
    byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
  }

  const success   = byStatus[200] ?? 0;
  const conflicts = byStatus[409] ?? 0;
  const ratelimit = byStatus[429] ?? 0;
  const errors    = Object.entries(byStatus)
    .filter(([s]) => !["200", "409", "429"].includes(s))
    .reduce((a, [, v]) => a + v, 0);

  console.log(`  📊  200:${success}  409:${conflicts}  429:${ratelimit}  autres:${errors}`);

  await test("Exactement 1 join réussi sur 20 (atomicité RPC)", async () => {
    if (success !== 1) throw new Error(`Attendu 1, reçu ${success} — RPC join_queue_atomic défaillant`);
  });

  await test("19 réponses 409/429 (pas de double-join)", async () => {
    const rejected = conflicts + ratelimit;
    if (rejected !== 19) throw new Error(`Attendu 19, reçu ${rejected}`);
  });

  // Cleanup
  await api("POST", "/api/queue/leave", {}).catch(() => {});
}

// ─────────────────────────────────────────────
// BLOC D — Friends
// ─────────────────────────────────────────────
async function smokeFriends() {
  console.log("\n👥  Bloc D — Friends");

  await test("GET /api/friends → structure { friends, pending, blocked }", async () => {
    const { status, data } = await api("GET", "/api/friends");
    if (status !== 200) throw new Error(`HTTP ${status}`);
    const d = data as Record<string, unknown>;
    if (!Array.isArray(d.friends)) throw new Error("friends manquant");
    if (!Array.isArray(d.pending)) throw new Error("pending manquant");
    if (!Array.isArray(d.blocked)) throw new Error("blocked manquant");
  });

  await test("POST /api/friends/request (username inexistant) → 404", async () => {
    const { status } = await api("POST", "/api/friends/request", { username: "___nobody___xyz" });
    if (status !== 404) throw new Error(`Attendu 404, reçu ${status}`);
  });
}

// ─────────────────────────────────────────────
// BLOC E — Rate limiting
// ─────────────────────────────────────────────
async function smokeRateLimit() {
  console.log("\n🔒  Bloc E — Rate limiting");

  let rateLimited = false;

  for (let i = 0; i < 12 && !rateLimited; i++) {
    await api("POST", "/api/queue/leave", {}).catch(() => {});
    const { status } = await api("POST", "/api/queue/join", { queue_type: "ranked" });
    if (status === 429) rateLimited = true;
  }

  await api("POST", "/api/queue/leave", {}).catch(() => {});

  await test("Rate limit 429 déclenché après 10 joins/min", async () => {
    if (!rateLimited) throw new Error("Rate limit non déclenché — vérifier check_and_increment_rate_limit");
  });
}

// ─────────────────────────────────────────────
// BLOC F — Analytics batch
// ─────────────────────────────────────────────
async function smokeAnalytics() {
  console.log("\n📊  Bloc F — Analytics batch");

  await test("POST /api/analytics/batch → ok: true", async () => {
    const { status, data } = await api("POST", "/api/analytics/batch", {
      events: [
        { event_type: "smoke_test", properties: { source: "smokeTest.ts" } },
      ],
    });
    if (status !== 200) throw new Error(`HTTP ${status}: ${JSON.stringify(data)}`);
    if (!(data as Record<string, unknown>).ok) throw new Error("ok absent");
  });

  await test("POST /api/analytics/batch (events vide) → ok: true, inserted: 0", async () => {
    const { status, data } = await api("POST", "/api/analytics/batch", { events: [] });
    if (status !== 200) throw new Error(`HTTP ${status}`);
    const d = data as Record<string, unknown>;
    if (d.inserted !== 0) throw new Error(`inserted devrait être 0, reçu ${d.inserted}`);
  });
}

// ─────────────────────────────────────────────
// BLOC G — GDPR export
// ─────────────────────────────────────────────
async function smokeGdpr() {
  console.log("\n🔏  Bloc G — GDPR export");

  await test("GET /api/gdpr/export → 200 + user_id", async () => {
    const { status, data } = await api("GET", "/api/gdpr/export");
    if (status !== 200) throw new Error(`HTTP ${status}: ${JSON.stringify(data)}`);
    const d = data as Record<string, unknown>;
    if (!d.user_id)     throw new Error("user_id absent");
    if (!d.exported_at) throw new Error("exported_at absent");
  });
}

// ─────────────────────────────────────────────
// ENTRY POINT
// ─────────────────────────────────────────────
async function main() {
  const sep = "─".repeat(52);
  console.log(`\n🚀  Smoke tests ArenaX — ${BASE}`);
  console.log(sep);

  await smokeHealth();
  await smokeQueue();
  await smokeConcurrency();
  await smokeFriends();
  await smokeRateLimit();
  await smokeAnalytics();
  await smokeGdpr();

  console.log(`\n${sep}`);
  console.log(`Résultat final : ${passed} ✅   ${failed} ❌`);

  if (failed > 0) {
    console.log("\n⚠️  Des tests ont échoué — corriger avant commercialisation.\n");
    process.exit(1);
  } else {
    console.log("\n🟢  Tous les tests passent — système prêt.\n");
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
