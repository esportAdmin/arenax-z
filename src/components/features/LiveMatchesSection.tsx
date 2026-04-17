"use client";

import { motion } from "framer-motion";
import { TeamLogo } from "@/components/ui/team-logo";
import { Clock, TrendingUp, ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLink } from "@/components/AppLink";
import { useMatches } from "@/hooks/useMatches";

export function LiveMatchesSection() {
  const { matches, loading, refetch } = useMatches({ refreshInterval: 60000 });

  // Show only first 3 matches for the homepage preview
  const displayMatches = matches.slice(0, 3);

  return (
    <section className="py-24 relative bg-card/30">
      <div className="container-arena">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-2">
              <span className="text-foreground">Live </span>
              <span className="gradient-text-accent">Match Calls</span>
            </h2>
            <p className="text-muted-foreground">
              Track the live board, log your calls, and stay close to the next momentum shift
            </p>
          </div>

          <Button asChild variant="outline" className="gap-2">
            <AppLink href="/live-calls">
              View All Calls
              <ChevronRight className="w-4 h-4" />
            </AppLink>
          </Button>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {/* Matches Grid */}
        {!loading && displayMatches.length > 0 && (
          <div className="space-y-4">
            {displayMatches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="glass-card-hover p-4 lg:p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Match Info */}
                  <div className="flex items-center gap-4 flex-1">
                    {/* Team A */}
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                        <TeamLogo name={match.teamA.name} logo={match.teamA.logo} size={48} className="bg-white/10" />
                      </div>
                      <div>
                        <div className="font-display font-bold">
                          {match.teamA.name}
                        </div>
                        <div className="text-sm text-primary font-semibold">
                          {match.teamA.signalScore} signal
                        </div>
                      </div>
                    </div>

                    {/* VS / Score */}
                    <div className="flex flex-col items-center gap-1 px-4">
                      {match.isLive ? (
                        <>
                          <span className="px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-xs font-semibold uppercase animate-pulse">
                            Live
                          </span>
                          {match.mapScore && (
                            <span className="font-display font-bold text-sm">
                              {match.mapScore.teamA} - {match.mapScore.teamB}
                            </span>
                          )}
                        </>
                      ) : match.isFinished ? (
                        <>
                          <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-semibold uppercase">
                            Finished
                          </span>
                          {match.mapScore && (
                            <span className="font-display font-bold text-sm">
                              {match.mapScore.teamA} - {match.mapScore.teamB}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-muted-foreground font-display font-bold">
                          VS
                        </span>
                      )}
                    </div>

                    {/* Team B */}
                    <div className="flex items-center gap-3 flex-1 justify-end text-right">
                      <div>
                        <div className="font-display font-bold">
                          {match.teamB.name}
                        </div>
                        <div className="text-sm text-primary font-semibold">
                          {match.teamB.signalScore} signal
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                        <TeamLogo name={match.teamB.name} logo={match.teamB.logo} size={48} className="bg-white/10" />
                      </div>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-6 lg:border-l border-border/50 lg:pl-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {match.date}, {match.time}
                      </div>
                      <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {match.tournament}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 text-right">
                      <div className="flex items-center gap-1 text-xs text-accent">
                        <TrendingUp className="w-3 h-3" />
                        Activity
                      </div>
                      <div className="text-sm font-display font-bold">
                        {match.totalLocked.toLocaleString()} ARENA
                      </div>
                    </div>

                    <Button
                      asChild
                      variant="hero"
                      size="sm"
                      disabled={match.isFinished}
                    >
              <AppLink href="/live-calls">
                        {match.isFinished ? "Completed" : "Open Call"}
                      </AppLink>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && displayMatches.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground mb-4">
              No live calls available at the moment
            </p>
            <Button onClick={refetch} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
