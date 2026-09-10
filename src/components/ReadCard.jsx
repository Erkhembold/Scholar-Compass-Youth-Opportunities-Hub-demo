import PlaceholderArt from "./PlaceholderArt.jsx";

export default function ReadCard({ read }) {
  return (
    <article className="read-card">
      <a
        className="read-card__media"
        href={read.link}
        aria-label={read.title}
        target={read.external ? "_blank" : undefined}
        rel={read.external ? "noopener noreferrer" : undefined}
      >
        {read.image ? (
          <img src={read.image} alt="" className="read-card__image" />
        ) : (
          <PlaceholderArt pattern={read.pattern} />
        )}
      </a>
      <div className="read-card__body">
        <div className="read-card__meta">
          <span className="read-card__category">{read.category}</span>
          {(read.source || read.date) && (
            <span className="read-card__date">{read.source || read.date}</span>
          )}
        </div>
        <h3 className="read-card__title">
          <a
            href={read.link}
            target={read.external ? "_blank" : undefined}
            rel={read.external ? "noopener noreferrer" : undefined}
          >
            {read.title}
          </a>
        </h3>
      </div>
    </article>
  );
}
