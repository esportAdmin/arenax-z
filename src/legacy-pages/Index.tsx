import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/features/HeroSection";
import { FeaturesSection } from "@/components/features/FeaturesSection";
import { LiveMatchesSection } from "@/components/features/LiveMatchesSection";
import { LeaderboardPreview } from "@/components/features/LeaderboardPreview";
import { StakingPreview } from "@/components/features/StakingPreview";
import { CTASection } from "@/components/features/CTASection";

// Image de fond Cyberpunk (identique à Auth)
const BG_CYBERPUNK_URL =
  "https://z-cdn-media.chatglm.cn/files/6eddc868-ac0e-4dfe-8432-390722fb9d23.png?auth_key=1868219762-d198976440254f6eabcf3f551c7d2f30-0-cad1f93f68f1b18cc29ba67b2b008532";

const Index = () => {
  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: `url('${BG_CYBERPUNK_URL}')`, // URL mise à jour
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay sombre pour lisibilité */}
      <div className="absolute inset-0 bg-background/85 pointer-events-none" />

      {/* Contenu par-dessus */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroSection />
          <FeaturesSection />
          <LiveMatchesSection />
          <LeaderboardPreview />
          <StakingPreview />
          <CTASection />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
