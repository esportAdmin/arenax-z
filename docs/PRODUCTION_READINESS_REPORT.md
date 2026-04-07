# Production Readiness Report

Date: 2026-04-07
Workspace: `C:\arena-forge-main`
Branch: `codex/repo-hardening`

## Executive Summary

The repository is now in a shippable technical state.

Validated end-to-end:
- TypeScript type-check passes
- Next.js production build passes
- ESLint runs successfully with zero errors

Residual quality debt still exists, but it is now non-blocking:
- 121 ESLint warnings remain
- the remaining warnings are concentrated in legacy UI modules and hook dependency hygiene
- no current warning blocks compilation, build output, or route generation

## Verified Commands

```powershell
node_modules\.bin\tsc.cmd -p tsconfig.json --noEmit --pretty false
node_modules\.bin\eslint.cmd .
node_modules\.bin\next.cmd build
```

## Delivered Improvements

### Build and Runtime Hardening

- moved the replay renderer to a proper App Router page entry
- made replay rendering compatible with production prerender rules
- made Stripe webhook initialization build-safe by delaying client construction until request time
- marked server-authenticated API routes as explicitly dynamic where required by Next.js
- removed the last build-time blockers discovered during static generation

### Quality Tooling

- added a working flat ESLint configuration in `eslint.config.mjs`
- scoped linting away from non-web noise such as generated/binary or Deno-only paths
- fixed a real React hooks ordering issue in `PlayerRankCard`

### Warning Reduction

ESLint warnings reduced:
- before: `144`
- after: `121`
- reduction: `23 warnings` removed in this final pass

The warnings removed were mostly:
- unused imports and dead local state
- noisy eslint-disable leftovers
- top-level API and utility cleanup

## Current Risk Level

### Green

- production build
- route generation
- middleware loading
- core routing and replay entrypoints
- Stripe webhook module loading

### Yellow

- legacy analytics pages still carry a lot of unused imports/state
- several hooks still trigger `react-hooks/exhaustive-deps`
- some older club/chat modules still contain presentation-layer noise

### Red

None currently blocking build or deployment.

## Residual Warning Hotspots

Top remaining warning clusters:

| Area | File | Warnings | Nature |
|---|---|---:|---|
| Legacy analytics | `src/legacy-pages/analytics/AnalyticsData.tsx` | 13 | mostly unused imports/state |
| Club chat | `src/components/clubs/ClubChat.tsx` | 8 | unused imports/props |
| Legacy analytics | `src/legacy-pages/analytics/AnalyticsPredictions.tsx` | 8 | unused imports |
| Arena balance hook | `src/hooks/useArenaBalance.ts` | 5 | `exhaustive-deps` |
| Legacy analytics | `src/legacy-pages/analytics/AnalyticsTeams.tsx` | 5 | unused imports |
| Legacy auth | `src/legacy-pages/Auth.tsx` | 5 | unused imports |

## Recommended Phase 2

### P1

- clean `src/legacy-pages/analytics/**`
- clean `src/legacy-pages/Auth.tsx`
- clean `src/components/clubs/ClubChat.tsx`

### P1

- resolve hook dependency warnings in:
  - `src/hooks/useArenaBalance.ts`
  - `src/hooks/usePredictions.ts`
  - `src/hooks/useProfile.ts`
  - `src/hooks/useClubWars.ts`
  - `src/hooks/useClubChallenges.ts`

### P2

- remove remaining unused icon/import noise in dashboard, profile, rankings, and club widgets
- tighten lint rules gradually once warning volume is lower

## Delivery Position

Recommended external positioning:

- “production-build stable”
- “type-safe build restored”
- “routing and critical API paths hardened”
- “remaining debt is localized quality cleanup, not delivery risk”

## Honest Caveat

This repository is now deployable and reviewable, but not yet fully polished.

The remaining work is mostly maintainability cleanup, not structural rescue:
- fewer hidden risks in release engineering
- better reviewer confidence
- cleaner CI signal once the residual warnings are retired
