// A small, dependency-free SVG progress ring. Pure presentation — every
// number it draws is passed in by the caller, nothing is computed here.
export default function ProgressRing({
  percent, // 0–100 (values outside that range are clamped)
  size = 96,
  strokeWidth = 10,
  color = "var(--blue-500)",
  trackColor = "var(--line)",
  children,
  label,
}) {
  const clamped = Math.max(0, Math.min(100, percent ?? 0));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="progress-ring" style={{ width: size, height: size }} role="img" aria-label={label}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.6s var(--ease-out)" }}
        />
      </svg>
      <div className="progress-ring__center">{children}</div>
    </div>
  );
}
