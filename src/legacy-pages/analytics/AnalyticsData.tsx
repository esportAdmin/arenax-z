import { AnalyticsSidebar } from "@/components/analytics/AnalyticsSidebar";
import { AnalyticsTopbar } from "@/components/analytics/AnalyticsTopbar";
import {
  BarChart3,
  TrendingUp,
  Target,
  DollarSign,
  Users,
  Trophy,
  Download,
  Share2,
  Sparkles,
  AlertTriangle,
  Zap,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart,
  Tooltip as RechartsTooltip,
} from "recharts";

// Mock data for charts
const performanceData = [
  { name: "Sun", clubClubs: 40, clubTeam: 60, clubB3: 30 },
  { name: "Mon", clubClubs: 55, clubTeam: 70, clubB3: 45 },
  { name: "Tue", clubClubs: 70, clubTeam: 90, clubB3: 55 },
  { name: "Wed", clubClubs: 60, clubTeam: 85, clubB3: 50 },
  { name: "Thu", clubClubs: 95, clubTeam: 110, clubB3: 70 },
  { name: "Fri", clubClubs: 110, clubTeam: 130, clubB3: 85 },
  { name: "Sat", clubClubs: 130, clubTeam: 140, clubB3: 95 },
];

const engagementData = [
  { name: "Sun", engagement: 50, usage: 30 },
  { name: "Mon", engagement: 75, usage: 45 },
  { name: "Tue", engagement: 100, usage: 60 },
  { name: "Wed", engagement: 85, usage: 55 },
  { name: "Thu", engagement: 150, usage: 90 },
  { name: "Fri", engagement: 200, usage: 120 },
  { name: "Sat", engagement: 220, usage: 140 },
];

const clubComparisonData = [
  { name: "Jan", value: 40 },
  { name: "Feb", value: 50 },
  { name: "Mar", value: 55 },
  { name: "Apr", value: 65 },
  { name: "May", value: 75 },
];

const playerStatsData = [
  { name: "0", value: 20 },
  { name: "5", value: 40 },
  { name: "10", value: 60 },
  { name: "15", value: 50 },
  { name: "20", value: 80 },
];

const tournamentResultsData = [
  { name: "Jan", value: 30 },
  { name: "Feb", value: 50 },
  { name: "Mar", value: 70 },
  { name: "Apr", value: 100 },
  { name: "May", value: 120 },
  { name: "Jun", value: 140 },
];

const recentReports = [
  {
    id: 1,
    name: "Report Report 1",
    date: "2023-01-19",
    metric: "Win rate",
    value: "64x28%",
    status: "Active",
  },
  {
    id: 2,
    name: "Report Report 2",
    date: "2023-01-10",
    metric: "Avg player",
    value: "4.2%",
    status: "Inactive",
  },
];

const clubPerformance = [
  {
    id: 1,
    name: "Team Liquid",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=TL",
    winRate: "Win rate",
    trend: [40, 50, 45, 60, 55, 70, 65],
  },
  {
    id: 2,
    name: "Fnatic",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=FN",
    winRate: "Win rate",
    trend: [30, 45, 50, 55, 60, 65, 70],
  },
  {
    id: 3,
    name: "G2",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=G2",
    winRate: "Win rate",
    trend: [50, 55, 45, 60, 70, 65, 75],
  },
];

const clubComparison = {
  name: "Team Liquid",
  logo: "https://api.dicebear.com/7.x/shapes/svg?seed=TL",
  winRate: "88% - 75%",
  avgRating: "Avg. rating",
  trend: [60, 70, 65, 80, 75, 90, 85],
};

