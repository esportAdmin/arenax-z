import { useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Edit2,
  Flame,
  Share2,
  ShieldCheck,
  Target,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "@/hooks/useProfile";

interface ProfileHeaderProps {
  profile: UserProfile;
  onUpdateProfile: (
    updates: Partial<UserProfile>,
  ) => Promise<{ error: Error | null }>;
}

export function ProfileHeader({
  profile,
  onUpdateProfile,
}: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile.display_name || "");
  const [username, setUsername] = useState(profile.username || "");
  const { toast } = useToast();

  const handleSave = async () => {
    const { error } = await onUpdateProfile({
      display_name: displayName,
      username,
    });

    if (error) {
      toast({
        title: "Update failed",
        description: "We couldn't update your profile right now.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Profile updated",
      description: "Your changes have been saved.",
    });
    setIsEditing(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Your profile link is now in the clipboard.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="command-frame hero-sheen overflow-hidden p-5 sm:p-6 lg:p-8"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="group relative">
          <div className="absolute inset-[-0.6rem] rounded-[2rem] bg-gradient-to-br from-cyan-400/25 via-transparent to-orange-400/20 blur-xl" />
          <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-[1.35rem] border border-cyan-300/25 bg-gradient-to-br from-primary to-secondary text-4xl font-display font-bold text-primary-foreground shadow-[0_0_34px_rgba(34,211,238,0.18)] lg:h-32 lg:w-32 lg:text-5xl">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              profile.display_name?.charAt(0).toUpperCase() || "U"
            )}
          </div>
          <button className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/25 bg-slate-950 text-cyan-100 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100">
            <Camera className="h-4 w-4" />
          </button>
        </div>

        <div className="min-w-0 flex-1 space-y-4">
          {isEditing ? (
            <div className="space-y-3">
              <Input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Display name"
                className="min-h-12 text-xl font-display font-bold"
              />
              <Input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="@username"
                className="min-h-12"
              />
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button onClick={handleSave} size="sm" className="min-h-10 rounded-full px-5">
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="min-h-10 rounded-full px-5"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="min-w-0 max-w-full truncate text-2xl font-display font-bold lg:text-3xl">
                  {profile.display_name || "User"}
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-xl"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
              {profile.username && (
                <p className="truncate text-muted-foreground">@{profile.username}</p>
              )}
            </>
          )}

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex min-h-12 items-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 px-3 py-2">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="min-w-0 truncate font-display font-bold">
                {profile.arena_score.toLocaleString("en-US")}
              </span>
              <span className="text-xs text-muted-foreground">Prestige</span>
            </div>
            <div className="flex min-h-12 items-center gap-2 rounded-2xl border border-accent/30 bg-accent/10 px-3 py-2">
              <Target className="h-4 w-4 text-accent" />
              <span className="min-w-0 truncate font-display font-bold">
                {profile.signal_accuracy?.toFixed(1) || 0}%
              </span>
              <span className="text-xs text-muted-foreground">Signal</span>
            </div>
            <div className="flex min-h-12 items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-3 py-2">
              <Flame className="h-4 w-4 text-amber-500" />
              <span className="min-w-0 truncate font-display font-bold">
                {profile.active_streak}
              </span>
              <span className="text-xs text-muted-foreground">Streak</span>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-slate-300">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" />
            <span>
              Your profile turns daily activity into public identity: progression,
              streaks, badges, and shareable status in one place.
            </span>
          </div>
        </div>

        <div className="flex gap-2 lg:self-start">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="min-h-10 w-full rounded-full px-5 sm:w-auto"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
