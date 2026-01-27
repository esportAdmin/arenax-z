// src/components/ui/game-logo.tsx
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export interface GameLogo {
  id: string;
  name: string;
  logoUrl: string;
  slug: string;
}

export const GAME_LOGOS: Record<string, GameLogo> = {
  lol: {
    id: "1",
    name: "League of Legends",
    logoUrl: "https://cdn.pandascore.co/images/league-of-legends.png",
    slug: "league-of-legends",
  },
  dota2: {
    id: "3",
    name: "Dota 2",
    logoUrl: "https://cdn.pandascore.co/images/dota-2.png",
    slug: "dota-2",
  },
  cs2: {
    id: "4",
    name: "CS2",
    logoUrl: "https://cdn.pandascore.co/images/cs-go.png",
    slug: "cs-go",
  },
  valorant: {
    id: "23",
    name: "Valorant",
    logoUrl: "https://cdn.pandascore.co/images/valorant.png",
    slug: "valorant",
  },
};

/**
 * normalizeGameKey
 *
 * @example
 * normalizeGameKey("CS:GO"); // "cs2"
 */
export function normalizeGameKey(game: string): string {
  const g = (game ?? "").trim().toLowerCase();

  if (
    g === "cs:go" ||
    g === "csgo" ||
    g === "cs2" ||
    g === "counter-strike 2" ||
    g === "counter strike 2"
  ) {
    return "cs2";
  }
  if (g === "dota 2" || g === "dota2") return "dota2";
  if (g === "league of legends" || g === "lol" || g === "league") return "lol";
  if (g === "valorant") return "valorant";

  return g;
}

/**
 * getGameLogo
 *
 * @example
 * getGameLogo("CS2")?.logoUrl;
 */
export function getGameLogo(game: string): GameLogo | null {
  const key = normalizeGameKey(game);
  return GAME_LOGOS[key] ?? null;
}

export function GameIcon({
  game,
  size = 14,
  className,
}: {
  game: string;
  size?: number;
  className?: string;
}) {
  const logo = getGameLogo(game);
  if (!logo) return null;

  return (
    <Image
      src={logo.logoUrl}
      alt={`${logo.name} logo`}
      width={size}
      height={size}
      className={className ?? "h-auto w-auto"}
    />
  );
}

export function GameBadge({
  game,
  className,
}: {
  game: string;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={
        "inline-flex items-center gap-2 border-white/20 bg-white/5 text-white/80 " +
        (className ?? "")
      }
    >
      <GameIcon game={game} size={14} className="opacity-90" />
      <span className="text-xs font-medium">{game}</span>
    </Badge>
  );
}
