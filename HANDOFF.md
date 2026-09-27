# ScholarCompass — Developer Handoff

Read this first. It's kept up to date so a new session (AI or human) can
pick up the project without re-discovering the architecture from scratch.

## What this is
A student opportunity hub for Mongolian high-school/university students:
scholarships, competitions, volunteering, internships, IELTS reading
practice, SAT English practice, a weekly XP leaderboard, and user
accounts. React + Vite, deployed on Vercel, backed by Supabase.

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

## PENDING TASK (in progress, not yet started — pick this up first)
The user has requested a new feature: **SAT 1v1 Challenge**, a real-time
multiplayer head-to-head mode under SAT → Exercises, where two
authenticated users answer the same SAT question set under a shared
timer, with a 4-digit PIN-based lobby system. Full spec was given in
detail (match creation with configurable question count/time-per-question,
lobby with host/opponent, synchronized question set + timer via Supabase
realtime, scoring, wait-for-both-players result screen, disconnect
handling, PIN uniqueness, per-user auth-scoped security, XP via the
existing `awardXp()`/`XP_REWARDS` system — no new flat reward). Explicit
required order: **Step 1 is to inspect the current SAT Exercises
architecture, auth system, question data, and Supabase setup, and report
back which existing pieces can be reused BEFORE writing any code.** Then
proceed in small steps (nav/UI shell → create/join/lobby → shared
question selection/realtime state → timer/scoring → results/disconnects →
final SQL handoff), building/testing/committing/pushing after each step —
do not batch multiple steps into one push. Do not modify
`src/data/satQuestions.js` unnecessarily; reuse it as the question source
for matches. This will need new Supabase tables for match state — write
the SQL and hand it to the user to run manually, same as every other
migration in this project.

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
- Main JS bundle is ~750KB minified — a code-splitting pass would help
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
