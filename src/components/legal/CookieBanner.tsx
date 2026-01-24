"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cookie, X } from "lucide-react";
import { AppLink } from "@/components/AppLink";

const COOKIE_CONSENT_KEY = "esport_arena_cookie_consent";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

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
      <Card className="max-w-4xl mx-auto p-4 bg-background/95 backdrop-blur-sm border shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 text-primary">
            <Cookie className="h-8 w-8 flex-shrink-0" />
          </div>

          <div className="flex-1 space-y-1">
            <p className="font-medium">🍪 Nous utilisons des cookies</p>
            <p className="text-sm text-muted-foreground">
              Nous utilisons des cookies pour améliorer votre expérience,
              analyser le trafic et personnaliser le contenu. En continuant,
              vous acceptez notre{" "}
              <AppLink href="/privacy" className="underline hover:text-primary">
                politique de confidentialité
              </AppLink>
              .
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              className="flex-1 sm:flex-none"
            >
              Refuser
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="flex-1 sm:flex-none"
            >
              Accepter
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDecline}
              className="hidden sm:flex"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
