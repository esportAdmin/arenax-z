"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { LevelProgress } from "@/components/profile/LevelProgress";
import { LevelUpCelebration } from "@/components/profile/LevelUpCelebration";
import { PredictionHistory } from "@/components/profile/PredictionHistory";
import { ProfileBadges } from "@/components/profile/ProfileBadges";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useLevelUp } from "@/hooks/useLevelUp";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppNavigate } from "@/hooks/useAppNavigate";

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useAppNavigate();
  const {
    profile,
    userBadges,
    predictions,
    loading,
    xpForNextLevel,
    updateProfile,
  } = useProfile();

  const {
    showCelebration,
    celebrationLevel,
    closeCelebration,
    triggerCelebration,
  } = useLevelUp({
    currentLevel: profile?.current_level ?? 1,
    enabled: !!profile,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-12">
          <div className="container-arena text-center py-20">
            <p className="text-muted-foreground">Profil non trouvé</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <LevelUpCelebration
        isVisible={showCelebration}
        newLevel={celebrationLevel}
        onComplete={closeCelebration}
      />
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="container-arena">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl lg:text-4xl font-display font-bold">
              Mon <span className="gradient-text-primary">Profil</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Gérez votre profil et consultez vos statistiques
            </p>
          </motion.div>

          <div className="space-y-6">
            <ProfileHeader profile={profile} onUpdateProfile={updateProfile} />

            <div className="space-y-3">
              <LevelProgress
                currentLevel={profile.current_level}
                currentXp={profile.current_xp}
                xpForNextLevel={xpForNextLevel}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => triggerCelebration(profile.current_level + 1)}
                className="gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Tester l'animation Level-Up
              </Button>
            </div>

            <ProfileStats profile={profile} totalBadges={userBadges.length} />

            <div className="grid lg:grid-cols-2 gap-6">
              <PredictionHistory predictions={predictions} />
              <ProfileBadges userBadges={userBadges} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
