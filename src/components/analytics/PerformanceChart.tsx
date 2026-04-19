import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", teamA: 45, teamB: 55 },
  { month: "Feb", teamA: 52, teamB: 48 },
  { month: "Mar", teamA: 61, teamB: 42 },
  { month: "Apr", teamA: 58, teamB: 51 },
  { month: "May", teamA: 72, teamB: 38 },
  { month: "Jun", teamA: 68, teamB: 45 },
  { month: "Jul", teamA: 75, teamB: 52 },
];

export function PerformanceChart() {
  return (
    <div className="bg-[#12121a] rounded-2xl p-5 border border-white/5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Match Performance Chart</h3>
          <p className="text-sm text-muted-foreground">Team Win Rate (Last 6 Months)</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Team A</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-secondary" />
            <span className="text-sm text-muted-foreground">Team B</span>
          </div>
        </div>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="month" 
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a1a24', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fff'
              }}
              labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
            />
            <Line 
              type="monotone" 
              dataKey="teamA" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
            />
            <Line 
              type="monotone" 
              dataKey="teamB" 
              stroke="hsl(var(--secondary))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: 'hsl(var(--secondary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
