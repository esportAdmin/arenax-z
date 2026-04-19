import { useState } from "react";
import { AnalyticsSidebar } from "@/components/analytics/AnalyticsSidebar";
import { AnalyticsTopbar } from "@/components/analytics/AnalyticsTopbar";
import {
  FileText,
  Download,
  Share2,
  Eye,
  Trash2,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  FileSpreadsheet,
  FilePieChart,
  FileBarChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Mock data for reports
const reports = [
  {
    id: 1,
    name: "Q4 Esports Performance Analysis",
    type: "Quarterly Review",
    date: "2024-01-15",
    status: "Completed",
    author: "Alex Chen",
    downloads: 245,
    icon: FileBarChart,
  },
  {
    id: 2,
    name: "Match Prediction Accuracy Report - January",
    type: "Monthly Analysis",
    date: "2024-01-10",
    status: "Completed",
    author: "Sarah Kim",
    downloads: 189,
    icon: FilePieChart,
  },
  {
    id: 3,
    name: "Team Liquid vs G2 Esports Deep Dive",
    type: "Match Analysis",
    date: "2024-01-08",
    status: "Completed",
    author: "Alex Chen",
    downloads: 312,
    icon: FileSpreadsheet,
  },
  {
    id: 4,
    name: "Weekly Tournament Summary",
    type: "Weekly Report",
    date: "2024-01-17",
    status: "In Progress",
    author: "Mike Johnson",
    downloads: 0,
    icon: FileText,
  },
  {
    id: 5,
    name: "Player Performance Metrics - CS2",
    type: "Player Analysis",
    date: "2024-01-12",
    status: "Completed",
    author: "Sarah Kim",
    downloads: 156,
    icon: FileBarChart,
  },
];

const scheduledReports = [
  {
    id: 1,
    name: "Weekly Performance Summary",
    frequency: "Weekly",
    nextRun: "2024-01-22",
    recipients: 12,
  },
  {
    id: 2,
    name: "Monthly Accuracy Report",
    frequency: "Monthly",
    nextRun: "2024-02-01",
    recipients: 8,
  },
  {
    id: 3,
    name: "Daily Live Calls",
    frequency: "Daily",
    nextRun: "2024-01-19",
    recipients: 25,
  },
];

const reportTemplates = [
  { id: 1, name: "Match Analysis Template", uses: 156, icon: FileBarChart },
  { id: 2, name: "Tournament Summary Template", uses: 89, icon: FilePieChart },
  {
    id: 3,
    name: "Player Performance Template",
    uses: 234,
    icon: FileSpreadsheet,
  },
  { id: 4, name: "Weekly Digest Template", uses: 67, icon: FileText },
];

export default function AnalyticsReports() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const stats = {
    totalReports: 156,
    completedThisMonth: 23,
    pendingReports: 4,
    avgDownloads: 187,
  };

  return (
    <div className="flex h-screen bg-[#0a0a0f] overflow-hidden">
      <AnalyticsSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AnalyticsTopbar title="Reports" />
        <main className="flex-1 overflow-auto p-6 space-y-6">
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
                  Reports & Documentation
                </h1>
                <p className="text-muted-foreground">
                  Generate, manage, and share comprehensive esports analytics
                  reports
                </p>
              </div>
              <Button className="bg-primary hover:bg-primary/90 font-semibold px-6">
                <Plus className="w-4 h-4 mr-2" />
                Create New Report
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#12121a] rounded-xl p-5 border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Total Reports
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold text-foreground">
                  {stats.totalReports}
                </span>
                <span className="flex items-center gap-1 text-sm font-semibold text-success">
                  <TrendingUp className="w-4 h-4" />
                  +8%
                </span>
              </div>
            </div>
            <div className="bg-[#12121a] rounded-xl p-5 border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Completed This Month
                </span>
              </div>
              <span className="text-3xl font-display font-bold text-foreground">
                {stats.completedThisMonth}
              </span>
            </div>
            <div className="bg-[#12121a] rounded-xl p-5 border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <span className="text-sm text-muted-foreground">Pending</span>
              </div>
              <span className="text-3xl font-display font-bold text-foreground">
                {stats.pendingReports}
              </span>
            </div>
            <div className="bg-[#12121a] rounded-xl p-5 border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <Download className="w-5 h-5 text-secondary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Avg Downloads
                </span>
              </div>
              <span className="text-3xl font-display font-bold text-foreground">
                {stats.avgDownloads}
              </span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={selectedFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("all")}
              >
                All Reports
              </Button>
              <Button
                variant={selectedFilter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("completed")}
              >
                Completed
              </Button>
              <Button
                variant={
                  selectedFilter === "in-progress" ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedFilter("in-progress")}
              >
                In Progress
              </Button>
              <Button
                variant={selectedFilter === "scheduled" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("scheduled")}
              >
                Scheduled
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-[250px] bg-[#12121a] border-white/10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Reports Table */}
          <div className="bg-[#12121a] rounded-xl border border-white/5 overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#0a0a0f]">
                <tr className="border-b border-white/5">
                  <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Report Name
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Type
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Author
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Downloads
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <report.icon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">
                          {report.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">{report.type}</Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {report.date}
                    </td>
                    <td className="py-4 px-4 text-sm text-foreground">
                      {report.author}
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        className={cn(
                          "text-xs",
                          report.status === "Completed"
                            ? "bg-success/20 text-success border-success/30"
                            : "bg-warning/20 text-warning border-warning/30",
                        )}
                      >
                        {report.status === "Completed" ? (
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {report.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-foreground">
                      {report.downloads}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Sections */}
          <div className="grid grid-cols-2 gap-6">
            {/* Scheduled Reports */}
            <div className="bg-[#12121a] rounded-xl border border-white/5 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">
                    Scheduled Reports
                  </h3>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">
                  <Plus className="w-4 h-4 mr-1" />
                  Schedule New
                </Button>
              </div>
              <div className="space-y-3">
                {scheduledReports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-[#0a0a0f] rounded-lg p-4 border border-white/5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">
                        {report.name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {report.frequency}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Next run: {report.nextRun}
                      </span>
                      <span className="text-muted-foreground">
                        {report.recipients} recipients
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Report Templates */}
            <div className="bg-[#12121a] rounded-xl border border-white/5 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">
                    Report Templates
                  </h3>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">
                  <Plus className="w-4 h-4 mr-1" />
                  Create Template
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {reportTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-[#0a0a0f] rounded-lg p-4 border border-white/5 hover:border-primary/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <template.icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium text-foreground text-sm">
                        {template.name}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {template.uses} uses
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
