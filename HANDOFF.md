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

## SAT 1v1 Challenge (built — verify SQL status)
Git history shows the full create/join/lobby/play/results flow is built
(`SatChallengePage.jsx`, `useSatMatch.js`, `supabase/sat_matches_schema.sql`
and `sat_matches_play_schema.sql`). The earlier "pending task" note here was
stale. Not confirmed from the repo alone: whether both SQL files have been
run in Supabase — ask the user before assuming realtime 1v1 works live.

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
deliberately deferred until the SAT Math exercises exist (user is building them).

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

## Not built yet (from the dashboard spec)
Progress tracker, weak-area diagnosis (waiting on SAT Math), roadmap, new-user
onboarding (when built: backfill `onboarding_completed = true` for existing
rows so nobody is forced through it), edit-goals settings, authenticated
homepage. Existing profile columns to reuse instead of duplicating: `grade`,
`intended_major`, `target_test`, `school`.

## Known issues / unfinished work (as of this handoff)
- IELTS reading tests 3–10: content was drafted in a prior session but
  it's unclear if it was ever merged — check `src/data/ieltsTests.js`
  for `comingSoon: true` entries before assuming this is done or
  redoing it.
- Two possibly-overlapping IELTS practice entry points exist (see
  above) — needs reconciliation.
- No server-side cron for weekly leaderboard rollover — it only runs
  client-side when the affected user's own profile loads
  (`processWeeklyReset` in `leaderboard.js`). Cross-user consistency at
  week boundaries is best-effort, not guaranteed.
- Main JS bundle is ~590KB minified — a code-splitting pass would help
  but hasn't been prioritized.
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
