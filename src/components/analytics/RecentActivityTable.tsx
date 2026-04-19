import { cn } from "@/lib/utils";

interface Activity {
  date: string;
  activity: string;
  status: "completed" | "pending";
  action: string;
}

const activities: Activity[] = [
  {
    date: "Oct 28, 10:30 AM",
    activity: "Report Generated: 'Monthly Analysis'",
    status: "completed",
    action: "Download"
  },
  {
    date: "Oct 28, 09:15 AM",
    activity: "Live Signal Updated: Community Pulse 12345",
    status: "pending",
    action: "View"
  },
  {
    date: "Oct 25, 04:45 PM",
    activity: "Data Sync: Tournament Data",
    status: "completed",
    action: "Details"
  }
];

export function RecentActivityTable() {
  return (
    <div className="bg-[#0a0a0f] rounded-2xl border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <h3 className="font-semibold text-foreground">Recent Activity</h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Date</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Activity</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, index) => (
              <tr key={index} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                  {activity.date}
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {activity.activity}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      activity.status === "completed" ? "bg-success" : "bg-warning"
                    )} />
                    <span className="text-sm text-muted-foreground capitalize">
                      {activity.status}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button className="text-sm text-primary hover:underline">
                    {activity.action}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
