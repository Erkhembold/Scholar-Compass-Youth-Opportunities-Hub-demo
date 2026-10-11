import { NEWS } from "../data/news.js";
import { NewsAvatar } from "../components/NewsSection.jsx";
import { newsHref, newsArticleHref } from "../router.js";
import { useLanguage } from "../context/LanguageContext.jsx";

// A single news story, laid out like a news article: headline, byline, date,
// photo, body text, then a call-to-action and more stories.
export default function NewsArticlePage({ id }) {
  const { t } = useLanguage();
  const item = NEWS.find((n) => n.id === id);

  if (!item) {
    return (
      <section className="section">
        <div className="section__inner">
          <h1 className="section__title">{t("Story not found")}</h1>
          <p className="section__lede">
            <a href={newsHref()}>{t("Back to all news")}</a>
          </p>
        </div>
      </section>
    );
  }

  const more = NEWS.filter((n) => n.id !== item.id);
  const isQuote = /^[“"]/.test(item.quoteOrStory[0]);

  return (
    <article className="section news-article">
      <div className="section__inner news-article__inner">
        <a className="detail__back" href={newsHref()}>
          ← {t("All news")}
        </a>
        <p className="news-article__kicker">
          {t("Scholar Compass News")} · {item.scoreTag}
        </p>
        <h1 className="news-article__headline">{item.headline}</h1>
        <div className="news-article__byline">
          <NewsAvatar item={item} size={48} />
          <div>
            <strong>{item.authorName}</strong>
            <span>
              {item.gradeClass}, {item.school}
            </span>
          </div>
        </div>
        <p className="news-article__date">
          {item.date}
          {item.testedOn ? ` · ${item.testedOn}` : ""}
        </p>

        {item.imageUrl ? (
          <figure className="news-article__figure">
            <img className="no-dim" src={item.imageUrl} alt={item.authorName} />
            <figcaption>
              {item.authorName}, {item.gradeClass}, {item.school}
            </figcaption>
          </figure>
        ) : null}

        <div className="news-article__body">
          {item.quoteOrStory.map((para, i) =>
            isQuote ? (
              <blockquote key={i}>{para}</blockquote>
            ) : (
              <p key={i}>{para}</p>
            )
          )}
        </div>

        <div className="news-article__cta">
          <p>{t("Want to prepare like this? Start practising for the IELTS on ScholarCompass.")}</p>
          <a className="btn btn--accent" href={item.targetUrl}>
            {t("Go to IELTS practice")}
          </a>
        </div>

        {more.length > 0 && (
          <div className="news-article__more">
            <h2>{t("More news")}</h2>
            {more.map((n) => (
              <a key={n.id} href={newsArticleHref(n.id)}>
                {n.headline}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
