"use client";

import { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Users,
  Crown,
  Shield,
  ArrowLeft,
  Zap,
  Target,
  TrendingUp,
  Trophy,
  UserPlus,
  UserMinus,
  Check,
  X,
  Loader2,
  Settings,
  Clock,
  Award,
  Flame,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  useClubDetail,
  ClubActivity,
  JoinRequest,
} from "@/hooks/useClubDetail";
import { ClubMember } from "@/hooks/useClubs";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const roleConfig: Record<
  string,
  { label: string; icon: typeof Crown; color: string }
> = {
  owner: { label: "Propriétaire", icon: Crown, color: "text-amber-400" },
  admin: { label: "Admin", icon: Shield, color: "text-primary" },
  moderator: { label: "Modérateur", icon: Shield, color: "text-secondary" },
  member: { label: "Membre", icon: Users, color: "text-muted-foreground" },
};

const activityIcons: Record<string, typeof Trophy> = {
  member_joined: UserPlus,
  member_left: UserMinus,
  prediction_won: Trophy,
  prediction_lost: Target,
  level_up: TrendingUp,
  challenge_completed: Award,
};

function MemberRow({
  member,
  rank,
  isOwner,
  onRoleChange,
}: {
  member: ClubMember;
  rank: number;
  isOwner: boolean;
  onRoleChange: (memberId: string, role: string) => void;
}) {
  const role = roleConfig[member.role] || roleConfig.member;
  const RoleIcon = role.icon;
  const accuracy =
    member.predictions_count > 0
      ? Math.round((member.wins_count / member.predictions_count) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.05 }}
      className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors"
    >
      {/* Rank */}
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm",
          rank === 1 && "bg-amber-500/20 text-amber-400",
          rank === 2 && "bg-slate-400/20 text-slate-400",
          rank === 3 && "bg-orange-600/20 text-orange-500",
          rank > 3 && "bg-muted text-muted-foreground",
        )}
      >
        {rank}
      </div>

      {/* Avatar */}
      <Avatar className="w-10 h-10">
        <AvatarImage src={member.profile?.avatar_url || ""} />
        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
          {member.profile?.display_name?.charAt(0) || "?"}
        </AvatarFallback>
      </Avatar>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">
            {member.profile?.display_name ||
              member.profile?.username ||
              "Utilisateur"}
          </span>
          <RoleIcon className={cn("w-3 h-3", role.color)} />
        </div>
        <div className="text-xs text-muted-foreground">
          Niveau {member.profile?.current_level || 1}
        </div>
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-4 text-sm">
        <div className="text-center">
          <div className="font-display font-bold text-primary">
            {member.xp_contributed.toLocaleString()}
          </div>
          <div className="text-[10px] text-muted-foreground">XP</div>
        </div>
        <div className="text-center">
          <div className="font-display font-bold">
            {member.predictions_count}
          </div>
          <div className="text-[10px] text-muted-foreground">Pronos</div>
        </div>
        <div className="text-center">
          <div className="font-display font-bold text-emerald-500">
            {accuracy}%
          </div>
          <div className="text-[10px] text-muted-foreground">Précision</div>
        </div>
      </div>

      {/* Role selector (owner only) */}
      {isOwner && member.role !== "owner" && (
        <Select
          value={member.role}
          onValueChange={(value) => onRoleChange(member.id, value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="moderator">Modérateur</SelectItem>
            <SelectItem value="member">Membre</SelectItem>
          </SelectContent>
        </Select>
      )}
    </motion.div>
  );
}

function ActivityItem({ activity }: { activity: ClubActivity }) {
  const Icon = activityIcons[activity.activity_type] || Zap;

  return (
    <div className="flex items-start gap-3 p-3">
      <div className="p-2 rounded-lg bg-muted/50">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{activity.title}</span>
          {activity.xp_amount > 0 && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              +{activity.xp_amount} XP
            </Badge>
          )}
        </div>
        {activity.description && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {activity.description}
          </p>
        )}
        <p className="text-[10px] text-muted-foreground/60 mt-1">
          {formatDistanceToNow(new Date(activity.created_at), {
            addSuffix: true,
            locale: fr,
          })}
        </p>
      </div>
    </div>
  );
}

