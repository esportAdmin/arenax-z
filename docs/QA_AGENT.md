# QA Agent

Automated browser QA agent for ArenaX.

## What it does

- opens the app in a real browser with Puppeteer
- visits the key user-facing routes
- records runtime errors, failed requests, and warning-level console output
- clicks important CTA buttons on the landing page and login page
- writes a machine-readable JSON report and a human-readable Markdown report

## Default coverage

- `/`
- `/login`
- `/clubs`
- `/war-map`
- `/leaderboard`
- `/live-calls`
- `/rewards`

## Run it

Start the app first:

```powershell
npm run dev
```

Then run the agent:

```powershell
npm run qa:agent
```

## Useful environment variables

Base URL:

```powershell
$env:QA_BASE_URL="http://localhost:3000"
```

Visible browser instead of headless:

```powershell
$env:QA_HEADLESS="false"
```

Custom timeout:

```powershell
$env:QA_TIMEOUT_MS="60000"
```

Authenticated session cookie if you want to test logged-in flows:

```powershell
$env:QA_COOKIE="sb-xxx-auth-token=..."
```

Custom output directory:

```powershell
$env:QA_OUTPUT_DIR="C:\\arena-forge-main\\artifacts\\qa-agent"
```

## Output

The agent writes:

- `artifacts/qa-agent/qa-agent-report.json`
- `artifacts/qa-agent/qa-agent-report.md`

## Notes

- If a CTA is visible but does not navigate correctly, the report marks it as failed.
- If the app throws runtime errors or request failures, they are included in the report.
- For protected pages, provide `QA_COOKIE` to test with a real user session.
