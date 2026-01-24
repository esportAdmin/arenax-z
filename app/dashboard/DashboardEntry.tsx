// app/dashboard/DashboardEntry.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { CookieBanner } from "@/components/legal/CookieBanner";
import MainLayoutShellNext from "./MainLayoutShellNext";
import Dashboard from "@/legacy-pages/Dashboard";

const queryClient = new QueryClient();

export default function DashboardEntry() {
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
