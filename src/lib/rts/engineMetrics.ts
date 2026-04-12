let lastTickTime = Date.now();

let metrics = {
  ticks: 0,
  lastDuration: 0,
  avgDuration: 0,

  activeTerritories: 0,
  activeBattles: 0,
  projectilesPending: 0,

  lastTickAt: Date.now(),
};

export function recordTick(duration: number, extra?: Partial<typeof metrics>) {
  metrics.ticks++;

  metrics.lastDuration = duration;
  metrics.avgDuration =
    metrics.avgDuration === 0
      ? duration
      : Math.round((metrics.avgDuration * 0.9 + duration * 0.1) * 100) / 100;

  metrics.lastTickAt = Date.now();

  if (extra) {
    metrics = { ...metrics, ...extra };
  }
}

export function getMetrics() {
  const now = Date.now();

  const delta = now - lastTickTime;
  const tps = delta > 0 ? Math.round((1000 / delta) * 10) / 10 : 0;

  lastTickTime = now;

  return {
    ...metrics,
    tps,
    lag: metrics.lastDuration > 200,
  };
}
