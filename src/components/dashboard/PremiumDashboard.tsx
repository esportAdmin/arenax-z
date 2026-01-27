import PremiumDailyChallengeCard from "@/components/dashboard/premium/PremiumDailyChallengeCard";
import PremiumLeaderboardCard from "@/components/dashboard/premium/PremiumLeaderboardCard";
import PremiumPlayerCard from "@/components/dashboard/premium/PremiumPlayerCard";
import { Navbar } from "@/components/layout/Navbar";

/**
 * PremiumDashboard
 *
 * Pixel-style dashboard layout (3 panels) matching the provided reference screenshot.
 * Pure UI (no data fetching). Wire Supabase/Stripe hooks later if needed.
 *
 * @example
 * import PremiumDashboard from "@/components/dashboard/PremiumDashboard";
 *
 * export default function Page() {
 *   return <PremiumDashboard />;
 * }
 */
export default function PremiumDashboard() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background font-body">
      <Navbar />

      {/* Background (dark + subtle grid + glows) */}
      <div className="pointer-events-none absolute inset-0 cyber-grid opacity-[0.06]" />
      <div className="pointer-events-none absolute -top-24 left-[-140px] h-[520px] w-[520px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-28 right-[-140px] h-[520px] w-[520px] rounded-full bg-accent/10 blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-screen bg-[url('/images/hero-arena-background.png')] bg-cover bg-center" />

      {/* Content */}
      <div className="relative mx-auto w-full max-w-[1700px] px-5 pb-10 pt-20 sm:px-8 lg:pt-24">
        {/* 12-col grid prevents clipping on 1366px while preserving 3 panels on xl+ */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12 xl:gap-10 2xl:gap-12">
          <div className="min-w-0 xl:col-span-4">
            <PremiumPlayerCard />
          </div>

          <div className="min-w-0 xl:col-span-5">
            <PremiumLeaderboardCard />
          </div>

          <div className="min-w-0 xl:col-span-3">
            <PremiumDailyChallengeCard />
          </div>
        </div>
      </div>
    </div>
  );
}
