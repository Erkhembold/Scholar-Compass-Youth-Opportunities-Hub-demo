// Lesson title block: small eyebrow badge, large H1, one-sentence
// description, and a metadata row (level / lesson number / est. time).
export default function LessonHeader({ eyebrow, title, description, level, lessonNumber, estMinutes }) {
  return (
    <header className="lesson-header">
      {eyebrow && <span className="lesson-header__eyebrow">{eyebrow}</span>}
      <h1 className="lesson-header__title">{title}</h1>
      {description && <p className="lesson-header__description">{description}</p>}

      {(level || lessonNumber || estMinutes) && (
        <div className="lesson-header__meta">
          {level && (
            <span className="lesson-header__meta-item">
              <span className="lesson-header__meta-label">Level</span> {level}
            </span>
          )}
          {lessonNumber && (
            <span className="lesson-header__meta-item">
              <span className="lesson-header__meta-label">Lesson</span> {lessonNumber}
            </span>
          )}
          {estMinutes && (
            <span className="lesson-header__meta-item">
              <span className="lesson-header__meta-label">Est. time</span> {estMinutes} min
            </span>
          )}
        </div>
      )}
    </header>
  );
}
