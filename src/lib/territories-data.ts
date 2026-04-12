/**
 * lib/territories-data.ts
 *
 * Approche entièrement dynamique — plus de TERRITORY_STATIC hardcodé.
 *
 * Les territoires sont construits depuis club_territories (DB) :
 *   slug            → identifiant unique front-end
 *   name            → label affiché
 *   map_x / map_y   → centre sur la carte (colonnes DB réelles)
 *   controlling_club_id → club contrôlant
 *
 * Les shapes SVG sont des hexagones irréguliers générés à la volée
 * centrés sur (map_x, map_y). Seule approche viable sur 43 territoires.
 *
 * La guerre active (paris) sera bien trouvée car :
 *   war.territory.slug = "paris" → buildTerritoryDisplays le marque "critical"
 */

import type {
  TerritoryDisplay,
  TerritoryColor,
  TerritoryState,
  ClubDisplay,
  WarViewModel,
  WarPriority,
  ClubWar,
  Club,
  ClubTerritory,
} from "@/types/war-aaa";

// ─── PALETTE CYCLIQUE (8 couleurs pour N territoires) ─────────────────────────

const PALETTE: TerritoryColor[] = [
  { base: "#ef4444", glow: "rgba(239,68,68,0.7)",   border: "#dc2626", light: "rgba(239,68,68,0.15)"  },
  { base: "#f59e0b", glow: "rgba(245,158,11,0.6)",  border: "#d97706", light: "rgba(245,158,11,0.15)" },
  { base: "#3b82f6", glow: "rgba(59,130,246,0.5)",  border: "#2563eb", light: "rgba(59,130,246,0.12)" },
  { base: "#a855f7", glow: "rgba(168,85,247,0.5)",  border: "#9333ea", light: "rgba(168,85,247,0.12)" },
  { base: "#22c55e", glow: "rgba(34,197,94,0.5)",   border: "#16a34a", light: "rgba(34,197,94,0.12)"  },
  { base: "#06b6d4", glow: "rgba(6,182,212,0.5)",   border: "#0891b2", light: "rgba(6,182,212,0.12)"  },
  { base: "#f97316", glow: "rgba(249,115,22,0.5)",  border: "#ea580c", light: "rgba(249,115,22,0.12)" },
  { base: "#ec4899", glow: "rgba(236,72,153,0.5)",  border: "#db2777", light: "rgba(236,72,153,0.12)" },
];

function colorForIndex(i: number): TerritoryColor {
  return PALETTE[i % PALETTE.length];
}

// ─── GÉNÉRATION PATH SVG ──────────────────────────────────────────────────────

/**
 * Génère un hexagone irrégulier centré sur (cx, cy) avec rayon r.
 * `seed` varie la forme légèrement pour différencier les territoires visuellement.
 */
function hexPath(cx: number, cy: number, r: number, seed: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle  = (Math.PI / 3) * i - Math.PI / 6;
    const jitter = 1 + (((seed * (i + 3)) % 14) - 7) / 100;
    const x = cx + r * jitter * Math.cos(angle);
    const y = cy + r * jitter * Math.sin(angle);
    pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return `M ${pts.join(" L ")} Z`;
}

/**
 * Génère un hash numérique stable depuis un slug string.
 * Utilisé comme seed pour la forme et la couleur.
 */
function slugHash(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return h;
}

// ─── POSITIONS PAR DÉFAUT (quand map_x/map_y sont NULL) ──────────────────────
// Grille hexagonale sur viewBox 800×580

function defaultPosition(index: number, total: number): { x: number; y: number } {
  const cols = Math.ceil(Math.sqrt(total * 1.6));
  const col  = index % cols;
  const row  = Math.floor(index / cols);
  return {
    x: 60 + col * 88 + (row % 2) * 44,
    y: 60 + row * 76,
  };
}

// ─── CLUB DISPLAY ─────────────────────────────────────────────────────────────

// Couleurs stables par club — générées depuis le hash du slug
const CLUB_COLORS = [
  "#ef4444", "#3b82f6", "#a855f7", "#22c55e",
  "#f59e0b", "#06b6d4", "#f97316", "#ec4899",
];

function colorFromId(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return CLUB_COLORS[h % CLUB_COLORS.length];
}

export function toClubDisplay(club: Club): ClubDisplay {
  const displayName = club.name ?? "Club";
  const color = colorFromId(club.id);
  return {
    id:        club.id,
    name:      displayName,
    shortName: displayName.charAt(0).toUpperCase(),
    color,
    symbol:    displayName.charAt(0).toUpperCase(),
  };
}

// ─── WAR PROGRESS ─────────────────────────────────────────────────────────────

export function computeWarProgress(war: ClubWar): number {
  // Priorité : attacker_score vs defender_score (colonnes réelles DB)
  const scoreTotal = (war.attacker_score ?? 0) + (war.defender_score ?? 0);
  if (scoreTotal > 0) {
    return Math.round(((war.attacker_score ?? 0) / scoreTotal) * 100);
  }
  // Fallback : challenger_wins vs defender_wins
  const winsTotal = (war.challenger_wins ?? 0) + (war.defender_wins ?? 0);
  if (winsTotal > 0) {
    return Math.round(((war.challenger_wins ?? 0) / winsTotal) * 100);
  }
  return 50;
}

// ─── WAR PRIORITY ─────────────────────────────────────────────────────────────

