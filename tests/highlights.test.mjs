import test from "node:test";
import assert from "node:assert/strict";
import { addHighlight, removeHighlightAt, splitSegments } from "../src/utils/highlights.js";

test("add keeps ranges sorted and merges overlaps/touching", () => {
  let l = addHighlight([], 10, 20);
  l = addHighlight(l, 0, 5);
  assert.deepEqual(l, [{ start: 0, end: 5 }, { start: 10, end: 20 }]);
  l = addHighlight(l, 5, 12);
  assert.deepEqual(l, [{ start: 0, end: 20 }]);
});
test("empty or reversed ranges are ignored", () => {
  assert.deepEqual(addHighlight([], 4, 4), []);
  assert.deepEqual(addHighlight([], 6, 2), []);
});
test("remove drops only the range under the offset", () => {
  const l = [{ start: 0, end: 5 }, { start: 10, end: 20 }];
  assert.deepEqual(removeHighlightAt(l, 12), [{ start: 0, end: 5 }]);
  assert.deepEqual(removeHighlightAt(l, 7), l);
  assert.deepEqual(removeHighlightAt(l, 5), l);
});
test("segments cover the whole text in order", () => {
  const text = "abcdefghij";
  const segs = splitSegments(text, [{ start: 2, end: 4 }, { start: 7, end: 20 }]);
  assert.equal(segs.map((s) => s.text).join(""), text);
  assert.deepEqual(segs.map((s) => s.hl), [false, true, false, true]);
  assert.deepEqual(splitSegments("xyz", []), [{ text: "xyz", start: 0, end: 3, hl: false }]);
});
