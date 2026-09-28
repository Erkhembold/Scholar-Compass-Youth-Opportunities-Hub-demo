import katex from "katex";
import "katex/dist/katex.min.css";
import { parseMath } from "../utils/mathText.js";

// Renders text that may contain LaTeX ($$...$$ display, \(...\) inline).
// KaTeX output is generated from our own static question bank, and KaTeX
// runs with throwOnError:false + trust:false, so a bad formula degrades to
// plain red text instead of breaking the page.
function render(src, displayMode) {
  return katex.renderToString(src, { displayMode, throwOnError: false, trust: false, strict: "ignore" });
}

export default function MathText({ text, className }) {
  const segments = parseMath(text);
  return (
    <span className={`math-text ${className || ""}`.trim()}>
      {segments.map((seg, i) => {
        if (seg.type === "text") return <span key={i}>{seg.value}</span>;
        if (seg.type === "display")
          return <span key={i} className="math-text__display" dangerouslySetInnerHTML={{ __html: render(seg.value, true) }} />;
        return <span key={i} dangerouslySetInnerHTML={{ __html: render(seg.value, false) }} />;
      })}
    </span>
  );
}
