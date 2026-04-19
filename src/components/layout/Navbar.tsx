"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Trophy,
  TrendingUp,
  Coins,
  LayoutDashboard,
  User,
  Users,
  ShoppingBag,
  CreditCard,
  Crown,
  Sparkles,
  Zap,
  Calendar,
  LogOut,
  Swords,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AppLink } from "@/components/AppLink";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useArenaBalanceDisplay } from "@/hooks/useArenaBalance";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { differenceInDays, parseISO } from "date-fns";

const navLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "War Room", href: "/wars", icon: Swords },
  { name: "Live Calls", href: "/live-calls", icon: TrendingUp },
  { name: "Clubs", href: "/clubs", icon: Users },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Rewards", href: "/rewards", icon: Crown },
  { name: "Store", href: "/store", icon: ShoppingBag },
  { name: "Subscription", href: "/subscription", icon: CreditCard },
];

type NavigateOpts = { replace?: boolean };

/**
 * Next-only navigation for shared UI components.
 *
 * @example
 * const { navigate } = useAppNav();
 * navigate("/dashboard");
 */
function useAppNav(): {
  pathname: string;
  navigate: (to: string, opts?: NavigateOpts) => void;
} {
  const router = useRouter();
  const pathname = usePathname() ?? "/";

  const navigate = useMemo(() => {
    return (to: string, opts?: NavigateOpts) => {
      if (opts?.replace) router.replace(to);
      else router.push(to);
    };
  }, [router]);

  return { pathname, navigate };
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const { pathname, navigate } = useAppNav();
  const shouldShowLiveStatus =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/play") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/rewards") ||
    pathname.startsWith("/subscription");

  const { user, signOut } = useAuth();
  const {
    subscribed,
    tier,
    subscriptionEnd,
    loading: subLoading,
  } = useSubscription({
    enabled: Boolean(user) && shouldShowLiveStatus,
    poll: pathname.startsWith("/subscription"),
  });
  const { formatted, loading: balanceLoading } = useArenaBalanceDisplay({
    enabled: Boolean(user) && shouldShowLiveStatus,
  });

  const daysRemaining = subscriptionEnd
    ? differenceInDays(parseISO(subscriptionEnd), new Date())
    : null;

  const handleLogout = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  const getTierIcon = () => {
    if (!tier) return null;
    switch (tier.id) {
      case "elite":
        return <Crown className="w-3.5 h-3.5" />;
      case "pro":
        return <Sparkles className="w-3.5 h-3.5" />;
      default:
        return <Zap className="w-3.5 h-3.5" />;
    }
  };

  const getTierColor = () => {
    if (!tier) return "bg-muted text-muted-foreground";
    switch (tier.id) {
      case "elite":
        return "bg-gradient-to-r from-amber-500 to-yellow-400 text-white";
      case "pro":
        return "bg-gradient-to-r from-primary to-secondary text-white";
      default:
        return "bg-accent/20 text-accent";
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container-arena">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <AppLink href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-[196px] overflow-hidden rounded-xl border border-primary/15 bg-slate-950/50 shadow-[0_0_24px_rgba(77,243,255,0.12)] transition-transform duration-300 group-hover:scale-[1.01]">
              <Image
                src="/brand/rallyguild-navbar.svg"
                alt="RallyGuild by ArenaX"
                fill
                sizes="196px"
                className="object-contain p-0.5"
                priority
              />
            </div>
          </AppLink>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <AppLink key={link.name} href={link.href}>
                  <Button
                    variant="ghost"
                    className={`gap-2 ${
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </Button>
                </AppLink>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <NotificationCenter />

            {user && shouldShowLiveStatus && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 glass-card">
                <Coins className="w-4 h-4 text-accent" />
                {balanceLoading ? (
                  <div className="w-12 h-4 bg-muted animate-pulse rounded" />
                ) : (
                  <span className="font-display font-bold text-sm">
                    {formatted}
                  </span>
                )}
                <span className="text-muted-foreground text-xs font-medium">
                  AXT
                </span>
              </div>
            )}

            {user && shouldShowLiveStatus && !subLoading && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AppLink href="/subscription">
                      {subscribed && tier ? (
                        <Badge
                          className={`gap-1.5 px-2.5 py-1 font-medium cursor-pointer ${getTierColor()}`}
                        >
                          {getTierIcon()}
                          {tier.name}
                          {daysRemaining !== null && (
                            <span className="ml-1 text-xs opacity-80">
                              • {daysRemaining}d
                            </span>
                          )}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="gap-1.5 px-2.5 py-1 cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          Upgrade
                        </Badge>
                      )}
                    </AppLink>
                  </TooltipTrigger>
                  <TooltipContent>
                    {subscribed && daysRemaining !== null ? (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{daysRemaining} days remaining</span>
                      </div>
                    ) : (
                      <span>Upgrade to premium</span>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AppLink href="/profile">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Profile"
                          >
                            <User className="w-5 h-5" />
                          </Button>
                        </AppLink>
                      </TooltipTrigger>
                      <TooltipContent>Profile</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleLogout}
                          className="text-destructive hover:bg-destructive/10"
                          aria-label="Log Out"
                        >
                          <LogOut className="w-5 h-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Log Out</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              ) : (
                <>
                  <AppLink href="/auth">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </AppLink>
                  <AppLink href="/dashboard">
                    <Button variant="hero" size="sm">
                      Launch App
                    </Button>
                  </AppLink>
                </>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border/50 bg-background/95"
          >
            <div className="container-arena py-4 space-y-2">
              {navLinks.map((link) => (
                <AppLink
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg">
                    <link.icon className="w-5 h-5" />
                    <span className="font-medium">{link.name}</span>
                  </div>
                </AppLink>
              ))}

              <div className="pt-4 border-t border-border/50 space-y-2">
                {user ? (
                  <>
                    <AppLink href="/profile" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full gap-2">
                        <User className="w-4 h-4" />
                        My Profile
                      </Button>
                    </AppLink>

                    <Button
                      variant="outline"
                      className="w-full gap-2 text-destructive"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </Button>
                  </>
                ) : (
                  <>
                    <AppLink href="/auth" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </AppLink>
                    <AppLink href="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button variant="hero" className="w-full">
                        Launch App
                      </Button>
                    </AppLink>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
