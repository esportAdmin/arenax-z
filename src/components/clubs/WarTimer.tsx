"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface Props {
  endDate?: string;
}

export function WarTimer({ endDate }: Props) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!endDate) return;

    const updateTimer = () => {
      const end = new Date(endDate).getTime();
      const now = Date.now();

      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("War ended");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}h ${minutes
          .toString()
          .padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`,
      );
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <div className="glass-card p-6 mt-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Clock className="w-5 h-5 text-primary" />
        <span className="font-semibold">War ends in</span>
      </div>

      <div className="text-xl font-bold">{timeLeft}</div>
    </div>
  );
}
