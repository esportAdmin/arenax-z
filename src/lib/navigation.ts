/**
 * Return a boolean indicating whether we're on the client.
 *
 * @example
 * isBrowser(); // true in browser, false on server
 */
export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * Minimal navigate API shared across the app (Next-only).
 */
export type AppNavigate = (to: string, opts?: { replace?: boolean }) => void;

/**
 * Deprecated (React Router only) - kept as a no-op mapper to avoid refactors.
 * Do NOT use in new code.
 *
 * @example
 * toRRNavigateOptions({ replace: true }); // { replace: true }
 */
export function toRRNavigateOptions(opts?: {
  replace?: boolean;
}): { replace?: boolean } | undefined {
  if (!opts) return undefined;
  return { replace: opts.replace };
}
