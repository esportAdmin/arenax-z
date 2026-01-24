import { AnalyticsSidebar } from "@/components/analytics/AnalyticsSidebar";
import { AnalyticsTopbar } from "@/components/analytics/AnalyticsTopbar";
import { HeroBanner } from "@/components/analytics/HeroBanner";
import { StatsGrid } from "@/components/analytics/StatsGrid";
import { PerformanceChart } from "@/components/analytics/PerformanceChart";
import { WinProbabilityChart } from "@/components/analytics/WinProbabilityChart";
import { TrendChart } from "@/components/analytics/TrendChart";
import { InsightCards } from "@/components/analytics/InsightCards";
import { LiveMatchesWidget } from "@/components/analytics/LiveMatchesWidget";
import { RecentActivityTable } from "@/components/analytics/RecentActivityTable";

export default function AnalyticsDashboard() {
  return (
    <div className="flex h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Sidebar */}
      <AnalyticsSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <AnalyticsTopbar title="Overview" />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto">
          <div className="flex">
            {/* Left content area */}
            <div className="flex-1 p-6 space-y-6">
              {/* Hero Banner */}
              <HeroBanner />

              {/* Stats Grid */}
              <StatsGrid />

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <PerformanceChart />
                </div>
                <div className="lg:col-span-1">
                  <WinProbabilityChart />
                </div>
                <div className="lg:col-span-1">
                  <TrendChart />
                </div>
              </div>

              {/* Insight Cards */}
              <InsightCards />
            </div>

            {/* Right Sidebar */}
            <div className="w-[380px] border-l border-white/5 p-6 space-y-6">
              <LiveMatchesWidget />
              <RecentActivityTable />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
