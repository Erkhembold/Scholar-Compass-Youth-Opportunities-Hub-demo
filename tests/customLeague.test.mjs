import test from "node:test";
import assert from "node:assert/strict";
import { leagueErrorMessage, validateLeagueForm, leagueHref } from "../src/utils/customLeague.js";

test("error codes map to friendly text", () => {
  assert.match(leagueErrorMessage({ message: "not_friends" }), /friends/);
  assert.match(leagueErrorMessage({ message: "ERROR: invite_cooldown" }), /declined/);
  assert.match(leagueErrorMessage(new Error("boom")), /Something went wrong/);
});
test("form validation", () => {
  assert.ok(validateLeagueForm({ name: "ab" }));
  assert.ok(validateLeagueForm({ name: "   " }));
  assert.equal(validateLeagueForm({ name: "Study Squad", description: "" }), "");
  assert.ok(validateLeagueForm({ name: "Study Squad", description: "x".repeat(201) }));
});
test("href encodes the id", () => {
  assert.equal(leagueHref("a b"), "#/leagues/a%20b");
});
