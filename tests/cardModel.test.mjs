import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isPublic,
  ownerViewModel,
  publicViewModel,
  buildCard,
  listMilestones,
  buildMilestoneCard,
  CARD_KINDS,
} from "../src/utils/cardModel.js";

const full = {
  id: "u1",
  name: "Alice Tester",
  avatar_path: "u1/avatar-1.png",
  school: "Secret School",
  grade: "11",
  current_streak: 21,
  longest_streak: 35,
  sat_target_score: 1450,
  ielts_target_score: 7,
  current_league: "gold",
  league_rank: 3,
  league_size: 40,
  weekly_xp: 200,
  lifetime_xp: 1240,
  badges: [{ placement: 1, badge: "Gold", league: "bronze", week: 40 }],
  sat_questions: 130,
  ielts_questions: 40,
  ielts_latest_band: 6.5,
};
const allOn = { show: Object.fromEntries(["name", "avatar", "school", "grade", "sat", "ielts", "streak", "league", "xp", "achievements"].map((k) => [k, true])) };
const allOff = { show: Object.fromEntries(Object.keys(allOn.show).map((k) => [k, false])) };

test("defaults match the database: only name/avatar/streak/sat/ielts are public", () => {
  for (const k of ["name", "avatar", "streak", "sat", "ielts"]) assert.equal(isPublic({}, k), true, k);
  for (const k of ["school", "grade", "league", "xp", "achievements"]) assert.equal(isPublic({}, k), false, k);
  assert.equal(isPublic({ show: { name: false } }, "name"), false);
  assert.equal(isPublic({ show: { school: true } }, "school"), true);
  assert.equal(isPublic({ show: { name: "yes" } }, "name"), true); // non-boolean ignored -> default
});

test("owner view model hides every private field", () => {
  const vm = ownerViewModel(full, allOff);
  assert.equal(vm.name, null);
  assert.equal(vm.avatarPath, null);
  assert.equal(vm.school, null);
  assert.equal(vm.grade, null);
  assert.equal(vm.streak, null);
  assert.equal(vm.sat, null);
  assert.equal(vm.ielts, null);
  assert.equal(vm.league, null);
  assert.equal(vm.xp, null);
  assert.equal(vm.badges, null);
});

test("no card can be built from private data, and no private value reaches any card", () => {
  const vm = ownerViewModel(full, allOff);
  for (const k of CARD_KINDS) {
    const card = buildCard(k.id, vm);
    if (card) {
      const text = JSON.stringify(card);
      for (const secret of ["Alice", "Secret School", "1450", "1240", "gold", "Gold", "u1/avatar"]) {
        assert.ok(!text.includes(secret), `${k.id} leaked ${secret}`);
      }
    }
  }
  for (const k of ["streak", "league", "sat", "ielts", "achievements"]) assert.equal(buildCard(k, vm), null, k);
});

test("private fields stay out of cards when only some fields are public", () => {
  const vm = ownerViewModel(full, { show: { name: false, avatar: false, streak: true, league: false, xp: false } });
  const streak = buildCard("streak", vm);
  assert.equal(streak.hero, "21");
  assert.equal(streak.person.name, null);
  assert.equal(streak.person.avatarPath, null);
  assert.equal(buildCard("league", vm), null);
  const student = buildCard("student", vm);
  const text = JSON.stringify(student);
  assert.ok(!text.includes("Alice") && !text.includes("XP") && !text.includes("Gold"));
  assert.equal(student.hero, "ScholarCompass student");
});

test("real numbers only: streak, SAT, IELTS, league cards", () => {
  const vm = ownerViewModel(full, allOn);
  assert.equal(buildCard("streak", vm).hero, "21");
  assert.equal(buildCard("sat", vm).hero, "1450");
  assert.match(buildCard("sat", vm).note, /not an official score/);
  const ielts = buildCard("ielts", vm);
  assert.equal(ielts.hero, "6.5");
  assert.equal(ielts.label, "LATEST MOCK BAND");
  assert.equal(buildCard("league", vm).hero, "GOLD");
  assert.equal(buildCard("achievements", vm).hero, "1");
  // nothing to show -> no card (never a made-up one)
  const empty = ownerViewModel({ ...full, current_streak: 0, sat_target_score: null, sat_questions: 0, ielts_target_score: null, ielts_latest_band: null, ielts_questions: 0, badges: [] }, allOn);
  assert.equal(buildCard("streak", empty), null);
  assert.equal(buildCard("sat", empty), null);
  assert.equal(buildCard("ielts", empty), null);
  assert.equal(buildCard("achievements", empty), null);
});

test("public view model reads the server's already-filtered response", () => {
  const vm = publicViewModel({
    id: "u2", name: null, avatar_path: null, school: null, grade: null,
    streak: { current: 7, longest: 9 }, sat: null, ielts: null, league: null, xp: null, badges: null, cards: ["streak"], featured: "streak",
  });
  assert.equal(vm.name, null);
  assert.equal(buildCard("streak", vm).hero, "7");
  assert.equal(buildCard("sat", vm), null);
  assert.equal(buildCard("league", vm), null);
});

test("public view model still works with the older flat response (SQL not yet run)", () => {
  const vm = publicViewModel({ id: "u3", name: "Old", current_streak: 2, longest_streak: 4, sat_target_score: 1300, ielts_target_score: null });
  assert.equal(vm.legacy, true);
  assert.equal(buildCard("streak", vm).hero, "2");
  assert.equal(vm.school, null);
  assert.equal(vm.xp, null);
});

test("milestones: only meaningful ones, from real data", () => {
  const ms = listMilestones(full).map((m) => m.id);
  assert.deepEqual(ms, ["streak-7", "streak-14", "streak-30", "league-gold", "sat-100", "ielts-100"].filter((id) => ms.includes(id)));
  assert.ok(ms.includes("streak-30") && !ms.includes("streak-60"));
  assert.ok(ms.includes("league-gold"));
  assert.ok(ms.includes("sat-100") && !ms.includes("sat-500"));
  assert.ok(!ms.includes("ielts-100")); // only 40 IELTS questions
  assert.deepEqual(listMilestones({ longest_streak: 3, current_league: "bronze", sat_questions: 20, ielts_questions: 0 }), []);
  assert.deepEqual(listMilestones(null), []);
});

test("milestone card shows only the achievement + public identity", () => {
  const m = listMilestones(full).find((x) => x.id === "streak-30");
  const priv = buildMilestoneCard(m, ownerViewModel(full, allOff));
  assert.equal(priv.hero, "30");
  assert.equal(priv.person.name, null);
  assert.equal(priv.person.avatarPath, null);
  assert.ok(!JSON.stringify(priv).includes("Secret School"));
  const pub = buildMilestoneCard(m, ownerViewModel(full, allOn));
  assert.equal(pub.person.name, "Alice Tester");
  assert.equal(pub.person.sub, "Secret School · Grade 11");
});
