import type { LiveWar } from "@/hooks/useLiveWars";

/**
 * Normalizes live-war data into a HUD pressure value.
 *
 * Example:
 * ```ts
 * pressureFor({ capture_progress: 78, total_xp: 0 } as LiveWar, 0);
 * ```
 */
export function pressureFor(war: LiveWar, index: number) {
  const raw = war.capture_progress ?? (war.total_xp ? war.total_xp / 28 : 0);
  const minimum = index === 0 ? 58 : 34;
  return Math.min(100, Math.max(minimum, Math.round(raw)));
}
