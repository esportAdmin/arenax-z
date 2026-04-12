import { useState } from "react";
import { AnalyticsSidebar } from "@/components/analytics/AnalyticsSidebar";
import { AnalyticsTopbar } from "@/components/analytics/AnalyticsTopbar";
import {
  Users,
  Search,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Target,
  MoreHorizontal,
  Sparkles,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Mock data for teams
const teamsData = [
  {
    id: "10001",
    name: "Team Alpha",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=Alpha",
    type: "Professional",
    status: "Active",
    players: 12,
    winRate: 85,
    predictionAccuracy: 78,
  },
  {
    id: "10002",
    name: "CyberStorm",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=Cyber",
    type: "Professional",
    status: "Inactive",
    players: 10,
    winRate: 45,
    predictionAccuracy: 52,
  },
  {
    id: "10003",
    name: "DragonFury",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=Dragon",
    type: "Professional",
    status: "On hold",
    players: 18,
    winRate: 75,
    predictionAccuracy: 87,
  },
  {
    id: "10004",
    name: "Team Alpha",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=Alpha2",
    type: "Professional",
    status: "Active",
    players: 13,
    winRate: 45,
    predictionAccuracy: 76,
  },
  {
    id: "10005",
    name: "CyberStorm",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=Cyber2",
    type: "Professional",
    status: "Inactive",
    players: 19,
    winRate: 45,
    predictionAccuracy: 52,
  },
  {
    id: "10006",
    name: "DragonFury",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=Dragon2",
    type: "Professional",
    status: "On hold",
    players: 13,
    winRate: 75,
    predictionAccuracy: 76,
  },
];

const playersData = [
  {
    id: 1,
    name: "PlayerOne",
    role: "Carry",
    winRate: 85,
    predictionAccuracy: 78,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Player1",
  },
  {
    id: 2,
    name: "PlayerOne",
    role: "Jungler",
    winRate: 85,
    predictionAccuracy: 82,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Player2",
  },
  {
    id: 3,
    name: "PlayerOne",
    role: "Carry",
    winRate: 82,
    predictionAccuracy: 82,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Player3",
  },
  {
    id: 4,
    name: "PlayerOne",
    role: "Jungler",
    winRate: 82,
    predictionAccuracy: 82,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Player4",
  },
];

const recentPredictions = [
  {
    id: 1,
    player: "PlayerOne",
    team: "Team Alpha Win",
    prediction: "90%",
    status: "Correct",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=P1",
  },
  {
    id: 2,
    player: "PlayerOne",
    team: "Team Alpha Win",
    prediction: "90%",
    status: "Correct",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=P2",
  },
  {
    id: 3,
    player: "PlayerOne",
    team: "Team Alpha Win",
    prediction: "90%",
    status: "Correct",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=P3",
  },
];

interface TeamRowProps {
  team: (typeof teamsData)[0];
  isSelected?: boolean;
  onSelect: () => void;
}

function TeamRow({ team, isSelected, onSelect }: TeamRowProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-success/20 text-success border-success/30">
            Active
          </Badge>
        );
      case "Inactive":
        return (
          <Badge
            variant="outline"
            className="border-muted-foreground/30 text-muted-foreground"
          >
            Inactive
          </Badge>
        );
      case "On hold":
        return (
          <Badge className="bg-warning/20 text-warning border-warning/30">
            On hold
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <tr
      className={cn(
        "border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer",
        isSelected && "bg-primary/10",
      )}
      onClick={onSelect}
    >
      <td className="py-3 px-4 text-muted-foreground text-sm">{team.id}</td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <img src={team.logo} alt={team.name} className="w-8 h-8 rounded-lg" />
          <span className="font-medium text-foreground">{team.name}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <Badge
          variant="outline"
          className="bg-primary/10 border-primary/30 text-primary"
        >
          {team.type}
        </Badge>
      </td>
      <td className="py-3 px-4">{getStatusBadge(team.status)}</td>
      <td className="py-3 px-4 text-foreground">{team.players}</td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <span className="text-foreground font-medium">{team.winRate}%</span>
          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full",
                team.winRate >= 70
                  ? "bg-success"
                  : team.winRate >= 50
                    ? "bg-warning"
                    : "bg-destructive",
              )}
              style={{ width: `${team.winRate}%` }}
            />
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <span className="text-foreground font-medium">
            {team.predictionAccuracy}%
          </span>
          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full",
                team.predictionAccuracy >= 70
                  ? "bg-success"
                  : team.predictionAccuracy >= 50
                    ? "bg-warning"
                    : "bg-destructive",
              )}
              style={{ width: `${team.predictionAccuracy}%` }}
            />
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
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
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <UserPlus className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default function AnalyticsTeams() {
  const [selectedTeam, setSelectedTeam] = useState<
    (typeof teamsData)[0] | null
  >(teamsData[0]);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-screen bg-[#0a0a0f] overflow-hidden">
      <AnalyticsSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AnalyticsTopbar title="Teams & Players" />
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
                      Teams & Players Management
                    </h1>
                    <p className="text-muted-foreground">
                      Manage esports teams, players, and rosters with
                      comprehensive analytics.
                    </p>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90 font-semibold px-6">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Team
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Team Type
                    </span>
                    <div className="flex items-center gap-1">
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-white/5"
                      >
                        Professional
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-white/5"
                      >
                        Amateur
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-white/5"
                      >
                        Academy
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Player Role
                    </span>
                    <div className="flex items-center gap-1">
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-white/5"
                      >
                        Carry
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-white/5"
                      >
                        Support
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-white/5"
                      >
                        Jungler
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Status
                    </span>
                    <div className="flex items-center gap-1">
                      <Badge className="bg-success/20 text-success border-success/30 cursor-pointer">
                        Active
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-white/5"
                      >
                        Inactive
                      </Badge>
                      <Badge className="bg-warning/20 text-warning border-warning/30 cursor-pointer">
                        On hold
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-[200px] bg-[#12121a] border-white/10"
                    />
                  </div>
                </div>
              </div>

              {/* Teams Table */}
              <div className="bg-[#12121a] rounded-xl border border-white/5 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#0a0a0f]">
                    <tr className="border-b border-white/5">
                      <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Team ID
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Name
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Type
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Players
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Win Rate
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Prediction Accuracy
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamsData.map((team) => (
                      <TeamRow
                        key={team.id}
                        team={team}
                        isSelected={selectedTeam?.id === team.id}
                        onSelect={() => setSelectedTeam(team)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Sections */}
              <div className="grid grid-cols-2 gap-6">
                {/* Players Section */}
                <div className="bg-[#12121a] rounded-xl border border-white/5 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Players</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {playersData.map((player) => (
                      <div
                        key={player.id}
                        className="bg-[#0a0a0f] rounded-xl p-4 border border-white/5"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={player.avatar} />
                            <AvatarFallback>{player.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">
                              {player.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {player.role}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {player.winRate}% WR
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Player Predictions */}
                <div className="bg-[#12121a] rounded-xl border border-white/5 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">
            Recent Player Live Calls
                    </h3>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="py-2 text-left text-xs font-medium text-muted-foreground">
                          Player
                        </th>
                        <th className="py-2 text-left text-xs font-medium text-muted-foreground">
                          Team
                        </th>
                        <th className="py-2 text-left text-xs font-medium text-muted-foreground">
                          Prediction
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
                      {recentPredictions.map((pred) => (
                        <tr key={pred.id} className="border-b border-white/5">
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={pred.avatar} />
                                <AvatarFallback>
                                  {pred.player[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-foreground">
                                {pred.player}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 text-sm text-muted-foreground">
                            {pred.team}
                          </td>
                          <td className="py-3 text-sm text-muted-foreground">
                            {pred.prediction}
                          </td>
                          <td className="py-3">
                            <Badge className="bg-success/20 text-success border-success/30 text-xs">
                              {pred.status}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Team Details */}
            <div className="w-[340px] border-l border-white/5 p-6 space-y-6 bg-[#0a0a0f]/50">
              {selectedTeam && (
                <>
                  {/* Team Details Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">
                      Team Details
                    </h3>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Team Info Card */}
                  <div className="bg-[#12121a] rounded-xl border border-white/5 p-4">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={selectedTeam.logo}
                        alt={selectedTeam.name}
                        className="w-16 h-16 rounded-xl"
                      />
                      <div>
                        <h4 className="text-lg font-semibold text-foreground">
                          {selectedTeam.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className="bg-primary/10 border-primary/30 text-primary text-xs"
                          >
                            {selectedTeam.type}
                          </Badge>
                          <Badge className="bg-success/20 text-success border-success/30 text-xs">
                            {selectedTeam.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">est. 2018</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          Los Angeles, USA
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Coach Carter</p>
                      </div>
                    </div>
                  </div>

                  {/* Players Roster */}
                  <div className="bg-[#12121a] rounded-xl border border-white/5 p-4">
                    <h4 className="font-semibold text-foreground mb-3">
                      Players Roster
                    </h4>
                    <div className="space-y-2">
                      {playersData.slice(0, 4).map((player) => (
                        <div
                          key={player.id}
                          className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={player.avatar} />
                              <AvatarFallback>{player.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {player.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {player.role}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-primary">
                              {player.winRate}%
                            </span>
                            <span className="text-xs text-success">
                              {player.predictionAccuracy}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Team Statistics */}
                  <div className="bg-[#12121a] rounded-xl border border-white/5 p-4">
                    <h4 className="font-semibold text-foreground mb-3">
                      Team Statistics
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Win Rate
                        </p>
                        <p className="text-2xl font-display font-bold text-success">
                          {selectedTeam.winRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Loss Rate
                        </p>
                        <p className="text-2xl font-display font-bold text-destructive">
                          {100 - selectedTeam.winRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Win Streak
                        </p>
                        <p className="text-2xl font-display font-bold text-foreground">
                          5
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Prediction Accuracy
                        </p>
                        <p className="text-2xl font-display font-bold text-primary">
                          {selectedTeam.predictionAccuracy}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div className="bg-gradient-to-br from-[#1a1a2e] to-[#12121a] rounded-xl border border-primary/20 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <h4 className="font-semibold text-foreground">
                        AI Insights
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Key insight: Team Alpha has 75% win probability against
                      DragonFury.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="w-full">
                      Edit team
                    </Button>
                    <Button size="sm" className="w-full bg-primary">
                      Add player
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      Remove player
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
            Generate live calls
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full col-span-2"
                    >
                      Share
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
