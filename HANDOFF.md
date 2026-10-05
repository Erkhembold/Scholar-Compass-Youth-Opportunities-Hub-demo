# ScholarCompass — Developer Handoff

Read this first. It's kept up to date so a new session (AI or human) can
pick up the project without re-discovering the architecture from scratch.

## What this is
A student opportunity hub for Mongolian high-school/university students:
scholarships, competitions, volunteering, internships, IELTS reading
practice, SAT English practice, AI-graded IELTS Writing Task 2 essays
(`evaluate-essay` edge function, `writing_attempts`), SAT and IELTS 1v1
challenges, a weekly XP leaderboard, daily streaks, and user accounts. React + Vite, deployed on Vercel, backed by Supabase.

## Live URLs
- Site: https://scholar-compass-youth-opportunities.vercel.app
- GitHub: https://github.com/Erkhembold/Scholar-Compass-Youth-Opportunities-Hub-demo
- Supabase project ref: `ahcoccmcyumnvmakmlve`
  - SQL Editor: https://supabase.com/dashboard/project/ahcoccmcyumnvmakmlve/sql/new
  - Table Editor: https://supabase.com/dashboard/project/ahcoccmcyumnvmakmlve/editor

## CRITICAL: the workflow constraint
**An AI assistant working on this repo generally cannot reach Supabase's
network directly** (sandboxed dev environments typically only allowlist
GitHub/npm/PyPI-type domains, not `*.supabase.co`). Assume this is true
unless you've just verified otherwise for your own environment.

The established workflow is therefore:
1. AI writes/edits app code, builds it, commits, and pushes to GitHub
   directly (needs a GitHub PAT with `repo` scope from the user — these
   expire, ask for a fresh one when a push fails with an auth error).
2. Vercel auto-deploys on push to `main`.
3. Any database change (tables, RLS, columns) is written as a `.sql`
   file under `/supabase/` and handed to the user as a labeled,
   copy-pasteable block. **The user runs it manually** in the Supabase
   SQL Editor and reports back success/errors. Do not assume a
   migration has been run just because the file exists in the repo —
   always ask for confirmation, ideally by having them check the Table
   Editor.
4. The user is non-technical with Supabase specifically. Give exact
   URLs, tell them exactly what button to click, and expect to
   troubleshoot copy-paste mistakes (e.g. including a shell command or
   "Output" line by accident when pasting SQL).

## Environment variables (Vercel)
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in the Vercel
project's Environment Variables (type: **Config**, not Secret — Vercel
rejects `VITE_`-prefixed vars marked Secret since they're bundled into
client JS anyway). `src/lib/supabaseClient.js` exports `null` if these
are missing, and every consumer checks for that before using it.

**Profile page (mobile)** — `src/pages/ProfilePage.jsx` renders four
stacked blocks (basic info, League & Achievements, IELTS Reading
history, Saved Opportunities). The last two collapse into an accordion
on mobile only via `CollapsibleSection.jsx` + `useIsMobile.js` (720px
breakpoint, matches CSS). **Layout gotcha already hit once**: the outer
wrapper classes (`.signin`, `.signin__inner`) are shared with
`SignInPage.jsx` and were originally written assuming exactly one
child card, using `display:flex` in row direction with
centering tricks (`justify-content`/`align-items`) that only work for
a single item. Adding more sibling blocks under those same classes
made them lay out horizontally/overlap instead of stacking — fixed by
(1) making `.signin__inner` `flex-direction: column` with
`align-items: center` instead of row + `justify-content: center`, and
(2) making sure ProfilePage only ever nests ONE direct child under
the `.signin`-classed `<section>` (merge any new sections into the
existing `.signin__inner` div rather than adding a sibling
`.section__inner`). If you add a fifth block to this page, put it
inside the same `signin__inner` div, not a new top-level sibling — the
same class is used by two things that fought each other before.

## Key systems and where they live

**Auth & profiles** — `src/context/AuthContext.jsx` wraps the app,
exposes `user`/`profile`/`signUp`/`signIn`/`signOut`/`updateProfile`.
Profile row lives in `public.profiles` (see `supabase/profiles_schema.sql`
+ `leaderboard_schema.sql` for later added columns: `current_league`,
`weekly_xp`, `lifetime_xp`, `last_processed_week`, `badges`).

**Leaderboard / leagues** — `src/utils/leaderboard.js` (week-clock math,
ranking, promotion/relegation rules), `src/hooks/useLeagueBoard.js`
(fetches real players only), `src/pages/LeaderboardPage.jsx` (no league
selector by design — a user only ever sees their own league, enforced by
RLS on `public.leaderboard_entries`, see `supabase/leaderboard_secure.sql`
— **this must be the latest leaderboard SQL run; earlier
`leaderboard_public_view.sql` is superseded/insecure, do not re-run it**).
No fake/filler users in the live board — empty seats render as
`EmptyLeaderboardSlot`, not synthetic people.

**XP** — `src/utils/xp.js` is the single source of truth for point
values (`XP_REWARDS`). Currently wired: IELTS mock test completion
(`ieltsPractice`, flat), SAT practice (`satQuestion`, small amount per
question, first-correct-only — deliberately NOT a lump sum per test,
per explicit user preference).

**IELTS practice** — `src/data/ieltsTests.js`. **All 10 mock tests are
fully built** (verified: `grep -c "comingSoon: true"` returns 0, `grep -c
"id: \"reading-mock"` returns 10) — an earlier handoff note here claimed
tests 3–10 were still unfinished; that was stale, corrected now. Entry
point is `IeltsPracticePicker.jsx` → skill chooser → `/ielts/practice/:skill`.
Note: another session added a *second*, possibly overlapping IELTS entry
point (`IeltsExercisesPicker.jsx` / `ieltsReadingExercises.js` /
`IeltsExercisesPage.jsx`) — reconcile or clarify with the user which one
is meant to be canonical before adding more IELTS content, to avoid two
parallel systems. (This one is still genuinely unresolved, unlike the
mock-test note above.)

**Beginner Lessons** — `src/components/lessons/` (10 reusable atomic
components: `LessonLayout`, `LessonHeader`, `ConceptCard`, `ExampleCard`,
`QuestionCard`, `AnswerChoice`, `AnswerExplanation`, `TakeawayCard`,
`LessonProgress`, `LessonNavigation`, `Breadcrumb`, plus the
`useActiveSection` scroll-spy hook). 5 pages built on top of this
library, each its own file under `src/pages/` (not a generic
JSON-driven renderer — the section layouts vary too much lesson to
lesson for that to be worth building yet):
- `/sat/lessons/beginner-guide`
- `/ielts/lessons/beginner-guide`
- `/sat/lessons/reading/evidence-based-inference`
- `/sat/lessons/writing/complete-sentences`
- `/sat/lessons/writing/transitions`

