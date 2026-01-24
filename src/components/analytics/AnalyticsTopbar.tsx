import { Bell, Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AnalyticsTopbarProps {
  title: string;
}

export function AnalyticsTopbar({ title }: AnalyticsTopbarProps) {
  return (
    <header className="h-16 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-sm flex items-center justify-between px-6">
      {/* Title */}
      <h1 className="text-2xl font-display font-bold text-foreground">{title}</h1>

      {/* Search & Actions */}
      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search across matches, teams, players..."
            className="pl-12 h-11 bg-[#12121a] border-white/10 rounded-full text-sm placeholder:text-muted-foreground focus:border-primary/50"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-0 right-0 w-5 h-5 bg-destructive rounded-full text-[10px] font-bold flex items-center justify-center text-white">
            3
          </span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <Avatar className="w-10 h-10 border-2 border-primary/30">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" />
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">Alex Chen</p>
            <p className="text-xs text-muted-foreground">Lead Analyst</p>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
