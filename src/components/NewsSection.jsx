import { NEWS } from "../data/news.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { newsHref, newsArticleHref } from "../router.js";

export function NewsAvatar({ item, size = 44 }) {
  return item.imageUrl ? (
    <img className="news-avatar news-avatar--img no-dim" src={item.imageUrl} alt={item.authorName} width={size} height={size} style={{ width: size, height: size }} />
  ) : (
    <span className="news-avatar" aria-hidden="true" style={{ width: size, height: size, fontSize: size * 0.42 }}>
      {item.authorName.trim().charAt(0).toUpperCase()}
    </span>
  );
}

// "Scholar Compass News" sidebar. Used on the signed-out hero and beside the
// signed-in dashboard cards. Renders nothing if there are no news items.
export default function NewsSection({ onDark = false }) {
  const { t } = useLanguage();
  if (!NEWS.length) return null;
  return (
    <aside className={`news-sidebar ${onDark ? "news-sidebar--dark" : ""}`} aria-labelledby="news-heading">
      <h2 id="news-heading" className="news-sidebar__title">
        {t("Scholar Compass News")}
      </h2>
      <div className="news-sidebar__list">
        {NEWS.map((item) => (
          <a key={item.id} className="news-card" href={newsArticleHref(item.id)}>
            <span className="news-card__who">
              <NewsAvatar item={item} />
              <span className="news-card__tag">{item.scoreTag}</span>
            </span>
            <span className="news-card__date">{item.date}</span>
            <span className="news-card__title">{item.headline}</span>
          </a>
        ))}
      </div>
      <a className="news-sidebar__more" href={newsHref()}>
        {t("Show more")} →
      </a>
    </aside>
  );
}
