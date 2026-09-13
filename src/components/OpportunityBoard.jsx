import { useEffect, useMemo, useState } from "react";
import FilterBar from "./FilterBar.jsx";
import OpportunityGrid from "./OpportunityGrid.jsx";
import { FILTERS, opportunities } from "../data/opportunities.js";
import { useLanguage } from "../context/LanguageContext.jsx";

// How many cards show before the "Show more" button appears, and how many
// more each click reveals. The homepage board is meant to stay short and
// scannable — the full list per category is always still available on that
// category's own page (see CategoryPage.jsx), which is unpaginated.
const PAGE_SIZE = 10;

export default function OpportunityBoard() {
  const { t } = useLanguage();
  const [active, setActive] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Opportunities are appended to the data file as they come in, so the
  // most recently added ones are last in the array — reverse once here so
  // "recent" always means "most recently added" without touching the data
  // file's own order.
  const filtered = useMemo(() => {
    const mostRecentFirst = [...opportunities].reverse();
    if (active === "all") return mostRecentFirst;
    return mostRecentFirst.filter((op) => op.category === active);
  }, [active]);

  // Reset back to the first page whenever the filter changes, so switching
  // categories doesn't leave a stale "show more" state from a different list.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [active]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <section id="opportunities" className="section board" aria-labelledby="board-heading">
      <div className="section__inner">
        <div className="section__head">
          <h2 id="board-heading" className="section__title">
            {t("The Opportunity Board")}
          </h2>
          <p className="section__lede">
            {t(
              "A running list of scholarships, competitions, volunteer roles, and internships worth your time — filter to what applies to you."
            )}
          </p>
        </div>

        <FilterBar filters={FILTERS} active={active} onChange={setActive} />

        <OpportunityGrid opportunities={visible} />

        {hasMore && (
          <div className="board__more">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            >
              {t("Show more")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
