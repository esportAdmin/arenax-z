# ArenaX Domain Rollout Plan

Date: 2026-04-15
Workspace: `C:\arena-forge-main`

## Decision

Planned public domain:

```text
rallyguild.gg
```

Status:

```text
planned, not purchased yet
```

Do not configure production systems as if the domain is owned until the domain is purchased and connected in Vercel.

## Brand Positioning

Use this domain to support the product positioning:

```text
RallyGuild helps Discord and Twitch-led gaming communities turn daily activity into retention loops.
```

Recommended transition:

- short term: keep `ArenaX-Z` inside the app while preview testing continues
- launch prep: introduce `RallyGuild by ArenaX-Z` in documentation and commercial language
- public launch: use `RallyGuild` as the market-facing domain and brand if the domain is secured

## Why This Domain

`rallyguild.gg` is aligned with:

- gaming-native expectations through `.gg`
- community activation through `Rally`
- Discord/server identity through `Guild`
- the retention product promise: bring people back every day

Avoid over-investing in secondary domains before launch. Do not buy `.fr`, `.online`, `.info`, or bundles unless there is a clear defensive-brand reason later.

## Purchase Checklist

When ready to buy:

1. purchase only `rallyguild.gg`
2. keep WHOIS/privacy protection enabled if included
3. decline registrar hosting, website builder, paid SSL, VPN, logo maker, and email upsells
4. keep registrar login and 2FA secure
5. store renewal date and price in the launch finance tracker

## Vercel Setup After Purchase

In Vercel:

1. open the `areanax-z` project
2. go to `Settings > Domains`
3. add:
   - `rallyguild.gg`
   - `www.rallyguild.gg`
4. follow Vercel's DNS instructions at the registrar
5. wait until Vercel shows the domain as valid and HTTPS-ready

Production app URL:

```text
https://rallyguild.gg
```

## Environment Variables After Purchase

In Vercel production environment variables, set:

```env
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_SITE_URL=https://rallyguild.gg
```

Do not set this production value before the domain is connected and verified.

## Supabase Auth After Purchase

In Supabase:

```text
Authentication > URL Configuration > Site URL
```

Set:

```text
https://rallyguild.gg
```

Add redirect URLs:

```text
https://rallyguild.gg/auth/callback
https://www.rallyguild.gg/auth/callback
```

Keep preview/local redirect URLs while preview QA is still active:

```text
http://localhost:3000/**
https://*-esportadmins-projects.vercel.app/**
```

## Discord and Twitch OAuth

Because ArenaX uses Supabase Auth, Discord and Twitch developer consoles must use the Supabase callback URL:

```text
https://bbxvpirknqzvjhezrqpo.supabase.co/auth/v1/callback
```

Do not replace this with `https://rallyguild.gg/auth/callback` in Discord or Twitch unless the app stops using Supabase as the OAuth broker.

Supabase is responsible for redirecting users back to:

```text
https://rallyguild.gg/auth/callback
```

## Final Production Smoke Test

After the domain is connected:

1. open `https://rallyguild.gg`
2. open `https://rallyguild.gg/login`
3. sign in with Discord
4. confirm redirect to `/dashboard`
5. sign out
6. sign in with Twitch
7. confirm redirect to `/dashboard`
8. check `/clubs`
9. check `/war-map`
10. check `/leaderboard`
11. check `/profile`
12. check `/rewards`
13. check `/api/health`

Acceptance criteria:

- no Vercel protection page on production
- no OAuth redirect loop
- no visible Google login
- no betting/gambling wording
- `/api/health` reports `app: "healthy"` and `database: "healthy"`
