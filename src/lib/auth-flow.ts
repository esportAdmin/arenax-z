const DEFAULT_AUTH_REDIRECT = "/dashboard";

export function sanitizeRedirectPath(
  value: string | null | undefined,
  fallback = DEFAULT_AUTH_REDIRECT,
) {
  if (!value) {
    return fallback;
  }

  const trimmed = value.trim();

  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return fallback;
  }

  if (
    trimmed.startsWith("/auth") ||
    trimmed.startsWith("/login") ||
    trimmed.startsWith("/logout")
  ) {
    return fallback;
  }

  return trimmed;
}

export function formatAuthIssue(
  raw: string | null | undefined,
  providerLabel?: string | null,
) {
  if (!raw) {
    return null;
  }

  const value = raw.replace(/\+/g, " ").trim().toLowerCase();
  const providerPrefix = providerLabel ? `${providerLabel} ` : "";

  if (value.includes("access_denied") || value.includes("denied")) {
    return `${providerPrefix}access was canceled. Try again when you are ready.`;
  }

  if (value.includes("oauth") || value.includes("provider")) {
    return `The ${providerPrefix.toLowerCase() || "provider "}login could not be completed. Please retry the sign-in flow.`;
  }

  if (value.includes("expired") || value.includes("invalid")) {
    return "Your sign-in link expired or became invalid. Start the login flow again.";
  }

  return raw.replace(/\+/g, " ");
}

export function getUrlWithoutAuthArtifacts(urlString: string) {
  const url = new URL(urlString);
  const authKeys = [
    "code",
    "error",
    "error_code",
    "error_description",
    "state",
    "scope",
    "authError",
    "sb",
  ];

  let changed = false;

  for (const key of authKeys) {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key);
      changed = true;
    }
  }

  if (url.hash.startsWith("#")) {
    const hashParams = new URLSearchParams(url.hash.slice(1));
    for (const key of authKeys) {
      if (hashParams.has(key)) {
        hashParams.delete(key);
        changed = true;
      }
    }

    const nextHash = hashParams.toString();
    url.hash = nextHash ? `#${nextHash}` : "";
  }

  return {
    changed,
    url: `${url.pathname}${url.search}${url.hash}`,
  };
}

export function readAuthIssueFromLocation(locationLike: Location) {
  const searchParams = new URLSearchParams(locationLike.search);
  const hashParams = new URLSearchParams(locationLike.hash.replace(/^#/, ""));

  return (
    searchParams.get("authError") ??
    searchParams.get("error_description") ??
    searchParams.get("error") ??
    hashParams.get("error_description") ??
    hashParams.get("error") ??
    null
  );
}

export function readAuthProviderFromLocation(locationLike: Location) {
  const searchParams = new URLSearchParams(locationLike.search);
  return searchParams.get("provider");
}