All content in these 5 pages was supplied verbatim by the user, not
generated. `.lesson-grid`/`.lesson-mini-card`/`.lesson-flow`/
`.lesson-timeline`/`.lesson-elimination`/`.lesson-callout` are shared
utility CSS classes added alongside these pages for patterns the
original component library didn't cover (N-up card grids, compact
stat cards, etc.) — reuse these before adding new ones-off classes for
a 6th lesson. The SAT Reading lesson's "worked example" section needed
richer post-answer content (per-option elimination cards) than
QuestionCard's single explanation-string prop supports, so that one
block is custom-built directly from `AnswerChoice`/`AnswerExplanation`
with local state, same interaction contract as QuestionCard otherwise
— see `SatReadingLesson01Page.jsx` if a future lesson needs the same
pattern. Not yet linked from any nav menu or category page — reachable
only by direct URL for now; ask the user before adding nav entries, in
case that's intentionally being staged separately.

**SAT practice** — `src/data/satQuestions.js` (80 original questions,
20 per official R&W domain), `SatCategoryOverview.jsx` (progress per
domain), `SatPracticePage.jsx` (question workspace). Progress persisted
per-question in `public.sat_progress` (`supabase/sat_progress_schema.sql`).

**Opportunities** — `src/data/opportunities.js`, static array, images in
`src/assets/opportunities/`. Save/bookmark via `useSavedOpportunities.js`
+ `public.saved_opportunities`. Deadline urgency indicator was added by
another session — verify it's still working after any opportunity-data
changes.

**i18n** — `src/context/LanguageContext.jsx` + `src/data/translations.js`.
`t("English string")` looks up a dictionary; falls back to the English
string if no translation exists (safe no-op, never crashes). Only UI
chrome is translated — actual opportunity/article/test content stays in
English by design.

## SAT 1v1 Challenge (built — SQL confirmed run)
Full create/join/lobby/play/results flow (`SatChallengePage.jsx`,
`useSatMatch.js`). `supabase/sat_matches_schema.sql` and
`sat_matches_play_schema.sql` were both confirmed run by the user (checked
Table Editor, saw `sat_matches`). `ielts_matches_schema.sql` and
`sat_math_1v1_schema.sql` (same pattern, for the IELTS and SAT Math 1v1
modes) were handed to the user but not explicitly reconfirmed since —
all three schema files are idempotent, so re-running any of them is safe
if unsure.

## Opportunity archive (expired listings)
Opportunities are a **static array** in `src/data/opportunities.js` (not in
Supabase), so "archived" is derived from the deadline, never stored as a flag
and never deleted. All logic is in `src/utils/deadline.js`:
`isDeadlinePassed` / `isOpportunityArchived` / `partitionOpportunities` /
`getActiveOpportunities`. Rules: deadlines are read in **Ulaanbaatar time
(UTC+8)** regardless of the viewer's timezone; a date with no time means end
of that day; missing/label-only/malformed deadlines are **never** archived
(wrongly hiding a live listing is worse than showing a stale one). Label-only
event listings (e.g. "Event day — Sep 26, 2026") carry an optional
`deadline.archiveDate` (last event day) used only for archiving — it adds no
countdown indicator. **When adding a label-only event opportunity, add an
`archiveDate` or it will never leave the active board.**
Active-only: homepage `OpportunityBoard`, `CategoryPage`. Archived: `#/archive`
(`ArchivePage.jsx`, linked from the board, category pages, and footer).
Detail pages and Saved Opportunities still show archived items (old links and
bookmarks keep working; detail shows an "Archived" notice). This also fixed a
bug where a passed deadline showed "Deadline today" for up to 24h.
Known gap: "World Cleanup Day" has only "Rolling until event day" — no date in
the data, so it can't archive until an `archiveDate` is added.

## Daily streaks + IELTS exercise history (built — SQL must be run)
Part of the "personalized student dashboard" project (see the four-stage plan
the user gave: streaks -> progress tracker -> weak-area diagnosis -> roadmap,
plus onboarding for NEW users only and an edit-goals screen for existing ones).
**Only streaks + exercise history are built so far.** Weak-area diagnosis is
deliberately deferred until the SAT Math exercises existed; they now do (see
"SAT Math (Exercises + 1v1)" below), so weak-area diagnosis is unblocked.

**Manual step (not yet confirmed run):** `supabase/streaks_and_exercise_history.sql`
in the SQL Editor. Until it runs, the UI degrades gracefully: StreakCard shows
"streaks aren't switched on yet", `recordActivity` silently returns null, and
IELTS exercises save nothing. Nothing else breaks. It's idempotent.

- **Day convention:** a day is a calendar day in **Ulaanbaatar time
  (UTC+8)**, same as opportunity deadlines. The DATABASE decides "today"
  (`public.ub_today()`), never the browser. `src/utils/streak.js` mirrors it
  for display only (`todayInUB`, `weekDates` Monday-first, `streakStatus`).
- **Storage:** `profiles.current_streak / longest_streak / last_activity_date`
  + `public.activity_log` (unique per user+type+ref+day, so duplicate events
  are ignored). Only `public.record_activity(p_type, p_ref)` (SECURITY DEFINER)
  moves a streak; a trigger reverts direct client edits of those 3 columns
  (SQL Editor edits are allowed — no JWT). Clients cannot insert into
  `activity_log`; they can read only their own rows.
- **Rules:** first activity -> 1; same day again -> unchanged; yesterday ->
  +1; anything older -> reset to 1 (longest kept). A stored streak whose last
  activity is older than yesterday is DISPLAYED as 0 immediately ("broken")
  even though the column isn't rewritten until the next activity.
- **What counts** (`recordActivity(type, ref)` from `utils/streak.js`, types
  allow-listed in SQL): `sat_question` (any submitted answer, solo AND SAT 1v1 —
  both go through `useSatProgress.recordAnswer`), `ielts_exercise`,
  `ielts_mock` (only if >=1 question answered), `ielts_writing` (after the
  essay is saved), `ielts_1v1` (on finish), `lesson`. Opening the site or
  refreshing counts for nothing. XP is untouched.
- **Lessons** had no completion signal, so `components/LessonCompleteButton.jsx`
  ("Mark lesson complete") sits at the end of all 5 lesson pages; state is read
  back from `activity_log` (type `lesson`, ref = lesson id). **A 6th lesson
  page must add `<LessonCompleteButton lessonId="..."/>` too.**
- **UI:** `components/StreakCard.jsx` + `hooks/useStreak.js`, currently on the
  Profile page (inside the same `signin__inner`, per the layout gotcha above).
  When the authenticated dashboard homepage is built it should move there.
  `recordActivity` dispatches a `sc:activity` window event; AuthContext reloads
  the profile on it and `useStreak` refetches the week.
- **IELTS exercise history:** every submitted answer in
  `IeltsExercisesPage` is saved to `public.ielts_exercise_attempts`
  (`utils/ieltsExerciseHistory.js`): exercise id/type, `skill` (READING_SKILL_TAGS
  tag — mc items carry their own, others map from type), difficulty, correct,
  items_correct/items_total (tfng has several statements), raw answer. Repeats
  are kept as history. Shown on Profile under "IELTS Reading history" ->
  "Reading exercises". Signed-out users can still practise; nothing is saved.
  This table is the intended feed for the future weak-area engine.
