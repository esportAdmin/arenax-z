import { Search, Filter, Gamepad2, Radio, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FilterType = 'all' | 'live' | 'upcoming' | 'finished';

interface MatchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const MatchFilters = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange
}: MatchFiltersProps) => {
  const filters: { id: FilterType; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'Tous', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'live', label: 'En Direct', icon: <Radio className="w-4 h-4" /> },
    { id: 'upcoming', label: 'À Venir', icon: <Calendar className="w-4 h-4" /> },
    { id: 'finished', label: 'Terminés', icon: <CheckCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Rechercher équipes ou tournois..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 h-12 bg-card/50 border-border/50 text-base"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={activeFilter === filter.id ? "glass" : "ghost"}
            onClick={() => onFilterChange(filter.id)}
            className={`gap-2 whitespace-nowrap transition-all ${
              activeFilter === filter.id 
                ? "ring-1 ring-primary/50" 
                : "hover:bg-muted/50"
            }`}
          >
            {filter.icon}
            {filter.label}
            {filter.id === 'live' && (
              <span className="relative flex h-2 w-2 ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
              </span>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};