export function computeWarPriority(war: ClubWar): { priority: WarPriority; seconds: number } {
  // Cas 1 : end_date renseigné → secondes restantes
  if (war.end_date) {
    const seconds = Math.max(
      0,
      Math.floor((new Date(war.end_date).getTime() - Date.now()) / 1000)
    );
    if (seconds < 120) return { priority: "critical", seconds };
    if (seconds < 360) return { priority: "high",     seconds };
    return { priority: "medium", seconds };
  }

  // Cas 2 : end_date NULL
  // Priorité par attacker_score + challenger_wins combinés
  const attackScore  = (war.attacker_score ?? 0) + (war.challenger_wins ?? 0) * 10;
  const defenseScore = (war.defender_score  ?? 0) + (war.defender_wins  ?? 0) * 10;
  const total        = attackScore + defenseScore;

  // Une guerre active avec des scores = high par défaut
  // Une guerre avec attaquant dominant = critical
  if (total === 0) return { priority: "high", seconds: 0 };
  const attackPct = (attackScore / total) * 100;
  if (attackPct >= 60) return { priority: "critical", seconds: 0 };
  return { priority: "high", seconds: 0 };
}

// ─── TO WAR VIEW MODEL ────────────────────────────────────────────────────────

/**
 * Convertit une ligne club_wars (avec jointures challenger, defender, territory)
 * en WarViewModel.
 *
 * Retourne null si la jointure territory est absente ou si le slug est vide.
 * Dans ce cas un warning dev est loggué avec les détails.
 */
export function toWarViewModel(
  war: ClubWar & {
    challenger: Club;
    defender:   Club;
    territory:  (ClubTerritory & { controlling_club: Club | null }) | null;
  }
): WarViewModel | null {
  const slug = war.territory?.slug?.toLowerCase().trim() ?? null;

  if (!slug) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[toWarViewModel] Guerre ${war.id} ignorée.`,
        "territory:", war.territory,
        "territory_id:", war.territory_id
      );
    }
    return null;
  }

  const { priority, seconds } = computeWarPriority(war);

  // La couleur et la position seront calculées dans buildTerritoryDisplays
  // On n'en a pas besoin ici — juste le slug suffit pour le matching
  return {
    id:            war.id,
    territoryId:   slug,
    territoryUuid: war.territory_id ?? "",
    territoryName: war.territory?.name?.toUpperCase() ?? slug.toUpperCase(),
    attacker:      toClubDisplay(war.challenger),
    defender:      toClubDisplay(war.defender),
    progress:      computeWarProgress(war),
    priority,
    seconds,
    raw:           war,
  };
}

// ─── BUILD TERRITORY DISPLAYS ─────────────────────────────────────────────────

/**
 * Construit les TerritoryDisplay pour le rendu SVG depuis les données DB.
 *
 * Chaque territoire reçoit :
 *   - un path SVG hexagonal centré sur (map_x, map_y) ou position par défaut
 *   - une couleur stable (hash du slug → index palette)
 *   - un état (critical/high/idle/conquered) croisé avec les guerres actives
 */
export function buildTerritoryDisplays(
  territories: (ClubTerritory & { controlling_club: Club | null })[],
  wars: WarViewModel[]
): TerritoryDisplay[] {
  // Index des guerres par slug pour lookup O(1)
  const warBySlug = new Map<string, WarViewModel>();
  wars.forEach((w) => warBySlug.set(w.territoryId, w));

  // Tri alphabétique pour que les couleurs soient stables entre renders
  const sorted = [...territories].sort((a, b) => a.slug.localeCompare(b.slug));
  const total  = sorted.length;

  if (process.env.NODE_ENV === "development") {
    console.debug(
      "[buildTerritoryDisplays]",
      `${total} territoires DB, ${wars.length} guerres actives`
    );
    wars.forEach((w) => {
      const found = sorted.some((t) => t.slug === w.territoryId);
      if (!found) {
        console.warn(
          `[buildTerritoryDisplays] Guerre ${w.id} : slug "${w.territoryId}" absent de club_territories`
        );
      }
    });
  }

  return sorted.map((t, index) => {
    const slug  = t.slug.toLowerCase().trim();
    const hash  = slugHash(slug);
    const color = colorForIndex(index);

    // Position : map_x/map_y DB en priorité, sinon grille par défaut
    const hasDBPosition = t.map_x != null && t.map_y != null;
    const cx = hasDBPosition ? t.map_x! : defaultPosition(index, total).x;
    const cy = hasDBPosition ? t.map_y! : defaultPosition(index, total).y;

    // Rayon hexagone : strategic_value influe sur la taille (30–55px)
    const r = 30 + Math.min(25, (t.strategic_value ?? 0) / 4);

    // État du territoire
    const war   = warBySlug.get(slug);
    const state: TerritoryState =
      war?.priority === "critical" ? "critical" :
      war?.priority === "high"     ? "high"     :
      t.controlling_club_id        ? "idle"     : "idle";

    return {
      id:                slug,
      name:              t.name.toUpperCase(),
      path:              hexPath(cx, cy, r, hash),
      labelX:            cx,
      labelY:            cy,
      color,
      state,
      controllingClubId: t.controlling_club_id ?? null,
    };
  });
}

// ─── EVENT VERB ───────────────────────────────────────────────────────────────

export function getEventVerb(type: "attack" | "defend" | "conquest"): string {
  switch (type) {
    case "attack":   return "attacked";
    case "defend":   return "defended";
    case "conquest": return "conquered";
  }
}
