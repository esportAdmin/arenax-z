import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { format, subDays, startOfDay, eachDayOfInterval } from "date-fns";
import { fr } from "date-fns/locale";
import { Activity, TrendingUp, Users, Zap } from "lucide-react";

interface AuditLog {
  id: string;
  admin_id: string;
  action_type: string;
  target_type: string;
  target_id: string | null;
  details: unknown;
  created_at: string;
  admin_profile?: {
    display_name: string | null;
    username: string | null;
  };
}

interface AuditLogStatsProps {
  logs: AuditLog[];
}

// Theme-aware colors using CSS variables
const ACTION_COLORS: Record<string, string> = {
  give_arena_points: "hsl(45, 100%, 50%)", // Warning/Gold
  add_role: "hsl(142, 76%, 45%)", // Success/Green
  remove_role: "hsl(0, 84%, 60%)", // Destructive/Red
  create_prize: "hsl(142, 76%, 45%)", // Success/Green
  update_prize: "hsl(186, 100%, 50%)", // Primary/Cyan
  delete_prize: "hsl(0, 84%, 60%)", // Destructive/Red
  update_redemption: "hsl(30, 100%, 55%)", // Accent/Orange
};

const CHART_COLORS = [
  "hsl(186, 100%, 50%)", // Primary cyan
  "hsl(270, 70%, 50%)", // Secondary purple
  "hsl(30, 100%, 55%)", // Accent orange
  "hsl(142, 76%, 45%)", // Success green
  "hsl(45, 100%, 50%)", // Warning gold
  "hsl(0, 84%, 60%)", // Destructive red
  "hsl(210, 100%, 60%)", // Blue
];

export function AuditLogStats({ logs }: AuditLogStatsProps) {
  // Stats by action type
  const actionTypeStats = useMemo(() => {
    const counts: Record<string, number> = {};
    logs.forEach((log) => {
      counts[log.action_type] = (counts[log.action_type] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({
        name: name.replace(/_/g, " "),
        value,
        fill: ACTION_COLORS[name] || CHART_COLORS[0],
      }))
      .sort((a, b) => b.value - a.value);
  }, [logs]);

  // Stats by admin
  const adminStats = useMemo(() => {
    const counts: Record<string, { name: string; count: number }> = {};
    logs.forEach((log) => {
      const adminName = log.admin_profile?.display_name || log.admin_profile?.username || "Admin";
      if (!counts[log.admin_id]) {
        counts[log.admin_id] = { name: adminName, count: 0 };
      }
      counts[log.admin_id].count++;
    });
    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [logs]);

  // Activity over time (last 7 days)
  const activityOverTime = useMemo(() => {
    const today = startOfDay(new Date());
    const weekAgo = subDays(today, 6);
    const days = eachDayOfInterval({ start: weekAgo, end: today });

    const dayCounts: Record<string, number> = {};
    days.forEach((day) => {
      dayCounts[format(day, "yyyy-MM-dd")] = 0;
    });

    logs.forEach((log) => {
      const logDate = format(new Date(log.created_at), "yyyy-MM-dd");
      if (dayCounts[logDate] !== undefined) {
        dayCounts[logDate]++;
      }
    });

    return days.map((day) => ({
      date: format(day, "EEE", { locale: fr }),
      fullDate: format(day, "dd/MM", { locale: fr }),
      actions: dayCounts[format(day, "yyyy-MM-dd")],
    }));
  }, [logs]);

  // Summary stats
  const summaryStats = useMemo(() => {
    const today = startOfDay(new Date());
    const todayStr = format(today, "yyyy-MM-dd");
    const todayActions = logs.filter((log) => format(new Date(log.created_at), "yyyy-MM-dd") === todayStr).length;

    const uniqueAdmins = new Set(logs.map((log) => log.admin_id)).size;
    const avgPerDay = logs.length > 0 ? Math.round(logs.length / 7) : 0;

    return {
      total: logs.length,
      today: todayActions,
      uniqueAdmins,
      avgPerDay,
    };
  }, [logs]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total actions</p>
                <p className="text-xl font-bold">{summaryStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Zap className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Aujourd'hui</p>
                <p className="text-xl font-bold">{summaryStats.today}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Admins actifs</p>
                <p className="text-xl font-bold">{summaryStats.uniqueAdmins}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Moy/jour</p>
                <p className="text-xl font-bold">{summaryStats.avgPerDay}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Over Time */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Activité sur 7 jours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "hsl(215, 20%, 55%)" }}
                    axisLine={{ stroke: "hsl(222, 30%, 18%)" }}
                    tickLine={{ stroke: "hsl(222, 30%, 18%)" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "hsl(215, 20%, 55%)" }}
                    axisLine={{ stroke: "hsl(222, 30%, 18%)" }}
                    tickLine={{ stroke: "hsl(222, 30%, 18%)" }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="glass-card p-2 shadow-lg border border-primary/20">
                            <p className="text-sm font-medium text-foreground">{payload[0].payload.fullDate}</p>
                            <p className="text-sm text-primary">
                              {payload[0].value} action{Number(payload[0].value) > 1 ? "s" : ""}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="actions"
                    stroke="hsl(186, 100%, 50%)"
                    strokeWidth={2}
                    dot={{ fill: "hsl(186, 100%, 50%)", strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: "hsl(186, 100%, 60%)", stroke: "hsl(186, 100%, 50%)", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Actions by Type */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Répartition par type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={actionTypeStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="hsl(222, 47%, 5%)"
                    strokeWidth={2}
                  >
                    {actionTypeStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill || CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="glass-card p-2 shadow-lg border border-primary/20">
                            <p className="text-sm font-medium capitalize text-foreground">{payload[0].name}</p>
                            <p className="text-sm text-primary">
                              {payload[0].value} action{Number(payload[0].value) > 1 ? "s" : ""}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    formatter={(value) => <span className="text-xs capitalize text-muted-foreground">{value}</span>}
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Admins */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Admins les plus actifs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adminStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 12, fill: "hsl(215, 20%, 55%)" }}
                  axisLine={{ stroke: "hsl(222, 30%, 18%)" }}
                  tickLine={{ stroke: "hsl(222, 30%, 18%)" }}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "hsl(215, 20%, 55%)" }}
                  width={100}
                  axisLine={{ stroke: "hsl(222, 30%, 18%)" }}
                  tickLine={{ stroke: "hsl(222, 30%, 18%)" }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="glass-card p-2 shadow-lg border border-primary/20">
                          <p className="text-sm font-medium text-foreground">{payload[0].payload.name}</p>
                          <p className="text-sm text-primary">
                            {payload[0].value} action{Number(payload[0].value) > 1 ? "s" : ""}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="hsl(186, 100%, 50%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
