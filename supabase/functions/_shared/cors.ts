/// <reference path="./deno.d.ts" />

export function getAllowedOrigin(req: Request): string {
  const origin = req.headers.get("origin") ?? "";
  const siteUrl = Deno.env.get("SITE_URL") ?? "";
  const previewUrl = Deno.env.get("SITE_URL_PREVIEW") ?? "";

  const allow = new Set([siteUrl, previewUrl].filter(Boolean));
  return allow.has(origin) ? origin : siteUrl;
}

export function corsHeaders(req: Request): Record<string, string> {
  const origin = getAllowedOrigin(req);
  return {
    "Access-Control-Allow-Origin": origin,
    Vary: "Origin",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}
