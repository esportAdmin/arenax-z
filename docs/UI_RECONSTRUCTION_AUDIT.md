# ARENAX / RallyGuild UI Reconstruction Audit

This document is the repo-aware reconstruction baseline for the ARENAX / RallyGuild visual references. The references are the visual source of truth. Existing code is treated as technical substrate only.

## 1. ANALYSE DU REPO

### Routes existantes

- `app/page.tsx` exists and acts as the ARENAX public gateway.
- `app/clubs/page.tsx` exists and currently renders a clubs/retention page, not a faithful "JOIN THE ELITE" directory.
- `app/clubs/[slug]/page.tsx` exists and is the current club detail route.
- `app/leaderboard/page.tsx` exists and currently renders a gold prestige leaderboard with filters, podium, table, and ranked section.
- `app/wars/page.tsx` exists and currently renders a War Room Dashboard style screen.
- `app/war-map/page.tsx` exists and delegates to `src/components/map/GlobalAnimatedWarMap.tsx`.
- `app/dashboard/page.tsx` exists and currently renders the connected user daily command center.
- `app/live-calls/page.tsx` exists and now delegates to `src/components/rallyguild/live-calls/LiveCallsRitual.tsx`.
- `app/rewards/page.tsx` exists and delegates to `src/legacy-pages/Rewards.tsx`.
- `app/profile/page.tsx` exists and delegates to `src/legacy-pages/profile/page.tsx`.
- `app/rallyguild/*` does not exist yet.

### Composants existants utiles

- Global shell/navigation: `src/components/landing/Navigation.tsx`, `src/components/layout/Navbar.tsx`, `src/components/layout/Footer.tsx`.
- Clubs: `src/components/clubs/ClubHeader.tsx`, `ClubStats.tsx`, `OwnedTerritories.tsx`, `ActiveWars.tsx`, `MemberList.tsx`, `ClubLeaderboard.tsx`.
- Wars: `src/components/wars/LiveWarMapInner.tsx`, `WarCard.tsx`, `WarFilters.tsx`, `WarHeader.tsx`, `WarStats.tsx`.
- War map: `src/components/map/GlobalAnimatedWarMap.tsx`, `WorldMapSvg.tsx`, `TerritoryDetailsPanel.tsx`, `EuropeWarMap.tsx`.
- Leaderboard: `src/components/leaderboard/LeaderboardHeader.tsx`, `LeaderboardStats.tsx`, `LeaderboardFilters.tsx`, `TopThreePodium.tsx`, `LeaderboardTable.tsx`.
- Dashboard/retention: `src/components/engagement/CountdownPill.tsx`, `ReturnNudgeCard.tsx`, `src/components/dashboard/StreakDisplay.tsx`.
- Rewards/profile: `src/components/rewards/LevelRewardsGrid.tsx`, `src/components/profile/*`.

### Design system existant

- `app/globals.css` already defines the main premium HUD primitives: `glass-card`, `surface-panel`, `command-frame`, `section-shell`, `dashboard-card`, `eyebrow-badge`, `metal-chip`, `data-pill`, glow utilities, gradients, noise, sheen, grid, and animations.
- `tailwind.config.ts` already defines `font-display: Orbitron`, `font-body: Inter`, semantic HSL colors, cyber shadows, and animation tokens.
- Existing tokens are close to the target universe but are too broad. They need a dedicated reconstruction layer for exact HUD panels, button heights, glow strengths, clipped corners, map frames, and mobile cockpit cards.

### Assets existants

- ArenaX logo assets exist in `public/images`: `Logo ArenaX Header.png`, `Logo ArenaX Hero.png`, `Logo ArenaX Badge.png`, `Logo ArenaX AXT Token.png`.
- Game emblem SVGs exist in `public/images/game-emblems`.
- Feature illustrations exist but do not match the supplied RallyGuild war-room references.
- No exact RallyGuild logo asset was found in `public`.
- No exact tactical Europe map vector from the references was found.
- No exact sci-fi war-room cockpit background from the references was found.
- No exact mobile device frames, avatars, rank emblems, badge illustrations, or podium pedestal assets were found.

