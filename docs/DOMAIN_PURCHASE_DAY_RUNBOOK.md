# RallyGuild Domain Purchase Day Runbook

Date: 2026-04-15
Workspace: `C:\arena-forge-main`

## Goal

This is the step-by-step operating plan for the day `rallyguild.gg` is purchased.

The goal is not just to own the domain. The goal is to connect it safely to Vercel, align Supabase auth, preserve Discord/Twitch OAuth, and validate the full production user journey without breaking the existing preview.

## Current Assumptions

- Product repository: `esportAdmin/arenax-z`
- Vercel project: `areanax-z`
- Preview branch: `codex/preview-release`
- Planned domain: `rallyguild.gg`
- Production URL after purchase: `https://rallyguild.gg`
- Supabase project ref: `bbxvpirknqzvjhezrqpo`
- Supabase OAuth callback used by Discord/Twitch:

```text
https://bbxvpirknqzvjhezrqpo.supabase.co/auth/v1/callback
```

Do not change the Discord/Twitch provider callback away from Supabase while Supabase remains the OAuth broker.

## Do Not Do

- Do not buy registrar hosting.
- Do not buy paid SSL from the registrar.
- Do not buy website builder.
- Do not buy extra `.fr`, `.online`, `.info`, `.shop`, or bundle domains during the first purchase.
- Do not change Supabase `Site URL` before Vercel confirms `rallyguild.gg` is connected and HTTPS-ready.
- Do not paste secrets into chat, docs, screenshots, GitHub, or commit history.

## Minute-by-Minute Plan

### T-15 Minutes: Pre-Flight

1. Confirm the latest preview is healthy:

```powershell
cd C:\arena-forge-main
npx.cmd vercel curl /api/health --deployment https://areanax-z-git-codex-preview-release-esportadmins-projects.vercel.app
```

2. Confirm the current release branch is pushed:

```powershell
git status --short
git log -1 --oneline
```

3. Keep the current preview URL open as the fallback environment.

### T+0: Purchase Domain

At the registrar:

1. purchase only:

```text
rallyguild.gg
```

2. keep privacy protection enabled if it is included
3. enable 2FA on the registrar account
4. save the renewal date and renewal price
5. decline hosting, SSL, email, website builder, VPN, logo maker, and domain bundles

### T+10: Add Domain to Vercel

In Vercel:

```text
Project > areanax-z > Settings > Domains
```

Add:

```text
rallyguild.gg
www.rallyguild.gg
```

Follow Vercel's DNS instructions. The exact DNS records depend on what Vercel shows, but typical records are:

```text
A     @      76.76.21.21
CNAME www    cname.vercel-dns.com
```

Use Vercel's displayed values as the source of truth.

### T+20: Configure DNS at Registrar

At the registrar DNS panel:

1. remove conflicting parked-page records if present
2. add the Vercel records exactly as shown
3. save changes

Expected wait:

```text
5 minutes to several hours
```

Do not change Supabase yet.

### T+30: Verify Vercel Domain

In Vercel:

```text
Project > Domains
```

Wait for:

```text
Valid Configuration
HTTPS enabled
```

Also test:

```text
https://rallyguild.gg
https://www.rallyguild.gg
```

Expected behavior:

- one domain should be canonical
- the other may redirect
- no certificate warning

### T+40: Set Production Environment Variables

In Vercel production environment variables:

```env
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_SITE_URL=https://rallyguild.gg
```

Confirm existing required production variables:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

If billing is not launching yet, do not force live billing variables.

### T+50: Supabase URL Configuration

In Supabase:

```text
Authentication > URL Configuration
```

Set Site URL:

```text
https://rallyguild.gg
```

Add Redirect URLs:

```text
https://rallyguild.gg/auth/callback
https://www.rallyguild.gg/auth/callback
```

Keep preview/local URLs during rollout:

```text
http://localhost:3000/**
http://localhost:3000/auth/callback
https://*-esportadmins-projects.vercel.app/**
```

### T+60: Confirm OAuth Providers

In Supabase:

```text
Authentication > Sign In / Providers
```

Expected:

```text
Discord enabled
Twitch enabled
Google disabled
Email fallback only if intentionally retained
```

In Discord Developer Portal and Twitch Developer Console, keep:

```text
https://bbxvpirknqzvjhezrqpo.supabase.co/auth/v1/callback
```

Do not change provider callbacks to `rallyguild.gg`.

### T+70: Deploy or Promote Production

Preferred approach:

1. deploy the current known-good branch to production
2. or promote the validated preview if that is the chosen Vercel workflow

After deployment, confirm:

```text
https://rallyguild.gg
```

loads the app, not a Vercel placeholder.

### T+80: Production Smoke Test

Run the public path:

1. open `https://rallyguild.gg`
2. open `https://rallyguild.gg/login`
3. click `Continue with Discord`
4. confirm redirect to `/dashboard`
5. sign out
6. click `Continue with Twitch`
7. confirm redirect to `/dashboard`
8. open `/clubs`
9. open `/war-map`
10. open `/leaderboard`
11. open `/profile`
12. open `/rewards`
13. open `/api/health`

Expected `/api/health`:

```json
{
  "status": "healthy",
  "app": "healthy",
  "database": "healthy"
}
```

`workers` can be `degraded` during early production only if background workers are not launched yet. Treat it as an operations follow-up, not as a frontend launch blocker.

### T+95: Automated QA

If production is public and not protected:

```powershell
cd C:\arena-forge-main
$env:QA_BASE_URL="https://rallyguild.gg"
$env:QA_OUTPUT_DIR="artifacts\qa-production-rallyguild"
npm run qa:agent
```

Acceptance:

```text
Failed checks: 0
Runtime errors: 0
```

### T+110: Final Launch Notes

Record:

- domain purchase date
- renewal date
- registrar
- Vercel deployment URL
- production domain status
- Supabase Site URL status
- Discord login result
- Twitch login result
- QA report path

## Rollback

If production fails:

1. keep the preview branch intact
2. revert `NEXT_PUBLIC_SITE_URL` only if the production domain causes auth loops
3. restore Supabase `Site URL` to the last working public URL if needed
4. use Vercel rollback to return to the previous known-good deployment
5. do not delete the domain from Vercel unless DNS/certificate validation is the source of failure

Rollback triggers:

- OAuth callback loop
- dashboard unreachable after OAuth
- production app returns 404 or Vercel placeholder
- broken TLS/certificate
- visible Google login if production strategy is Discord/Twitch only
- gambling/betting wording visible on public pages

## Post-Purchase Brand Move

After the domain is live, use this transition language:

```text
RallyGuild by ArenaX-Z
```

Do not rename every UI surface immediately unless product QA confirms there are no broken references. Use the domain first, then perform a controlled brand pass.
