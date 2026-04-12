# Player Agent

Autonomous end-to-end browser agent for ArenaX.

## Goal

This agent behaves like a lightweight real player:

- signs in with Discord or Twitch using a persistent browser profile
- can still create a test account in fallback mode when needed
- opens the main logged-in routes
- clicks safe interactive elements on each page
- captures screenshots and runtime issues
- writes a detailed JSON and Markdown report

## Routes exercised after sign-in

- `/dashboard`
- `/play`
- `/clubs`
- `/war-map`
- `/leaderboard`
- `/live-calls`
- `/profile`
- `/rewards`

## Run it

Start the app first:

```powershell
npm run dev
```

Then run the player agent:

```powershell
npm run qa:player-agent
```

## Recommended mode: OAuth session reuse

By default, the agent now uses `Discord` or `Twitch` through a persistent browser profile.

First run:

- the agent opens `/login`
- clicks the selected provider button
- you finish the provider login once in the visible browser
- the session is stored in the local browser profile

Next runs:

- the agent reuses that stored session and goes straight into the app

Use a visible browser for the first OAuth run:

```powershell
$env:QA_HEADLESS="false"
$env:QA_AUTH_MODE="oauth-manual"
$env:QA_OAUTH_PROVIDER="discord"
npm run qa:player-agent
```

Or with Twitch:

```powershell
$env:QA_HEADLESS="false"
$env:QA_AUTH_MODE="oauth-manual"
$env:QA_OAUTH_PROVIDER="twitch"
npm run qa:player-agent
```

## Fallback mode: email/admin bootstrap

If you explicitly want the old email/bootstrap flow:

```powershell
$env:QA_AUTH_MODE="auto"
npm run qa:player-agent
```

If `SUPABASE_SERVICE_ROLE_KEY` is available locally, the agent can create a confirmed account first and then sign in through the UI in that fallback mode.

## Useful environment variables

Provider used in OAuth mode:

```powershell
$env:QA_OAUTH_PROVIDER="discord"
```

How long to wait for the manual OAuth completion:

```powershell
$env:QA_OAUTH_WAIT_MS="180000"
```

Persistent browser profile directory:

```powershell
$env:QA_USER_DATA_DIR="C:\\arena-forge-main\\artifacts\\player-agent\\browser-profile"
```

Provide a fixed test account for fallback email mode:

```powershell
$env:QA_E2E_EMAIL="qa-player@example.com"
$env:QA_E2E_PASSWORD="StrongPassword123!"
$env:QA_E2E_USERNAME="qa_player"
```

Visible browser instead of headless:

```powershell
$env:QA_HEADLESS="false"
```

Custom timeout:

```powershell
$env:QA_TIMEOUT_MS="60000"
```

Custom output directory:

```powershell
$env:QA_OUTPUT_DIR="C:\\arena-forge-main\\artifacts\\player-agent"
```

## Output

The agent writes:

- `artifacts/player-agent/player-agent-report.json`
- `artifacts/player-agent/player-agent-report.md`
- one screenshot per important page

## Guided OAuth QA

For a practical Discord/Twitch validation flow, use:

- `docs/OAUTH_QA_RUNBOOK.md`

## Notes

- The default mode is now aligned with a Discord/Twitch-first product.
- If OAuth sign-in is completed once in the same browser profile, later runs can reuse that session.
- If sign-up is blocked by email confirmation in fallback mode, the report will say so explicitly.
- The interaction strategy is intentionally conservative: it avoids destructive actions such as sign-out, delete, ban, and removal flows.
- This agent is designed for local QA and demo rehearsal, not for load testing.
