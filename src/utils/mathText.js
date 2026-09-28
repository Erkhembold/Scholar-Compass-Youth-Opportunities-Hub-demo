// Splits a string containing LaTeX into renderable segments.
// Supported delimiters (matching how the SAT Math bank is written):
//   $$ ... $$   -> display math (own line)
//   \( ... \)   -> inline math
// A single "$" is left alone on purpose, so prices like "$5" stay plain text.
const TOKEN = /\$\$([\s\S]+?)\$\$|\\\(([\s\S]+?)\\\)/g;

export function parseMath(text) {
  const segments = [];
  if (typeof text !== "string" || text === "") return segments;
  let last = 0;
  let m;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(text)) !== null) {
    if (m.index > last) segments.push({ type: "text", value: text.slice(last, m.index) });
    if (m[1] !== undefined) segments.push({ type: "display", value: m[1].trim() });
    else segments.push({ type: "inline", value: m[2].trim() });
    last = m.index + m[0].length;
  }
  if (last < text.length) segments.push({ type: "text", value: text.slice(last) });
  return segments;
}
