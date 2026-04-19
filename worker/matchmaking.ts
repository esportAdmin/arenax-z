export {};

const LOOP_INTERVAL_MS = 5_000;

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

function getHeaders() {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (process.env.CRON_SECRET) {
    headers["x-cron-secret"] = process.env.CRON_SECRET;
  }

  return headers;
}

async function tick() {
  const baseUrl = getBaseUrl();

  const response = await fetch(`${baseUrl}/api/cron/matchmaking`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      limit: 50,
      triggerBattleLoop: true,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Matchmaking tick failed (${response.status}): ${text}`);
  }

  const json = await response.json();
  return json;
}

async function run() {
  console.log("🎯 Matchmaking worker started");

  while (true) {
    const startedAt = Date.now();

    try {
      const result = await tick();

      if (result?.created > 0) {
        console.log(
          `🎮 Matchmaking created ${result.created} match(es)`,
          result.createdMatches ?? [],
        );
      }
    } catch (error) {
      console.error("Matchmaking worker error", error);
    }

    const elapsed = Date.now() - startedAt;
    const wait = Math.max(0, LOOP_INTERVAL_MS - elapsed);

    await new Promise((resolve) => setTimeout(resolve, wait));
  }
}

void run();
