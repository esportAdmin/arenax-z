import Link from "next/link";

export default function AccountPendingDeletionPage() {
  return (
    <main className="min-h-screen bg-[#050816] px-6 py-16 text-white">
      <div className="mx-auto flex max-w-2xl flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300/80">
            GDPR Request
          </p>
          <h1 className="text-3xl font-black">Account deletion in progress</h1>
          <p className="text-sm leading-6 text-white/65">
            Your account is currently scheduled for deletion. Access to gameplay
            features is paused while the request is processed.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-white/70">
          If this request was made by mistake, use the cancellation link sent to
          your email inbox or contact support before the retention window ends.
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="rounded-xl border border-cyan-400/20 bg-cyan-500/15 px-4 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/25"
          >
            Contact support
          </Link>
          <Link
            href="/privacy"
            className="rounded-xl border border-white/10 px-4 py-3 text-sm text-white/70 transition hover:bg-white/5"
          >
            Privacy policy
          </Link>
        </div>
      </div>
    </main>
  );
}
