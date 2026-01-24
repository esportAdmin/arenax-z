import { Button } from "@/components/ui/button";

export function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-8">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.3) 0%, transparent 50%),
                              radial-gradient(circle at 80% 50%, hsl(var(--secondary) / 0.3) 0%, transparent 50%)`
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">
            ArenaX Analytics Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Professional esports analytics & prediction platform
          </p>
        </div>
        <Button size="lg" className="bg-white text-background hover:bg-white/90 font-semibold px-8">
          Get Started
        </Button>
      </div>
    </div>
  );
}
