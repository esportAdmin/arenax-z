"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ComposableMap, Marker, ZoomableGroup } from "react-simple-maps";

import { useLiveWars } from "@/hooks/useLiveWars";
import { useArmyUnitsLive } from "@/hooks/useArmyUnitsLive";
import { useBattleEvents } from "@/hooks/useBattleEvents";
import { useUnitMovementsLive } from "@/hooks/useUnitMovementsLive";

import { useCameraFx } from "@/hooks/useCameraFx";
import { useCinematicCamera } from "@/hooks/useCinematicCamera";
import { useAbilityFx } from "@/hooks/useAbilityFx";
import { useSpectatorCamera } from "@/hooks/useSpectatorCamera";
import { useAudio } from "@/hooks/useAudio";

import ImpactEffect from "@/components/rts/ImpactEffect";
import DamageFloat from "@/components/rts/DamageFloat";
import StatusEffectLayer from "@/components/rts/StatusEffectLayer";
import AbilityEffectLayer, {
  type AbilityEffectInput,
  type AbilityFxType,
} from "@/components/rts/AbilityEffectLayer";
import CastEffectLayer from "@/components/rts/CastEffectLayer";
import SpectatorOverlay from "@/components/rts/SpectatorOverlay";

import ProjectileLayer, {
  ProjectilePosition,
  type ProjectileInput,
} from "@/components/rts/ProjectileLayer";
import ProjectileTrailLayer from "@/components/rts/ProjectileTrailLayer";

import CombatEventFeed, {
  type CombatFeedEvent,
} from "@/components/rts/CombatEventFeed";

interface Props {
  clubId?: string | null;
}

interface PendingImpact {
  id: string;
  defenderId: string;
  damage: number;
  crit?: boolean;
  impactAt: number;
  result?: "hit" | "miss" | "blocked";
  ability?: string;
  damageKind?: "physical" | "magic" | "true";
  impactStyle?: "impact" | "explosion" | "chain";
  aoeRadius?: number;
  chainTargetIds?: string[];
}

type AbilityName =
  | "global_burst"
  | "global_shield"
  | "mark_priority"
  | "execute_wave"
  | "meteor_zone"
  | "dash_strike"
  | "aura_field";

type AbilityCooldowns = Record<AbilityName, number>;

function buildLineStyle(from: [number, number], to: [number, number], color: string) {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle  = Math.atan2(dy, dx) * (180 / Math.PI);
  return {
    left: from[0], top: from[1], width: length,
    transform: `translate(0, -50%) rotate(${angle}deg)`,
    transformOrigin: "0 50%", background: color,
  };
}

const abilityCooldownMs: AbilityCooldowns = {
  global_burst: 5000, global_shield: 7000, mark_priority: 6000, execute_wave: 6500,
  meteor_zone: 9000, dash_strike: 4000, aura_field: 8000,
};

