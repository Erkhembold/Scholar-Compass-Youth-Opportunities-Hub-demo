// Shared tappable single/multi-select control used by both the onboarding
// flow and the Profile page's "edit goals" form, so the two stay visually
// and behaviorally consistent.
export default function ToggleGroup({ options, selected, onToggle, multi }) {
  return (
    <div className="onboarding-options" role="group">
      {options.map((opt) => {
        const active = multi ? selected.includes(opt) : selected === opt;
        return (
          <button
            key={opt}
            type="button"
            className={`onboarding-chip ${active ? "onboarding-chip--active" : ""}`}
            aria-pressed={active}
            onClick={() => onToggle(opt)}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
