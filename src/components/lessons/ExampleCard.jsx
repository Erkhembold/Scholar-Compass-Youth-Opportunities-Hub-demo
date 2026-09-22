// Same clean-card family as ConceptCard, with a small "Example" tag and
// an accent left border to visually separate worked examples from
// concept explanations without breaking the shared academic style.
export default function ExampleCard({ title, children }) {
  return (
    <section className="lesson-card lesson-card--example">
      <span className="lesson-card__tag">Example</span>
      {title && <h3 className="lesson-card__title lesson-card__title--sm">{title}</h3>}
      <div className="lesson-card__body">{children}</div>
    </section>
  );
}