- **Verified:** SQL rules run against a local Postgres 16 with the real file
  (first/consecutive/same-day/duplicate/missed-day/tamper/RLS/anon/isolation);
  UI driven in headless Chrome with a mocked Supabase (light+dark, desktop 1280
  + mobile 390, browser TZ deliberately not Ulaanbaatar, UB midnight boundary
  via a fake clock). Not verified against the live Supabase project.
- **Honest limit:** answers are graded in the browser and the question banks
  ship in the JS bundle, so a determined user could call `record_activity` by
  hand. The design stops accidental/trivial gaming and cross-user access, not
  a deliberate attacker; real protection needs server-side grading.
- **Still-open pre-existing weakness:** `profiles` update RLS has no column
  limit, so users can edit their own `weekly_xp`/`lifetime_xp` (and
  `awardXp` is a client-side read-modify-write). Not changed here.

## Public student profiles + profile pictures (built — SQL must be run)
Other students can now see a limited public card for any student:
name, avatar photo, daily streak (current + longest), SAT target score,
IELTS target score. **Nothing else** — no email, school, grade, intended
major, XP, league, saved opportunities, or practice history.

**Manual step (not yet confirmed run):** `supabase/public_profiles_and_avatars.sql`
in the SQL Editor. Run it after `streaks_and_exercise_history.sql` (it calls
`public.ub_today()`) — though it's written defensively so either order is
safe, including running it before `leaderboard_secure.sql` even exists yet.
Idempotent.

- **Why not just open `profiles` to other users:** RLS filters ROWS, not
  COLUMNS — a same-visibility policy on `profiles` would let anyone fetch
  private columns (email, school, grade...) via a raw REST call, same
  reasoning as the existing `leaderboard_entries` design. Instead the only
  door is `public.get_public_profile(p_id)` (SECURITY DEFINER), which
  returns exactly the 6 allowed fields for ONE profile at a time (no
  "list everyone"), only to signed-in callers.
