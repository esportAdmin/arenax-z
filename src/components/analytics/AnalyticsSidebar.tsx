"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Gamepad2,
  Trophy,
  Users,
  BarChart3,
  Brain,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/analytics" },
  { icon: Gamepad2, label: "Matches", href: "/analytics/matches" },
  { icon: Trophy, label: "Tournaments", href: "/analytics/tournaments" },
  { icon: Users, label: "Clubs", href: "/clubs" },
  { icon: BarChart3, label: "Signals", href: "/analytics" },
  { icon: Brain, label: "Live Calls", href: "/live-calls" },
  { icon: FileText, label: "Reports", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/analytics/settings" },
];

export function AnalyticsSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "h-screen bg-[#0a0a0f] border-r border-white/5 flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <span className="text-white font-display font-bold text-lg">A</span>
        </div>
        {!collapsed && (
          <span className="font-display text-xl font-bold text-white">
            Arena<span className="text-primary">X</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/analytics" && pathname === "/analytics");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5",
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse button */}
      <div className="p-4 border-t border-white/5">
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="flex items-center gap-3 px-4 py-3 w-full text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-white/5"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