### Reutilisable

- `Navigation`, existing globals/tokens, countdown pills, return nudge cards, leaderboard data components, and the current custom SVG territory-map approach are reusable.
- Current `/wars` and `/dashboard` are useful prototypes for layout intent.
- Current `/war-map` can serve as the code base for a real map reconstruction if split and upgraded.

### Non reutilisable tel quel

- `app/wars/page.tsx` is too monolithic and must be split before serious reconstruction.
- `src/components/map/GlobalAnimatedWarMap.tsx` and `WorldMapSvg.tsx` are too large for the requested file discipline and need decomposition.
- `src/legacy-pages/LiveCalls.tsx` still re-exports `Predictions.tsx`, but the live route no longer depends on it.
- `/clubs/page.tsx` is not the visual "JOIN THE ELITE" directory yet.
- `/clubs/[slug]` is the right route for club detail but needs a dedicated RallyGuild club command layout.

## 2. ANALYSE VISUELLE DES REFERENCES

### A. War Map Desktop - critical battle

- Structure: full-screen Europe map, top utility bar, left player status, central critical battle card, right command center, bottom ticker.
- Components: country territories, glowing borders, critical modal, attack/reinforce CTAs, stacked war cards, stat rail.
- Tokens: red/orange danger, cyan ally, violet opponent, smoky navy map base, glass side panels.
- Interactions: territory hover, war card selection, attack/reinforce actions, ticker updates.
- Responsive intent: map remains dominant; side rails should collapse into stacked command cards on mobile.

### B. War Map Desktop - active wars

- Structure: map-first HUD, club panel bottom-left, right active wars rail, territory tooltips.
- Components: territory labels, progress chips, pressure bars, control badges, active war cards.
- Tokens: cleaner cyan/blue HUD with controlled red/orange urgency.
- Interactions: hover territory, click war card, open territory detail, reinforce/attack.
- Responsive intent: right rail becomes horizontal carousel or accordion below map.

### C. Leaderboard Desktop

- Structure: left hero/stat/filter/podium column, right table and top cards.
- Components: gold hero, stat cards, region/time filters, top-3 podium, dense rankings table, load-more CTA.
- Tokens: gold/yellow dominance, dark smoke, metallic podium, amber glows.
- Interactions: category tabs, region/timeframe filters, load more.
- Responsive intent: podium stacks above table; filters become scrollable pills.

### D. Clubs Directory Desktop

- Structure: centered "JOIN THE ELITE" hero, stat chips, neon search, filters, two-row club card grid.
- Components: rank cards, status badges, neon color-coded club cards, CTA buttons.
- Tokens: cyan/violet base with red, gold, blue club-specific accents.
- Interactions: search, filters, join/view details.
- Responsive intent: cards become one-column high-impact mobile cards.

### E. RallyGuild Mobile - New Club

- Structure: compact mobile hero, stacked CTA buttons, 2x2 stat cockpit, launch sequence, war room panel, trust strip, bottom nav.
- Components: logo crest, primary cyan CTA, secondary blue/gold CTAs, timeline steps, map/war panel.
- Tokens: cyan glass, gold action, mobile-safe radii, strong readable buttons.
- Interactions: create first call, open war map, start war, bottom nav.
- Responsive intent: mobile is primary, not a compressed desktop.

### F. RallyGuild Responsive Mobile Trio

- Structure: device-frame explorations showing hero-first, sequence-first, and footer/trust layouts.
- Components: footer nav, trust strip, timeline, mini war map.
- Tokens: same cyan/navy/gold stack, tighter spacing, larger touch targets.
- Interactions: one-tap primary actions.
- Responsive intent: preserve luxury and spacing despite density.

### G. Rivalry Card / Command Card

