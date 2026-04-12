import { useState } from "react";
import { AnalyticsSidebar } from "@/components/analytics/AnalyticsSidebar";
import { AnalyticsTopbar } from "@/components/analytics/AnalyticsTopbar";
import {
  Brain,
  TrendingUp,
  Target,
  Sparkles,
  AlertTriangle,
  Zap,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Search,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip as RechartsTooltip,
} from "recharts";

// Mock data
const predictionAccuracyData = [
  { name: "Jan", accuracy: 72 },
  { name: "Feb", accuracy: 75 },
  { name: "Mar", accuracy: 78 },
  { name: "Apr", accuracy: 82 },
  { name: "May", accuracy: 85 },
  { name: "Jun", accuracy: 88 },
  { name: "Jul", accuracy: 89.5 },
];

const recentPredictions = [
  {
    id: 1,
    match: "Team Liquid vs G2",
    prediction: "Team Liquid Win",
    confidence: 85,
    result: "correct",
    date: "2024-01-18",
    odds: "185",
  },
  {
    id: 2,
    match: "Fnatic vs T1",
    prediction: "T1 Win",
    confidence: 72,
    result: "correct",
    date: "2024-01-17",
    odds: "210",
  },
  {
    id: 3,
    match: "Cloud9 vs 100T",
    prediction: "Cloud9 Win",
    confidence: 68,
    result: "incorrect",
    date: "2024-01-16",
    odds: "195",
  },
  {
    id: 4,
    match: "NaVi vs Vitality",
    prediction: "NaVi Win",
    confidence: 78,
    result: "pending",
    date: "2024-01-19",
    odds: "175",
  },
  {
    id: 5,
    match: "Gen.G vs DRX",
    prediction: "Gen.G Win",
    confidence: 82,
    result: "correct",
    date: "2024-01-15",
    odds: "165",
  },
];

const aiInsights = [
  {
    type: "opportunity",
    icon: TrendingUp,
    title: "High Value Opportunity",
    description:
    "Team Alpha has a strong signal gap compared with current community attention.",
    confidence: 85,
  },
  {
    type: "risk",
    icon: AlertTriangle,
    title: "Risk Alert",
    description:
      "CyberStorm has key player injured. Model confidence reduced by 15%.",
    confidence: 45,
  },
  {
    type: "insight",
    icon: Zap,
    title: "Meta Shift Detected",
    description:
      "New patch favors aggressive playstyles. Teams with high K/D expected to perform better.",
    confidence: 72,
  },
];

const topPerformingModels = [
  {
    name: "Match Outcome V3",
    accuracy: 89.5,
    predictions: 1245,
    trend: [80, 82, 85, 87, 88, 89.5],
  },
  {
    name: "Map Score Predictor",
    accuracy: 76.2,
    predictions: 890,
    trend: [70, 72, 74, 75, 76, 76.2],
  },
  {
    name: "Player Performance",
    accuracy: 82.1,
    predictions: 567,
    trend: [75, 78, 80, 81, 82, 82.1],
  },
];

const upcomingPredictions = [
  {
    id: 1,
    teamA: "Team Liquid",
    teamB: "G2 Esports",
    prediction: "Team Liquid",
    confidence: 72,
    date: "Today, 15:00",
    game: "LoL",
  },
  {
    id: 2,
    teamA: "Fnatic",
    teamB: "T1",
    prediction: "T1",
    confidence: 65,
    date: "Today, 18:00",
    game: "LoL",
  },
  {
    id: 3,
    teamA: "NaVi",
    teamB: "Vitality",
    prediction: "NaVi",
    confidence: 78,
    date: "Tomorrow, 14:00",
    game: "CS2",
  },
];

