# ArenaX Publishing Checklist

Date: 2026-04-10
Workspace: `C:\arena-forge-main`

## Goal

This checklist is the release path for publishing ArenaX as a production-ready retention platform for structured gaming communities.

Planned public domain:

```text
rallyguild.gg
```

Domain status:

```text
planned, not purchased yet
```

Do not switch production settings to `rallyguild.gg` until the domain is purchased, connected in Vercel, and HTTPS-ready.

Use it in this order:
- release candidate freeze
- production environment setup
- private preview validation
- public launch validation

## 1. Release Candidate Freeze

Before deploying anything:

- confirm the production build passes locally
- confirm `eslint` passes
- confirm `tsc --noEmit` passes
- stop mixing unrelated work into the release branch
- isolate deployment-critical changes from UI exploration or unfinished experiments

Recommended commands:

```powershell
cd C:\arena-forge-main
node_modules\.bin\eslint.cmd .
node_modules\.bin\tsc.cmd -p tsconfig.json --noEmit --pretty false
node_modules\.bin\next.cmd build
```

Release gate:
- no build errors
- no type errors
- no broken auth routes
- no launch-critical runtime blocker on `/`, `/login`, `/dashboard`, `/clubs`, `/war-map`, `/leaderboard`, `/profile`, `/rewards`

## 2. Production Environment Variables

Prepare a production-specific environment set.

Required:
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_APP_ENV=production`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

If subscriptions are enabled:
- `NEXT_PUBLIC_BILLING_PROVIDER=lemonsqueezy`
- `NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_STARTER_MONTHLY`
- `NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_STARTER_YEARLY`
- `NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO_MONTHLY`
- `NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO_YEARLY`
- `NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ELITE_MONTHLY`
- `NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ELITE_YEARLY`
- `NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_STARTER`
- `NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_PRO`
- `NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_ELITE`
- `LEMONSQUEEZY_API_KEY`
- `LEMONSQUEEZY_STORE_ID`
- `LEMONSQUEEZY_TEST_MODE`

Recommended hardening:
- do not expose local QA credentials in production
- do not keep `REPLACE_ME` values in the deployed environment
- rotate any secret that was ever pasted in chat or screenshots

## 3. Supabase Production Checks

In Supabase, verify:

- production project is the one referenced by `NEXT_PUBLIC_SUPABASE_URL`
- Auth providers are enabled only for the intended flows
- `Discord` is enabled
- `Twitch` is enabled
- `Google` is disabled unless we intentionally keep it as a public production login path
- email fallback is kept secondary or internal-only if that is still the product decision
- launch blocker: `Site URL` must be changed from `http://localhost:3000` to the real production domain before public launch
- allowed redirect URLs include:
  - `https://rallyguild.gg/auth/callback` after the domain is purchased and connected
  - `https://www.rallyguild.gg/auth/callback` after the domain is purchased and connected
  - preview URL callback if you want preview OAuth testing

Production domain reminder:

```text
Supabase > Authentication > URL Configuration > Site URL
```

Set it to:

```text
https://rallyguild.gg
```

Do this after the final domain is connected in Vercel and before the production OAuth smoke test.

Database checks:
- `profiles` table exists and supports the current onboarding/auth flow
- RLS policies allow the expected logged-in reads/writes
- `bootstrap-profile` route can create/update social profiles after OAuth

Functions and API checks:
- `check-subscription`
- `api/billing/checkout`
- Lemon Squeezy webhook/status sync before public paid launch
- any queue/matchmaking endpoints used by the visible product

## 4. Discord and Twitch OAuth

ArenaX is community-first, so this is a launch-critical area.

Discord:
- production client ID/secret configured in Supabase
- Discord Developer Portal redirect URL remains the Supabase callback URL: `https://bbxvpirknqzvjhezrqpo.supabase.co/auth/v1/callback`
- login flow returns to `/auth/callback`
- final redirect lands on the intended target page

Twitch:
- production client ID/secret configured in Supabase
- email scope is available and accepted
- Twitch Developer Console redirect URL remains the Supabase callback URL: `https://bbxvpirknqzvjhezrqpo.supabase.co/auth/v1/callback`
- login flow returns to `/auth/callback`

Must test both providers in:
- preview
- production

## 5. Lemon Squeezy and Billing

If billing is part of launch:

- live Lemon Squeezy API key is configured server-side only
- live store ID is configured
- live product and monthly/yearly variant IDs match the public plan cards
- yearly variants are priced at 10 months of monthly pricing to support the "2 months free" offer
- hosted checkout opens from `/subscription`
- webhook or status sync is configured before selling paid plans publicly
- at least one real test of:
  - checkout open
  - successful payment
  - subscription status update
  - webhook processing

If billing is not part of first public release:
- hide or downscope premium purchase prompts that cannot yet complete safely

## 6. Deployment Target

Before deploy:

- confirm target platform
- confirm domain ownership
- confirm TLS/HTTPS works

Suggested flow:

1. deploy a private preview
2. test OAuth on the preview
3. test core product pages
4. deploy production only after preview validation passes

## 7. Browser QA on Preview

Validate manually on preview:

- `/`
- `/login`
- `/dashboard`
- `/clubs`
- `/war-map`
- `/leaderboard`
- `/profile`
- `/rewards`

Check on desktop and mobile:
- no hydration errors
- no dead CTA on hero or primary navigation
- Discord login works
- Twitch login works
- footer links work
- no wording that sounds like gambling, betting, payout, stake, or real-money play

## 8. Production-Safety Checks

Before public release:

- disable local QA shortcuts in production
- confirm `/api/auth/local-qa` is unavailable in production
- confirm `/api/auth/dev-bypass` is unavailable in production
- confirm CSP/security headers are present through middleware
- confirm no test-only route is linked from the visible UI

## 9. Monitoring and Recovery

Set up launch-day visibility for:

- auth failures
- callback failures
- webhook failures
- queue/matchmaking failures
- profile bootstrap failures

Prepare a rollback plan:

- previous known-good deployment ID
- previous known-good environment set
- rollback owner
- rollback decision threshold

## 10. Launch-Day Runbook

Immediately before launch:

1. run local build one last time
2. deploy preview
3. validate OAuth
4. validate dashboard and club flows
5. deploy production
6. validate production OAuth
7. validate one full user journey

First user journey to validate:

1. land on `/`
2. open `/login`
3. sign in with Discord
4. land on `/dashboard`
5. open `/clubs`
6. open `/war-map`
7. open `/leaderboard`
8. open `/profile`
9. open `/rewards`

## 11. Honest Current Status

As of this checklist:

- local production build passes
- auth callback and login routes are hardened
- Discord/Twitch-first product framing is in place
- the repo is much closer to a publishable state

Still recommended before public launch:
- private preview validation
- real OAuth validation on the final domain
- production env review
- final browser QA pass on the deployed app
