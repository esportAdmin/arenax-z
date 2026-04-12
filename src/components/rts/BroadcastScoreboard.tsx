"use client";

import { useMemo } from "react";

// ============================================================
// TYPES
// ============================================================

export interface BroadcastUnit {
  id: string;
  clubId?: string | null;
  hp?: number;
  maxHp?: number;
}

interface ReplayEventLike {
  attackerId: string;
  defenderId: string;
  damage?: number;
  isKill?: boolean;
  type?: string;
}

interface TeamStats {
  clubId: string;
  unitCount: number;
  aliveCount: number;   // unités avec hp > 0 après le tick
  totalHp: number;
  maxHp: number;
  kills: number;
  damage: number;
  ultimates: number;
}

interface Props {
  units: BroadcastUnit[];
  events: ReplayEventLike[];
}

// ============================================================
// HELPERS
// ============================================================

function normalizeClubId(value: string | null | undefined): string {
  return value?.trim() || "unknown";
}

// ============================================================
// COMPONENT
// ============================================================

/**
 * BroadcastScoreboard — statistiques par équipe calculées en temps réel.
 *
 * - Stats : unités vivantes, HP total, dégâts infligés, kills, ultimates
 * - Tri : kills DESC → damage DESC
 * - HP bar proportionnelle au maxHp de l'équipe
 *
 * Path : @/components/rts/BroadcastScoreboard
 */
export default function BroadcastScoreboard({ units, events }: Props) {
  const stats = useMemo(() => {
    const byClub   = new Map<string, TeamStats>();
    const unitToClub = new Map<string, string>();

    for (const unit of units) {
      const clubId = normalizeClubId(unit.clubId);
      unitToClub.set(unit.id, clubId);

      if (!byClub.has(clubId)) {
        byClub.set(clubId, { clubId, unitCount: 0, aliveCount: 0, totalHp: 0, maxHp: 0, kills: 0, damage: 0, ultimates: 0 });
      }

      const row = byClub.get(clubId)!;
      row.unitCount += 1;
      // aliveCount : unités avec HP > 0 (snapshot après le tick)
      if (Number(unit.hp ?? 0) > 0) row.aliveCount += 1;
      row.totalHp   += Number(unit.hp    ?? 0);
      row.maxHp     += Number(unit.maxHp ?? 100);
    }

    for (const event of events) {
      const attackerClub = unitToClub.get(event.attackerId);
      if (!attackerClub) continue;
      const row = byClub.get(attackerClub);
      if (!row) continue;

      row.damage += Number(event.damage ?? 0);
      if (event.isKill)             row.kills     += 1;
      if (event.type === "ultimate") row.ultimates += 1;
    }

    return [...byClub.values()].sort((a, b) =>
      b.kills !== a.kills ? b.kills - a.kills : b.damage - a.damage,
    );
  }, [units, events]);

  if (!stats.length) return null;

  // Résumé global "X alive vs Y alive" entre les deux équipes
  const aliveSummary = stats.length >= 2
    ? `${stats[0].aliveCount} alive vs ${stats[1].aliveCount} alive`
    : stats[0] ? `${stats[0].aliveCount} alive` : null;

  return (
    <div className="rounded-lg border border-white/10 bg-black/65 p-3 text-white backdrop-blur">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
          Scoreboard
        </div>
        {aliveSummary && (
          <div className="text-[11px] text-white/60 font-mono">{aliveSummary}</div>
        )}
      </div>

      <div className="space-y-2">
        {stats.map((team) => {
          const hpPct = team.maxHp > 0
            ? Math.max(0, Math.min(100, (team.totalHp / team.maxHp) * 100))
            : 0;

          return (
            <div key={team.clubId} className="rounded bg-white/5 p-2">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="truncate max-w-[160px]" title={team.clubId}>
                  {team.clubId.length > 20 ? `${team.clubId.slice(0, 8)}…` : team.clubId}
                </span>
                <span className="shrink-0 ml-2">{team.kills} K</span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded bg-white/10">
                <div className="h-full bg-cyan-400 transition-all" style={{ width: `${hpPct}%` }} />
              </div>

              <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-white/70">
                <span className="font-semibold text-white/90">{team.aliveCount} alive</span>
                <span>{Math.round(team.totalHp)} hp</span>
                <span>{team.damage} dmg</span>
                <span>{team.kills} K</span>
                <span>{team.ultimates} ult</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
