import { Suspense } from "react";
import Auth from "@/legacy-pages/Auth";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background px-6">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/80 px-8 py-10 text-center text-sm text-muted-foreground backdrop-blur-xl">
            Loading secure access...
          </div>
        </div>
      }
    >
      <Auth />
    </Suspense>
  );
}

