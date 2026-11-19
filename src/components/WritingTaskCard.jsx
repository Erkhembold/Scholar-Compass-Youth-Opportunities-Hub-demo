import { writingTaskHref } from "../router.js";
import { bandTier } from "../utils/bandColor.js";

// Boxed task card. When the student has an assessed attempt, their best band
// shows top-right, coloured red (5 or below), yellow (5.5-6.5) or green (7+).
export default function WritingTaskCard({ task, band }) {
  const tier = bandTier(band);
  return (
    <a className={`wr-hub-card wr-hub-card--${tier}`} href={writingTaskHref(task.id)}>
      {tier !== "none" && <span className={`wr-score wr-score--${tier}`}>{Number(band).toFixed(1)}</span>}
      <span className="wr-hub-card__kind">{task.kind} · {task.minWords}+</span>
      <h3 className="wr-hub-card__title">{task.title}</h3>
      <p className="wr-hub-card__text">{task.prompt}</p>
    </a>
  );
}
