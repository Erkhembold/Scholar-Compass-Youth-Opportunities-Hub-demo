// Neutral editorial placeholder art, standing in for a real photograph until
// one is supplied. Any component can pass a real `image` URL instead — see
// usage in OpportunityCard / ReadCard — and this is skipped entirely.
export default function PlaceholderArt({ pattern = "grid" }) {
  return (
    <svg
      className={`placeholder-art placeholder-art--${pattern}`}
      viewBox="0 0 400 225"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="400" height="225" fill="var(--navy-800)" />
      {pattern === "diagonal" && (
        <path d="M-20 225 L260 -20 L440 -20 L160 245 Z" fill="var(--blue-500)" opacity="0.55" />
      )}
      {pattern === "grid" && (
        <g stroke="var(--blue-300)" strokeWidth="1" opacity="0.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 60} y1="0" x2={i * 60} y2="225" />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 55} x2="400" y2={i * 55} />
          ))}
        </g>
      )}
      {pattern === "radial" && (
        <circle cx="320" cy="60" r="180" fill="var(--blue-500)" opacity="0.45" />
      )}
      {pattern === "stripe" && (
        <g fill="var(--blue-300)" opacity="0.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <rect key={i} x={i * 70 - 30} y="0" width="24" height="225" transform="skewX(-18)" />
          ))}
        </g>
      )}
      {pattern === "dots" && (
        <g fill="var(--blue-300)" opacity="0.55">
          {Array.from({ length: 8 }).map((_, r) =>
            Array.from({ length: 14 }).map((_, c) => (
              <circle key={`${r}-${c}`} cx={c * 30 + 15} cy={r * 30 + 15} r="2.6" />
            ))
          )}
        </g>
      )}
    </svg>
  );
}
