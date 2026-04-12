"use client";

import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";
import { AppLink } from "@/components/AppLink";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const COOKIE_CONSENT_KEY = "esport_arena_cookie_consent";

export function CookieBanner() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (user) {
      setIsVisible(false);
      return;
    }

    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      const timer = window.setTimeout(() => setIsVisible(true), 1000);
      return () => window.clearTimeout(timer);
    }
  }, [user]);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-4">
      <Card className="mx-auto max-w-4xl border shadow-lg bg-background/95 p-4 backdrop-blur-sm">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 text-primary">
            <Cookie className="h-8 w-8 flex-shrink-0" />
          </div>

          <div className="flex-1 space-y-1">
            <p className="font-medium text-white">
              We use cookies to keep ArenaX-Z smooth
            </p>
            <p className="text-sm text-muted-foreground">
              Cookies help us improve performance, understand traffic, and keep
              the product trustworthy. By continuing, you agree to our{" "}
              <AppLink href="/privacy" className="underline hover:text-primary">
                privacy policy
              </AppLink>
              .
            </p>
          </div>

          <div className="flex w-full flex-shrink-0 items-center gap-2 sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              className="flex-1 sm:flex-none"
            >
              Essential only
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="flex-1 sm:flex-none"
            >
              Accept all
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDecline}
              className="hidden sm:flex"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
