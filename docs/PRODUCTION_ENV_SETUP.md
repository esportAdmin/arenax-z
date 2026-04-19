# ArenaX Production Environment Setup

Date: 2026-04-10
Workspace: `C:\arena-forge-main`

## Goal

This file defines the production environment variables required to publish ArenaX safely.

Planned public domain:

```text
rallyguild.gg
```

Domain status:

```text
planned, not purchased yet
```

Use `https://rallyguild.gg` only after the domain is purchased, connected in Vercel, and HTTPS-ready.

Use it for:
- preview deployments
- production deployments
- final launch review

## 1. Required Public Variables

These values are exposed to the client and must be valid for the deployed environment.

```env
NEXT_PUBLIC_APP_NAME=ArenaX
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_SITE_URL=https://rallyguild.gg

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
https://rallyguild.gg/auth/callback
```

Preview callback route example:

```text
https://your-preview-domain.vercel.app/auth/callback
```

## 4. Lemon Squeezy Billing Variables

Use these if paid subscriptions are part of the release. Lemon Squeezy is the preferred launch provider because ArenaX is sold as a community retention SaaS, not as a gaming reward or financial product.

```env
NEXT_PUBLIC_BILLING_PROVIDER=lemonsqueezy
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_STARTER_MONTHLY=...
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_STARTER_YEARLY=...
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO_MONTHLY=...
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO_YEARLY=...
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ELITE_MONTHLY=...
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ELITE_YEARLY=...
NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_STARTER=...
NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_PRO=...
NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_ELITE=...

LEMONSQUEEZY_API_KEY=...
LEMONSQUEEZY_STORE_ID=...
LEMONSQUEEZY_TEST_MODE=false
```

Rules:
- never expose `LEMONSQUEEZY_API_KEY` publicly
- verify each variant ID belongs to the correct live Lemon Squeezy product
- create both monthly and yearly variants for Starter, Pro, and Elite
- set yearly variants at 10 months of the monthly price to offer 2 months free
- keep all subscription copy framed around retention, admin workflows, community activation, and virtual perks
- do not promise cash value, payouts, wagering, investment value, or financial return

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
NEXT_PUBLIC_BILLING_PROVIDER=lemonsqueezy
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_STARTER_MONTHLY=preview_or_test_variant
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_STARTER_YEARLY=preview_or_test_variant
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO_MONTHLY=preview_or_test_variant
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO_YEARLY=preview_or_test_variant
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ELITE_MONTHLY=preview_or_test_variant
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ELITE_YEARLY=preview_or_test_variant
LEMONSQUEEZY_API_KEY=test_or_disabled
LEMONSQUEEZY_STORE_ID=test_or_disabled
LEMONSQUEEZY_TEST_MODE=true
```

### Production

```env
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_SITE_URL=https://rallyguild.gg
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_BILLING_PROVIDER=lemonsqueezy
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_STARTER_MONTHLY=...
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_STARTER_YEARLY=...
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO_MONTHLY=...
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO_YEARLY=...
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ELITE_MONTHLY=...
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ELITE_YEARLY=...
NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_STARTER=...
NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_PRO=...
NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_ELITE=...
LEMONSQUEEZY_API_KEY=...
LEMONSQUEEZY_STORE_ID=...
LEMONSQUEEZY_TEST_MODE=false
```

## 7. Supabase Dashboard Checks

In Supabase Auth:
- launch blocker: `Site URL` must be changed from `http://localhost:3000` to the final production domain
- `Redirect URLs` must include:
  - `https://rallyguild.gg/auth/callback`
  - `https://www.rallyguild.gg/auth/callback`
  - preview callback if using preview OAuth

Production Site URL:

```text
Supabase > Authentication > URL Configuration > Site URL
```

Set it to:

```text
https://rallyguild.gg
```

Do this only once the Vercel production domain is connected and ready.

In Discord and Twitch developer consoles:
- keep the provider redirect URI set to the Supabase callback URL
- do not replace it with the app domain while Supabase remains the OAuth broker

Provider callback URL:

```text
https://bbxvpirknqzvjhezrqpo.supabase.co/auth/v1/callback
```

In Providers:
- Discord enabled
- Twitch enabled
- Google disabled unless it is intentionally part of the production login strategy
- email fallback only if intentionally retained

## 8. Final Validation Before Deploy

Before publishing, confirm:

- no `REPLACE_ME` values in deployed env
- `NEXT_PUBLIC_SITE_URL` points to the real domain
- Supabase project matches the env set
- OAuth callback URLs match exactly
- Lemon Squeezy values are all test or all live, never mixed

## 9. Recommended Secret Ownership

Keep a simple owner map:

- Supabase prod keys: product/engineering owner
- Discord OAuth app: community/platform owner
- Twitch OAuth app: creator/platform owner
- Lemon Squeezy API key/store/products: billing owner

This avoids launch-day confusion.
