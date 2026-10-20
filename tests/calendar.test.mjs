import test from "node:test";
import assert from "node:assert/strict";
import { createGoogleCalendarUrl, opportunityCalendarUrl, summarize } from "../src/utils/calendar.js";

test("builds the Google Calendar template url", () => {
  const url = createGoogleCalendarUrl({ title: "Japan Youth Summit", description: "Apply & go", date: "2026-11-05" });
  assert.ok(url.startsWith("https://calendar.google.com/calendar/render?action=TEMPLATE&text=Japan%20Youth%20Summit"));
  assert.ok(url.includes("&dates=20261105/20261105"));
  const details = new URL(url).searchParams.get("details");
  assert.equal(details, "Apply & go\n\nApplied via ScholarCompass");
});
test("opportunity url needs a real date", () => {
  const op = { title: "Cleanup Day", description: { mn: "mn text", en: "English text" }, deadline: { date: "2026-12-01" } };
  const url = opportunityCalendarUrl(op, "https://x.test/#/opportunity/a");
  assert.ok(url.includes("dates=20261201/20261201"));
  assert.match(new URL(url).searchParams.get("details"), /English text[\s\S]*x\.test[\s\S]*Applied via ScholarCompass/);
  assert.equal(opportunityCalendarUrl({ ...op, deadline: { label: "Rolling" } }), null);
  assert.equal(opportunityCalendarUrl({ ...op, deadline: undefined }), null);
});
test("summarize flattens and truncates", () => {
  assert.equal(summarize("a\n\n  b   c"), "a b c");
  assert.ok(summarize("word ".repeat(200), 50).length <= 54);
  assert.equal(summarize(undefined), "");
});
