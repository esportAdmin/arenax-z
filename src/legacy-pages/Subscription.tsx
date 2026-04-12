"use client";

import { useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { SUBSCRIPTION_TIERS } from "@/lib/subscriptionTiers";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, Crown, Sparkles, Zap, Settings } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const Subscription = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    subscribed,
    tier: currentTier,
    subscriptionEnd,
    loading,
    checkoutLoading,
    portalLoading,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
  } = useSubscription();

  // Handle success/cancel from Stripe
  useEffect(() => {
    const sp = searchParams ?? new URLSearchParams();
    const success = sp.get("success");
    const canceled = sp.get("canceled");

    if (success === "true") {
      toast.success("Subscription successful! Welcome to the Arena.");
      checkSubscription();
    } else if (canceled === "true") {
      toast.info("Subscription canceled.");
    }
  }, [searchParams, checkSubscription]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth");
    }
  }, [user, authLoading, router]);

  const handleSubscribe = useCallback(
    async (priceId: string) => {
      try {
        await createCheckout(priceId);
      } catch (error) {
        toast.error("Failed to start checkout. Please try again.");
        console.error(error);
      }
    },
    [createCheckout],
  );

  const handleManageSubscription = useCallback(async () => {
    try {
      await openCustomerPortal();
    } catch (error) {
      toast.error("Failed to open subscription management. Please try again.");
      console.error(error);
    }
  }, [openCustomerPortal]);

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case "starter":
        return <Zap className="w-6 h-6" />;
      case "pro":
        return <Crown className="w-6 h-6" />;
      case "elite":
        return <Sparkles className="w-6 h-6" />;
      default:
        return <Zap className="w-6 h-6" />;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Stop render while redirecting
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get monthly Arena Points and exclusive features to dominate the
            community competition layer.
          </p>
        </div>

        {/* Current Subscription Status */}
        {subscribed && currentTier && (
          <div className="max-w-2xl mx-auto mb-12">
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getTierIcon(currentTier.id)}
                    <div>
                      <CardTitle className="text-xl">
                        Current Plan: {currentTier.name}
                      </CardTitle>
                      <CardDescription>
                        {subscriptionEnd && (
                          <>
                            Renews on{" "}
                            {new Date(subscriptionEnd).toLocaleDateString()}
                          </>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-primary/20 text-primary"
                  >
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardFooter>
                <Button
                  variant="outline"
                  onClick={handleManageSubscription}
                  disabled={portalLoading}
                  className="w-full"
                >
                  {portalLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Settings className="w-4 h-4 mr-2" />
                  )}
                  Manage Subscription
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {Object.values(SUBSCRIPTION_TIERS).map((tier) => {
            const isCurrentPlan = currentTier?.id === tier.id;

            return (
              <Card
                key={tier.id}
                className={`relative transition-all duration-300 hover:shadow-xl ${
                  tier.popular
                    ? "border-primary shadow-lg scale-105"
                    : "border-border hover:border-primary/50"
                } ${isCurrentPlan ? "ring-2 ring-primary" : ""}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-3 right-4">
                    <Badge
                      variant="secondary"
                      className="bg-green-500/20 text-green-500"
                    >
                      Your Plan
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-2">
                  <div className="mx-auto mb-3 p-3 rounded-full bg-primary/10 text-primary w-fit">
                    {getTierIcon(tier.id)}
                  </div>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">
                      ${tier.price}
                    </span>
                    <span className="text-muted-foreground">
                      /{tier.interval}
                    </span>
                  </div>
                  <CardDescription className="mt-2">
                    {tier.arenaPointsPerMonth.toLocaleString()} Arena Points /
                    month
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-4">
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground text-sm">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    variant={tier.popular ? "default" : "outline"}
                    disabled={checkoutLoading || isCurrentPlan}
                    onClick={() => handleSubscribe(tier.price_id)}
                  >
                    {checkoutLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    {isCurrentPlan ? "Current Plan" : "Subscribe"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* FAQ or additional info */}
        <div className="text-center mt-12 text-muted-foreground">
          <p>
            All plans include automatic monthly Arena Points delivery.
            <br />
            Cancel anytime with no questions asked.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Subscription;