- Structure: centered holographic card with attacker, defender, territory, pressure, timer, CTAs.
- Components: shield icons, territory mini-map, pressure bar, countdown, rally/open-command buttons.
- Tokens: cyan/orange split, glass frame, strong glow.
- Interactions: rally members, open command room.
- Responsive intent: standalone card should fit desktop panels and mobile stack.

### H. War Room Tower Screen

- Structure: vertical command display with critical alert, pressure window, contributors, momentum, reward loop.
- Components: alert stack, digital timer, leaderboard list, line chart, locked/unlocked reward tiles, bottom controls.
- Tokens: tactical cyan/orange, cockpit metal, dark industrial background.
- Interactions: system controls, deploy resources, detail panels.
- Responsive intent: can become a right rail on desktop and command drawer on mobile.

### I. War Room Dashboard Desktop

- Structure: nav, hero, active war card, central territory map, right command center, feed/objectives/trust strip.
- Components: active rivalry card, territory control map, critical window, contributors, reset, reward loop, objectives.
- Tokens: cyan/orange/violet with large central map and industrial depth.
- Interactions: start war, open map, rally members, objective CTAs.
- Responsive intent: hero, map, active card, command center stack vertically.

## 3. GAPS ET BLOQUANTS

### Assets manquants

- Exact RallyGuild logo and crest.
- Exact Europe/territory vector geometry used in the war map screenshots.
- Exact war-room cockpit background image.
- Exact mobile device frames.
- Exact player avatars, club icons, trophy badges, rank medals, and reward crates.
- Exact sci-fi card close-up imagery used in Lovart references.

### Composants manquants

- `RallyGuildShell`
- `HudPanel`
- `NeonButton`
- `TerritoryControlMap`
- `RivalryPressureCard`
- `WarRoomTower`
- `ObjectivesStrip`
- `ClubDirectoryCard`
- `MobileBottomNav`
- `TrustStrip`
- `LeaderboardPodiumFrame`

### Incoherences repo

- `/live-calls` still depends on a legacy `Predictions` file name.
- `/wars` contains multiple sections in one file and should be split.
- `/war-map` delegates to a large animated map component; it needs a smaller composition layer.
- Some remaining routes use `Navigation`; others use `Navbar`, so the product shell is not fully unified yet.
- Existing files exceed the requested reconstruction file size discipline.

### Blockers pour clone 100%

- Without exact map SVG geometry, exact logos, exact cockpit backgrounds, and exact fonts, a pixel-perfect clone is impossible.
- The current repo can produce a faithful code-native reconstruction, but not a literal clone of proprietary image assets.
- Any map built now must be labeled "code-native reconstruction" until final map SVG/assets are supplied.

## 4. PLAN DE RECONSTRUCTION

### Pages cibles

- Keep and align `app/clubs/page.tsx` as Clubs Directory.
- Keep and align `app/leaderboard/page.tsx` as Leaderboard Desktop.
- Keep and split `app/wars/page.tsx` as RallyGuild War Room Dashboard.
- Keep and align `app/war-map/page.tsx` as Tactical Map / Active Wars map.
- Keep and align `app/dashboard/page.tsx` as daily cockpit.
- Keep and migrate `app/live-calls/page.tsx` away from `Predictions.tsx` into a true Live Calls page.
- Create `app/rallyguild/page.tsx` only if we need a dedicated showcase route, not as a duplicate product route.
- Create `app/rallyguild/new-club/page.tsx`, `app/rallyguild/war-room/page.tsx`, and `app/rallyguild/rivalry/page.tsx` only as reference/demo routes after core product pages are aligned.

### Composants cibles

