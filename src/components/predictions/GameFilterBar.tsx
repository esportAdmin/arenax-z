import { motion } from "framer-motion";
import {
  Bomb,
  Calendar,
  Car,
  CheckCircle,
  Crosshair,
  Gamepad2,
  Radio,
  Shield,
  Swords,
  Target,
} from "lucide-react";
import { SiDota2, SiLeagueoflegends, SiValorant } from "react-icons/si";
import { CountdownPill } from "@/components/engagement/CountdownPill";
import { Button } from "@/components/ui/button";
import { getHoursFromNow } from "@/lib/countdown";

type GameFilter =
  | "all"
  | "lol"
  | "cs2"
  | "valorant"
  | "dota2"
  | "rl"
  | "pubg"
  | "cod"
  | "r6";
type StatusFilter = "all" | "live" | "upcoming" | "finished";

interface GameFilterBarProps {
  activeGame: GameFilter;
  onGameChange: (game: GameFilter) => void;
  activeStatus: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
}

const gameFilters: {
  id: GameFilter;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  { id: "all", label: "All", icon: <Gamepad2 className="h-5 w-5" />, color: "text-cyan-300" },
  { id: "lol", label: "LoL", icon: <SiLeagueoflegends className="h-5 w-5" />, color: "text-yellow-400" },
  { id: "cs2", label: "CS2", icon: <Crosshair className="h-5 w-5" />, color: "text-orange-400" },
  { id: "valorant", label: "VAL", icon: <SiValorant className="h-5 w-5" />, color: "text-red-400" },
  { id: "dota2", label: "Dota 2", icon: <SiDota2 className="h-5 w-5" />, color: "text-red-500" },
  { id: "rl", label: "RL", icon: <Car className="h-5 w-5" />, color: "text-blue-400" },
  { id: "pubg", label: "PUBG", icon: <Target className="h-5 w-5" />, color: "text-yellow-500" },
  { id: "cod", label: "CoD", icon: <Bomb className="h-5 w-5" />, color: "text-green-400" },
  { id: "r6", label: "R6", icon: <Shield className="h-5 w-5" />, color: "text-blue-500" },
];

const statusFilters: {
  id: StatusFilter;
  label: string;
  icon: React.ReactNode;
}[] = [
  { id: "all", label: "All matches", icon: <Swords className="h-4 w-4" /> },
  { id: "live", label: "Live only", icon: <Radio className="h-4 w-4" /> },
  { id: "upcoming", label: "Upcoming", icon: <Calendar className="h-4 w-4" /> },
  { id: "finished", label: "Finished", icon: <CheckCircle className="h-4 w-4" /> },
];

export const GameFilterBar = ({
  activeGame,
  onGameChange,
  activeStatus,
  onStatusChange,
}: GameFilterBarProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-300">
          Narrow the slate until the next best action feels obvious.
        </div>
        <CountdownPill label="Slate pulse" target={getHoursFromNow(3)} tone="amber" />
      </div>

      <div className="flex flex-wrap gap-2">
        {gameFilters.map((game) => (
          <motion.button
            key={game.id}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onGameChange(game.id)}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all ${
              activeGame === game.id
                ? `border-cyan-400/30 bg-cyan-400/10 ${game.color} shadow-[0_0_22px_rgba(34,211,238,0.12)]`
                : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
            }`}
          >
            {game.icon}
            <span className="font-medium">{game.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {statusFilters.map((status) => (
          <Button
            key={status.id}
            variant={activeStatus === status.id ? "default" : "outline"}
            size="sm"
            onClick={() => onStatusChange(status.id)}
            className="gap-2"
          >
            {status.icon}
            {status.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
