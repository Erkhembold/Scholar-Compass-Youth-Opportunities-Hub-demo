// prev / next: { href, label } or null/undefined to disable that side.
export default function LessonNavigation({ prev, next }) {
  return (
    <div className="lesson-nav-footer">
      {prev ? (
        <a className="lesson-nav-footer__link lesson-nav-footer__link--prev" href={prev.href}>
          <span className="lesson-nav-footer__dir">← Previous</span>
          <span className="lesson-nav-footer__label">{prev.label}</span>
        </a>
      ) : (
        <span />
      )}
      {next ? (
        <a className="lesson-nav-footer__link lesson-nav-footer__link--next" href={next.href}>
          <span className="lesson-nav-footer__dir">Next →</span>
          <span className="lesson-nav-footer__label">{next.label}</span>
        </a>
      ) : (
        <span />
      )}
    </div>
  );
}
