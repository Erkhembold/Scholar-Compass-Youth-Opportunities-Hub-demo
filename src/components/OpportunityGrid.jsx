import OpportunityCard from "./OpportunityCard.jsx";

export default function OpportunityGrid({ opportunities, emptyMessage }) {
  if (opportunities.length === 0) {
    return (
      <p className="board__empty">
        {emptyMessage ??
          "Nothing in this category yet — check back soon, or browse another filter above."}
      </p>
    );
  }

  return (
    <div className="opp-grid" role="list">
      {opportunities.map((opportunity) => (
        <div role="listitem" key={opportunity.id}>
          <OpportunityCard opportunity={opportunity} />
        </div>
      ))}
    </div>
  );
}
