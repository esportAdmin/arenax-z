import type { LucideIcon } from "lucide-react";

export type WarTone = "cyan" | "orange" | "violet" | "emerald";

export interface FeedItem {
  icon: LucideIcon;
  label: string;
  time: string;
  tone: WarTone;
}

export interface ObjectiveItem {
  cta: string;
  progress: string;
  rewardLabel: string;
  rewardValue: string;
  state: "In Progress" | "Almost There" | "Active" | "Completed";
  title: string;
  tone: "cyan" | "orange" | "emerald";
}
