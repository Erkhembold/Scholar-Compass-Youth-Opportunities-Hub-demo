import { useEffect, useRef, useState } from "react";

const BASE = import.meta.env.BASE_URL || "/";

// Launch film in the signed-out hero. It starts by itself, so it has to be
// muted (browsers block autoplay with sound) and inline (iOS Safari). People
// who ask their system for reduced motion get the still poster with normal
// controls instead of a moving picture.
export default function HeroVideo() {
  const ref = useRef(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let reduced = false;
    try {
      reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      reduced = false;
    }
    setReduceMotion(reduced);
    const v = ref.current;
    if (!v || reduced) return;
    v.muted = true;
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, []);

  return (
    <div className="hero-video">
      <video
        ref={ref}
        className="hero-video__el no-dim"
        src={`${BASE}media/scholarcompass-launch.mp4`}
        poster={`${BASE}media/scholarcompass-launch-poster.jpg`}
        autoPlay={!reduceMotion}
        muted
        loop
        playsInline
        preload="auto"
        controls={reduceMotion}
        aria-label="ScholarCompass launch video: a short look at what the platform offers students."
      />
    </div>
  );
}
