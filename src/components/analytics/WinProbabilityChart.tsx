import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Team A", value: 65 },
  { name: "Team B", value: 35 },
];

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))"];

const mapData = [
  { name: "Map 1", value: 60 },
  { name: "", value: 65 },
  { name: "Map 2", value: 70 },
];

export function WinProbabilityChart() {
  return (
    <div className="bg-[#12121a] rounded-2xl p-5 border border-white/5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Win Probability</h3>
        <p className="text-sm text-muted-foreground">Team A: 65%</p>
      </div>

      <div className="relative h-[180px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-display font-bold text-foreground">65%</span>
        </div>
      </div>

      {/* Map bars */}
      <div className="flex items-end justify-center gap-3 mt-4 h-20">
        {mapData.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div 
              className="w-10 rounded-t-lg bg-gradient-to-t from-primary/50 to-primary"
              style={{ height: `${item.value}px` }}
            />
            <span className="text-xs text-muted-foreground">{item.name || `${item.value}%`}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
