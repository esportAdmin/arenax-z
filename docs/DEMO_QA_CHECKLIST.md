# Demo QA Checklist

## Scope reviewed

- Home
- Clubs
- Leaderboard
- Dashboard
- Live Calls
- Profile
- Rewards
- War Map
- Login
- Navigation / Footer / Notifications

## Completed fixes

### Home
- Tightened mobile spacing and section density.
- Added visible return-pressure modules and reset timers.
- Improved premium copy and locked-state framing.

### Clubs
- Unified club-facing hero, cards, member list, active wars, territory ownership, and prestige ladder.
- Removed broken emoji artifacts and replaced them with cleaner premium markers.
- Added war-wave and recruitment cadence signals.

### Leaderboard
- Cleaned podium visuals and fixed corrupted avatar markers.
- Improved filter density and mobile behavior.
- Added refresh and season reward countdowns plus aspirational locked states.

### Dashboard
- Improved comeback mission clarity, pick history readability, and reset visibility.
- Strengthened empty states and reward projection messaging.
- Cleaned dashboard loops to feel more intentional during demos.

### Live Calls
- Polished sidebars, filters, match-of-the-day module, and support panels.
- Added stronger market cadence, lock windows, and premium tease states.
- Harmonized the whole live-calls flow around urgency and confidence.

### Profile
- Improved profile trust cues and mobile density.
- Reinforced progression, shareability, and prestige framing.

### Rewards
- Improved reset visibility and reward-category empty states.
- Made reward filtering and claim-track presentation clearer on small screens.

### War Map
- Upgraded territory side panels, command notes, battle overlays, and live feed surfaces.
- Reinforced the idea that the map is a return ritual, not just a utility screen.

### Login
- Brought sign-in closer to the premium command-center language.
- Added trust framing and stronger launch-readiness copy.
- Improved mobile spacing and the perceived quality of the authentication step.

### Shared chrome
- Tightened navigation density on mobile.
- Improved mobile menu context.
- Strengthened footer trust and product positioning.
- Added more explanatory empty states for alerts and challenges.

## Demo watchpoints

- Verify that live data is available before a stakeholder demo, especially for live calls, notifications, and territory state.
- Prefer a seeded account with pick history, rewards, and streak data to avoid landing on too many empty states.
- Confirm Discord-linked dashboard flows with a valid OAuth session before demo day.
- Confirm Supabase-backed leaderboards and reward catalogs are populated.

## Validation completed

- `tsc --noEmit --pretty false`
- targeted `eslint` on the latest edited UI files

## Suggested final rehearsal

1. Start on Home and validate mobile and desktop hero readability.
2. Open Clubs and verify member, war, and territory panels feel alive.
3. Open Leaderboard and confirm podium plus table hierarchy is visually stable.
4. Open Live Calls and place a test flow with sidebars visible.
5. Open Profile and Rewards with a seeded account.
6. Open War Map and confirm the side command panels and territory details are readable.
7. Open Login in an incognito browser and validate trust, spacing, and CTA clarity.
