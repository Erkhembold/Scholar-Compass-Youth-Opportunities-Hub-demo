import { useMemo, useState } from "react";
import FilterBar from "./FilterBar.jsx";
import OpportunityGrid from "./OpportunityGrid.jsx";
import { FILTERS, opportunities } from "../data/opportunities.js";

export default function OpportunityBoard() {
  const [active, setActive] = useState("all");

  const visible = useMemo(() => {
    if (active === "all") return opportunities;
    return opportunities.filter((op) => op.category === active);
  }, [active]);

  return (
    <section id="opportunities" className="section board" aria-labelledby="board-heading">
      <div className="section__inner">
        <div className="section__head">
          <h2 id="board-heading" className="section__title">
            The Opportunity Board
          </h2>
          <p className="section__lede">
            A running list of scholarships, competitions, volunteer roles, and
            internships worth your time — filter to what applies to you.
          </p>
        </div>

        <FilterBar filters={FILTERS} active={active} onChange={setActive} />

        <OpportunityGrid opportunities={visible} />
      </div>
    </section>
  );
}
