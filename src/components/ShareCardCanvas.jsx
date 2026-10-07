import { useEffect, useRef } from "react";
import { drawCard } from "../utils/shareCard.js";

// Draws one card on a canvas. The same drawing code produces the exported
// image (see utils/shareCard.js), so this preview is exactly what gets shared.
export default function ShareCardCanvas({ card, className = "" }) {
  const ref = useRef(null);
  const key = JSON.stringify(card);

  useEffect(() => {
    let cancelled = false;
    if (!ref.current || !card) return undefined;
    drawCard(ref.current, card).catch(() => {
      if (!cancelled && ref.current) ref.current.getContext("2d").clearRect(0, 0, 1, 1);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return (
    <canvas
      ref={ref}
      className={`share-canvas ${className}`}
      width={1080}
      height={1920}
      role="img"
      aria-label={card?.alt || "ScholarCompass card"}
    />
  );
}
