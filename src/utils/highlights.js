// Highlights are stored as character ranges over a passage's plain text
// ({ start, end }, end exclusive) so they survive React re-renders and can be
// kept per question. Pure functions, unit-tested in tests/highlights.test.mjs.

// Adds a range, merging anything it overlaps or touches. Returns a new list.
export function addHighlight(list, start, end) {
  if (!(end > start)) return list;
  let s = start;
  let e = end;
  const rest = [];
  for (const h of list) {
    if (h.end < s || h.start > e) rest.push(h);
    else {
      s = Math.min(s, h.start);
      e = Math.max(e, h.end);
    }
  }
  rest.push({ start: s, end: e });
  return rest.sort((a, b) => a.start - b.start);
}

// Removes the highlight that contains `offset`, if any.
export function removeHighlightAt(list, offset) {
  return list.filter((h) => !(offset >= h.start && offset < h.end));
}

// Splits text into ordered segments, each flagged as highlighted or not.
export function splitSegments(text, list) {
  const out = [];
  let pos = 0;
  for (const h of list) {
    const start = Math.max(0, Math.min(text.length, h.start));
    const end = Math.max(start, Math.min(text.length, h.end));
    if (end <= start) continue;
    if (start > pos) out.push({ text: text.slice(pos, start), start: pos, end: start, hl: false });
    out.push({ text: text.slice(start, end), start, end, hl: true });
    pos = end;
  }
  if (pos < text.length) out.push({ text: text.slice(pos), start: pos, end: text.length, hl: false });
  return out;
}

// Offsets of the current text selection relative to `container`'s text, or null.
export function selectionOffsets(container, selection) {
  if (!container || !selection || selection.rangeCount === 0 || selection.isCollapsed) return null;
  const range = selection.getRangeAt(0);
  if (!container.contains(range.startContainer) || !container.contains(range.endContainer)) return null;
  const pre = range.cloneRange();
  pre.selectNodeContents(container);
  pre.setEnd(range.startContainer, range.startOffset);
  const start = pre.toString().length;
  const end = start + range.toString().length;
  return end > start ? { start, end } : null;
}
