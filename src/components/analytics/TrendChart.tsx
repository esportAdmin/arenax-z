import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "1", kdRatio: 1.2, goldDiff: 2.5 },
  { name: "2", kdRatio: 1.8, goldDiff: 3.2 },
  { name: "3", kdRatio: 2.1, goldDiff: 2.8 },
  { name: "4", kdRatio: 1.9, goldDiff: 3.8 },
  { name: "5", kdRatio: 2.5, goldDiff: 4.2 },
  { name: "6", kdRatio: 2.8, goldDiff: 3.5 },
  { name: "7", kdRatio: 3.2, goldDiff: 4.8 },
];

export function TrendChart() {
  return (
    <div className="bg-[#12121a] rounded-2xl p-5 border border-white/5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Trend Over Time</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">K/D Ratio</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <span className="text-sm text-muted-foreground">Gold Difference</span>
          </div>
        </div>
      </div>

      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorKd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorGold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="name" 
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              domain={[0, 5]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a1a24', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fff'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="kdRatio" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorKd)" 
            />
            <Area 
              type="monotone" 
              dataKey="goldDiff" 
              stroke="hsl(var(--warning))" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorGold)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
