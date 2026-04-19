export interface LiveCallMission {
  attention: string;
  actionLabel: string;
  accent: "cyan" | "blue" | "orange" | "locked";
  community: string;
  lockTime: string;
  signal: string;
  status: "Live" | "Upcoming" | "Completed" | "Locked";
  subtitle: string;
  title: string;
}

export const missions: LiveCallMission[] = [
  {
    actionLabel: "Make live call",
    accent: "cyan",
    attention: "95%",
    community: "Team Alpha",
    lockTime: "00:15:30",
    signal: "High",
    status: "Live",
    subtitle: "Valorant match pulse",
    title: "Daily Live Call",
  },
  {
    actionLabel: "Rally members",
    accent: "blue",
    attention: "85%",
    community: "Community Beta",
    lockTime: "01:20:45",
    signal: "Medium",
    status: "Upcoming",
    subtitle: "Community night ready",
    title: "Community Game Night",
  },
  {
    actionLabel: "View results",
    accent: "orange",
    attention: "72%",
    community: "Guild Omega",
    lockTime: "Completed",
    signal: "Stable",
    status: "Completed",
    subtitle: "Weekend raid recap",
    title: "Weekend Raid Plan",
  },
  {
    actionLabel: "Unlock ritual layer",
    accent: "locked",
    attention: "0%",
    community: "Cyber Sink",
    lockTime: "08:42:15",
    signal: "Locked",
    status: "Locked",
    subtitle: "Premium return cadence",
    title: "Premium Return Ritual",
  },
];

export const recentCalls = [
  ["Today", "Daily call opened", "+240 XP"],
  ["Yesterday", "Member rally completed", "+180 XP"],
  ["Monday", "Community night synced", "+120 XP"],
] as const;

export const pulseMembers = [
  ["CyberNinja99", "Contributed", "Live"],
  ["PixelQueen", "Rallied", "Active"],
  ["NeroStrike", "Returned", "Ready"],
] as const;

export const ritualStats = [
  ["Live now", "3"],
  ["Calls today", "12"],
  ["Members rallied", "248"],
  ["Reset timer", "08:42:15"],
] as const;
