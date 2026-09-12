import { useLanguage } from "../context/LanguageContext.jsx";

export default function FilterBar({ filters, active, onChange }) {
  const { t } = useLanguage();

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
          {t(filter.label)}
        </button>
      ))}
    </div>
  );
}
