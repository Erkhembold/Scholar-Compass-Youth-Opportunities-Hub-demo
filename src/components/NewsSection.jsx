import { NEWS } from "../data/news.js";
import { useLanguage } from "../context/LanguageContext.jsx";

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
          <a key={item.id} className="news-card" href={item.href}>
            <span className="news-card__date">{item.date}</span>
            <span className="news-card__title">{item.title}</span>
            <span className="news-card__summary">{item.summary}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}
