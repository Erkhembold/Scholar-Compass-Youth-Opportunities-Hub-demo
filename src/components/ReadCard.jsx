import ReadArt from "./ReadArt.jsx";
import { readHref } from "../router.js";

export default function ReadCard({ read }) {
  const href = readHref(read.id);

  return (
    <article className="read-card">
      <a className="read-card__media" href={href} aria-label={read.title}>
        {read.image ? (
          <img src={read.image} alt="" className="read-card__image" />
        ) : (
          <ReadArt category={read.category} pattern={read.pattern} />
        )}
      </a>
      <div className="read-card__body">
        <div className="read-card__meta">
          <span className="read-card__category">{read.category}</span>
          {read.source && <span className="read-card__date">{read.source}</span>}
        </div>
        <h3 className="read-card__title">
          <a href={href}>{read.title}</a>
        </h3>
      </div>
    </article>
  );
}
