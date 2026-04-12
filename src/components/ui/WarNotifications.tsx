"use client";

import { useWarNotifications } from "@/hooks/useWarNotifications";

export default function WarNotifications() {
  const notifications = useWarNotifications();

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 space-y-2">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="rounded border border-cyan-400/30 bg-black/80 px-3 py-2 text-xs text-white shadow-lg"
        >
          {n.message}
        </div>
      ))}
    </div>
  );
}