- Core: `RallyGuildShell`, `TopNavArena`, `HudPanel`, `NeonButton`, `MetricChip`, `TrustStrip`, `LiveTicker`.
- War: `TerritoryControlMap`, `WarStatusCard`, `RivalryPressureCard`, `WarCommandCenter`, `ActiveWarsRail`, `PressureBar`, `BattleFeedList`.
- Leaderboard: `LeaderboardHero`, `StatsSummaryGrid`, `CategoryTabs`, `PodiumSection`, `RankingsTable`.
- Clubs: `ClubsHero`, `SearchNeonBar`, `FilterPills`, `ClubCard`, `ClubStatusBadge`, `ClubsGrid`.
- RallyGuild: `RallyGuildHero`, `ClubStatsCockpit`, `LaunchSequencePanel`, `WarRoomPanel`, `FooterMobileNav`.

### Ordre d'implementation

1. Create reconstruction primitives: shell, HUD panel, neon buttons, trust strip, pressure bar.
2. Split `/wars` into reusable war-room components while preserving current route behavior.
3. Replace central tactical map with a dedicated `TerritoryControlMap` component.
4. Rebuild `/clubs` as "JOIN THE ELITE" directory.
5. Rebuild `/leaderboard` to match gold podium/table reference more tightly.
6. Rebuild `/live-calls` as true live ritual command board, no `Predictions.tsx` route dependency.
7. Align `/dashboard`, `/profile`, `/rewards` with the same shell and button sizing.
8. Add optional `/rallyguild/*` reference routes only after main product pages are stable.

### Fichiers a creer / modifier

- Create `src/components/rallyguild/RallyGuildShell.tsx`.
- Create `src/components/rallyguild/HudPanel.tsx`.
- Create `src/components/rallyguild/NeonButton.tsx`.
- Create `src/components/rallyguild/TrustStrip.tsx`.
- Create `src/components/rallyguild/PressureBar.tsx`.
- Create `src/components/rallyguild/TerritoryControlMap.tsx`.
- Split `app/wars/page.tsx` into a thin route plus `src/components/rallyguild/war-room/*`.
- Modify `app/clubs/page.tsx`, `app/leaderboard/page.tsx`, `app/live-calls/page.tsx`, `app/war-map/page.tsx`.

## 5. IMPLEMENTATION

Implementation artifacts created in tranche 1:

- `docs/UI_RECONSTRUCTION_AUDIT.md`
- `app/wars/page.tsx`
- `src/components/rallyguild/HudPanel.tsx`
- `src/components/rallyguild/NeonButton.tsx`
- `src/components/rallyguild/PressureBar.tsx`
- `src/components/rallyguild/TrustStrip.tsx`
- `src/components/rallyguild/TerritoryControlMap.tsx`
- `src/components/rallyguild/war-room/ActiveWarCard.tsx`
- `src/components/rallyguild/war-room/WarCommandCenter.tsx`
- `src/components/rallyguild/war-room/WarFeed.tsx`
- `src/components/rallyguild/war-room/WarHero.tsx`
- `src/components/rallyguild/war-room/WarObjectives.tsx`
- `src/components/rallyguild/war-room/WarRoomDashboard.tsx`
- `src/components/rallyguild/war-room/WarStatTile.tsx`
- `src/components/rallyguild/war-room/data.ts`
- `src/components/rallyguild/war-room/types.ts`
- `src/components/rallyguild/war-room/utils.ts`
- `app/clubs/page.tsx`
- `src/components/rallyguild/clubs/ClubDirectoryCard.tsx`
- `src/components/rallyguild/clubs/ClubFilters.tsx`
- `src/components/rallyguild/clubs/ClubsDirectory.tsx`
- `src/components/rallyguild/clubs/ClubsHero.tsx`
- `src/components/rallyguild/clubs/data.ts`
- `app/leaderboard/page.tsx`
- `src/components/rallyguild/leaderboard/LeaderboardHero.tsx`
- `src/components/rallyguild/leaderboard/LeaderboardPrestige.tsx`
- `src/components/rallyguild/leaderboard/PodiumSection.tsx`
- `src/components/rallyguild/leaderboard/RankingTable.tsx`
- `src/components/rallyguild/leaderboard/data.ts`
- `app/live-calls/page.tsx`
- `src/components/rallyguild/live-calls/LiveCallMissionCard.tsx`
- `src/components/rallyguild/live-calls/LiveCallsRitual.tsx`
- `src/components/rallyguild/live-calls/MomentumSidebar.tsx`
- `src/components/rallyguild/live-calls/RitualPulseCard.tsx`
- `src/components/rallyguild/live-calls/data.ts`
- `src/legacy-pages/ClubDetail.tsx`
- `src/components/rallyguild/club-detail/ClubDetailExperience.tsx`
- `src/components/rallyguild/club-detail/ClubDetailHero.tsx`
- `src/components/rallyguild/club-detail/ClubLaunchSequence.tsx`
- `src/components/rallyguild/club-detail/ClubActivationPanels.tsx`
- `src/components/rallyguild/club-detail/ClubDetailTrustStrip.tsx`
- `src/components/rallyguild/club-detail/TerritoryNetworkPreview.tsx`
- `src/legacy-pages/RewardsStore.tsx`
- `src/components/rewards/RewardsStorePrizeCard.tsx`
- `src/types/rewardsStore.ts`
- `src/components/layout/Navbar.tsx`
- `src/components/landing/Navigation.tsx`
- `src/components/layout/Footer.tsx`
- `app/game/page.tsx`
- `src/components/debug/ActiveWarsDebug.tsx`
- `src/components/features/HeroSection.tsx`
- `src/components/features/LiveMatchesSection.tsx`
- `src/components/features/LeaderboardPreview.tsx`
- `src/components/dashboard/DashboardStats.tsx`
- `src/components/dashboard/premium/PremiumDailyChallengeCard.tsx`
- `src/components/dashboard/premium/PremiumPlayerCard.tsx`

