import { useEffect, useState } from "react";

// Mirrors the site's existing `@media (max-width: 720px)` breakpoint
// used elsewhere in index.css, so JS-driven layout decisions (like the
// profile page's mobile accordion) stay in sync with the CSS breakpoints.
export function useIsMobile(breakpoint = 720) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= breakpoint
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}
