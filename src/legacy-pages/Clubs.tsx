"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Plus,
  Search,
  Crown,
  Shield,
  Lock,
  Globe,
  TrendingUp,
  Target,
  Zap,
  Loader2,
  ChevronRight,
  Trophy,
  Swords,
  MessageCircle,
} from "lucide-react";

import { ClubLeaderboard } from "@/components/clubs/ClubLeaderboard2";
import { ClubChallenges } from "@/components/clubs/ClubChallenges";
import { ClubChatFull } from "@/components/clubs/ClubChat";
import { ClubWars } from "@/components/clubs/ClubWars";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { Club, useClubs } from "@/hooks/useClubs";

function ClubCard({
  club,
  onJoin,
  isMember,
  isJoining,
}: {
  club: Club;
  onJoin: () => void;
  isMember: boolean;
  isJoining: boolean;
}) {
  const callAccuracy =
    club.total_predictions > 0
      ? Math.round((club.total_wins / club.total_predictions) * 100)
      : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card group p-5 transition-all hover:border-primary/30"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-secondary to-accent">
          <span className="text-xl font-bold text-primary-foreground">
            {club.name.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-bold">{club.name}</h3>
            {!club.is_public && (
              <Lock className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {club.description || "No description available"}
          </p>

          <div className="mt-3 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>
                {club.member_count}/{club.max_members}
              </span>
            </div>
            <div className="flex items-center gap-1 text-primary">
              <Zap className="h-3 w-3" />
              <span>{club.total_xp.toLocaleString()} XP</span>
            </div>
            <div className="flex items-center gap-1 text-accent">
              <Target className="h-3 w-3" />
              <span>{callAccuracy}%</span>
            </div>
          </div>
        </div>

        <div className="shrink-0">
          {isMember ? (
            <Badge variant="outline" className="border-primary/30 text-primary">
              Member
            </Badge>
          ) : (
            <Button
              size="sm"
              onClick={onJoin}
              disabled={isJoining || club.member_count >= club.max_members}
            >
              {isJoining ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : club.member_count >= club.max_members ? (
                "Full"
              ) : (
                "Join"
              )}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function MyClubCard({
  club,
  membership,
  onViewClub,
}: {
  club: Club;
  membership: any;
  onViewClub: () => void;
}) {
  const callAccuracy =
    club.total_predictions > 0
      ? Math.round((club.total_wins / club.total_predictions) * 100)
      : 0;

  const roleLabels: Record<string, { label: string; icon: typeof Crown }> = {
    owner: { label: "Owner", icon: Crown },
    admin: { label: "Admin", icon: Shield },
    moderator: { label: "Moderator", icon: Shield },
    member: { label: "Member", icon: Users },
  };

  const roleInfo = roleLabels[membership.role] || roleLabels.member;
  const RoleIcon = roleInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card border-primary/30 p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold">
          <Users className="h-5 w-5 text-primary" />
          My Club
        </h3>
        <Badge className="gap-1 border-primary/30 bg-primary/20 text-primary">
          <RoleIcon className="h-3 w-3" />
          {roleInfo.label}
        </Badge>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-secondary to-accent">
          <span className="text-2xl font-bold text-primary-foreground">
            {club.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h4 className="text-xl font-bold">{club.name}</h4>
          <p className="text-sm text-muted-foreground">
            {club.member_count} member{club.member_count > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-muted/30 p-3 text-center">
          <Zap className="mx-auto mb-1 h-4 w-4 text-primary" />
          <div className="text-lg font-bold">{club.total_xp.toLocaleString()}</div>
          <div className="text-[10px] text-muted-foreground">Total XP</div>
        </div>
        <div className="rounded-lg bg-muted/30 p-3 text-center">
          <Target className="mx-auto mb-1 h-4 w-4 text-accent" />
          <div className="text-lg font-bold">{club.total_predictions}</div>
          <div className="text-[10px] text-muted-foreground">Live Calls</div>
        </div>
        <div className="rounded-lg bg-muted/30 p-3 text-center">
          <TrendingUp className="mx-auto mb-1 h-4 w-4 text-emerald-500" />
          <div className="text-lg font-bold">{callAccuracy}%</div>
          <div className="text-[10px] text-muted-foreground">Read Rate</div>
        </div>
      </div>

      <Button className="w-full gap-2" onClick={onViewClub}>
        View club
        <ChevronRight className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}

export default function Clubs() {
  const navigate = useAppNavigate();
  const { user } = useAuth();
  const { clubs, myClub, myMembership, loading, createClub, joinClub } =
    useClubs();

  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [joiningClubId, setJoiningClubId] = useState<string | null>(null);
  const [newClubName, setNewClubName] = useState("");
  const [newClubDescription, setNewClubDescription] = useState("");
  const [newClubPublic, setNewClubPublic] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const filteredClubs = clubs.filter(
    (club) =>
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleJoin = async (clubId: string) => {
    setJoiningClubId(clubId);
    await joinClub(clubId);
    setJoiningClubId(null);
  };

  const handleCreate = async () => {
    if (!newClubName.trim()) return;

    setIsCreating(true);
    const result = await createClub(
      newClubName,
      newClubDescription,
      newClubPublic,
    );
    setIsCreating(false);

    if (result.success) {
      setShowCreateDialog(false);
      setNewClubName("");
      setNewClubDescription("");
      setNewClubPublic(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pb-16 pt-24">
        <div className="container-arena">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <Badge className="mb-4 border-primary/30 bg-primary/20 text-primary">
              <Users className="mr-1 h-3 w-3" />
              Clubs
            </Badge>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Join a <span className="gradient-text-primary">Club</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Create or join a club to compete as a team and climb the rankings
              together.
            </p>
          </motion.div>

          <Tabs defaultValue="clubs" className="w-full">
            <TabsList className="mx-auto mb-6 grid w-full max-w-3xl grid-cols-5">
              <TabsTrigger value="clubs" className="gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Clubs</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="gap-2" disabled={!myClub}>
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="challenges" className="gap-2">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Challenges</span>
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="gap-2">
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">Leaderboard</span>
              </TabsTrigger>
              <TabsTrigger value="wars" className="gap-2">
                <Swords className="h-4 w-4" />
                <span className="hidden sm:inline">Wars</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="clubs">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6">
                  {myClub && myMembership ? (
                    <MyClubCard
                      club={myClub}
                      membership={myMembership}
                      onViewClub={() => navigate(`/clubs/${myClub.slug}`)}
                    />
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card p-6 text-center"
                    >
                      <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
                      <h3 className="mb-2 font-bold">No club yet?</h3>
                      <p className="mb-4 text-sm text-muted-foreground">
                        Create your own club or join an existing one.
                      </p>
                      <Button
                        className="w-full gap-2"
                        onClick={() => setShowCreateDialog(true)}
                        disabled={!user}
                      >
                        <Plus className="h-4 w-4" />
                        Create a club
                      </Button>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-4"
                  >
                    <h4 className="mb-3 text-sm font-bold">Stats</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Active clubs</span>
                        <span className="font-medium">{clubs.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total members</span>
                        <span className="font-medium">
                          {clubs.reduce((sum, club) => sum + club.member_count, 0)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="space-y-4 lg:col-span-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative"
                  >
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search for a club..."
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      className="pl-10"
                    />
                  </motion.div>

                  {loading ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : filteredClubs.length === 0 ? (
                    <div className="py-20 text-center">
                      <Users className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
                      <h3 className="mb-2 text-xl font-bold">No clubs found</h3>
                      <p className="text-muted-foreground">
                        {searchQuery
                          ? "Try a different search"
                          : "Be the first to create a club."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredClubs.map((club, index) => (
                        <motion.div
                          key={club.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                        >
                          <ClubCard
                            club={club}
                            onJoin={() => handleJoin(club.id)}
                            isMember={myClub?.id === club.id}
                            isJoining={joiningClubId === club.id}
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="chat">
              {myClub ? (
                <ClubChatFull clubId={myClub.id} clubName={myClub.name} />
              ) : (
                <div className="py-20 text-center text-muted-foreground">
                  <MessageCircle className="mx-auto mb-4 h-16 w-16 opacity-30" />
                  <p className="font-medium">Join a club to unlock chat</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="challenges">
              <ClubChallenges />
            </TabsContent>

            <TabsContent value="leaderboard">
              <ClubLeaderboard />
            </TabsContent>

            <TabsContent value="wars">
              <ClubWars />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="glass-card border-border/50 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Create a club
            </DialogTitle>
            <DialogDescription>
              Launch your own club and invite other players to join.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="club-name">Club name</Label>
              <Input
                id="club-name"
                placeholder="Example: Alpha Kings"
                value={newClubName}
                onChange={(event) => setNewClubName(event.target.value)}
                maxLength={30}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="club-description">Description (optional)</Label>
              <Textarea
                id="club-description"
                placeholder="Describe your club..."
                value={newClubDescription}
                onChange={(event) => setNewClubDescription(event.target.value)}
                maxLength={200}
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
              <div className="flex items-center gap-2">
                {newClubPublic ? (
                  <Globe className="h-4 w-4 text-primary" />
                ) : (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                )}
                <div>
                  <div className="text-sm font-medium">
                    {newClubPublic ? "Public club" : "Private club"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {newClubPublic
                      ? "Anyone can join"
                      : "Approval required"}
                  </div>
                </div>
              </div>
              <Switch
                checked={newClubPublic}
                onCheckedChange={setNewClubPublic}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!newClubName.trim() || isCreating}
              className="gap-2"
            >
              {isCreating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
