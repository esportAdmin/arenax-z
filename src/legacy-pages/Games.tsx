"use client";

import { motion } from "framer-motion";
import { TrendingUp, Gamepad2, ChevronRight, Sparkles } from "lucide-react";
import { AppLink } from "@/components/AppLink";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// URL de l'image Game Banner (DOTA 2 Cyberpunk Ascension)
const DOTA_BANNER_URL =
  "https://z-cdn-media.chatglm.cn/files/8f343635-7745-4080-8b38-fde0fd57ef1e.png?auth_key=1868236506-ddb85af4a3c4800b9e8404ac6033c30-0-da1745f23259ff5ac6f86a218d0ee728";

type GameItem = {
  id: string;
  name: string;
  fullName: string;
  activeMatches: number;
  upcoming: number;
  isFeatured?: boolean;
  event?: string;
  banner?: string;
  iconColor?: string;
  gradient?: string;
};

const gamesList: GameItem[] = [
  {
    id: "dota2",
    name: "DOTA 2",
    fullName: "Defense of the Ancients 2",
    activeMatches: 12,
    upcoming: 24,
    isFeatured: true,
    event: "Cyberpunk Ascension",
    banner: DOTA_BANNER_URL,
  },
  {
    id: "lol",
    name: "League of Legends",
    fullName: "League of Legends",
    activeMatches: 45,
    upcoming: 80,
    iconColor: "text-yellow-400",
    gradient: "from-blue-600 to-cyan-500",
  },
  {
    id: "cs2",
    name: "CS2",
    fullName: "Counter-Strike 2",
    activeMatches: 32,
    upcoming: 15,
    iconColor: "text-yellow-500",
    gradient: "from-orange-500 to-yellow-500",
  },
  {
    id: "valorant",
    name: "Valorant",
    fullName: "Valorant",
    activeMatches: 18,
    upcoming: 12,
    iconColor: "text-pink-500",
    gradient: "from-pink-600 to-rose-500",
  },
  {
    id: "rl",
    name: "Rocket League",
    fullName: "Rocket League",
    activeMatches: 8,
    upcoming: 4,
    iconColor: "text-blue-400",
    gradient: "from-blue-700 to-indigo-600",
  },
  {
    id: "r6",
    name: "Rainbow Six",
    fullName: "Rainbow Six Siege",
    activeMatches: 5,
    upcoming: 6,
    iconColor: "text-orange-400",
    gradient: "from-orange-600 to-red-700",
  },
];

const Games = () => {
  return (
    <div className="min-h-screen bg-background pb-12 relative overflow-hidden">
      {/* Background subtil */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="container-arena pt-6">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <Gamepad2 className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-display font-bold text-white">
              Game <span className="gradient-text-primary">Hub</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Select your arena and start predicting.
          </p>
        </motion.div>

        {/* Grille des Jeux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
          {gamesList.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${game.isFeatured ? "lg:col-span-2 lg:row-span-1 md:col-span-2" : ""}`}
            >
              <AppLink
                href={`/predictions?game=${game.id}`}
                className="block h-full"
              >
                {/* Design Spécial pour la carte Featured (DOTA 2) */}
                {game.isFeatured ? (
                  <div className="h-full rounded-xl relative overflow-hidden group border border-white/10 hover:border-primary/50 transition-all duration-500 shadow-2xl hover:shadow-[0_0_60px_rgba(139,92,246,0.4)] neon-border">
                    {/* Image de fond avec zoom animé */}
                    <motion.div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${game.banner})` }}
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    />

                    {/* Overlay avec effet de scan */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-black/60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Contenu */}
                    <div className="relative z-10 h-full flex flex-col justify-between p-8">
                      <div className="flex justify-between items-start">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Badge className="bg-primary/20 border border-primary/50 text-primary backdrop-blur-md flex items-center gap-2 neon-pulse">
                            <Sparkles className="w-3 h-3 animate-pulse" />
                            {game.event}
                          </Badge>
                        </motion.div>
                        <div className="flex gap-2">
                          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 backdrop-blur-md shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-1.5 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                            {game.activeMatches} Live
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <h2 className="text-5xl font-display font-black text-white mb-2 tracking-tighter drop-shadow-lg group-hover:drop-shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all duration-500">
                          {game.name}
                        </h2>
                        <p className="text-slate-300 max-w-md text-lg mb-6 drop-shadow-md">
                          Cyberpunk Ascension Season is LIVE. Join 50,000+ fans
                          competing.
                        </p>

                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant="hero"
                            size="lg"
                            className="gap-2 w-max group/btn relative overflow-hidden"
                          >
                            <span className="relative z-10 flex items-center gap-2">
                              Enter Arena
                              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </span>
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Design Standard pour les autres jeux avec effets néon */
                  <div className="game-card h-full p-6 backdrop-blur-xl group scan-effect">
                    {/* Fond dégradé animé au hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${
                        game.gradient || "from-gray-800 to-gray-900"
                      } opacity-0 group-hover:opacity-20 transition-opacity duration-700`}
                    />

                    {/* Effet de particules/lueur */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        {/* Icône avec effet néon au hover */}
                        <motion.div
                          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                          className={`w-14 h-14 rounded-lg bg-gradient-to-br ${
                            game.gradient || "from-slate-700 to-slate-800"
                          } flex items-center justify-center shadow-lg relative`}
                        >
                          <Gamepad2 className="w-8 h-8 text-white relative z-10" />
                          <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 neon-glow-primary" />
                        </motion.div>

                        {/* Badge Live avec pulse */}
                        <Badge
                          variant="secondary"
                          className="bg-green-500/10 text-green-400 border-green-500/20 flex items-center gap-1.5 group-hover:bg-green-500/20 transition-colors"
                        >
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                          {game.activeMatches} Live
                        </Badge>
                      </div>

                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-white mb-1 group-hover:gradient-text-primary transition-all duration-300">
                          {game.name}
                        </h2>
                        <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
                          {game.fullName}
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/5 group-hover:border-primary/30 transition-colors flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">
                            Upcoming
                          </span>
                          <span className="text-sm font-semibold text-white flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                            {game.upcoming} Matches
                          </span>
                        </div>

                        {/* Bouton avec effet néon */}
                        <motion.div
                          whileHover={{ x: 3 }}
                          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]"
                        >
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                )}
              </AppLink>
            </motion.div>
          ))}
        </div>

        {/* Bannière de suggestion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 glass-card p-8 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 neon-border"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-display font-bold text-white mb-2">
                Want to create a Club?
              </h3>
              <p className="text-muted-foreground">
                Gather your friends, compete against other clubs, and earn
                massive rewards.
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button variant="hero" size="lg" className="shrink-0">
                Create a Club
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Games;
