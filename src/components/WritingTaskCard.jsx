import { writingTaskHref } from "../router.js";

export default function WritingTaskCard({ task }) {
  return (
    <a className="opp-card" href={writingTaskHref(task.id)}>
      <div className="opp-card__body">
        <div className="opp-card__top">
          <span className="opp-card__category">{task.kind}</span>
          <span className="opp-card__deadline">{task.minWords}+ words</span>
        </div>
        <h3 className="opp-card__title">{task.title}</h3>
        <p className="opp-card__description">{task.prompt}</p>
      </div>
    </a>
  );
}