export default function AnalyticsPredictions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const stats = {
    totalPredictions: 1245,
    accuracy: 89.5,
    correctPredictions: 1114,
    pendingPredictions: 23,
  };

  return (
    <div className="flex h-screen bg-[#0a0a0f] overflow-hidden">
      <AnalyticsSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
  <AnalyticsTopbar title="Live Calls / AI" />
        <main className="flex-1 overflow-auto">
          <div className="flex">
            {/* Main Content */}
            <div className="flex-1 p-6 space-y-6">
              {/* Hero Banner */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-8">
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
              AI Live Calls & Insights
                    </h1>
                    <p className="text-muted-foreground">
              Machine learning powered live-call insights with real-time
                      accuracy tracking
                    </p>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90 font-semibold px-6">
                    <Brain className="w-4 h-4 mr-2" />
              Generate Live Calls
                  </Button>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-[#12121a] rounded-xl p-5 border border-white/5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">
              Total Live Calls
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-display font-bold text-foreground">
                      {stats.totalPredictions.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-success">
                      <TrendingUp className="w-4 h-4" />
                      +12%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    This month
                  </p>
                </div>
                <div className="bg-[#12121a] rounded-xl p-5 border border-white/5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                      <Target className="w-5 h-5 text-success" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Accuracy Rate
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-display font-bold text-foreground">
                      {stats.accuracy}%
                    </span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-success">
                      <TrendingUp className="w-4 h-4" />
                      +2.3%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Rolling 30-day avg
                  </p>
                </div>
                <div className="bg-[#12121a] rounded-xl p-5 border border-white/5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-secondary" />
                    </div>
                    <span className="text-sm text-muted-foreground">
              Correct Calls
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-display font-bold text-foreground">
                      {stats.correctPredictions.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-success">
                      <TrendingUp className="w-4 h-4" />
                      +8%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    This month
                  </p>
                </div>
                <div className="bg-[#12121a] rounded-xl p-5 border border-white/5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-warning" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Pending
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-display font-bold text-foreground">
                      {stats.pendingPredictions}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Awaiting results
                  </p>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-2 gap-6">
                {/* Accuracy Trend */}
                <div className="bg-[#12121a] rounded-xl border border-white/5 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">
              Signal Accuracy Trend
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      Last 7 months
                    </Badge>
                  </div>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={predictionAccuracyData}>
                        <defs>
                          <linearGradient
                            id="colorAccuracy"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="hsl(var(--success))"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="hsl(var(--success))"
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
                          domain={[60, 100]}
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
                          dataKey="accuracy"
                          stroke="hsl(var(--success))"
                          fill="url(#colorAccuracy)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Model Performance */}
                <div className="bg-[#12121a] rounded-xl border border-white/5 p-5">
                  <h3 className="font-semibold text-foreground mb-4">
                    Top Performing Models
                  </h3>
                  <div className="space-y-4">
                    {topPerformingModels.map((model, index) => (
                      <div
                        key={index}
                        className="bg-[#0a0a0f] rounded-lg p-4 border border-white/5"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium text-foreground">
                              {model.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                    {model.predictions.toLocaleString()} live calls
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-success">
                              {model.accuracy}%
                            </p>
                            <div className="w-20 h-6">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                  data={model.trend.map((v, i) => ({
                                    x: i,
                                    y: v,
                                  }))}
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
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Predictions Table */}
              <div className="bg-[#12121a] rounded-xl border border-white/5 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">
              Recent Live Calls
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Button
                        variant={
                          selectedFilter === "all" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedFilter("all")}
                      >
                        All
                      </Button>
                      <Button
                        variant={
                          selectedFilter === "correct" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedFilter("correct")}
                      >
                        Correct
                      </Button>
                      <Button
                        variant={
                          selectedFilter === "incorrect" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedFilter("incorrect")}
                      >
                        Incorrect
                      </Button>
                      <Button
                        variant={
                          selectedFilter === "pending" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedFilter("pending")}
                      >
                        Pending
                      </Button>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-[200px] bg-[#0a0a0f] border-white/10"
                      />
                    </div>
                  </div>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Match
                      </th>
                      <th className="py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Live Call
                      </th>
                      <th className="py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Confidence
                      </th>
                      <th className="py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Signal
                      </th>
                      <th className="py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Date
                      </th>
                      <th className="py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Result
                      </th>
                      <th className="py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPredictions
                      .filter(
                        (p) =>
                          selectedFilter === "all" ||
                          p.result === selectedFilter,
                      )
                      .map((pred) => (
                        <tr
                          key={pred.id}
                          className="border-b border-white/5 hover:bg-white/5"
                        >
                          <td className="py-4 text-sm font-medium text-foreground">
                            {pred.match}
                          </td>
                          <td className="py-4 text-sm text-muted-foreground">
                            {pred.prediction}
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "text-sm font-medium",
                                  pred.confidence >= 80
                                    ? "text-success"
                                    : pred.confidence >= 60
                                      ? "text-warning"
                                      : "text-muted-foreground",
                                )}
                              >
                                {pred.confidence}%
                              </span>
                              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={cn(
                                    "h-full rounded-full",
                                    pred.confidence >= 80
                                      ? "bg-success"
                                      : pred.confidence >= 60
                                        ? "bg-warning"
                                        : "bg-muted-foreground",
                                  )}
                                  style={{ width: `${pred.confidence}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-foreground">
                            {pred.odds}
                          </td>
                          <td className="py-4 text-sm text-muted-foreground">
                            {pred.date}
                          </td>
                          <td className="py-4">
                            <Badge
                              className={cn(
                                "text-xs",
                                pred.result === "correct" &&
                                  "bg-success/20 text-success border-success/30",
                                pred.result === "incorrect" &&
                                  "bg-destructive/20 text-destructive border-destructive/30",
                                pred.result === "pending" &&
                                  "bg-warning/20 text-warning border-warning/30",
                              )}
                            >
                              {pred.result === "correct" && (
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                              )}
                              {pred.result === "incorrect" && (
                                <XCircle className="w-3 h-3 mr-1" />
                              )}
                              {pred.result === "pending" && (
                                <Clock className="w-3 h-3 mr-1" />
                              )}
                              {pred.result.charAt(0).toUpperCase() +
                                pred.result.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-primary"
                            >
                              Details
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-[340px] border-l border-white/5 p-6 space-y-6 bg-[#0a0a0f]/50">
              {/* AI Insights */}
              <div className="bg-gradient-to-br from-[#1a1a2e] to-[#12121a] rounded-xl border border-primary/20 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">AI Insights</h3>
                </div>
                <div className="space-y-4">
                  {aiInsights.map((insight, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-3 rounded-lg border",
                        insight.type === "opportunity" &&
                          "bg-success/5 border-success/20",
                        insight.type === "risk" &&
                          "bg-destructive/5 border-destructive/20",
                        insight.type === "insight" &&
                          "bg-primary/5 border-primary/20",
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <insight.icon
                          className={cn(
                            "w-4 h-4",
                            insight.type === "opportunity" && "text-success",
                            insight.type === "risk" && "text-destructive",
                            insight.type === "insight" && "text-primary",
                          )}
                        />
                        <span className="text-sm font-medium text-foreground">
                          {insight.title}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {insight.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">
                          Confidence:
                        </span>
                        <span
                          className={cn(
                            "text-xs font-medium",
                            insight.confidence >= 70
                              ? "text-success"
                              : insight.confidence >= 50
                                ? "text-warning"
                                : "text-destructive",
                          )}
                        >
                          {insight.confidence}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Predictions */}
              <div className="bg-[#12121a] rounded-xl border border-white/5 p-5">
                <h3 className="font-semibold text-foreground mb-4">
            Upcoming Live Calls
                </h3>
                <div className="space-y-3">
                  {upcomingPredictions.map((pred) => (
                    <div
                      key={pred.id}
                      className="bg-[#0a0a0f] rounded-lg p-3 border border-white/5"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">
                          {pred.date}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {pred.game}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">
                          {pred.teamA}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          vs
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {pred.teamB}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-primary">
                      Live call: {pred.prediction}
                        </span>
                        <span
                          className={cn(
                            "text-xs font-medium",
                            pred.confidence >= 70
                              ? "text-success"
                              : "text-warning",
                          )}
                        >
                          {pred.confidence}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
