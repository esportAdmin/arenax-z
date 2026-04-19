"use client";

import { Crown, Gem, Shield, Medal, Star } from "lucide-react";

interface Props {
  tier: string;
}

const tierConfig: Record<
  string,
  {
    label: string;
    className: string;
    icon: React.ReactNode;
  }
> = {
  challenger: {
    label: "Challenger",
    className:
      "bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg shadow-yellow-500/30",
    icon: <Crown className="w-4 h-4" />,
  },
  diamond: {
    label: "Diamond",
    className:
      "bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-md shadow-blue-500/30",
    icon: <Gem className="w-4 h-4" />,
  },
  platinum: {
    label: "Platinum",
    className: "bg-gradient-to-r from-slate-400 to-slate-600 text-white",
    icon: <Shield className="w-4 h-4" />,
  },
  gold: {
    label: "Gold",
    className: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black",
    icon: <Medal className="w-4 h-4" />,
  },
  silver: {
    label: "Silver",
    className: "bg-gradient-to-r from-gray-300 to-gray-400 text-black",
    icon: <Star className="w-4 h-4" />,
  },
  bronze: {
    label: "Bronze",
    className: "bg-gradient-to-r from-orange-700 to-orange-900 text-white",
    icon: <Star className="w-4 h-4" />,
  },
};

export function DivisionBadge({ tier }: Props) {
  const config = tierConfig[tier] ?? tierConfig["bronze"];

  return (
    <div
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}
    >
      {config.icon}
      {config.label}
    </div>
  );
}
