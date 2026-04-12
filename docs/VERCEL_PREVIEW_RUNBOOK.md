# ArenaX Vercel Preview Runbook

Date: 2026-04-10
Workspace: `C:\arena-forge-main`

## Goal

This runbook is the safest path to get ArenaX online in a private preview before public launch.

It assumes:
- Next.js deployment
- Vercel hosting
- Supabase auth
- Discord and Twitch OAuth

## 1. Create the Vercel Project

In Vercel:

1. import the repository
2. let Vercel detect Next.js
3. keep the default build command unless you intentionally override it

Expected commands:
- build: `next build`
- output: standard Next.js app

## 2. Add Preview Environment Variables

In the Vercel project settings, add preview variables first:

- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_APP_ENV=preview`
- `NEXT_PUBLIC_SITE_URL=https://your-preview-domain.vercel.app`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

If subscriptions are visible in preview:
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_STRIPE_PRICE_STARTER`
- `NEXT_PUBLIC_STRIPE_PRICE_PRO`
- `NEXT_PUBLIC_STRIPE_PRICE_ELITE`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## 3. Configure Supabase for Preview OAuth

In Supabase Auth settings:

- add the preview callback URL:
  - `https://your-preview-domain.vercel.app/auth/callback`
- keep the final production callback separate

If you use multiple preview domains, prefer a stable preview alias for OAuth testing.

## 4. Configure Discord

In the Discord developer portal:

- add the preview redirect URI:
  - `https://your-preview-domain.vercel.app/auth/callback`

Make sure the same provider is enabled in Supabase.

## 5. Configure Twitch

In the Twitch developer console:

- add the preview redirect URI:
  - `https://your-preview-domain.vercel.app/auth/callback`

Make sure the app is aligned with the Supabase provider configuration.

## 6. Deploy Preview

Trigger a preview deployment from the selected branch.

When preview is live, test:

- `/`
- `/login`
- Discord sign-in
- Twitch sign-in
- `/dashboard`
- `/clubs`
- `/war-map`
- `/leaderboard`
- `/profile`
- `/rewards`
- `/api/health`

## 7. Preview Acceptance Criteria

Preview is acceptable only if:

- home loads correctly
- login screen loads correctly
- Discord OAuth returns to the app
- Twitch OAuth returns to the app
- no auth redirect loop
- dashboard is reachable after login
- primary nav works
- footer links work
- no visible betting/gambling wording remains
- `/api/health` returns HTTP `200`
- `/api/health` reports `app: "healthy"` and `database: "healthy"`
- `/api/health` can report `workers: "not_configured"` or `workers: "degraded"` during preview if background jobs are not deployed yet

## 8. Promote to Production

Only after preview passes:

1. add production env variables
2. update `NEXT_PUBLIC_SITE_URL`
3. add production OAuth redirect URIs in Discord and Twitch
4. update Supabase `Site URL`
5. deploy production

## 9. Production Smoke Test

Immediately after prod deploy:

1. open `/`
2. open `/login`
3. test Discord login
4. test Twitch login
5. confirm `/dashboard`
6. confirm `/clubs`
7. confirm `/war-map`
8. confirm `/leaderboard`
9. confirm `/profile`
10. confirm `/rewards`
11. confirm `/api/health`

Expected `/api/health` shape during preview:

```json
{
  "status": "healthy",
  "app": "healthy",
  "database": "healthy",
  "workers": "not_configured"
}
```

If `workers` is `degraded`, the web app can still be preview-ready. Treat it as an operations task before public launch, not as a broken web deployment.

## 10. Rollback Rule

Rollback immediately if any of these happens:

- OAuth callback loop
- dashboard inaccessible after login
- broken production build
- broken middleware/auth redirects
- broken subscription flow if billing is part of launch

## 11. Best Next Move

After the preview is stable:

- create a short launch checklist
- set the final domain
- repeat the smoke test on production
