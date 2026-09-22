// Visually strong closing callout — the one card per lesson meant to
// stand out from the calm academic cards above it.
export default function TakeawayCard({ title = "Key takeaway", children }) {
  return (
    <section className="lesson-takeaway">
      <span className="lesson-takeaway__label">{title}</span>
      <div className="lesson-takeaway__body">{children}</div>
    </section>
  );
}
