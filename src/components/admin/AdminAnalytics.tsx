import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { format, subDays, startOfDay, eachDayOfInterval } from "date-fns";
import { fr } from "date-fns/locale";

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  arena_balance: number;
  current_level: number;
  total_predictions: number;
  total_wins: number;
  created_at: string;
}

interface Redemption {
  id: string;
  prize_name: string;
  price_paid: number;
  status: string;
  created_at: string;
}

interface AdminAnalyticsProps {
  users: UserProfile[];
  redemptions: Redemption[];
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

export function AdminAnalytics({ users, redemptions }: AdminAnalyticsProps) {
  // User registrations over last 30 days
  const registrationsData = useMemo(() => {
    const last30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date(),
    });

    return last30Days.map((day) => {
      const dayStart = startOfDay(day);
      const count = users.filter((u) => {
        const createdAt = startOfDay(new Date(u.created_at));
        return createdAt.getTime() === dayStart.getTime();
      }).length;

      return {
        date: format(day, "dd/MM", { locale: fr }),
        inscriptions: count,
      };
    });
  }, [users]);

  // Redemptions over last 30 days
  const redemptionsData = useMemo(() => {
    const last30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date(),
    });

    return last30Days.map((day) => {
      const dayStart = startOfDay(day);
      const dayRedemptions = redemptions.filter((r) => {
        const createdAt = startOfDay(new Date(r.created_at));
        return createdAt.getTime() === dayStart.getTime();
      });

      return {
        date: format(day, "dd/MM", { locale: fr }),
        échanges: dayRedemptions.length,
        valeur: dayRedemptions.reduce((sum, r) => sum + r.price_paid, 0),
      };
    });
  }, [redemptions]);

  // User levels distribution
  const levelDistribution = useMemo(() => {
    const levels: Record<string, number> = {};
    users.forEach((u) => {
      const levelGroup =
        u.current_level <= 5
          ? "1-5"
          : u.current_level <= 10
            ? "6-10"
            : u.current_level <= 20
              ? "11-20"
              : u.current_level <= 50
                ? "21-50"
                : "50+";
      levels[levelGroup] = (levels[levelGroup] || 0) + 1;
    });

    return Object.entries(levels).map(([name, value]) => ({ name: `Niv. ${name}`, value }));
  }, [users]);

  // Redemption status distribution
  const statusDistribution = useMemo(() => {
    const statuses: Record<string, number> = {};
    redemptions.forEach((r) => {
      const label =
        r.status === "pending"
          ? "En attente"
          : r.status === "processing"
            ? "En cours"
            : r.status === "completed"
              ? "Complété"
              : r.status === "cancelled"
                ? "Annulé"
                : r.status;
      statuses[label] = (statuses[label] || 0) + 1;
    });

    return Object.entries(statuses).map(([name, value]) => ({ name, value }));
  }, [redemptions]);

  // Top redeemed prizes
  const topPrizes = useMemo(() => {
    const prizes: Record<string, number> = {};
    redemptions.forEach((r) => {
      prizes[r.prize_name] = (prizes[r.prize_name] || 0) + 1;
    });

    return Object.entries(prizes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name: name.length > 20 ? name.slice(0, 20) + "..." : name, count }));
  }, [redemptions]);

  // Summary stats
  const summaryStats = useMemo(() => {
    const totalAP = users.reduce((sum, u) => sum + (u.arena_balance || 0), 0);
    const avgAP = users.length > 0 ? Math.round(totalAP / users.length) : 0;
    const totalPredictions = users.reduce((sum, u) => sum + u.total_predictions, 0);
    const totalWins = users.reduce((sum, u) => sum + u.total_wins, 0);
    const avgWinRate = totalPredictions > 0 ? Math.round((totalWins / totalPredictions) * 100) : 0;
    const avgLevel =
      users.length > 0 ? (users.reduce((sum, u) => sum + u.current_level, 0) / users.length).toFixed(1) : 0;

    return { totalAP, avgAP, totalPredictions, totalWins, avgWinRate, avgLevel };
  }, [users]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">AP Moyen / Utilisateur</p>
            <p className="text-2xl font-bold text-yellow-500">{summaryStats.avgAP.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Niveau Moyen</p>
            <p className="text-2xl font-bold text-primary">{summaryStats.avgLevel}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Prédictions</p>
            <p className="text-2xl font-bold">{summaryStats.totalPredictions.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Taux de Victoire</p>
            <p className="text-2xl font-bold text-green-500">{summaryStats.avgWinRate}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Registrations Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inscriptions (30 jours)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={registrationsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="inscriptions"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Redemptions Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Échanges (30 jours)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={redemptionsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="échanges" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Level Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribution des Niveaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={levelDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {levelDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Redemption Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Statut des Échanges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Prizes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Prix Échangés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPrizes} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} tickLine={false} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill="#22c55e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
