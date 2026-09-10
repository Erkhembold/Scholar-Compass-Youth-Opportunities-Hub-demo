import PlaceholderArt from "./PlaceholderArt.jsx";
import { ieltsTestHref } from "../router.js";

const PATTERNS = ["grid", "diagonal", "radial", "stripe", "dots"];

export default function MockTestCard({ test, index }) {
  const pattern = PATTERNS[index % PATTERNS.length];

  if (test.comingSoon) {
    return (
      <div className="opp-card opp-card--disabled" aria-disabled="true">
        <div className="opp-card__media">
          <PlaceholderArt pattern={pattern} />
        </div>
        <div className="opp-card__body">
          <div className="opp-card__top">
            <span className="opp-card__category">IELTS Reading</span>
            <span className="opp-card__deadline">Coming soon</span>
          </div>
          <h3 className="opp-card__title">{test.title}</h3>
        </div>
      </div>
    );
  }

  return (
    <a className="opp-card" href={ieltsTestHref(test.id)}>
      <div className="opp-card__media">
        <PlaceholderArt pattern={pattern} />
      </div>
      <div className="opp-card__body">
        <div className="opp-card__top">
          <span className="opp-card__category">IELTS Reading</span>
          <span className="opp-card__deadline">60 min · 40 questions</span>
        </div>
        <h3 className="opp-card__title">{test.title}</h3>
      </div>
    </a>
  );
}
