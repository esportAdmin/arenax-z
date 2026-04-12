# ArenaX Production Environment Setup

Date: 2026-04-10
Workspace: `C:\arena-forge-main`

## Goal

This file defines the production environment variables required to publish ArenaX safely.

Use it for:
- preview deployments
- production deployments
- final launch review

## 1. Required Public Variables

These values are exposed to the client and must be valid for the deployed environment.

```env
NEXT_PUBLIC_APP_NAME=ArenaX
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_SITE_URL=https://your-domain.com

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Notes:
- `NEXT_PUBLIC_SITE_URL` must match the final deployed domain
- use the production Supabase project, not local or staging

## 2. Required Server Variables

These values must never be exposed publicly.

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Notes:
- this is required for profile bootstrap and admin-style server actions
- rotate it immediately if it was ever pasted into chat or screenshots

## 3. OAuth Configuration Variables

ArenaX is Discord-first and Twitch-second, so OAuth is launch-critical.

Supabase usually stores provider secrets in its dashboard, but you still need these values aligned across environments:

- production site URL
- Supabase auth redirect URLs
- Discord app redirect URLs
- Twitch app redirect URLs

ArenaX callback route:

```text
https://your-domain.com/auth/callback
```

Preview callback route example:

```text
https://your-preview-domain.vercel.app/auth/callback
```

## 4. Stripe Variables

Only set these if subscriptions are part of the release.

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_STRIPE_PRICE_STARTER=price_...
NEXT_PUBLIC_STRIPE_PRICE_PRO=price_...
NEXT_PUBLIC_STRIPE_PRICE_ELITE=price_...

STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Rules:
- never deploy test Stripe keys to production
- verify each price ID exists in the live Stripe account
- make sure the webhook points to the production domain or Supabase function target

## 5. Variables That Must Stay Out of Production

Do not keep development-only shortcuts active in production unless intentionally protected.

Review:
- local QA shortcuts
- test-only email accounts
- sandbox-only keys
- any `REPLACE_ME` values

Expected production behavior:
- `/api/auth/local-qa` unavailable
- `/api/auth/dev-bypass` unavailable

## 6. Environment Split

Recommended setup:

### Preview

```env
NEXT_PUBLIC_APP_ENV=preview
NEXT_PUBLIC_SITE_URL=https://preview-domain.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://preview-or-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_or_disabled
STRIPE_SECRET_KEY=sk_test_or_disabled
STRIPE_WEBHOOK_SECRET=whsec_test_or_disabled
```

### Production

```env
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_live_...
```

## 7. Supabase Dashboard Checks

In Supabase Auth:
- `Site URL` must match the final domain
- `Redirect URLs` must include:
  - `https://your-domain.com/auth/callback`
  - preview callback if using preview OAuth

In Providers:
- Discord enabled
- Twitch enabled
- Google optional only if you still want it
- email fallback only if intentionally retained

## 8. Final Validation Before Deploy

Before publishing, confirm:

- no `REPLACE_ME` values in deployed env
- `NEXT_PUBLIC_SITE_URL` points to the real domain
- Supabase project matches the env set
- OAuth callback URLs match exactly
- Stripe values are all test or all live, never mixed

## 9. Recommended Secret Ownership

Keep a simple owner map:

- Supabase prod keys: product/engineering owner
- Discord OAuth app: community/platform owner
- Twitch OAuth app: creator/platform owner
- Stripe live keys: billing owner

This avoids launch-day confusion.