Tranche 1 outcome:

- `/wars` is no longer a 717-line monolith.
- `/wars` now delegates to `WarRoomDashboard`.
- The war-room UI is split into small HUD components.
- The central map is now a dedicated code-native `TerritoryControlMap`.
- The central map has been upgraded with a stronger HUD frame, larger territory masses, status chips, hot-core glow, rails, and bottom control-state chips.
- The active war card has been upgraded into a stronger rivalry command card with attacker/defender blocks, mini contested territory map, pressure, timer, next action, and clearer CTAs.
- The right command center has been upgraded into a tactical tower with critical battle state, digital timer, contributors, momentum chart, reset state, locked reward loop, and system/deploy controls.
- War feed and objectives now use a more premium live-room pulse and mission-strip treatment.
- `/clubs` has been rebuilt as a premium "JOIN THE ELITE" club directory with neon hero, KPI chips, search, region/status filters, and color-coded club cards.
- `/leaderboard` has been rebuilt as a gold prestige screen with hero stats, filter strips, top-three podium, dense ranking table, and trust strip.
- `/live-calls` has been rebuilt as a true RallyGuild live ritual command board with hero mission, ritual stats, waveform card, mission grid, community pulse sidebar, return loop, recent live calls, and trust strip.
- `/live-calls` no longer depends on the legacy `Predictions.tsx` route path.
- `/war-map` keeps the live backend-driven territory map, but the oversized SVG implementation has been split into `WorldMapSvg`, `WorldMapHudBase`, and `worldMapLayout` so the map can now be polished without a fragile monolith.
- `/rewards` has received a launch-readiness pass: sensitive wording now avoids gambling-adjacent language, reward catalog cards are extracted, and the page file is back under 400 LOC.
- `/profile` has received a product-language cleanup: the live activity panel is now `LiveCallHistoryPanel`, the old `PredictionHistory` export remains as compatibility only, and the streak empty state now points users toward live calls.
- `/clubs/[slug]` has been moved out of a 777-line legacy monolith into a dedicated RallyGuild club-detail experience with a premium command hero, launch sequence, activation cockpit, rivalry warm-up state, live ritual panel, member activation panel, and trust strip.
- `/store` has received a compliance/product-language pass: the reward item card is extracted, the page is under 400 LOC, USD-equivalent display is removed from the UI, and the visible copy now frames rewards as virtual community perks instead of financial prizes.
- `/subscription` has received a US/Lemon Squeezy positioning pass: visible prices are now USD community tiers, the page no longer references the legacy payment processor in user-facing copy, and subscription benefits are framed around retention, live rituals, member activation, and community perks.
- Secondary visible pages received a launch-readiness pass:
  - `/analytics` is now framed around retention intelligence, community signals, ritual completion, and member touchpoints instead of prediction/revenue language.
  - `/analytics/predictions`, `/analytics/data`, `/analytics/teams`, and `/analytics/reports` redirect away from legacy high-risk content until those screens are rebuilt properly.
  - `/ranked`, `/tournaments`, and `/alliances` now have premium HUD hero sections, better panels, stronger empty states, and cleaner community-first copy.