function JoinRequestCard({
  request,
  onApprove,
  onReject,
  isProcessing,
}: {
  request: JoinRequest;
  onApprove: () => void;
  onReject: () => void;
  isProcessing: boolean;
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
      <Avatar className="w-12 h-12">
        <AvatarImage src={request.profile?.avatar_url || ""} />
        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
          {request.profile?.display_name?.charAt(0) || "?"}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">
          {request.profile?.display_name ||
            request.profile?.username ||
            "Utilisateur"}
        </div>
        <div className="text-xs text-muted-foreground">
          Niveau {request.profile?.current_level || 1} •{" "}
          {formatDistanceToNow(new Date(request.created_at), {
            addSuffix: true,
            locale: fr,
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onReject}
          disabled={isProcessing}
        >
          <X className="w-4 h-4" />
        </Button>
        <Button size="sm" onClick={onApprove} disabled={isProcessing}>
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

export default function ClubDetail() {
  const router = useRouter();
  const params = useParams() as { slug?: string };
  const slug = params?.slug;

  const { user } = useAuth();

  const {
    club,
    members,
    activities,
    joinRequests,
    myMembership,
    loading,
    isAdmin,
    isOwner,
    approveRequest,
    rejectRequest,
    updateMemberRole,
  } = useClubDetail(slug);

  const [processingRequestId, setProcessingRequestId] = useState<string | null>(
    null,
  );

  const handleApprove = async (requestId: string) => {
    setProcessingRequestId(requestId);
    await approveRequest(requestId);
    setProcessingRequestId(null);
  };

  const handleReject = async (requestId: string) => {
    setProcessingRequestId(requestId);
    await rejectRequest(requestId);
    setProcessingRequestId(null);
  };

  const accuracy = useMemo(() => {
    if (!club) return 0;
    if (club.total_predictions <= 0) return 0;
    return Math.round((club.total_wins / club.total_predictions) * 100);
  }, [club]);

  if (!slug) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container-arena text-center py-20">
            <Users className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="font-display font-bold text-xl mb-2">
              Club non trouvé
            </h2>
            <p className="text-muted-foreground mb-4">
              Identifiant de club invalide.
            </p>
            <Button onClick={() => router.push("/clubs")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux clubs
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container-arena text-center py-20">
            <Users className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="font-display font-bold text-xl mb-2">
              Club non trouvé
            </h2>
            <p className="text-muted-foreground mb-4">
              Ce club n&apos;existe pas ou a été supprimé.
            </p>
            <Button onClick={() => router.push("/clubs")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux clubs
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container-arena">
          {/* Back button */}
          <Button
            variant="ghost"
            className="mb-6 gap-2"
            onClick={() => router.push("/clubs")}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux clubs
          </Button>

          {/* Club Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 mb-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Logo */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
                <span className="text-3xl font-display font-bold text-primary-foreground">
                  {club.name.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-display font-bold">
                    {club.name}
                  </h1>
                  {myMembership && (
                    <Badge
                      className={cn(
                        "gap-1",
                        roleConfig[myMembership.role]?.color,
                      )}
                    >
                      {roleConfig[myMembership.role]?.label}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">
                  {club.description || "Aucune description"}
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {club.member_count} membre{club.member_count > 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Créé{" "}
                    {formatDistanceToNow(new Date(club.created_at), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </span>
                </div>
              </div>

              {/* Admin Actions */}
              {isAdmin && (
                <Button variant="outline" className="gap-2">
                  <Settings className="w-4 h-4" />
                  Paramètres
                </Button>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border/50">
              <div className="text-center">
                <Zap className="w-5 h-5 mx-auto text-primary mb-1" />
                <div className="text-xl font-display font-bold">
                  {club.total_xp.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">XP Total</div>
              </div>
              <div className="text-center">
                <Target className="w-5 h-5 mx-auto text-accent mb-1" />
                <div className="text-xl font-display font-bold">
                  {club.total_predictions}
                </div>
                <div className="text-xs text-muted-foreground">Pronostics</div>
              </div>
              <div className="text-center">
                <Trophy className="w-5 h-5 mx-auto text-amber-400 mb-1" />
                <div className="text-xl font-display font-bold">
                  {club.total_wins}
                </div>
                <div className="text-xs text-muted-foreground">Victoires</div>
              </div>
              <div className="text-center">
                <TrendingUp className="w-5 h-5 mx-auto text-emerald-500 mb-1" />
                <div className="text-xl font-display font-bold">
                  {accuracy}%
                </div>
                <div className="text-xs text-muted-foreground">Précision</div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <Tabs defaultValue="members" className="space-y-6">
            <TabsList className="grid w-full max-w-lg grid-cols-3">
              <TabsTrigger value="members" className="gap-2">
                <Users className="w-4 h-4" />
                Membres
              </TabsTrigger>
              <TabsTrigger value="activity" className="gap-2">
                <Flame className="w-4 h-4" />
                Activité
              </TabsTrigger>
              {isAdmin && joinRequests.length > 0 && (
                <TabsTrigger value="requests" className="gap-2">
                  <UserPlus className="w-4 h-4" />
                  Demandes
                  <Badge
                    variant="destructive"
                    className="ml-1 px-1.5 py-0 text-[10px]"
                  >
                    {joinRequests.length}
                  </Badge>
                </TabsTrigger>
              )}
            </TabsList>

            {/* Members Tab */}
            <TabsContent value="members">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4"
              >
                <h3 className="font-display font-bold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Classement des membres
                </h3>
                <div className="space-y-1">
                  {members.map((member, index) => (
                    <MemberRow
                      key={member.id}
                      member={member}
                      rank={index + 1}
                      isOwner={isOwner || false}
                      onRoleChange={updateMemberRole}
                    />
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4"
              >
                <h3 className="font-display font-bold mb-4 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-primary" />
                  Activité récente
                </h3>
                {!user ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <LogIn className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Connectez-vous pour voir l&apos;activité</p>
                  </div>
                ) : !myMembership ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <LogIn className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Rejoignez le club pour voir l&apos;activité</p>
                  </div>
                ) : activities.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Aucune activité récente</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-1">
                      {activities.map((activity) => (
                        <ActivityItem key={activity.id} activity={activity} />
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </motion.div>
            </TabsContent>

            {/* Join Requests Tab (Admin only) */}
            {isAdmin && (
              <TabsContent value="requests">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-4"
                >
                  <h3 className="font-display font-bold mb-4 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-primary" />
                    Demandes d&apos;adhésion
                  </h3>
                  {joinRequests.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <UserPlus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Aucune demande en attente</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {joinRequests.map((request) => (
                        <JoinRequestCard
                          key={request.id}
                          request={request}
                          onApprove={() => handleApprove(request.id)}
                          onReject={() => handleReject(request.id)}
                          isProcessing={processingRequestId === request.id}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
