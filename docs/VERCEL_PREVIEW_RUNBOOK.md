# ArenaX Vercel Preview Runbook

Date: 2026-04-10
Workspace: `C:\arena-forge-main`

## Goal

This runbook is the safest path to get ArenaX online in a private preview before public launch.

Planned public domain after purchase:

```text
rallyguild.gg
```

Keep the preview domain active until `rallyguild.gg` is purchased, connected in Vercel, and validated with Discord/Twitch OAuth.

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

- keep the redirect URI pointed at the Supabase OAuth callback:
  - `https://bbxvpirknqzvjhezrqpo.supabase.co/auth/v1/callback`

Make sure the same provider is enabled in Supabase, and make sure the preview callback is allowed in Supabase Redirect URLs:

```text
https://your-preview-domain.vercel.app/auth/callback
```

## 5. Configure Twitch

In the Twitch developer console:

- keep the redirect URI pointed at the Supabase OAuth callback:
  - `https://bbxvpirknqzvjhezrqpo.supabase.co/auth/v1/callback`

Make sure the app is aligned with the Supabase provider configuration, and make sure the preview callback is allowed in Supabase Redirect URLs:

```text
https://your-preview-domain.vercel.app/auth/callback
```

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

## 8. Allow QA Agent Access Through Preview Protection

If Vercel Deployment Protection is enabled, normal browsers and automated QA will receive `401` or land on `vercel.com/login`.

That is expected. The app can still be healthy behind the protection.

Use one of these two options before running automated preview QA:

### Option A: Temporary Public QA Window

1. open the Vercel project
2. go to `Settings`
3. open `Deployment Protection`
4. temporarily disable protection for preview deployments
5. run the QA agent
6. re-enable protection immediately after the report is clean

This is the fastest option for a short internal validation session.

### Option B: Protection Bypass for Automation

1. open the Vercel project
2. go to `Settings`
3. open `Deployment Protection`
4. create or copy the protection bypass secret for automation
5. run:

```powershell
$env:QA_BASE_URL="https://your-preview-domain.vercel.app"
$env:QA_VERCEL_PROTECTION_BYPASS="paste-the-vercel-bypass-secret-here"
$env:QA_OUTPUT_DIR="artifacts\qa-preview-protected"
npm run qa:agent
```

The QA agent already supports Vercel's bypass flow by setting the bypass cookie before checking routes.

Never commit or paste the bypass secret into docs, GitHub, screenshots, or chat history.

## 9. Promote to Production

Only after preview passes:

1. add production env variables
2. update `NEXT_PUBLIC_SITE_URL` to `https://rallyguild.gg` after purchase and Vercel domain validation
3. confirm Discord and Twitch still use the Supabase OAuth callback URL
4. update Supabase `Site URL` to `https://rallyguild.gg`
5. deploy production

## 10. Production Smoke Test

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

## 11. Rollback Rule

Rollback immediately if any of these happens:

- OAuth callback loop
- dashboard inaccessible after login
- broken production build
- broken middleware/auth redirects
- broken subscription flow if billing is part of launch

## 12. Best Next Move

After the preview is stable:

- create a short launch checklist
- set the final domain
- repeat the smoke test on production
