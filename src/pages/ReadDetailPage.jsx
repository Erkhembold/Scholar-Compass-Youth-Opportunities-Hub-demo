import ReadArt from "../components/ReadArt.jsx";
import { IconArrowLeft } from "../components/icons.jsx";
import { reads } from "../data/reads.js";
import { CONTACT_EMAIL } from "../data/config.js";

function sourceDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch (e) {
    return url;
  }
}

export default function ReadDetailPage({ id }) {
  const read = reads.find((r) => r.id === id);

  if (!read) {
    return (
      <section className="section">
        <div className="section__inner">
          <h1 className="section__title">Read not found</h1>
          <p className="section__lede">
            This read may have been removed. <a href="#/">Back to the homepage.</a>
          </p>
        </div>
      </section>
    );
  }

  const { title, category, pattern, image, source, sourceUrl, summary, external } = read;

  return (
    <article className="section detail">
      <div className="section__inner detail__inner">
        <a className="detail__back" href="#/">
          <IconArrowLeft /> Back to Suggested Reads
        </a>

        <div className="detail__banner">
          {image ? (
            <img src={image} alt="" className="detail__banner-image" />
          ) : (
            <ReadArt category={category} pattern={pattern} />
          )}
        </div>

        <header className="detail__header">
          <span className="opp-card__category">{category}</span>
          <h1 className="detail__title">{title}</h1>
          {external && source && (
            <p className="read-detail__byline">
              Originally published by <strong>{source}</strong>
              {sourceUrl && <> — {sourceDomain(sourceUrl)}</>}
            </p>
          )}
        </header>

        <div className="detail__content read-detail__content">
          {external ? (
            <>
              <p>{summary}</p>
              <div className="read-detail__credit">
                <p>
                  All credit for this article belongs to <strong>{source}</strong>. We're
                  summarizing it here so it's easy to find alongside the rest of ScholarCompass
                  — the full piece, in the authors' own words, is on their site.
                </p>
                <a
                  className="btn btn--accent"
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read the full article on {source} ↗
                </a>
              </div>
            </>
          ) : (
            <p>
              This read is on our editorial list but hasn't been written up yet. Check back
              soon, or{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>let us know</a> if you've got a great free
              resource for this topic.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
