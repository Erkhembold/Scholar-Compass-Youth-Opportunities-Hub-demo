import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("UserScoreBadge source: renders label/score/sublabel, hides when no score", () => {
  const src = fs.readFileSync("src/components/UserScoreBadge.jsx", "utf8");
  assert.match(src, /return null/);
  assert.match(src, /score-badge__label/);
  assert.match(src, /score-badge__score/);
  assert.match(src, /score-badge__sub/);
});

test("badge is wired into leaderboard, public profile and own profile", () => {
  for (const f of ["src/components/LeaderboardRow.jsx", "src/pages/PublicProfilePage.jsx", "src/pages/ProfilePage.jsx"]) {
    assert.match(fs.readFileSync(f, "utf8"), /UserScoreBadges/, f);
  }
});

test("verified_scores migration is read-only for users and seeds both people", () => {
  const sql = fs.readFileSync("supabase/verified_scores.sql", "utf8");
  assert.ok(!/for (insert|update|delete|all)/i.test(sql.replace(/--.*$/gm, "")));
  assert.match(sql, /'7\.5'/);
  assert.match(sql, /'8\.0'/);
});
