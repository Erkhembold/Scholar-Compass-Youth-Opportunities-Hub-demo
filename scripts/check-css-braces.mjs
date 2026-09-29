// Guards against a merge failure mode seen repeatedly while rebasing on top
// of concurrent sessions: when two independent CSS additions land on
// adjacent lines, git's line-based merge can concatenate them cleanly by
// its own lights while silently dropping the closing "}" between them (the
// diff hunks abut with no context line to anchor on). The result is valid
// enough that `git rebase` reports success, but breaks the stylesheet.
// esbuild's minifier usually warns about it, but only as a build warning,
// easy to miss in noisy CI output — this makes it a hard failure.
// Run: node scripts/check-css-braces.mjs
import { readFileSync } from "node:fs";

const path = new URL("../src/styles/index.css", import.meta.url);
const css = readFileSync(path, "utf8");

let depth = 0;
let line = 1;
const stack = [];
for (let i = 0; i < css.length; ) {
  const c = css[i];
  if (c === "\n") { line++; i++; continue; }
  if (css.slice(i, i + 2) === "/*") {
    const end = css.indexOf("*/", i + 2);
    if (end === -1) { console.error(`Unterminated comment starting at line ${line}`); process.exit(1); }
    line += (css.slice(i, end).match(/\n/g) || []).length;
    i = end + 2;
    continue;
  }
  if (c === "{") { depth++; stack.push(line); i++; continue; }
  if (c === "}") {
    if (stack.length === 0) { console.error(`Unmatched closing brace at line ${line}`); process.exit(1); }
    stack.pop(); depth--; i++; continue;
  }
  i++;
}

if (depth !== 0) {
  console.error(`Unbalanced CSS: ${depth} unclosed rule(s), opened at line(s): ${stack.join(", ")}`);
  process.exit(1);
}
console.log("index.css braces balanced.");
