// Cover art for each IELTS mock test card in the test list — shows the
// test's ordinal number (1, 2, 3...) large, in place of an abstract
// pattern, so the numbering is visible at a glance while real cover
// images haven't been chosen yet. Pass `image` once one has.

export default function OrdinalArt({ number, image, alt = "" }) {
  if (image) {
    return <img src={image} alt={alt} className="ordinal-art ordinal-art--image" />;
  }

  const gradientId = `ordinal-art-grad-${number}`;

  return (
    <svg
      className="ordinal-art"
      viewBox="0 0 400 225"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--navy-900)" />
          <stop offset="100%" stopColor="var(--navy-700)" />
        </linearGradient>
      </defs>
      <rect width="400" height="225" fill={`url(#${gradientId})`} />
      <circle cx="332" cy="30" r="90" fill="var(--blue-500)" opacity="0.16" />
      <text
        x="50%"
        y="54%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="inherit"
        fontSize="120"
        fontWeight="800"
        fill="var(--on-dark)"
        opacity="0.94"
      >
        {number}
      </text>
    </svg>
  );
}
