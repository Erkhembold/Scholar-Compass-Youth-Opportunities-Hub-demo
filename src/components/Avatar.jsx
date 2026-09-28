import { avatarUrl } from "../utils/avatar.js";

// One consistent avatar everywhere a student's picture appears: a photo
// when they have one, otherwise their initial on a plain background —
// same fallback style the leaderboard already used.
export default function Avatar({ path, name, size = 48, className = "" }) {
  const url = avatarUrl(path);
  const initial = (name || "?").trim().charAt(0).toUpperCase() || "?";
  const style = { width: size, height: size, fontSize: Math.max(12, size * 0.42) };

  if (url) {
    return (
      <img
        src={url}
        alt=""
        className={`avatar-img ${className}`}
        style={style}
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    );
  }
  return (
    <span className={`avatar-img avatar-img--fallback ${className}`} style={style} aria-hidden="true">
      {initial}
    </span>
  );
}