export default function WorldMap({ clubId = null }: Props) {
  const { loading }    = useLiveWars();
  const { units }      = useArmyUnitsLive();
  const { events }     = useBattleEvents();
  const { movements }  = useUnitMovementsLive();

  const projectionRef = useRef<any>(null);
  const [projectiles, setProjectiles]         = useState<ProjectileInput[]>([]);
  const [trailPositions, setTrailPositions]   = useState<ProjectilePosition[]>([]);
  const [impactDirections, setImpactDirections] = useState<Record<string, { dx: number; dy: number }>>({});
  const [pendingImpacts, setPendingImpacts]   = useState<PendingImpact[]>([]);
  const [visibleDamageEvents, setVisibleDamageEvents] = useState<any[]>([]);
  /** Pipeline FX pur — indépendant des dégâts. Déclenché au cast, sans attendre l'impact. */
  const [abilityVisualEvents, setAbilityVisualEvents] = useState<any[]>([]);
  const [abilityCooldowns, setAbilityCooldowns] = useState<AbilityCooldowns>({
    global_burst: 0, global_shield: 0, mark_priority: 0, execute_wave: 0,
    meteor_zone: 0, dash_strike: 0, aura_field: 0,
  });
  const projection = projectionRef.current;

  const handledEventKeysRef = useRef<Set<string>>(new Set());
  /** Kill detection — snapshot HP précédent pour détecter les morts ce tick */
  const previousHpRef = useRef<Map<string, number>>(new Map());
  const [_killEventIds, setKillEventIds] = useState<Set<string>>(new Set());

  const unitsById = useMemo(() => {
    const map = new Map<string, typeof units[number]>();
    units.forEach((u) => map.set(u.unit_id, u));
    return map;
  }, [units]);

  const movementsByUnitId = useMemo(() => {
    const map = new Map<string, (typeof movements)[number]>();
    movements.forEach((m) => { if (m.status === "moving") map.set(m.unit_id, m); });
    return map;
  }, [movements]);

  /** Source de vérité unique des positions [lng, lat]. Stable via useCallback. */
  const getUnitLngLat = useCallback(
    (unitId: string): [number, number] | null => {
      const movement = movementsByUnitId.get(unitId);
      if (movement?.currentPosition) return movement.currentPosition;
      const unit = unitsById.get(unitId);
      if (!unit || unit.lat == null || unit.lng == null) return null;
      return [unit.lng, unit.lat];
    },
    [movementsByUnitId, unitsById],
  );

  const cameraFx = useCameraFx(
    visibleDamageEvents.map((e) => ({
      damage: e.damage, crit: e.crit, result: e.result,
      dx: impactDirections[e.id]?.dx, dy: impactDirections[e.id]?.dy,
    })),
  );

  const cinematic = useCinematicCamera(
    useMemo(
      () =>
        visibleDamageEvents.map((e) => {
          const coords = getUnitLngLat(e.defenderId);
          if (!coords || !projection) return { x: 0, y: 0, damage: 0 };
          const [x, y] = projection(coords);
          return { x, y, damage: e.damage, crit: e.crit };
        }),
      [visibleDamageEvents, getUnitLngLat, projection],
    ),
  );

  // Mapper ability + event type → FX type.
  // Priorité : event.type === "ultimate" > replayTag > ability name.
  function mapAbilityToFxType(ability: string, eventType?: string, replayTag?: string): AbilityFxType | null {
    // Ultimates → FX dédié selon le replayTag ou l'ability
    if (eventType === "ultimate") {
      if (replayTag === "ULT_BLACKHOLE") return "chain";      // anneau violet pulsant
      if (replayTag === "ULT_METEOR")   return "zone";        // zone avec délai
      if (replayTag === "ULT_DASH_AOE") return "dash";        // trail rouge
      if (replayTag === "ACTIVE_BLINK") return "shield";      // anneau bleu (escape)
      if (replayTag === "ACTIVE_SHIELD") return "shield";
      if (replayTag === "ACTIVE_DASH")  return "dash";
      return "explosion";  // fallback ultimate générique
    }
    switch (ability) {
      case "arcane_burst":              return "explosion";
      case "chain_lightning":           return "chain";
      case "execute":                   return "dash";
      case "shield_burst":              return "shield";
      case "meteor":
      case "meteor_zone":               return "zone";
      case "dash":
      case "dash_strike":               return "dash";
      case "aura":
      case "aura_field":                return "aura";
      case "blackhole":                 return "chain";
      case "dash_aoe":                  return "dash";
      default:                          return null;
    }
  }

  // Fix déduplication : les visibleDamageEvents avec delayMs ont déjà
  // leur FX spawné côté abilityVisualEvents — on les exclut pour éviter
  // un double rendu (FX au cast + FX au hit pour le même event).
  const abilityFxSource = useMemo(
    () => [
      ...abilityVisualEvents,
      ...visibleDamageEvents.filter((e) => !e.delayMs),
    ],
    [abilityVisualEvents, visibleDamageEvents],
  );

  const abilityFxInput = useMemo(
    () =>
      abilityFxSource
        .map((e) => {
          const coords = getUnitLngLat(e.defenderId);
          if (!coords || !projection) return null;
          const [x, y] = projection(coords);
          // Passe event.type et replayTag pour que les ultimates aient le bon FX
          const type = mapAbilityToFxType(e.ability, e.type, e.replayTag);
          if (!type) return null;
          return {
            id: e.id, type, x, y,
            delayMs: e.delayMs,
            ...(type === "aura" ? { durationMs: 4000 } : {}),
          } as AbilityEffectInput;
        })
        .filter((entry): entry is NonNullable<typeof entry> => entry !== null),
    [abilityFxSource, getUnitLngLat, projection],
  );

  // AbilityFxEvent a un union plus étroit que AbilityEffectInput (manque zone/shield/aura).
  // Le cast est sûr : useAbilityFx passe les events à AbilityEffectLayer qui supporte tous les types.
  const abilityFx = useAbilityFx(abilityFxInput as any);

  const projectedUnits = useMemo(() => {
    if (!projection) return [];
    return units
      .map((u) => {
        const coords = getUnitLngLat(u.unit_id);
        if (!coords) return null;
        const [x, y] = projection(coords);
        return { unit_id: u.unit_id, x, y };
      })
      .filter((entry): entry is { unit_id: string; x: number; y: number } => !!entry);
  }, [units, getUnitLngLat, projection]);

  // ── Spectator camera ── alimentée par projectedUnits + events en temps réel
  const spectator = useSpectatorCamera({
    units: projectedUnits.map((u) => ({
      id: u.unit_id, x: u.x, y: u.y,
      hp:     unitsById.get(u.unit_id)?.hp     ?? 100,
      clubId: unitsById.get(u.unit_id)?.club_id ?? null,
    })),
    events: (events ?? []) as any[],
    enabled: true,
    width: 900, height: 540,
  });

  // ── Audio esport ── réactif sur spectator (kill, ultimate, clutch heartbeat)
  const { play, startClutch, stopClutch } = useAudio({ enabled: true, volume: 0.35 });

  useEffect(() => {
    if (spectator.highlightKill) {
      const topEvent = (events ?? [])[0] as any;
      if (topEvent?.highlight === "ace" || topEvent?.highlight === "teamwipe") {
        play("ace");
      } else if ((topEvent?.killStreak ?? 0) >= 2) {
        play("multi_kill");
      } else {
        play("kill");
      }
    }
  }, [events, play, spectator.highlightKill]);

  useEffect(() => {
    const hasUltimate = (events ?? []).some((e: any) => e.type === "ultimate");
    if (!hasUltimate) return;
    const topUlt = (events ?? []).find((e: any) => e.type === "ultimate") as any;
    if (topUlt?.ability === "meteor")    play("meteor");
    else if (topUlt?.ability === "blackhole") play("blackhole");
    else                                  play("ultimate");
  }, [events, play]);

  useEffect(() => {
    if (spectator.highlightClutch) startClutch();
    else stopClutch();
  }, [spectator.highlightClutch, startClutch, stopClutch]);

  const remainingCooldowns = useMemo(() => {
    const now = Date.now();
    return {
      global_burst:  Math.max(0, abilityCooldowns.global_burst  - now),
      global_shield: Math.max(0, abilityCooldowns.global_shield - now),
      mark_priority: Math.max(0, abilityCooldowns.mark_priority - now),
      execute_wave:  Math.max(0, abilityCooldowns.execute_wave  - now),
      meteor_zone:   Math.max(0, abilityCooldowns.meteor_zone   - now),
      dash_strike:   Math.max(0, abilityCooldowns.dash_strike   - now),
      aura_field:    Math.max(0, abilityCooldowns.aura_field    - now),
    };
  }, [abilityCooldowns]);

  const triggerAbility = async (ability: AbilityName): Promise<void> => {
    try {
      const territoryId = units[0]?.territory_id ?? null;
      if (!clubId || !territoryId || remainingCooldowns[ability] > 0) return;

      setAbilityCooldowns((prev) => ({ ...prev, [ability]: Date.now() + abilityCooldownMs[ability] }));

      const res  = await fetch("/api/battles/ability", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ability, clubId, territoryId }),
      });
      const data = await res.json();
      if (!data?.event) return;

      const now = Date.now();
      const targets: string[] = Array.isArray(data.affectedUnitIds) ? data.affectedUnitIds : [];

      // ── Pipeline FX pur (indépendant des dégâts) ──
      // Déclenché immédiatement au cast — shield, aura et meteor ont leur FX
      // même si totalDamage = 0. Le rendu visuel ne dépend plus des HP.
      if (targets.length > 0) {
        setAbilityVisualEvents((prev) => [
          ...prev,
          ...targets.map((id: string, i: number) => ({
            id: `ability-fx-${ability}-${now}-${i}`,
            defenderId: id,
            ability: data.event.ability,
            delayMs: data.event.delayMs,
            createdAt: now,
          })),
        ]);
      } else {
        // Fallback : ability globale sans cible retournée (zone pure, buff global).
        // On ancre le FX sur la première unité visible pour que quelque chose s'affiche.
        const fallbackId = units[0]?.unit_id;
        if (fallbackId) {
          setAbilityVisualEvents((prev) => [
            ...prev,
            {
              id: `ability-fx-${ability}-${now}`,
              defenderId: fallbackId,
              ability: data.event.ability,
              delayMs: data.event.delayMs,
              createdAt: now,
            },
          ]);
        }
      }

      // ── Pipeline damage (DamageFloat + ImpactEffect uniquement si dégâts) ──
      const totalDamage = Number(data.totalDamage ?? 0);
      if (totalDamage > 0 && targets.length > 0) {
        const validTargets = targets.filter((id) => !!getUnitLngLat(id));
        const perTargetDamage = validTargets.length > 0
          ? Math.max(0, Math.round(totalDamage / validTargets.length))
          : 0;

        setVisibleDamageEvents((prev) => [
          ...prev,
          ...validTargets.map((targetId, index) => ({
            id: `ability-dmg-${ability}-${now}-${index}`, defenderId: targetId,
            damage: perTargetDamage, crit: false, result: "hit" as const,
            ability: data.event.ability, damageKind: data.event.damageKind,
            impactStyle: data.event.impactStyle, aoeRadius: 0, chainTargetIds: [],
            delayMs: data.event.delayMs, createdAt: now,
          })),
        ]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [hitStop, setHitStop] = useState(false);

  useEffect(() => {
    if (!cinematic.slowMo) return;
    setHitStop(true);
    const t = setTimeout(() => setHitStop(false), 80);
    return () => clearTimeout(t);
  }, [cinematic.slowMo]);

  useEffect(() => {
    if (!events || !projection) return;

    const now = Date.now();
    const nextProjectiles: ProjectileInput[] = [];
    const nextImpacts: PendingImpact[] = [];

    for (const rawEvent of events as CombatFeedEvent[]) {
      const eventType = (rawEvent as any).type;
      if (eventType === "cast_start" || eventType === "cast_interrupt") continue;

      const key = [
        eventType ?? "attack",
        rawEvent.attackerId, rawEvent.defenderId, rawEvent.damage,
        rawEvent.impactStyle ?? "impact", rawEvent.targetPriority ?? "default",
        rawEvent.chainTargetIds?.join(",") ?? "",
      ].join("-");

      if (handledEventKeysRef.current.has(key)) continue;
      handledEventKeysRef.current.add(key);

      // Skillshot : utiliser le point prédit (projectileAimLng/Lat) comme destination
      // visuelle du projectile plutôt que la position actuelle de la cible.
      const startCoords =
        typeof (rawEvent as any).projectileStartLng === "number" &&
        typeof (rawEvent as any).projectileStartLat === "number"
          ? [(rawEvent as any).projectileStartLng, (rawEvent as any).projectileStartLat]
          : getUnitLngLat(rawEvent.attackerId);

      const aimCoords =
        typeof (rawEvent as any).projectileAimLng === "number" &&
        typeof (rawEvent as any).projectileAimLat === "number"
          ? [(rawEvent as any).projectileAimLng, (rawEvent as any).projectileAimLat]
          : getUnitLngLat(rawEvent.defenderId);

      if (!startCoords || !aimCoords) continue;

      const from = projection(startCoords);
      const to   = projection(aimCoords);

      const travelMs = Number(rawEvent.travelMs ?? 0);
      const id = `${key}-${now}`;

      if (travelMs > 0) {
        nextProjectiles.push({
          id, from, to, duration: travelMs, crit: rawEvent.crit,
          projectileType:
            rawEvent.projectileType === "arrow" || rawEvent.projectileType === "bolt" ||
            rawEvent.projectileType === "orb"   || rawEvent.projectileType === "none"
              ? rawEvent.projectileType : "bolt",
        });
        nextImpacts.push({
          id, defenderId: rawEvent.defenderId, damage: rawEvent.damage, crit: rawEvent.crit,
          impactAt: now + travelMs, result: rawEvent.result, ability: rawEvent.ability,
          damageKind: rawEvent.damageKind, impactStyle: rawEvent.impactStyle,
          aoeRadius: rawEvent.splashRadius, chainTargetIds: rawEvent.chainTargetIds ?? [],
        });
      } else {
        setVisibleDamageEvents((prev) => [
          ...prev,
          {
            id, defenderId: rawEvent.defenderId, damage: rawEvent.damage, crit: rawEvent.crit,
            result: rawEvent.result, ability: rawEvent.ability, damageKind: rawEvent.damageKind,
            impactStyle: rawEvent.impactStyle, aoeRadius: rawEvent.splashRadius,
            chainTargetIds: rawEvent.chainTargetIds ?? [],
          },
        ]);
      }
    }

    if (nextProjectiles.length) setProjectiles((p) => [...p, ...nextProjectiles]);
    if (nextImpacts.length)     setPendingImpacts((p) => [...p, ...nextImpacts]);
  }, [events, projection, getUnitLngLat]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now   = Date.now();
      const ready = pendingImpacts.filter((i) => i.impactAt <= now);
      if (!ready.length) return;
      setPendingImpacts((p) => p.filter((i) => i.impactAt > now));
      setVisibleDamageEvents((prev) => [
        ...prev,
        ...ready.map((r) => ({
          id: r.id, defenderId: r.defenderId, damage: r.damage, crit: r.crit,
          result: r.result, ability: r.ability, damageKind: r.damageKind,
          impactStyle: r.impactStyle, aoeRadius: r.aoeRadius, chainTargetIds: r.chainTargetIds ?? [],
        })),
      ]);
    }, 50);
    return () => clearInterval(interval);
  }, [pendingImpacts]);

  useEffect(() => {
    if (!trailPositions.length) return;
    setImpactDirections((prev) => {
      const next = { ...prev };
      for (const p of trailPositions) next[p.id] = { dx: p.dx, dy: p.dy };
      return next;
    });
  }, [trailPositions]);

  // ── Kill detection ──
  // Snapshot HP précédent → détecte les morts ce tick pour les FX et le spectator.
  useEffect(() => {
    const next = new Map<string, number>();
    const newKills = new Set<string>();

    units.forEach((u) => {
      const prevHp = previousHpRef.current.get(u.unit_id);
      const currHp = Number(u.hp ?? 0);
      if (prevHp != null && prevHp > 0 && currHp <= 0) {
        newKills.add(u.unit_id);
      }
      next.set(u.unit_id, currHp);
    });

    previousHpRef.current = next;
    if (newKills.size > 0) {
      setKillEventIds((prev) => new Set([...prev, ...newKills]));
      // Auto-purge après 2s pour éviter l'accumulation
      setTimeout(() => {
        setKillEventIds((prev) => {
          const cleaned = new Set(prev);
          newKills.forEach((id) => cleaned.delete(id));
          return cleaned;
        });
      }, 2000);
    }
  }, [units]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAbilityCooldowns((prev) => ({ ...prev }));
      const now = Date.now();
      // Purge les FX visuels expirés.
      // TTL = max(delayMs, 0) + 4000ms pour couvrir aura (4s) et meteor (delay + impact).
      setAbilityVisualEvents((prev) =>
        prev.filter((e) => now - e.createdAt < Math.max(0, e.delayMs ?? 0) + 4000),
      );
    }, 200);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div
      className="relative h-[540px] overflow-hidden bg-black"
      style={{
        // Fusion : shake (cameraFx) + spectator offset + zoom cinematic/spectator
        transform: `translate(${cameraFx.x + spectator.offsetX}px, ${cameraFx.y + spectator.offsetY}px) scale(${Math.max(cinematic.zoom, spectator.zoom)})`,
        transition: cinematic.slowMo ? "transform 0.15s ease-out" : "transform 0.22s ease-out",
      }}
    >
      <div
        style={{
          transform: hitStop ? "scale(0.98)" : "scale(1)",
          // slowMo : brightness légèrement augmenté + saturation réduite pour effet cinématique
          filter: spectator.slowMo
            ? "brightness(1.18) saturate(0.8)"
            : cinematic.slowMo ? "brightness(1.2)" : "none",
          transition: "all 0.2s",
        }}
      >
        <ComposableMap>
          {(mapProps: any) => {
            projectionRef.current = mapProps.projection;
            return (
              <ZoomableGroup>
                {units.map((unit) => {
                  const coords = getUnitLngLat(unit.unit_id);
                  if (!coords) return null;
                  return (
                    <Marker key={unit.unit_id} coordinates={coords}>
                      <circle r={5} fill={unit.club_color || "#22d3ee"} />
                    </Marker>
                  );
                })}
              </ZoomableGroup>
            );
          }}
        </ComposableMap>

        <ProjectileTrailLayer projectiles={trailPositions} />
        <ProjectileLayer projectiles={projectiles} onUpdate={setTrailPositions} />

        {projection && (
          <>
            <StatusEffectLayer units={units} projection={projection} />
            <AbilityEffectLayer effects={abilityFx} />
            <CastEffectLayer units={projectedUnits} events={events as any[]} />

            {visibleDamageEvents.map((event) => {
              const coords = getUnitLngLat(event.defenderId);
              if (!coords) return null;
              const [x, y] = projection(coords);

              const chainTargetUnits = (event.chainTargetIds ?? [])
                .map((targetId: string) => {
                  const targetCoords = getUnitLngLat(targetId);
                  if (!targetCoords) return null;
                  return { unit_id: targetId, lng: targetCoords[0], lat: targetCoords[1] };
                })
                .filter(Boolean) as Array<{ unit_id: string; lat: number; lng: number }>;

              return (
                <div key={event.id}>
                  <ImpactEffect x={x} y={y} crit={event.crit} damageKind={event.damageKind}
                    impactStyle={event.impactStyle} aoeRadius={event.aoeRadius} />

                  {event.impactStyle === "chain" &&
                    chainTargetUnits.map((targetUnit, index) => {
                      const [tx, ty] = projection([targetUnit.lng, targetUnit.lat]);
                      return (
                        <div
                          key={`${event.id}-chain-${targetUnit.unit_id}-${index}`}
                          className="pointer-events-none absolute z-50 h-[2px] rounded-full"
                          style={buildLineStyle([x, y], [tx, ty], "#d946ef")}
                        />
                      );
                    })}

                  <DamageFloat x={x} y={y} damage={event.damage} crit={event.crit}
                    result={event.result} ability={event.ability}
                    impactDirection={impactDirections[event.id] ?? null} damageKind={event.damageKind} />
                </div>
              );
            })}
          </>
        )}
      </div>

      <div className="absolute left-4 top-4 z-50 flex gap-2">
        {(["global_burst", "global_shield", "mark_priority", "execute_wave", "meteor_zone", "dash_strike", "aura_field"] as const).map((ability) => {
          const remaining = remainingCooldowns[ability];
          const labels: Record<AbilityName, string> = {
            global_burst: "Burst", global_shield: "Shield", mark_priority: "Mark", execute_wave: "Execute",
            meteor_zone: "Meteor", dash_strike: "Dash", aura_field: "Aura",
          };
          const colors: Record<AbilityName, string> = {
            global_burst: "bg-purple-600", global_shield: "bg-blue-600",
            mark_priority: "bg-fuchsia-600", execute_wave: "bg-red-600",
            meteor_zone: "bg-orange-500", dash_strike: "bg-rose-600", aura_field: "bg-violet-600",
          };
          return (
            <button
              key={ability}
              type="button"
              onClick={() => triggerAbility(ability)}
              disabled={remaining > 0}
              className={`rounded ${colors[ability]} px-3 py-2 text-xs font-semibold text-white disabled:opacity-40`}
            >
              {remaining > 0 ? `${(remaining / 1000).toFixed(1)}s` : labels[ability]}
            </button>
          );
        })}
      </div>

      {/* ── Spectator overlays ── */}
      {spectator.highlightKill && (
        <div className="pointer-events-none absolute inset-0 z-40 border-4 border-red-500/70 animate-pulse" />
      )}
      {spectator.highlightClutch && !spectator.highlightKill && (
        <div className="pointer-events-none absolute inset-0 z-40 border-4 border-yellow-300/60" />
      )}

      {/* SpectatorOverlay — feed événements + états camera */}
      <SpectatorOverlay
        events={events as any[]}
        focusLabel={spectator.focusLabel}
        slowMo={spectator.slowMo}
        freezeFrame={spectator.freezeFrame}
        teamFight={spectator.teamFight}
      />

      {/* focusLabel badge haut-droite */}
      {spectator.focusLabel && (
        <div className="pointer-events-none absolute right-4 top-4 z-40 rounded bg-black/55 px-2 py-1 text-xs font-semibold text-cyan-200">
          {spectator.focusLabel}
        </div>
      )}

      <CombatEventFeed events={events} />
    </div>
  );
}
