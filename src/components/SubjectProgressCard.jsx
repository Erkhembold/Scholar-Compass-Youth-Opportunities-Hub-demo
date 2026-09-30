import ProgressRing from "./ProgressRing.jsx";

// One "question set"-style tile: an icon, a ring showing progress, and a
// short status line underneath. Used for SAT Reading & Writing, SAT Math,
// and IELTS on the profile dashboard — see ProgressTracker.jsx.
export default function SubjectProgressCard({ icon, title, percent, ringLabel, centerValue, centerUnit, statusLine, href, color }) {
  const content = (
    <>
      <div className="subject-card__head">
        <span className="subject-card__icon" aria-hidden="true">
          {icon}
        </span>
        <span className="subject-card__title">{title}</span>
      </div>
      <ProgressRing percent={percent} size={104} strokeWidth={10} color={color} label={ringLabel}>
        <span className="subject-card__ring-value">{centerValue}</span>
        {centerUnit && <span className="subject-card__ring-unit">{centerUnit}</span>}
      </ProgressRing>
      <p className="subject-card__status">{statusLine}</p>
    </>
  );

  return href ? (
    <a className="subject-card subject-card--link" href={href}>
      {content}
    </a>
  ) : (
    <div className="subject-card">{content}</div>
  );
}
