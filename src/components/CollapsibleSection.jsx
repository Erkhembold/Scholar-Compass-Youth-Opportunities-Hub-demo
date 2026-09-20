import { useState } from "react";
import { useIsMobile } from "../hooks/useIsMobile.js";

// On desktop this renders exactly like a plain section heading with its
// content always visible underneath — no accordion behavior at all,
// visually unchanged from before. On mobile it becomes a tap-to-expand
// row: collapsed by default, content only mounts once opened.
export default function CollapsibleSection({ title, lede, children, defaultOpen = false }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(defaultOpen);
  const isOpen = !isMobile || open;

  return (
    <div className="profile-accordion__item">
      <button
        type="button"
        className="profile-accordion__header"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={isOpen}
      >
        <span className="profile-accordion__title">{title}</span>
        <span className="profile-accordion__chevron" aria-hidden="true">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {lede && isMobile && !isOpen ? null : lede ? (
        <p className="signin__lede profile-accordion__lede">{lede}</p>
      ) : null}
      {isOpen && <div className="profile-accordion__panel">{children}</div>}
    </div>
  );
}
