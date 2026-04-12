"use client";

import { motion } from "framer-motion";
import { Flame, Shield, Zap } from "lucide-react";

import { BattleEvent } from "@/types/war";

interface EventFeedProps {
  events: BattleEvent[];
}

export default function EventFeed({ events }: EventFeedProps) {
  const doubled = [...events, ...events];

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-slate-950/96 backdrop-blur-2xl"
    >
      <div className="flex h-14 items-center">
        <div className="flex h-full shrink-0 items-center gap-2 border-r border-white/10 px-4">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.9)]" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
            Event feed
          </span>
        </div>

        <div className="flex-1 overflow-hidden">
          <motion.div
            className="flex items-center gap-8 whitespace-nowrap px-4"
            animate={{ x: [0, -1400] }}
            transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
          >
            {doubled.map((evt, index) => (
              <div key={`${evt.id}-${index}`} className="flex shrink-0 items-center gap-3">
                <span style={{ color: evt.clubColor }}>
                  {evt.type === "attack" ? (
                    <Flame className="h-4 w-4" />
                  ) : evt.type === "defend" ? (
                    <Shield className="h-4 w-4" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                </span>
                <span className="text-sm text-slate-300">
                  <strong style={{ color: evt.clubColor }}>{evt.clubName}</strong>
                  {evt.type === "attack" && " attacked "}
                  {evt.type === "defend" && " defended "}
                  {evt.type === "conquest" && " secured "}
                  <strong className="text-white">{evt.territoryName}</strong>
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
