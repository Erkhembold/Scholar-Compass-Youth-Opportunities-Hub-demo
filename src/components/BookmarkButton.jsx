import { IconBookmark } from "./icons.jsx";

export default function BookmarkButton({ saved, onToggle, className = "", size = "md" }) {
  return (
    <button
      type="button"
      className={`bookmark-btn bookmark-btn--${size} ${saved ? "bookmark-btn--saved" : ""} ${className}`}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved opportunities" : "Save this opportunity"}
      title={saved ? "Saved" : "Save"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
    >
      <IconBookmark filled={saved} />
    </button>
  );
}
