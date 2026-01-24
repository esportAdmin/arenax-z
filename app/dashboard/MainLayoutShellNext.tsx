"use client";

import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";

/**
 * MainLayoutShellNext
 *
 * Next.js-compatible layout shell.
 * - No react-router usage
 * - Renders children instead of <Outlet />
 *
 * @example
 * export default function Page() {
 *   return (
 *     <MainLayoutShellNext>
 *       <div>Content</div>
 *     </MainLayoutShellNext>
 *   );
 * }
 */
export default function MainLayoutShellNext({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 px-4 pb-8">{children}</main>
    </div>
  );
}

