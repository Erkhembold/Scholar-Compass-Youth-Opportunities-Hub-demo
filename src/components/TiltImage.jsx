import { useEffect, useRef, useState } from "react";

export default function TiltImage({ src, alt }) {
  const wrapperRef = useRef(null);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setSettled(true);
      return undefined;
    }

    const node = wrapperRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setSettled(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSettled(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="tilt-perspective" style={{ perspective: "1000px" }}>
      <div
        ref={wrapperRef}
        className={`tilt-frame ${settled ? "tilt-frame--settled" : ""}`}
      >
        <div className="tilt-frame__inner">
          <img src={src} alt={alt} className="tilt-frame__image" draggable="false" />
        </div>
      </div>
    </div>
  );
}
