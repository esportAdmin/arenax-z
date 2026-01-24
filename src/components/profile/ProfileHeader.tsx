import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Edit2, Trophy, Target, Flame, Star, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";

interface ProfileHeaderProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
}

export function ProfileHeader({ profile, onUpdateProfile }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile.display_name || "");
  const [username, setUsername] = useState(profile.username || "");
  const { toast } = useToast();

  const handleSave = async () => {
    const { error } = await onUpdateProfile({
      display_name: displayName,
      username: username,
    });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profil mis à jour",
        description: "Vos modifications ont été enregistrées",
      });
      setIsEditing(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Lien copié",
      description: "Le lien de votre profil a été copié dans le presse-papier",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 lg:p-8"
    >
      <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
        {/* Avatar Section */}
        <div className="relative group">
          <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl lg:text-5xl font-display font-bold text-primary-foreground overflow-hidden">
            {profile.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            ) : (
              profile.display_name?.charAt(0).toUpperCase() || "U"
            )}
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {/* Info Section */}
        <div className="flex-1 space-y-4">
          {isEditing ? (
            <div className="space-y-3">
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Nom d'affichage"
                className="text-xl font-display font-bold"
              />
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="@username"
              />
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm">
                  Enregistrer
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditing(false)}
                >
                  Annuler
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl lg:text-3xl font-display font-bold">
                  {profile.display_name || "Utilisateur"}
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
              {profile.username && (
                <p className="text-muted-foreground">@{profile.username}</p>
              )}
            </>
          )}

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="font-display font-bold">{profile.arena_score.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">Score</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/30">
              <Target className="w-4 h-4 text-accent" />
              <span className="font-display font-bold">{profile.prediction_accuracy?.toFixed(1) || 0}%</span>
              <span className="text-xs text-muted-foreground">Précision</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <Flame className="w-4 h-4 text-amber-500" />
              <span className="font-display font-bold">{profile.active_streak}</span>
              <span className="text-xs text-muted-foreground">Série</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Partager
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