- Navigation and preview-route pass:
  - Main navigation now routes users toward `/wars` instead of the old `/game` surface.
  - `/game` redirects to `/wars` so stale bookmarks do not expose the old debug page.
  - Landing navigation now sends authenticated users toward `/dashboard` and anonymous visitors toward `/auth`.
  - Footer links now avoid weak placeholder pages and prioritize Clubs, War Room, Live Calls, Leaderboard, Rewards, Pricing, Concierge Guide, Support, Legal, Privacy, and Terms.
  - Dashboard premium cards no longer link to `/predictions`; daily ritual and signal cards route to `/live-calls`.
  - The landing conflict telemetry section no longer exposes `Active Wars (DEBUG)` and now renders a production-safe war-signal preview/empty state.
  - A targeted scan found no visible `href="/game"`, `href="/predictions"`, or `href="/staking"` references in `app` and `src/components`.
- All newly produced code files stay below 400 LOC.
- Targeted TypeScript and ESLint checks passed locally.
- Full Next.js production build passed locally after rerunning outside the Windows sandbox due to `spawn EPERM`.
- // TODO-human: verify CI

Important truth note:

- The map is a code-native reconstruction, not the exact final map asset from the references.
- Exact clone-level fidelity remains blocked until final logo, map geometry, cockpit background, badges, and icon assets are provided.

## 6. PIXEL DIFF CHECKLIST

- Widths: verify shell max-width, side rail widths, map central width, card grid widths, and mobile card widths.
- Heights: verify hero height, map height, war cards, podium cards, live call cards, and mobile bottom nav.
- Spacing: verify section gaps, panel inner padding, CTA spacing, filter gaps, ticker spacing.
- Typography: verify display font weight, uppercase tracking, KPI scale, body line height, label legibility.
- Glow: verify cyan primary glow, orange critical glow, violet energy glow, red alert glow, and no cheap overbloom.
- Shadows: verify panel depth, inner highlights, cards separated from background, map glass depth.
- Radius: verify premium rounded panels, button radius, pills, mobile card corners.
- Borders: verify luminous border opacity, active state borders, warning borders, panel separators.
- Icon sizing: verify nav icons, KPI icons, CTA icons, map markers, status badges.
- Contrast: verify labels remain readable against glass surfaces and image-like backgrounds.
- Alignments: verify centered CTAs, table columns, podium rank placement, war-card value alignment.
- Map proportions: verify central map dominates `/wars` and `/war-map`, with no miniature fake map.
- Responsive stacking: verify desktop three-column layout becomes clean mobile sequence.

## 7. TODO-HUMAN

- Provide exact RallyGuild logo/crest assets if clone-level fidelity is required.
- Provide exact territory map SVG or approve a code-native vector reconstruction.
- Provide exact cockpit/background images or approve procedural CSS/SVG atmosphere.
- Review `/live-calls` naming migration from legacy `Predictions.tsx`.
- Review whether `/rallyguild/*` should be public demo routes or internal design-reference routes.
- Run visual comparison against supplied references after each page tranche.
- Run local build and preview validation after code changes.
- // TODO-human: verify CI
