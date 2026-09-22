// Clean academic card for explaining a single concept. Subtle border,
// no heavy styling — meant to read as calm, textbook-like content.
export default function ConceptCard({ title, children }) {
  return (
    <section className="lesson-card lesson-card--concept">
      {title && <h2 className="lesson-card__title">{title}</h2>}
      <div className="lesson-card__body">{children}</div>
    </section>
  );
}