export default function AnalyticsData() {
  return (
    <div className="flex h-screen bg-[#0a0a0f] overflow-hidden">
      <AnalyticsSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AnalyticsTopbar title="Clubs Analytics" />
        <main className="flex-1 overflow-auto p-6">
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-8 mb-6">
            <div className="absolute inset-0 opacity-20">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.3) 0%, transparent 50%),
                                    radial-gradient(circle at 80% 50%, hsl(var(--secondary) / 0.3) 0%, transparent 50%)`,
                }}
              />
            </div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                  Clubs Analytics & Insights
                </h1>
                <p className="text-muted-foreground">
                  Comprehensive data analysis, KPIs, and insights for strategic
                  esports decision making
                </p>
              </div>
              <Button className="bg-primary hover:bg-primary/90 font-semibold px-6">
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Date Range
                </span>
                <div className="flex items-center gap-1">
                  <Badge
                    variant="outline"
                    className="cursor-pointer bg-white/5"
                  >
                    Last 7 days
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-white/5"
                  >
                    Last 30 days
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-white/5"
                  >
                    Custom
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Data Type</span>
                <div className="flex items-center gap-1">
                  <Badge className="bg-primary/20 text-primary border-primary/30 cursor-pointer">
                    Clubs
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-white/5"
                  >
                    Teams
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-white/5"
                  >
                    Players
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-white/5"
                  >
                    Tournaments
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Metric Type
                </span>
                <div className="flex items-center gap-1">
                  <Badge className="bg-primary/20 text-primary border-primary/30 cursor-pointer">
                    Win rate
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-white/5"
                  >
                    Prediction accuracy
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-white/5"
                  >
                    Revenue
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-white/5"
                  >
                    Usage
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-white/5"
                  >
                    Engagement
                  </Badge>
                </div>
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search clubs..."
                className="bg-[#12121a] border border-white/10 rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground w-48"
              />
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-[#12121a] rounded-xl p-5 border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Active clubs
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold text-foreground">
                  12
                </span>
                <span className="flex items-center gap-1 text-sm font-semibold text-success">
                  <TrendingUp className="w-4 h-4" />
                  +3%
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                vs last period
              </p>
            </div>
            <div className="bg-[#12121a] rounded-xl p-5 border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-secondary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Players analyzed
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold text-foreground">
                  284
                </span>
                <span className="flex items-center gap-1 text-sm font-semibold text-success">
                  <TrendingUp className="w-4 h-4" />
                  +5%
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                vs last period
              </p>
            </div>
            <div className="bg-[#12121a] rounded-xl p-5 border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-success" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Prediction accuracy %
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold text-foreground">
                  89.5%
                </span>
                <span className="flex items-center gap-1 text-sm font-semibold text-success">
                  <TrendingUp className="w-4 h-4" />
                  +2%
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                vs last period
              </p>
            </div>
            <div className="bg-[#12121a] rounded-xl p-5 border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-warning" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Revenue / Usage
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold text-foreground">
                  $45.2K
                </span>
                <span className="flex items-center gap-1 text-sm font-semibold text-success">
                  <TrendingUp className="w-4 h-4" />
                  +8%
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                vs last period
              </p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-12 gap-6 mb-6">
            {/* Club Performance Trend */}
            <div className="col-span-5 bg-[#12121a] rounded-xl border border-white/5 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">
                  Club Performance Trend
                </h3>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-muted-foreground">Club Clubs</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    <span className="text-muted-foreground">Club TeαmΔ</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    <span className="text-muted-foreground">Club B-3</span>
                  </div>
                </div>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient
                        id="colorClubs"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border) / 0.3)"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="clubClubs"
                      stroke="hsl(var(--primary))"
                      fill="url(#colorClubs)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="clubTeam"
                      stroke="hsl(var(--secondary))"
                      fill="transparent"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="clubB3"
                      stroke="hsl(var(--accent))"
                      fill="transparent"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Win Probability */}
            <div className="col-span-2 bg-[#12121a] rounded-xl border border-white/5 p-5">
              <h3 className="font-semibold text-foreground mb-4">
                Win Probability
              </h3>
              <div className="flex flex-col items-center justify-center h-[200px]">
                <div className="relative w-32 h-32">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${75 * 2.51} ${100 * 2.51}`}
                    />
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--secondary))" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-display font-bold text-foreground">
                      75%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement & Usage Over Time */}
            <div className="col-span-5 bg-[#12121a] rounded-xl border border-white/5 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">
                  Engagement & Usage Over Time
                </h3>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="text-muted-foreground">
                      Engagement metrics
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span className="text-muted-foreground">
                      Usage statistics
                    </span>
                  </div>
                </div>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={engagementData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border) / 0.3)"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="engagement"
                      stroke="#22d3ee"
                      fill="transparent"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="usage"
                      stroke="#a855f7"
                      fill="transparent"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Second Charts Row */}
          <div className="grid grid-cols-12 gap-6 mb-6">
            {/* Club Performance Comparison */}
            <div className="col-span-3 bg-[#12121a] rounded-xl border border-white/5 p-5">
              <h3 className="font-semibold text-foreground mb-4">
                Club Performance Comparison
              </h3>
              <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clubComparisonData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border) / 0.3)"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                    />
                    <Bar
                      dataKey="value"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Player Statistics */}
            <div className="col-span-3 bg-[#12121a] rounded-xl border border-white/5 p-5">
              <h3 className="font-semibold text-foreground mb-4">
                Player Statistics
              </h3>
              <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={playerStatsData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border) / 0.3)"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--secondary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--secondary))", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tournament Results */}
            <div className="col-span-3 bg-[#12121a] rounded-xl border border-white/5 p-5">
              <h3 className="font-semibold text-foreground mb-4">
                Tournament Results
              </h3>
              <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={tournamentResultsData}>
                    <defs>
                      <linearGradient
                        id="colorTournament"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#f97316"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#f97316"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border) / 0.3)"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#f97316"
                      fill="url(#colorTournament)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Analytics Insights */}
            <div className="col-span-3 bg-gradient-to-br from-[#1a1a2e] to-[#12121a] rounded-xl border border-primary/20 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">
                  Analytics Insights
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <Zap className="w-4 h-4 text-primary mt-0.5" />
                  <p className="text-muted-foreground">
                    Team A has 75% win probability against Team B
                  </p>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                  <p className="text-muted-foreground">
                    Low prediction confidence for this match
                  </p>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-success mt-0.5" />
                  <p className="text-muted-foreground">
                        High signal movement on Team C, worth a closer review
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5">
                <h4 className="font-semibold text-foreground mb-2">
                  AI Recommendations
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="text-muted-foreground">
                      Optimize betting strategy
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span className="text-muted-foreground">
                      Focus on Team A
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-muted-foreground">
                      Consider Team C
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Sections */}
          <div className="grid grid-cols-12 gap-6">
            {/* Club Performance */}
            <div className="col-span-4 bg-[#12121a] rounded-xl border border-white/5 p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">
                  Club Performance
                </h3>
              </div>
              <div className="space-y-4">
                {clubPerformance.map((club) => (
                  <div
                    key={club.id}
                    className="bg-[#0a0a0f] rounded-xl p-4 border border-white/5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={club.logo}
                          alt={club.name}
                          className="w-10 h-10 rounded-lg"
                        />
                        <div>
                          <p className="font-medium text-foreground">
                            {club.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {club.winRate}
                          </p>
                        </div>
                      </div>
                      <div className="w-20 h-8">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={club.trend.map((v, i) => ({ x: i, y: v }))}
                          >
                            <Line
                              type="monotone"
                              dataKey="y"
                              stroke="hsl(var(--primary))"
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-primary/20 text-primary hover:bg-primary/30"
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Club Analytics Reports */}
            <div className="col-span-5 bg-[#12121a] rounded-xl border border-white/5 p-5">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">
                  Recent Club Analytics Reports
                </h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="py-2 text-left text-xs font-medium text-muted-foreground">
                      Report Name
                    </th>
                    <th className="py-2 text-left text-xs font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="py-2 text-left text-xs font-medium text-muted-foreground">
                      Metric
                    </th>
                    <th className="py-2 text-left text-xs font-medium text-muted-foreground">
                      Value
                    </th>
                    <th className="py-2 text-left text-xs font-medium text-muted-foreground">
                      Trend
                    </th>
                    <th className="py-2 text-left text-xs font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="py-2 text-left text-xs font-medium text-muted-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentReports.map((report) => (
                    <tr key={report.id} className="border-b border-white/5">
                      <td className="py-3 text-sm text-foreground">
                        {report.name}
                      </td>
                      <td className="py-3 text-sm text-muted-foreground">
                        {report.date}
                      </td>
                      <td className="py-3 text-sm text-muted-foreground">
                        {report.metric}
                      </td>
                      <td className="py-3 text-sm text-foreground">
                        {report.value}
                      </td>
                      <td className="py-3">
                        <div className="w-16 h-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={[
                                { x: 0, y: 30 },
                                { x: 1, y: 50 },
                                { x: 2, y: 40 },
                                { x: 3, y: 60 },
                              ]}
                            >
                              <Line
                                type="monotone"
                                dataKey="y"
                                stroke="hsl(var(--success))"
                                strokeWidth={2}
                                dot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge
                          className={cn(
                            "text-xs",
                            report.status === "Active"
                              ? "bg-success/20 text-success border-success/30"
                              : "bg-muted/20 text-muted-foreground border-muted/30",
                          )}
                        >
                          {report.status}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                          >
                            <Share2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Club Comparison */}
            <div className="col-span-3 bg-[#12121a] rounded-xl border border-white/5 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">
                  Club Comparison
                </h3>
              </div>
              <div className="bg-[#0a0a0f] rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={clubComparison.logo}
                    alt={clubComparison.name}
                    className="w-12 h-12 rounded-lg"
                  />
                  <div>
                    <p className="font-medium text-foreground">
                      {clubComparison.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Head-to-head win rate
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Win Rate</p>
                    <p className="text-lg font-semibold text-foreground">
                      {clubComparison.winRate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {clubComparison.avgRating}
                    </p>
                    <div className="w-full h-8">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={clubComparison.trend.map((v, i) => ({
                            x: i,
                            y: v,
                          }))}
                        >
                          <Line
                            type="monotone"
                            dataKey="y"
                            stroke="hsl(var(--warning))"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Compare
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
