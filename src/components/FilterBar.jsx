export default function FilterBar({ filters, active, onChange }) {
  return (
    <div className="filter-bar" role="group" aria-label="Filter opportunities by category">
      {filters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          className={`filter-chip ${active === filter.id ? "filter-chip--active" : ""}`}
          aria-pressed={active === filter.id}
          onClick={() => onChange(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
