import { useRef } from "react";

// Recreates the per-letter hover effect from the portfolio site's hero name:
// each character sits in its own inline-block span, and as the cursor moves
// over the text, nearby letters lift and scale slightly, falling back to
// rest as the cursor moves away. Pure CSS transforms + a mousemove handler,
// no animation library needed.

const RADIUS = 90; // px — how far from a letter the cursor still affects it
const MAX_LIFT = 10; // px upward translate at zero distance
const MAX_SCALE = 1.16;

export default function HoverText({ text, as: Tag = "span", className = "" }) {
  const ref = useRef(null);

  function handleMouseMove(e) {
    const container = ref.current;
    if (!container) return;
    const letters = container.querySelectorAll("[data-letter]");
    letters.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const proximity = Math.max(0, 1 - dist / RADIUS);
      const lift = proximity * MAX_LIFT;
      const scale = 1 + proximity * (MAX_SCALE - 1);
      el.style.transform = proximity > 0.01 ? `translateY(-${lift}px) scale(${scale})` : "";
    });
  }

  function handleMouseLeave() {
    const container = ref.current;
    if (!container) return;
    container.querySelectorAll("[data-letter]").forEach((el) => {
      el.style.transform = "";
    });
  }

  return (
    <Tag
      ref={ref}
      className={`hover-text ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {text.split(" ").flatMap((word, wi, words) => {
        const wordSpan = (
          <span key={`w-${wi}`} className="hover-text__word">
            {word.split("").map((char, ci) => (
              <span key={ci} data-letter className="hover-text__letter">
                {char}
              </span>
            ))}
          </span>
        );
        // The space between words is a plain sibling text node — kept
        // outside the word's no-wrap box so the browser can only break
        // the line *between* words, never in the middle of one.
        return wi < words.length - 1 ? [wordSpan, " "] : [wordSpan];
      })}
    </Tag>
  );
}
