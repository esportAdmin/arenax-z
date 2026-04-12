# OAuth QA Runbook

Use this runbook to validate the real community-first sign-in flow on a local ArenaX environment.

## Goal

Confirm that:

- Discord and Twitch both open the correct provider flow
- provider refusal returns cleanly to `/login`
- the requested destination is preserved after sign-in
- the player agent can reuse an authenticated browser profile

## Before you start

From `C:\arena-forge-main`:

```powershell
npm run dev
```

Keep that terminal open.

Open a second terminal in the same folder for QA runs.

## Discord final run

Run:

```powershell
$env:QA_HEADLESS="false"
$env:QA_AUTH_MODE="oauth-manual"
$env:QA_OAUTH_PROVIDER="discord"
node scripts/playerAgent.mjs
```

What to do in the opened browser:

1. Wait for `/login`
2. Click `Continue with Discord` if needed
3. Complete Discord authentication
4. Allow the redirect back to ArenaX
5. Let the agent continue without closing the browser

Expected result:

- the app reaches `/dashboard` or the requested `redirect`
- no ugly `error=...` URL remains visible
- the report is written to `artifacts/player-agent`

## Twitch final run

Run:

```powershell
$env:QA_HEADLESS="false"
$env:QA_AUTH_MODE="oauth-manual"
$env:QA_OAUTH_PROVIDER="twitch"
node scripts/playerAgent.mjs
```

What to validate:

1. `Continue with Twitch` opens Twitch correctly
2. Twitch consent returns to ArenaX
3. the login screen does not loop silently
4. the final destination is respected

## Redirect validation

Manually test these URLs:

- `http://localhost:3000/login?redirect=/dashboard`
- `http://localhost:3000/login?redirect=/play`
- `http://localhost:3000/login?redirect=/profile`
- `http://localhost:3000/login?redirect=/rewards`
- `http://localhost:3000/login?redirect=/leaderboard`

After sign-in, each route should land on the requested destination instead of always returning to `/dashboard`.

## Refusal validation

For both Discord and Twitch:

1. start the provider flow
2. cancel or deny access
3. confirm that ArenaX returns to `/login`
4. confirm that the UI shows a clean error toast
5. confirm that the URL does not stay polluted with raw provider error parameters

## Reports

After each run, inspect:

- `C:\arena-forge-main\artifacts\player-agent\player-agent-report.md`
- `C:\arena-forge-main\artifacts\player-agent\player-agent-report.json`

What matters most:

- `Auth status`
- `Final URL`
- `Runtime issues`
- route coverage after sign-in

## Success criteria

A run is considered good when:

- authentication succeeds or fails cleanly
- no broken redirect loop appears
- provider errors are understandable
- post-login destination is correct
- the agent reaches the main logged-in pages
