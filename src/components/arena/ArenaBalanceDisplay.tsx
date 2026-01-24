import { motion, AnimatePresence } from "framer-motion";
import { Coins, TrendingUp, TrendingDown } from "lucide-react";
import { useArenaBalance } from "@/hooks/useArenaBalance";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

interface ArenaBalanceDisplayProps {
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export const ArenaBalanceDisplay = ({
  className,
  showIcon = true,
  size = "md",
  animated = true,
}: ArenaBalanceDisplayProps) => {
  const { balance, loading } = useArenaBalance();
  const [displayBalance, setDisplayBalance] = useState(balance);
  const [trend, setTrend] = useState<"up" | "down" | null>(null);
  const prevBalanceRef = useRef(balance);

  useEffect(() => {
    if (balance !== prevBalanceRef.current) {
      if (balance > prevBalanceRef.current) {
        setTrend("up");
      } else if (balance < prevBalanceRef.current) {
        setTrend("down");
      }
      
      // Animate the number counting
      if (animated) {
        const diff = balance - prevBalanceRef.current;
        const steps = 20;
        const stepValue = diff / steps;
        let currentStep = 0;
        
        const interval = setInterval(() => {
          currentStep++;
          if (currentStep >= steps) {
            setDisplayBalance(balance);
            clearInterval(interval);
          } else {
            setDisplayBalance(Math.round(prevBalanceRef.current + stepValue * currentStep));
          }
        }, 30);
        
        // Clear trend indicator after animation
        setTimeout(() => setTrend(null), 2000);
        
        prevBalanceRef.current = balance;
        return () => clearInterval(interval);
      } else {
        setDisplayBalance(balance);
        prevBalanceRef.current = balance;
      }
    }
  }, [balance, animated]);

  const sizeClasses = {
    sm: "text-sm gap-1",
    md: "text-base gap-1.5",
    lg: "text-lg gap-2",
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  if (loading) {
    return (
      <div className={cn("flex items-center", sizeClasses[size], className)}>
        {showIcon && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Coins className="text-primary" size={iconSizes[size]} />
          </motion.div>
        )}
        <div className="h-4 w-12 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <motion.div
      className={cn(
        "flex items-center font-semibold",
        sizeClasses[size],
        className
      )}
      initial={animated ? { scale: 0.9, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {showIcon && (
        <motion.div
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Coins className="text-primary" size={iconSizes[size]} />
        </motion.div>
      )}
      
      <AnimatePresence mode="wait">
        <motion.span
          key={displayBalance}
          initial={animated ? { y: trend === "up" ? 10 : -10, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: trend === "up" ? -10 : 10, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "tabular-nums",
            trend === "up" && "text-green-500",
            trend === "down" && "text-destructive"
          )}
        >
          {displayBalance.toLocaleString()}
        </motion.span>
      </AnimatePresence>

      <AnimatePresence>
        {trend && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            {trend === "up" ? (
              <TrendingUp className="text-green-500" size={iconSizes[size] - 2} />
            ) : (
              <TrendingDown className="text-destructive" size={iconSizes[size] - 2} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
