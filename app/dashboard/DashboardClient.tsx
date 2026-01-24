"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { CookieBanner } from "@/components/legal/CookieBanner";
import MainLayoutShellNext from "./MainLayoutShellNext";

// IMPORTANT: On importe la page legacy Dashboard (src/legacy-pages/Dashboard)
// Elle doit rester "client-only" (elle utilise hooks, supabase, etc.)
import Dashboard from "@/legacy-pages/Dashboard";

/**
 * Next.js Dashboard shell mounting the existing legacy Dashboard page.
 * Legacy router shim removed (Next.js shell only).
 *
 * @example
 * // Used by app/dashboard/page.tsx:
 * // export default function Page(){ return <DashboardClient/> }
 */
export default function DashboardClient() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <NotificationProvider>
            <Toaster />
            <Sonner />
            <CookieBanner />

            <MainLayoutShellNext>
              <Dashboard />
            </MainLayoutShellNext>
          </NotificationProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
