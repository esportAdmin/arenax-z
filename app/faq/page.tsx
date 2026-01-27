import Link from "next/link";

export default function FaqPage() {
  return (
    <main className="container-arena py-12">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold">FAQ</h1>
        <p className="mt-4 text-muted-foreground">This page is coming soon.</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Back home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Contact
          </Link>
        </div>
      </div>
    </main>
  );
}
