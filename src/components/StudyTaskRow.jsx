import { IconCheck } from "./icons.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

// One task in the planner: tick box, exam badge, "Skill: topic", length and
// a Start link to the real exercise.
export default function StudyTaskRow({ task, onToggle, showDate = false }) {
  const { t } = useLanguage();
  const done = !!task.completed_at;
  return (
    <li className={`sp-task ${done ? "sp-task--done" : ""}`}>
      <button
        type="button"
        className="sp-task__check"
        role="checkbox"
        aria-checked={done}
        aria-label={`${done ? t("Mark as not done") : t("Mark as done")}: ${task.exam} ${task.skill}, ${task.topic}`}
        onClick={() => onToggle(task.id, !done)}
      >
        {done && <IconCheck />}
      </button>
      <span className={`sp-task__exam sp-task__exam--${task.exam.toLowerCase()}`}>{task.exam}</span>
      <span className="sp-task__text">
        <span className="sp-task__title">
          {task.skill} <span className="sp-task__sep">&mdash;</span> {task.topic}
        </span>
        {showDate && <span className="sp-task__meta">{task.task_date}</span>}
      </span>
      <span className="sp-task__min">{task.minutes} min</span>
      {task.link_href ? (
        <a className="btn btn--ghost btn--small sp-task__go" href={task.link_href}>
          {done ? t("Practice again") : t("Start")}
        </a>
      ) : (
        <span className="sp-task__go" />
      )}
    </li>
  );
}