- **Opt-out:** `profiles.profile_visible` (default true). When false,
  `get_public_profile` returns null for everyone except the owner — same
  response as a nonexistent id, on purpose (doesn't reveal *why*).
- **Streak shown is corrected for missed days** (same "broken -> 0, longest
  kept" rule as the owner's own streak card), computed inside the function
  using `ub_today()`, so viewers never see raw `last_activity_date`.
- **Target scores:** new `profiles.sat_target_score` (400-1600) and
  `ielts_target_score` (1-9, half-point steps) with CHECK constraints.
  Editable on the Profile page's existing edit form.
- **Avatars:** public Storage bucket `avatars` (2 MB limit, jpg/png/webp
  only). Client can only write to `<own user id>/avatar.<ext>` — enforced
  both by storage policies AND a `profiles.avatar_path` CHECK constraint
  (`avatar_path like id || '/%'`) so the column can't be pointed at someone
  else's file or an outside URL. One fixed filename per user (re-upload
  overwrites) — accept up to ~1h of CDN cache staleness after changing
  photo (bucket `cacheControl: 3600`), not solved here.
  `components/Avatar.jsx` (photo-or-initial, used everywhere), `AvatarUpload.jsx`
  (owner-only, on Profile page), `utils/avatar.js`.
- **New route:** `#/u/:id` -> `pages/PublicProfilePage.jsx`. Visiting your
  own link points to your real Profile page instead. Leaderboard rows for
  real users (not demo seats, not yourself) now link here and show avatars;
  `leaderboard_entries` gained a mirrored `avatar_path` column + trigger
  update (guarded to no-op if that table doesn't exist yet).
- **Verified:** SQL exercised against local Postgres 16 — field-limited
  return value, visibility opt-out (self still sees own hidden profile),
  raw-table access still owner-only, unknown id, CHECK constraints (target
  score ranges, avatar own-folder), streak/name un-editable by other users,
  anon + signed-out both blocked, storage policies (own-folder insert/
  update/delete allowed, other-folder/no-folder/wrong-bucket blocked),
  and the leaderboard avatar-sync trigger in both file-application orders.
  UI verified in headless Chrome with a mocked backend: upload flow (incl.
  oversized-file client-side rejection), visibility toggle, visible/hidden/
  unknown/self/signed-out states of `/u/:id`, and the leaderboard link +
  avatar render. Not yet verified against the live Supabase project.

## SAT/IELTS progress tracker + weak-area diagnosis (built — SQL must be run)
Priorities 2 and 3 of the personalized-dashboard plan (see the streaks
section above for the full plan). Built together since both are pure
derivations of the same practice data.

**Manual step (not yet confirmed run):** `supabase/sat_math_progress.sql`
in the SQL Editor. Independent of the other migrations — order doesn't
matter. Idempotent. Fixes a real gap: `SatMathExercisesPage` saved
**nothing** before this — every answer lived only in React state and
vanished on navigation.

- **Also fixed:** `sat_math_match_answers` (the SAT Math 1v1 answer log)
  deliberately has no SELECT policy at all — not even the two players in a
  match could read it. Added `public.get_my_sat_math_answers()` (SECURITY
  DEFINER, filters by `auth.uid()` internally) as the one safe read path:
  a student's own answers, and only their own, regardless of which
  `match_id` existing data has. Domain/topic per question stay in
  `src/data/satMathQuestions.js` only (not duplicated into SQL) — the
  frontend merges the two so the taxonomy has one source of truth, same
  reasoning as the existing `gen:sat-math-key` script.
- **SAT Math exercises + 1v1 now report streak activity too** (`sat_question`,
  same type SAT R&W already used) — this was a real gap, not by design;
  neither hooked into `recordActivity` before this.
- **`utils/progress.js` + `utils/weakAreas.js`**: pure functions, no
  network calls, so the derivation logic is directly unit-testable (was
  run against ~25 hand-written cases during development covering merge
  behavior, threshold behavior, and the "no data" vs "not enough data"
  distinction — not committed as a test file, since this repo has no test
  runner wired up for plain Node scripts; `npm test` here is the SAT-Math
  answer-key sync/lint check).
- **`hooks/useProgressData.js`** fetches every raw row once (SAT R&W, SAT
  Math exercises, SAT Math 1v1 via the new function, IELTS mocks, IELTS
  Reading exercises) and feeds both derivations from the same fetch.
  Refetches on the `sc:activity` event streaks already dispatch.
- **Why SAT Reading & Writing is reported as "mastery," not "accuracy"**:
  `sat_progress` is a sticky one-row-per-question table (has this question
  EVER been gotten right), not a per-attempt log — that's true of the
  existing schema, not something changed here. Relabeling it as a false
  "accuracy %" would overstate what the data actually shows, so R&W
  progress reads "Mastered 8/10 questions tried" instead. SAT Math and
  IELTS Reading exercises ARE real per-attempt logs, so those get a true
  accuracy percentage.
- **SAT score vs. practice performance, and IELTS score vs. practice**, are
  kept visibly distinct per the spec: SAT shows a target score plus real
  practice stats with an explicit note that there's no official diagnostic
  test; IELTS shows a real band from the most recent mock test (not
  invented from exercise accuracy) separately from Reading-exercise
  accuracy.
- **Weak-area diagnosis**: `MIN_SAMPLE = 5` (spec's "1 wrong out of 1 ≠
  weak area" rule) across three subjects — SAT R&W (by the 4 official
  domains), SAT Math (by the 4 official domains — sub-topic tags exist in
  the data but aren't enough sample per-topic yet for most students, so
  diagnosis is domain-level for now), IELTS Reading (by skill tag from
  `ielts_exercise_attempts`, not the coarser mock `by_type` — the two use
  different granularities and weren't merged). Below the threshold shows
  "not enough data" (some attempts) vs. "No practice yet" (zero attempts)
  as genuinely different states, never a fabricated weak area. Each
  flagged area links straight to that subject's practice page.
- **UI**: `components/ProgressTracker.jsx` + `WeakAreaCard.jsx`, on the
  Profile page for now (same "belongs on the future dashboard homepage"
  caveat as StreakCard above — Stage 7 still pending).
- **Also fixed a real CSS bug found while testing this**: an unclosed
  `.profile-subhead` rule (from the streaks session) had silently
  swallowed every SAT Math style rule that came after it into one broken
  selector — `SatMathExercisesPage` had never actually loaded its intended
  CSS. Confirmed fixed with a real render (screenshot), not just a build
  check, since a build can succeed with broken CSS.
- **Verified:** SQL exercised against local Postgres 16 (own-answers-only
  isolation via the new function even though the underlying table has zero
  policies, direct-table-read still fully blocked, insert restricted to
  own user_id, anon/signed-out blocked). UI driven in headless Chrome with
  a mocked backend: brand-new user (everything honestly empty, no
  fabricated numbers), a realistic mixed-data user (correct merge of
  exercises + 1v1 into SAT Math accuracy, correct mastery math for R&W,
  real IELTS band surfaced, weak areas correctly flagged only once over
  threshold), practice-this links, signed-out gating, and the SAT Math
  submit flow persisting an attempt + firing streak activity. All earlier
  sessions' test suites (36 checks) re-run clean on top of this. Not yet
  verified against the live Supabase project.

## Leaderboard hotfix: only the signed-in user was visible (fixed)
`fetchLeaguePlayers()` started selecting `avatar_path` unconditionally
when public profiles were added. That column only exists once
`supabase/public_profiles_and_avatars.sql` has been run — until then the
select failed outright, the function's existing "return `[]` on any
error" fallback silently swallowed it, and every real player vanished
except the client's own synthesized `meEntry` row. Fixed by retrying the
same query without `avatar_path` on error, so the leaderboard itself
never breaks just because that separate, newer migration hasn't been
applied yet — same graceful-degrade pattern used everywhere else in this
project (StreakCard, ProgressTracker, etc. all show a "not switched on
yet" notice instead of breaking core functionality; this file should have
followed that pattern from the start and didn't). Verified by reproducing
the exact failure (a mocked backend that errors on any request naming
`avatar_path`) before and after the fix.

## Real weekly league promotion / relegation (built — SQL must be run)
Leagues previously never really moved anyone. `processWeeklyReset()` (the
function this replaces) ran per-user, client-side, only when that user's
own Profile or Leaderboard page happened to load, and to decide whether
THEY were promoted it built a one-off board of ~39 deterministically-
seeded FAKE players and ranked the user against those — never against the
real students actually shown on the Leaderboard page. So a user's league
had no real relationship to how they did against real competitors.

**Manual step (not yet confirmed run):** `supabase/league_promotion.sql`
in the SQL Editor. Independent of the other migrations. Idempotent.

- **`public.run_weekly_league_rollover()`** (SECURITY DEFINER) computes
  every real user's rank from real `weekly_xp` in `leaderboard_entries`,
  resolves promotion/stay/relegation for every league in one pass (so no
  league's outcome depends on another league's outcome from the same
  rollover — all computed from a single snapshot via window functions,
  then applied together), and updates every real profile at once: new
  `current_league`, `weekly_xp` reset to 0, and a Gold/Silver/Bronze badge
  appended (not overwritten) for each league's top 3. Same thresholds as
  before (rank <= 15 promotes, bottom 5 relegates, `totalPlayers` is the
  REAL per-league count, not the 40-seat capacity) — `zoneForRank` /
  `resolveOutcome` stay in `leaderboard.js` too, now display-only (used
  for the Leaderboard page's zone labels), while the SQL function is the
  only thing that actually moves anyone.
- **Idempotent per week**, not per user: a singleton
  `league_rollover_state` row tracks the last processed week (same
  Monday-anchored week as `getWeekInfo()`'s EPOCH/WEEK_MS), locked with
  `for update` before the check so concurrent triggers from different
  students can't double-process. Seeded to the CURRENT week on first run
  (not replayed backward) — see the file's own comment for why an exact
  historical replay isn't recoverable (no per-week XP snapshot table
  exists, same limitation the old client-side version had).
  `src/utils/leaderboard.js` still exports a client-side
  `triggerWeeklyRollover(supabase, profile)` that calls this RPC then
  re-reads the caller's own profile row, called opportunistically from
  both the Leaderboard and Profile pages on load (unchanged call sites,
  just swapped which function they call) — so a rollover still happens
  promptly even with nobody running a server-side cron.
- **Best-effort `pg_cron` scheduling** is included (guarded in a
  `DO`/`EXCEPTION` block so it never fails the rest of the file if that
  extension isn't available on this Supabase project/plan) to also run it
  automatically right at the week boundary. Not verified against the live
  project — only confirmed the guard doesn't break anything when pg_cron
  is absent, which is the case in this sandbox.
- **Deleted** the demo-player generator (`generateDemoPlayers`,
  `buildLeaderboard`, and their seeded-RNG helpers) along with
  `processWeeklyReset` — confirmed nothing else in the app imported them
  before removing.
- **Verified:** SQL exercised against local Postgres 16 with a realistic
  multi-league seed (20 real Bronze players, 10 Silver, 5 in the top
  league) — correct top-15 promotion and bottom-5-stays-in-Bronze floor
  math, a small league (10/10) where everyone promotes because there
  aren't enough real competitors to fill a relegation zone, the top
  league's promotion-zone players correctly staying (no league above),
  badges assigned to the real top 3 by rank and accumulating (not
  overwriting) across weeks, same-week idempotency (second call is a
  no-op, nothing double-applied), and anon/signed-out both blocked. UI
  driven in headless Chrome with a mocked RPC: real promotion reflected
  on both the Leaderboard and Profile pages without a reload, and RPC
  failure (SQL not yet run) degrading gracefully with no crash. Full
  regression: 59 checks across every earlier suite in this project still
  pass. Not yet verified against the live Supabase project.


## Personalized roadmap (Priority 4 — built)
The last of the four dashboard-plan priorities (streaks → progress
tracker → weak-area diagnosis → roadmap). No SQL step — purely a
derivation of data the earlier three priorities already collect.

- **`utils/roadmap.js`**: pure, network-free step generators, same style
  as `utils/progress.js` / `weakAreas.js` (unit-tested against 24 cases
  during development — merge/threshold behavior, not committed as a test
  file, see the same note under the progress-tracker section above for
  why). `buildSatRoadmap` / `buildIeltsRoadmap` each produce an ordered
  list of `{id, title, done}` steps from real progress + weak-area data;
  `withStatus` marks the first not-done step `"current"` (the one
  actionable thing to do next), everything before it `"done"`, everything
  after `"upcoming"`. A step's `done` state is recomputed from live data
  every render — nothing is stored, so it can never drift from reality.
- **No fabricated journey for a new user**: if a subject has neither a
  target score/band nor any practice at all, its roadmap is a single
  "Set a target to get your personalized roadmap" prompt — not a fake
  5-step script with nothing behind it. Once there's a real goal or real
  practice, the full adaptive sequence appears: set target → first
  practice → (more data needed, if diagnosis isn't confident yet) →
  practice the real weakest area → keep practicing (trailing, never
  marked done). A weak area's step is marked done once its accuracy/
  mastery clears 70% (`MASTERY_BAR` in `roadmap.js`) — a deliberately
  higher bar than `MIN_SAMPLE`'s "confident enough to name it" threshold,
  so a step doesn't flip to done the moment a weak area is barely
  identified.
- **UI**: `components/RoadmapCard.jsx`, on the Profile page (same
  temporary-home caveat as every other dashboard piece — Stage 7 still
  pending). Each step links to the right practice page (SAT Math weak
  area → SAT Math exercises, IELTS weak area → IELTS Reading exercises,
  target-setting → Profile's own edit form, etc.) except done/trailing
  steps, which aren't links.
- **Verified**: 24 unit-test cases (brand-new user gets the single prompt
  not a fake journey, target/practice steps flip done at the right time,
  a mastered area doesn't keep nagging, a genuinely weak area does, the
  trailing step never completes, `withStatus` ordering, and a full
  composed roadmap end to end). UI driven in headless Chrome: empty
  state, a realistic mixed-mastery student (confirmed the *current*
  highlighted step is the real weak domain, not the already-mastered
  one), current-step links resolving to the correct practice page, and
  signed-out gating. Full regression: all 65 checks from every earlier
  suite in this project still pass on top of this. Not yet verified
  against the live Supabase project (nothing here needs it — no new
  tables or RPCs).


## New-user onboarding + real dashboard homepage (built — SQL must be run)
Stages 5–8 of the dashboard plan: a short onboarding flow for brand-new
users, and the authenticated homepage the streak/progress/weak-area/
roadmap cards were always meant to live on (they'd been sitting on the
Profile page as a stand-in since the streak session — that caveat is
resolved now).

**Manual step (not yet confirmed run):** `supabase/onboarding.sql` in the
SQL Editor. Independent of the other migrations. Idempotent.

- **Existing users are never forced through onboarding — enforced at the
  database level, not just by frontend logic.** `onboarding_completed` is
  added with `default true`, which Postgres backfills into every row that
  already exists the moment the column is added — no separate UPDATE
  needed, and nothing here can touch a user who already finished
  onboarding. Genuinely new sign-ups need the opposite, so
  `public.handle_new_user()` (the trigger that fires exactly once per
  brand-new `auth.users` row) was updated to explicitly insert
  `onboarding_completed = false` — this covers Google sign-ups too, since
  those create their account through the same trigger, no separate
  handling needed.
- **New profile columns**: `intended_countries text[]`, `preparing_for_sat
  boolean`, `preparing_for_ielts boolean`, `sat_target_date date`,
  `ielts_target_date date`. Reused existing columns for the rest (`grade`,
  `intended_major`, `sat_target_score`, `ielts_target_score`) rather than
  duplicating them, per the spec's own instruction to check the schema
  first.
- **`pages/OnboardingPage.jsx`**: every field skippable (no field blocks
  reaching the dashboard — both "Start using ScholarCompass" and "Skip for
  now" save whatever was filled in, if anything, and mark onboarding
  complete either way). Uses a new shared `components/ToggleGroup.jsx`
  (tappable chips, single or multi-select) — also used by the Profile
  page's goal-editing form now, so the two stay consistent.
- **`pages/DashboardPage.jsx`**: the real authenticated homepage. Greeting
  + the 4 cards (`StreakCard`, `ProgressTracker`, `WeakAreaCard`,
  `RoadmapCard` — moved here from Profile) + the exact same
  `OpportunityBoard` every visitor sees, unmodified, so nothing is lost by
  no longer landing on the public homepage. Deliberately skips the public
  homepage's Hero/Notification/SuggestedReads/About sections — those are
  for visitors deciding whether to sign up, not a returning student.
- **The routing gate lives in `App.jsx`'s "home" route** (also the catch-
  all for any unrecognized URL, matching the old behavior's fallback):
  signed-out → public `HomePage` (unchanged); signed-in but the profile
  fetch hasn't resolved yet → a brief loading state (see `AuthContext`'s
  new `profileLoading`, distinct from `loading`, which flips false right
  after the *session* resolves, before the profile row fetch does — without
  this a race could flash the wrong page); signed-in with
  `onboarding_completed === false` → `OnboardingPage`; everything else
  (`true`, or the column missing entirely because the SQL hasn't run,
  or even an unexpectedly-null profile) → `DashboardPage`, never
  onboarding. All three post-auth redirects (email/password sign-up,
  sign-in, Google OAuth) now land on `#/` instead of `#/profile`, so this
  one gate decides where a person actually ends up either way.
- **Profile page is now settings-only**: the 4 cards moved out to the
  dashboard; a "View my dashboard" link was added; the edit form gained
  the new goal fields (countries as multi-select chips, SAT/IELTS prep as
  Yes/No/Not-sure chips, target dates) alongside the existing ones, and
  the read-only view shows all of them. This is Stage 8 (existing users
  can edit their goals any time) — done by extending the form that
  already existed rather than building a separate screen.
- **Verified**: SQL exercised against local Postgres 16 — seeded a user
  BEFORE running the migration and confirmed they land on
  `onboarding_completed = true` (never forced through onboarding), then
  inserted a new `auth.users` row AFTER and confirmed the trigger gives
  them `false`. UI driven in headless Chrome: a brand-new user sees
  onboarding not the dashboard; filling it in and finishing saves every
  field and flips to the dashboard; "Skip for now" completes onboarding
  with nothing forced; an existing user goes straight to the dashboard
  every time; a profile with the `onboarding_completed` column missing
  entirely (migration not run) still reaches the dashboard, never traps
  the user in onboarding; a signed-out visitor still gets the normal
  public homepage; the Profile page shows the saved goal fields, links to
  the dashboard, and no longer shows the 4 cards. Full regression: all 65
  checks from every earlier suite in this project still pass (several
  needed their navigation target updated from `#/profile` to `#/`, since
  that's genuinely where the cards live now — not a regression, an
  intentional part of this move). Not yet verified against the live
  Supabase project.


## Homepage (`#/`) simplified, per the user's own sketch
Following a rough reference image the user drew (greeting + streak pill
top-right, "Level progress" and "Your progress" centered side by side,
nothing else above the Opportunity board), `DashboardPage.jsx` was pared
back down:
- **Removed from `#/`**: the full `StreakCard` (week row, longest-streak
  stat, milestone messaging), `WeakAreaCard`, and `RoadmapCard`. All
  three still exist and render in full on `/profile` (now the "everything"
  view; `#/` is the lean daily check-in) — nothing was deleted, just
  un-rendered from the homepage specifically.
- **New `components/DashboardStreakPill.jsx`**: a compact "🔥 X Day
  Streak" readout for the header only — no week row, no longest-streak
  stat, no milestone text. Links to `/profile/stats`. Renders nothing at
  all (not even "0 Day Streak") while `isSetUp` is false, so a
  not-yet-migrated database never shows a misleading zero.
- **`dashboard__header`**: greeting and the streak pill in one flex row,
  pill right-aligned, matching the sketch's "Hello, user! ... X Day
  Streak" layout. Wraps to stack cleanly on mobile.
- **`dashboard__cards` now centers exactly two cards** (`LevelCard` +
  `ProgressTracker`) instead of the previous 4-card auto-fit grid.
- **Test files updated, not just the app**: several of this session's own
  Playwright suites (`ui_test.py`, parts of `ui_test2/4/6.py`) had
  hard-coded assumptions that the full StreakCard/WeakAreaCard/RoadmapCard
  lived on `#/` — because at the time they were written, they did. Updated
  those specific assertions to check `/profile` instead, where that
  content now actually lives; the ProgressTracker-specific assertions in
  the same files correctly stayed on `#/`, since that card IS still there.
  This is the same category of fix as the earlier `#/profile` → `#/`
  updates from when the cards first moved the other direction — tests
  tracking where the UI genuinely is, not a sign of app regressions.
- **Verified**: 14 new checks (greeting, streak pill content and its
  absence pre-migration, Level/Progress presence, confirmed absence of
  the three removed sections, Opportunity board still present, light/dark/
  mobile) plus the full existing suite (96 prior checks) all passing
  after retargeting. Build, CSS-brace check, contrast check, and this
  repo's own `npm test` all clean.

## Fixed a landmine between onboarding.sql and the Google sign-in migration
`supabase/onboarding.sql` and `supabase/google_oauth_profile_name_fallback.sql`
(the latter from a concurrent session, see below) both used `create or
replace function public.handle_new_user()` — which replaces the ENTIRE
function body, not just the part each file cared about. The Google file
predated `onboarding_completed` and didn't set it, so running it *after*
`onboarding.sql` would have silently reverted every future sign-up
(Google or email/password) to not getting `onboarding_completed = false`,
quietly breaking "new users see onboarding" with no error of any kind.
Fixed by merging both fixes into each file (so either one, run in either
order, or alone, produces the same correct result), and adding a
cross-reference comment in each so a future edit to one doesn't
reintroduce the drift. Verified against local Postgres in both run
orders, confirmed idempotent (re-running either file doesn't reset an
existing user back into onboarding), and confirmed normal email/password
sign-ups are unaffected.
**Not yet confirmed which order was actually run on the live project** —
if you're unsure, just re-run both files now (in either order); the fix
makes that safe.

## Merge note: onboarding/dashboard session vs. the concurrent Profile redesign
Two sessions touched the same ground at the same time: this session built
the onboarding flow + a separate `DashboardPage` (originally making
Profile settings-only, cards moved OUT), while a concurrent session
independently rebuilt Profile itself into a visual ring-based dashboard
(`2f02d3b`, later extended with Level/Questions/Streak-milestones in
`0224725`/`f7bb4a4`/`1ebcfb5`). Per the user's explicit instruction not to
revert or fight the other session's work, the merge keeps BOTH: Profile
is now its own rich dashboard-style page (streak ring, progress rings,
weak areas, roadmap, league, account details all in one `dashboard-grid`)
**and** a separate `#/` `DashboardPage` exists too (greeting + the same
4 cards + the Opportunity board), reached via the onboarding gate. A
little redundant — both pages show the same 4 cards — but not broken,
and not something this session unilaterally decided to "clean up" on
someone else's work. A future session may want to make a deliberate call
on whether Profile should go back to settings-only now that `DashboardPage`
exists, but that's a product decision, not a merge-conflict fix.

**A real bug was introduced resolving that merge's conflict, found and
fixed in the same session**: the conflict resolution's import block
dropped `StreakCard`/`ProgressTracker`/`WeakAreaCard`/`RoadmapCard`
imports entirely, even though the kept (upstream) JSX still rendered all
four — `ReferenceError: StreakCard is not defined` on every load of
`/profile`, crashing the whole page (React never mounted `<main>`, which
is also why several of this session's own Playwright tests mysteriously
timed out waiting for that element — not flakiness, a real crash). Fixed
by re-adding all four imports. Caught by instrumenting a timing-out test
with `pageerror` logging rather than assuming it was test flakiness —
worth remembering: an inexplicable `main`-not-found timeout in this app's
test setup is worth checking for a pageerror before assuming the test
itself is at fault.

A second rebase onto further concurrent commits (the Level/Questions/
Streak-milestones page + that session's own reconciliation of the same
Profile redesign) applied with zero conflicts, confirming no duplicate
fix was needed.

## Two new opportunities
Added via the normal `data/opportunities.js` + `assets/opportunities/`
pattern, images sourced from the organizers' own Instagram posts (same
convention as other entries using real promotional graphics):
- **ARC EDU "Teen Researcher"** (2nd intake) — paid career-exploration +
  university-prep + research program, 10th/11th graders, Oct 31–Nov 15 2026.
- **Mongolian Art Gallery painting course** — ongoing/rolling enrollment.

Both categorized `"events"` (existing category for structured programs
that aren't scholarships/competitions/volunteering/internships — already
used elsewhere in this file, just not one of the four filter tabs).

## Three more opportunities (Oct 5, 2026)
Appended to `data/opportunities.js` in this order (thumbnails match 1:1, files in
`assets/opportunities/`): (1) **Sean Academy** volunteer English teaching
(`volunteering`, label-only deadline + `archiveDate: 2026-12-20`), (2) **ILSPSD
Erasmus Mundus Joint Master**, Sept 2027 intake (`scholarships`, label-only
deadline, no date published so it never auto-archives), (3) **TEEN ХУРАЛДАЙ 2026**
(`events`, deadline 2026-10-14 23:45 UB time). The Sean registration link is
`https://hurteemj.github.io/.mn` exactly as written in the post (registration
steps were in a 2nd image we don't have) - verify it resolves. No SQL involved.

## Not built yet (from the dashboard spec)
Nothing remains from the original four-priority dashboard plan.


## Theme system (light/dark) — audit in progress

Root causes of the SAT/IELTS-dashboard and league unreadable-text reports:
1. `--text-primary`, `--text-tertiary`, `--surface-alt`, `--navy-950` were
   used throughout the SAT/IELTS dashboards but **never defined** — their
   hardcoded CSS fallbacks (e.g. `#1a1a1a`) always applied, giving dark text
   on dark cards regardless of theme. Now defined for both themes in
   `src/styles/index.css` (`:root` and `[data-theme="dark"]`).
2. Each league tier had one pastel `soft` color as background with no
   theme-aware text color, and solid chips hardcoded white text (illegible
   on light tiers: Gold/Silver/Pearl/Diamond).

**New centralized league color system**: `src/utils/leagueTheme.js` derives
`--league-bg/fg/muted/border/accent/chip-bg/chip-fg` per tier per theme from
each tier's one identity color (`data/leagues.js`'s `primary`), injected as
`[data-league="<id>"]` CSS rules by `injectLeagueTokens()` (called once in
`main.jsx`). Components set `data-league={league.id}` instead of inline
`--league-color`/`--badge-color` vars — no component hardcodes a league hex.
`scripts/check-league-contrast.mjs` (`node scripts/check-league-contrast.mjs`)
asserts all 10 tiers hit WCAG AA in both themes; **run this after changing
any league color**. Currently passing for all 10 tiers, both themes.

Also fixed while auditing:
- Brand blue (`--blue-500` = `#0a84ff`) is fine as a *fill* but only
  3.5–3.65:1 as *text* or under white button-text — below AA. Added
  `--blue-text` / `--blue-solid` (`#0068d6`, `#4da3ff` in dark) for those
  uses; `--blue-500` itself is unchanged and still used for fills/dots.
- `.btn--ghost` was hardcoded white-on-transparent, invisible on light
  surfaces (e.g. Profile's "Edit details"). Now theme-aware by default;
  still white-on-navy on the always-navy hero/header/footer.
- Deadline-status and difficulty-badge text colors (`--status-*`) were the
  same value used for both the pale badge *fill* and the *text* on white
  cards — added `--status-*-text` variants with real AA contrast; the fills
  are unchanged.
- Two `<ThemeToggle>` instances (desktop bar + mobile menu) each held their
  own `useState`, so toggling one could leave the other stale until
  remount. `utils/theme.js` now has a single external store
  (`getTheme`/`subscribeTheme`/`applyTheme`); both toggles use
  `useSyncExternalStore` against it.
- SAT/IELTS 1v1 "Create match"/"Join" buttons had no button class (plain
  unstyled text in some states) — added `.btn.btn--accent`.

**Verification method**: an automated contrast auditor (Playwright, not
committed — lived in `/tmp/audit` in the session that did this work) walks
every route, computes each visible text node's effective color against its
actual resolved background (accounting for opacity/layered backgrounds),
and flags anything under WCAG AA (4.5:1 normal text, 3:1 large text),
excluding disabled controls and SVG `<text>` (fill-driven). Last full run:
**0 violations** across all main routes × light/dark × desktop/mobile, and
0 violations across all 10 leagues on Leaderboard + Profile. If you
continue this audit, rebuild that harness rather than eyeballing pages —
it caught things (e.g. the accent-button white-text contrast) that were
not visually obvious.

**Follow-up pass**: a grep for remaining hardcoded hex colors turned up
several that the route-crawl audit couldn't see because they only appear in
*interacted* states the crawler never triggers (answered SAT questions,
success/error banners). Checked each by hand and fixed the real failures,
computed against their actual composited background (see
`--chip-correct-bg`, `--chip-attempted-fg`/`--chip-attempted-border` in
`src/styles/index.css`):
- `.sat-question-chip--correct`: white text on `#1a9c5c` was 3.53:1 (needs
  4.5) — darkened to `--chip-correct-bg` (`#16854e`, 4.67:1). Self-contained
  solid fill, same in both themes.
- `.sat-question-chip--attempted`: text `#8a6a10` passed light (5.06) but
  failed dark (3.51); border `#d6a419` passed dark but failed light's 3:1
  (2.29) — both were static values on a background that flips with theme.
  Now `--chip-attempted-fg`/`--chip-attempted-border`, theme-aware, AA in
  both.
- `.sat-challenge__pin` text (`#c76b00`) failed against its own translucent
  background in both light (3.56) and dark (4.17) — replaced with the
  already-proven `--status-yellow-text` token.
- `.submit-opp__status--success`/`.review-item--correct` text (`#1a9c5c`,
  3.53:1 on white) and `.submit-opp__status--error`/`.review-item--incorrect`/
  `.profile-menu__signout` text (`#d64545`, 4.38/4.05:1, just under 4.5) —
  all switched to `--status-green-text`/`--status-red-text`.
- Verified by scripting real interactions (clicking through SAT
  Check-answer to actually produce correct/wrong/attempted chip states,
  not just the default page load) — 0 violations in both themes after.
- Re-ran the full route × theme × viewport sweep and all 10 leagues after
  these changes: still 0 violations.

**Still open / not done**:
- `border-color`-only hardcoded hex that are non-text and already clear
  the 3:1 non-text threshold in both themes (checked, not changed):
  `.sat-option--correct`/`--wrong` borders,
  `.leaderboard-legend__item--*` dots. Left alone — no contrast issue.
- `.category-action-card--*` background/border tints and `.tilt-frame`
  (decorative phone-mockup bezel) are intentionally static across themes;
  not text, not flagged, left as-is.
- Audit was run with mock/stub league membership + profile data (no live
  Supabase connection in this environment) — re-verify against real
  leaderboard/profile data once possible.
- No lint/typecheck run yet on this batch (build passes).

## SAT Math (Exercises + 1v1) — added this session
- `src/data/satMathQuestions.js`: 40 questions (10 per domain: Algebra,
  Advanced Math, Data Analysis, Geometry & Trig), each with
  difficulty/topic/explanation. Math is LaTeX (`$$...$$` display,
  `\(...\)` inline) rendered by `src/components/MathText.jsx` via
  KaTeX. **To add a question**: append one `mc(...)`/`spr(...)` call,
  then run `npm run gen:sat-math-key` (rewrites the answer-key block in
  `supabase/sat_math_1v1_schema.sql` from the JS file) and re-run that
  SQL in Supabase. `npm test` checks the two stay in sync, and checks
  every question is well-formed and every math delimiter is balanced.
  Two source-bank answers didn't work as given (A07's ticket totals had
  no integer solution; B07 had two positive y-values for "the positive
  value") — both are called out with a `NOTE:` comment at the question
  and adjusted so the printed answer is actually correct.
- `src/pages/SatMathExercisesPage.jsx`: practice page, topic + difficulty
  filters (reuses the existing `.filter-bar`/`.filter-chip` classes),
  check-answer/explanation reuses `.sat-question-card`/`.sat-option`
  styling from the existing SAT practice page.
- **SAT Math 1v1 is architecturally different from the SAT/IELTS 1v1**:
  those two trust the client to report its own score at the end. SAT
  Math 1v1 grades server-side instead — see "Known issues" for why and
  how (`supabase/sat_math_1v1_schema.sql`, `useSatMathMatch.js`,
  `SatMathChallengePage.jsx`). If you build a fourth 1v1 mode, consider
  whether it should follow the SAT Math pattern instead of the
  SAT/IELTS one.
- Tested against a real local Postgres + PostgREST (not just read over):
  34 scripted checks as two real signed-in users (create, join, third-
  player rejected, RLS blocks direct table writes/reads, duplicate/late/
  early answers rejected, disconnect/reconnect via heartbeat, refresh
  doesn't move the timer, expiry, leave/cancel). This sandbox has no
  network access to Vercel/Supabase, so the actual deployed app itself
  is unverified — ask the user to confirm the live flow once deployed
  and the SQL is run.

## Levels + streak milestones page — added this session
Clicking the streak anywhere (the homepage `HomeStreakBar`, or the
`StreakCard` on Profile — both are now real `<a>` links, not onClick
handlers) opens `#/profile/progress` (`ProfileStatsPage.jsx`): a page
styled after a reference screenshot the user supplied (a competing SAT
prep tool's stats dashboard), deliberately **excluding its leaderboard/
rank-history panel** per explicit instruction. Only three cards:

- **Level** (`LevelCard.jsx` + `utils/levels.js`): a level is purely a
  *read* of `profile.lifetime_xp` — already a real, permanently-
  accumulating column (see `utils/xp.js`, awarded for SAT questions and
  IELTS practice/mocks) — run through a quadratic curve,
  `xpForLevel(L) = 50*L*(L-1)`. **No new DB column or migration**; it
  works immediately. Uses the shared `ProgressRing` component (added by
  the Profile-redesign commit this was rebased onto) rather than a
  second hand-rolled ring.
- **Questions** (`QuestionsStatCard.jsx`): total answered + overall
  accuracy, via a new `buildOverallStats()` in `utils/progress.js` that
  combines the existing SAT R&W/Math + IELTS exercise aggregates. Mixes
  a sticky mastery flag (SAT R&W) with real per-attempt correctness (SAT
  Math, IELTS) into one headline pair — precise per-source numbers are
  still in `progress.sat`/`progress.ielts` for anyone who wants the
  breakdown.
- **Streak milestones** (`StreakMilestonesCard.jsx` +
  `utils/streakMilestones.js`): a fixed ladder (3/7/14/30/60/100/180/365
  days). "Achieved" = the **longest** streak on record ever reached it
  (stays achieved even after the streak later breaks). Not-yet-reached
  ones show days-to-go + a target calendar date, computed from the
  **current** streak, only while it's alive.

Verified: full route x theme x viewport contrast audit 0 violations,
including three synthetic states (no XP/no streak, mid-level/early
streak, max level/all-milestones-achieved) in both themes. All 10
leagues re-checked (unaffected — unrelated code path). No JS pageerrors.

Incidental fix while reconciling with the concurrent Profile-redesign
commit: that commit's "Account details" section had a duplicated `)}`
after the edit-form ternary, rendering a stray `}` next to the "Edit
details" button on every load. Fixed (one-line removal).

## Known issues / unfinished work (as of this handoff)
- **Why SAT Math 1v1 grades server-side instead of matching the SAT/
  IELTS 1v1 pattern**: the user's requirements for SAT Math 1v1 were
  explicit that "players cannot modify each other's scores" and to
  "handle timeout, refresh, disconnect, reconnect, duplicate
  submissions, expired challenges, and a third-player join attempt" —
  the existing SAT/IELTS 1v1 tables let either player UPDATE the whole
  match row (including `host_score`/`opponent_score`) once they're a
  participant, which technically lets a player overwrite the other
  player's score, and don't handle duplicate submissions, join-race
  timing, or expiry at all. Rather than touch the working SAT/IELTS
  tables (explicitly out of scope — "do NOT modify the IELTS 1v1
  behavior"), SAT Math 1v1 uses its own tables with **no client write
  access at all**: every action is a `SECURITY DEFINER` RPC
  (`create_sat_math_match`, `join_sat_math_match`,
  `start_sat_math_match`, `submit_sat_math_answer`,
  `leave_sat_math_match`, `get_sat_math_match`) that checks identity and
  match state server-side; the answer key lives in a table with no RLS
  policies at all (so it's readable by nobody but the functions); a
  `primary key (match_id, user_id, question_index)` on the answers table
  is what makes duplicate submissions a no-op instead of a race; and the
  timer is purely `started_at + index * seconds_per_question`, read
  fresh from the server on every poll, so refreshing can't move it. If
  the SAT/IELTS 1v1 ever need the same guarantees, they'd need a similar
  rework — noting it here rather than doing it as a drive-by change.
- IELTS reading tests 3–10: content was drafted in a prior session but
  it's unclear if it was ever merged — check `src/data/ieltsTests.js`
  for `comingSoon: true` entries before assuming this is done or
  redoing it.
- Two possibly-overlapping IELTS practice entry points exist (see
  above) — needs reconciliation.
- Main JS bundle is ~590KB minified for the main chunk (SAT Math's own
  chunk, with KaTeX, is lazy-loaded separately and doesn't add to this) —
  a further code-splitting pass would help but hasn't been prioritized.
- Mobile horizontal-overflow bug: fixed in this session by (1) adding
  `overflow-x: hidden` to `<html>` (it was only on `<body>`, which
  mobile Safari doesn't reliably honor alone), (2) removing the
  language/theme toggles from the mobile top bar (moved into the
  slide-down mobile menu instead) since they didn't fit alongside the
  hamburger + sign-in/profile button, (3) a broad `overflow-wrap:
  break-word` safety net on text elements. If overflow reappears after
  adding new header controls or wide fixed-width elements, check those
  two things first.
- Profile page mobile layout: the four blocks (basic info, League &
  Achievements, IELTS history, Saved Opportunities) were severely
  overlapping/garbled on mobile due to a shared-class flex layout bug
  (see "Key systems" above for the fix). Fixed and verified on both
  mobile (390px) and desktop (1280px) via a temporary local auth stub
  (never committed) since a real Supabase session isn't available in
  a sandboxed dev environment — screenshot-diff this page again with
  the same technique if you touch this layout. **Resolved**: the user
  confirmed the vertical stack is the intended final design — no
  horizontal/grid/swipe arrangement is wanted. Don't revisit this.

## House rules for continuing work
- Build (`npm run build`) before every commit — don't push unverified.
- Commit messages should explain *why*, not just *what* — this file and
  git history are the only continuity mechanism between sessions.
- Never assume a Supabase migration ran; ask for confirmation.
- Don't reintroduce synthetic/demo users into any user-facing list —
  this was explicitly removed as a trust/accuracy issue.
- Update this file when you finish a body of work, especially anything
  in "Known issues" above.
