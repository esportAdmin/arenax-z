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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useClubs, Club } from "@/hooks/useClubs";
import { useAuth } from "@/contexts/AuthContext";
import { ClubLeaderboard } from "@/components/clubs/ClubLeaderboard";
import { ClubWars } from "@/components/clubs/ClubWars";
import { ClubChallenges } from "@/components/clubs/ClubChallenges";
import { ClubChatFull } from "@/components/clubs/ClubChat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useAppNavigate } from "@/hooks/useAppNavigate";

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
  const accuracy =
    club.total_predictions > 0
      ? Math.round((club.total_wins / club.total_predictions) * 100)
      : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 hover:border-primary/30 transition-all group"
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shrink-0">
          <span className="text-xl font-display font-bold text-primary-foreground">
            {club.name.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold truncate">{club.name}</h3>
            {!club.is_public && (
              <Lock className="w-3 h-3 text-muted-foreground" />
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {club.description || "Aucune description"}
          </p>

          <div className="flex items-center gap-4 mt-3 text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>
                {club.member_count}/{club.max_members}
              </span>
            </div>
            <div className="flex items-center gap-1 text-primary">
              <Zap className="w-3 h-3" />
              <span>{club.total_xp.toLocaleString()} XP</span>
            </div>
            <div className="flex items-center gap-1 text-accent">
              <Target className="w-3 h-3" />
              <span>{accuracy}%</span>
            </div>
          </div>
        </div>

        <div className="shrink-0">
          {isMember ? (
            <Badge variant="outline" className="border-primary/30 text-primary">
              Membre
            </Badge>
          ) : (
            <Button
              size="sm"
              onClick={onJoin}
              disabled={isJoining || club.member_count >= club.max_members}
            >
              {isJoining ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : club.member_count >= club.max_members ? (
                "Complet"
              ) : (
                "Rejoindre"
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
  const accuracy =
    club.total_predictions > 0
      ? Math.round((club.total_wins / club.total_predictions) * 100)
      : 0;

  const roleLabels: Record<string, { label: string; icon: typeof Crown }> = {
    owner: { label: "Propriétaire", icon: Crown },
    admin: { label: "Admin", icon: Shield },
    moderator: { label: "Modérateur", icon: Shield },
    member: { label: "Membre", icon: Users },
  };

  const roleInfo = roleLabels[membership.role] || roleLabels.member;
  const RoleIcon = roleInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 border-primary/30"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-lg flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Mon Club
        </h3>
        <Badge className="bg-primary/20 text-primary border-primary/30 gap-1">
          <RoleIcon className="w-3 h-3" />
          {roleInfo.label}
        </Badge>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
          <span className="text-2xl font-display font-bold text-primary-foreground">
            {club.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h4 className="font-display font-bold text-xl">{club.name}</h4>
          <p className="text-sm text-muted-foreground">
            {club.member_count} membre{club.member_count > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-muted/30 text-center">
          <Zap className="w-4 h-4 mx-auto text-primary mb-1" />
          <div className="text-lg font-display font-bold">
            {club.total_xp.toLocaleString()}
          </div>
          <div className="text-[10px] text-muted-foreground">XP Total</div>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 text-center">
          <Target className="w-4 h-4 mx-auto text-accent mb-1" />
          <div className="text-lg font-display font-bold">
            {club.total_predictions}
          </div>
          <div className="text-[10px] text-muted-foreground">Pronostics</div>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 text-center">
          <TrendingUp className="w-4 h-4 mx-auto text-emerald-500 mb-1" />
          <div className="text-lg font-display font-bold">{accuracy}%</div>
          <div className="text-[10px] text-muted-foreground">Précision</div>
        </div>
      </div>

      <Button className="w-full gap-2" onClick={onViewClub}>
        Voir le club
        <ChevronRight className="w-4 h-4" />
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

      <main className="pt-24 pb-16">
        <div className="container-arena">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              <Users className="w-3 h-3 mr-1" />
              Clubs
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Rejoignez un <span className="gradient-text-primary">Club</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Créez ou rejoignez un club pour compétitionner en équipe et
              grimper dans le classement ensemble.
            </p>
          </motion.div>

          <Tabs defaultValue="clubs" className="w-full">
            <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-5 mb-6">
              <TabsTrigger value="clubs" className="gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Clubs</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="gap-2" disabled={!myClub}>
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="challenges" className="gap-2">
                <Target className="w-4 h-4" />
                <span className="hidden sm:inline">Défis</span>
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="gap-2">
                <Trophy className="w-4 h-4" />
                <span className="hidden sm:inline">Classement</span>
              </TabsTrigger>
              <TabsTrigger value="wars" className="gap-2">
                <Swords className="w-4 h-4" />
                <span className="hidden sm:inline">Guerres</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="clubs">
              <div className="grid lg:grid-cols-3 gap-6">
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
                      <Users className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                      <h3 className="font-display font-bold mb-2">
                        Pas encore de club ?
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Créez votre propre club ou rejoignez-en un existant !
                      </p>
                      <Button
                        className="w-full gap-2"
                        onClick={() => setShowCreateDialog(true)}
                        disabled={!user}
                      >
                        <Plus className="w-4 h-4" />
                        Créer un club
                      </Button>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-4"
                  >
                    <h4 className="font-display font-bold text-sm mb-3">
                      Statistiques
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Clubs actifs
                        </span>
                        <span className="font-medium">{clubs.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Total membres
                        </span>
                        <span className="font-medium">
                          {clubs.reduce((sum, c) => sum + c.member_count, 0)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative"
                  >
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un club..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </motion.div>

                  {loading ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : filteredClubs.length === 0 ? (
                    <div className="text-center py-20">
                      <Users className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                      <h3 className="font-display font-bold text-xl mb-2">
                        Aucun club trouvé
                      </h3>
                      <p className="text-muted-foreground">
                        {searchQuery
                          ? "Essayez une autre recherche"
                          : "Soyez le premier à créer un club !"}
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
                <div className="text-center py-20 text-muted-foreground">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="font-medium">
                    Rejoignez un club pour accéder au chat
                  </p>
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
            <DialogTitle className="font-display flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Créer un club
            </DialogTitle>
            <DialogDescription>
              Créez votre propre club et invitez d'autres joueurs à vous
              rejoindre.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="club-name">Nom du club</Label>
              <Input
                id="club-name"
                placeholder="Ex: Les Champions"
                value={newClubName}
                onChange={(e) => setNewClubName(e.target.value)}
                maxLength={30}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="club-description">Description (optionnel)</Label>
              <Textarea
                id="club-description"
                placeholder="Décrivez votre club..."
                value={newClubDescription}
                onChange={(e) => setNewClubDescription(e.target.value)}
                maxLength={200}
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2">
                {newClubPublic ? (
                  <Globe className="w-4 h-4 text-primary" />
                ) : (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                )}
                <div>
                  <div className="text-sm font-medium">
                    {newClubPublic ? "Club public" : "Club privé"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {newClubPublic
                      ? "Tout le monde peut rejoindre"
                      : "Approbation requise"}
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
              Annuler
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!newClubName.trim() || isCreating}
              className="gap-2"
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
