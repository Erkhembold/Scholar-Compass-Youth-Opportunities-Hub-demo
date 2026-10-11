import { NEWS } from "../data/news.js";
import { NewsAvatar } from "../components/NewsSection.jsx";
import { newsArticleHref } from "../router.js";
import { useLanguage } from "../context/LanguageContext.jsx";

// All Scholar Compass News, laid out like the Opportunity Board (same section,
// heading and bordered card grid).
const excerpt = (s) => (s.length > 170 ? s.slice(0, 170).replace(/\s+\S*$/, "") + "…" : s);

export default function NewsPage() {
  const { t } = useLanguage();
  return (
    <section className="section board" aria-labelledby="news-page-heading">
      <div className="section__inner">
        <div className="section__head">
          <h1 id="news-page-heading" className="section__title">
            {t("Scholar Compass News")}
          </h1>
          <p className="section__lede">
            {t("Stories from students using ScholarCompass to reach their goals.")}
          </p>
        </div>

        <div className="opp-grid" role="list">
          {NEWS.map((item) => (
            <div role="listitem" key={item.id}>
              <a className="opp-card news-page-card" href={newsArticleHref(item.id)}>
                <div className="news-page-card__head">
                  <NewsAvatar item={item} size={64} />
                  <div>
                    <span className="opp-card__category">{item.scoreTag}</span>
                    <span className="news-page-card__meta">
                      {item.authorName} · {item.gradeClass}, {item.school}
                    </span>
                  </div>
                </div>
                <div className="opp-card__body">
                  <div className="opp-card__top">
                    <span className="opp-card__deadline">{item.date}</span>
                    {item.testedOn ? <span className="opp-card__deadline">{item.testedOn}</span> : null}
                  </div>
                  <h2 className="opp-card__title">{item.headline}</h2>
                  <p className="news-page-card__text">{excerpt(item.quoteOrStory[0])}</p>
                  <span className="news-page-card__read">{t("Read the story")} →</span>
                </div>
              </a>
            </div>
          ))}
        </div>

        <p className="board__archive-link">
          <a href="#/">{t("Back to home")}</a>
        </p>
      </div>
    </section>
  );
}
