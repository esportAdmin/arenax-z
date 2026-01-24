import { motion } from "framer-motion";
import { 
  Gamepad2, Radio, Calendar, CheckCircle,
  Swords, Target, Crosshair, Flame, Car, Bomb, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiLeagueoflegends, SiDota2, SiValorant } from "react-icons/si";

type GameFilter = 'all' | 'lol' | 'cs2' | 'valorant' | 'dota2' | 'rl' | 'pubg' | 'cod' | 'r6';
type StatusFilter = 'all' | 'live' | 'upcoming' | 'finished';

interface GameFilterBarProps {
  activeGame: GameFilter;
  onGameChange: (game: GameFilter) => void;
  activeStatus: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
}

const gameFilters: { id: GameFilter; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'all', label: 'ALL', icon: <Gamepad2 className="w-5 h-5" />, color: 'text-primary' },
  { id: 'lol', label: 'LoL', icon: <SiLeagueoflegends className="w-5 h-5" />, color: 'text-yellow-400' },
  { id: 'cs2', label: 'CS2', icon: <Crosshair className="w-5 h-5" />, color: 'text-orange-400' },
  { id: 'valorant', label: 'VAL', icon: <SiValorant className="w-5 h-5" />, color: 'text-red-400' },
  { id: 'dota2', label: 'DOTA2', icon: <SiDota2 className="w-5 h-5" />, color: 'text-red-500' },
  { id: 'rl', label: 'RL', icon: <Car className="w-5 h-5" />, color: 'text-blue-400' },
  { id: 'pubg', label: 'PUBG', icon: <Target className="w-5 h-5" />, color: 'text-yellow-500' },
  { id: 'cod', label: 'CoD', icon: <Bomb className="w-5 h-5" />, color: 'text-green-400' },
  { id: 'r6', label: 'R6', icon: <Shield className="w-5 h-5" />, color: 'text-blue-500' },
];

const statusFilters: { id: StatusFilter; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'Tous', icon: <Swords className="w-4 h-4" /> },
  { id: 'live', label: 'Live', icon: <Radio className="w-4 h-4" /> },
  { id: 'upcoming', label: 'À Venir', icon: <Calendar className="w-4 h-4" /> },
  { id: 'finished', label: 'Terminés', icon: <CheckCircle className="w-4 h-4" /> },
];

export const GameFilterBar = ({
  activeGame,
  onGameChange,
  activeStatus,
  onStatusChange
}: GameFilterBarProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
      {/* Game Icons Filter */}
      <div className="flex gap-1 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto">
        {gameFilters.map((game) => (
          <motion.button
            key={game.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onGameChange(game.id)}
            className={`relative flex items-center justify-center w-11 h-11 rounded-lg transition-all ${
              activeGame === game.id
                ? `bg-primary/20 ${game.color} border border-primary/50 neon-glow-primary`
                : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent'
            }`}
            title={game.label}
          >
            {game.icon}
            {activeGame === game.id && (
              <motion.div
                layoutId="activeGameIndicator"
                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Status Filter Pills */}
      <div className="flex gap-2">
        {statusFilters.map((status) => (
          <Button
            key={status.id}
            variant={activeStatus === status.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onStatusChange(status.id)}
            className={`gap-2 ${
              activeStatus === status.id 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {status.icon}
            {status.label}
            {status.id === 'live' && activeStatus === status.id && (
              <span className="relative flex h-2 w-2 ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
              </span>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};
