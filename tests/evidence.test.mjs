import test from "node:test";
import assert from "node:assert/strict";
import { validateEvidenceFile, evidencePath, formatBytes, friendlyCompletionError, EVIDENCE_MAX_BYTES } from "../src/utils/evidence.js";

test("accepts jpg/png/webp up to 5 MB", () => {
  for (const type of ["image/jpeg", "image/png", "image/webp"]) {
    assert.equal(validateEvidenceFile({ type, size: 1000 }), null);
  }
  assert.equal(validateEvidenceFile({ type: "image/png", size: EVIDENCE_MAX_BYTES }), null);
});
test("rejects missing, wrong-type, empty and oversized files", () => {
  assert.match(validateEvidenceFile(null), /Choose a photo/);
  assert.match(validateEvidenceFile({ type: "application/pdf", size: 10 }), /JPG, PNG or WebP/);
  assert.match(validateEvidenceFile({ type: "image/gif", size: 10 }), /JPG, PNG or WebP/);
  assert.match(validateEvidenceFile({ type: "image/png", size: 0 }), /empty/);
  assert.match(validateEvidenceFile({ type: "image/png", size: EVIDENCE_MAX_BYTES + 1 }), /5 MB/);
});
test("evidence path lives in the student's own folder", () => {
  const p = evidencePath("user-1", "IRIM Student Program 2026!", { type: "image/webp" }, 123);
  assert.equal(p, "user-1/irim-student-program-2026-123.webp");
  assert.ok(p.startsWith("user-1/"));
  assert.equal(evidencePath("u", "???", { type: "image/png" }, 1), "u/opportunity-1.png");
});
test("friendly sizes and errors", () => {
  assert.equal(formatBytes(2048), "2 KB");
  assert.equal(formatBytes(3 * 1024 * 1024), "3.0 MB");
  assert.match(friendlyCompletionError("Could not find the function public.submit_opportunity_completion in the schema cache"), /not switched on/);
  assert.match(friendlyCompletionError("You already have a submission for this opportunity that is pending review or approved."), /^You already/);
  assert.equal(friendlyCompletionError(""), "Something went wrong. Please try again.");
});
