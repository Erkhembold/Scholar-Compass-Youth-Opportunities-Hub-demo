import { useMemo, useState } from "react";
import FilterBar from "../components/FilterBar.jsx";
import OpportunityGrid from "../components/OpportunityGrid.jsx";
import { FILTERS, opportunities } from "../data/opportunities.js";
import { partitionOpportunities } from "../utils/deadline.js";
import { useLanguage } from "../context/LanguageContext.jsx";

// Archive of opportunities whose deadline has passed. Nothing is ever
// deleted from data/opportunities.js — an opportunity is "archived" purely
// by virtue of its deadline (see utils/deadline.js), so the moment a
// deadline passes it moves here with all its original info, images, and
// links intact, and the detail page keeps working for old links/bookmarks.
export default function ArchivePage() {
  const { t } = useLanguage();
  const [active, setActive] = useState("all");

  // Most recently added first, matching the active board's ordering.
  const archived = useMemo(() => {
    const { archived: list } = partitionOpportunities(opportunities);
    return [...list].reverse();
  }, []);

  const filtered =
    active === "all" ? archived : archived.filter((op) => op.category === active);

  return (
    <section className="section board" aria-labelledby="archive-heading">
      <div className="section__inner">
        <div className="section__head">
          <h1 id="archive-heading" className="section__title">
            {t("Archive")}
          </h1>
          <p className="section__lede">
            {t(
              "Opportunities whose deadlines have passed. They're kept here for reference — check the current board for anything you can still apply to."
            )}
          </p>
        </div>

        <FilterBar filters={FILTERS} active={active} onChange={setActive} />

        <OpportunityGrid
          opportunities={filtered}
          emptyMessage="No archived opportunities here yet."
        />

        <p className="board__archive-link">
          <a href="#opportunities">{t("Back to current opportunities")}</a>
        </p>
      </div>
    </section>
  );
}
