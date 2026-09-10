import PlaceholderArt from "./PlaceholderArt.jsx";

export default function CategoryHero({ label, intro, pattern }) {
  return (
    <section className="hero category-hero" aria-label={`${label} overview`}>
      <div className="hero__inner">
        <div className="hero__copy">
          <p className="hero__eyebrow">Category</p>
          <h1 className="hero__headline category-hero__headline">{label}</h1>
          <p className="hero__lede">{intro}</p>
          <div className="hero__actions">
            <a className="btn btn--accent" href="#category-board">
              View {label.toLowerCase()} opportunities
            </a>
          </div>
        </div>

        <div className="hero__visual">
          <div className="category-hero__frame">
            <PlaceholderArt pattern={pattern} />
          </div>
        </div>
      </div>
    </section>
  );
}
