// A placeholder "cover" for each reading passage, showing its ordinal
// number (1, 2, 3...) in the brand style. This is the image slot for a
// passage — pass a real `image` prop once one is chosen and it renders
// instead of the numeral.

export default function PassageArt({ number, image, alt = "" }) {
  if (image) {
    return <img src={image} alt={alt} className="passage-art passage-art--image" />;
  }

  const gradientId = `passage-art-grad-${number}`;

  return (
    <svg
      className="passage-art"
      viewBox="0 0 400 130"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--navy-900)" />
          <stop offset="100%" stopColor="var(--navy-700)" />
        </linearGradient>
      </defs>
      <rect width="400" height="130" fill={`url(#${gradientId})`} />
      <circle cx="352" cy="18" r="60" fill="var(--blue-500)" opacity="0.16" />
      <text
        x="40"
        y="92"
        fontFamily="inherit"
        fontSize="88"
        fontWeight="800"
        fill="var(--on-dark)"
        opacity="0.92"
      >
        {number}
      </text>
    </svg>
  );
}
