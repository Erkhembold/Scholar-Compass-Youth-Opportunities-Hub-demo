import LessonLayout from "../components/lessons/LessonLayout.jsx";
import LessonHeader from "../components/lessons/LessonHeader.jsx";
import ConceptCard from "../components/lessons/ConceptCard.jsx";
import QuestionCard from "../components/lessons/QuestionCard.jsx";
import { useActiveSection } from "../components/lessons/useActiveSection.js";
import {
  categoryHref,
  satReadingEvidenceHref,
  satWritingTransitionsHref,
} from "../router.js";

const STEP_IDS = ["three-types", "examples", "mini-practice"];
const STEP_LABELS = {
  "three-types": "Гурван төрөл",
  examples: "Жишээ",
  "mini-practice": "Mini Practice",
};

export default function SatWritingLesson01Page() {
  const activeId = useActiveSection(STEP_IDS);
  const activeIndex = STEP_IDS.indexOf(activeId);
  const steps = STEP_IDS.map((id, i) => ({
    id,
    label: STEP_LABELS[id],
    status: i < activeIndex ? "done" : i === activeIndex ? "current" : "upcoming",
  }));

  return (
    <LessonLayout
      breadcrumbItems={[
        { label: "SAT", href: categoryHref("sat") },
        { label: "Бүрэн өгүүлбэрийг таньж сур" },
      ]}
      steps={steps}
      prev={{ href: satReadingEvidenceHref(), label: "Evidence-Based Inference" }}
      next={{ href: satWritingTransitionsHref(), label: "Writing 02 — Transitions" }}
    >
      <LessonHeader
        eyebrow="SAT • READING & WRITING"
        title="Бүрэн өгүүлбэрийг таньж сур"
        description="Fragment, complete sentence, run-on өгүүлбэрийг ялгаж сур."
        level="Beginner"
        lessonNumber="01"
        estMinutes="6–8"
      />

      <div id="three-types">
        <div className="lesson-grid lesson-grid--3">
          <div className="lesson-mini-card">
            <span className="lesson-mini-card__label">Complete sentence</span>
            <span className="lesson-mini-card__value">Subject + verb + complete idea</span>
          </div>
          <div className="lesson-mini-card">
            <span className="lesson-mini-card__label">Fragment</span>
            <span className="lesson-mini-card__value">Бүрэн санаа илэрхийлээгүй</span>
          </div>
          <div className="lesson-mini-card">
            <span className="lesson-mini-card__label">Run-on</span>
            <span className="lesson-mini-card__value">Хоёр бүрэн өгүүлбэрийг буруу холбосон</span>
          </div>
        </div>
      </div>

      <div id="examples">
        <ConceptCard>
          <div className="lesson-elimination">
            <div className="lesson-elimination__item lesson-elimination__item--correct">
              <span className="lesson-elimination__letter">✓</span>
              <span>
                <strong>Correct:</strong> The students completed the project.
              </span>
            </div>
            <div className="lesson-elimination__item lesson-elimination__item--warning">
              <span className="lesson-elimination__letter">!</span>
              <span>
                <strong>Fragment:</strong> Because the students were tired.
              </span>
            </div>
            <div className="lesson-elimination__item lesson-elimination__item--warning">
              <span className="lesson-elimination__letter">!</span>
              <span>
                <strong>Run-on:</strong> The students finished the project they presented it to
                the teacher.
              </span>
            </div>
          </div>
        </ConceptCard>
      </div>

      <div id="mini-practice">
        <QuestionCard
          number={1}
          prompt="Which sentence is correct?"
          choices={[
            { id: "A", text: "Because the weather was cold." },
            { id: "B", text: "The students went inside because the weather was cold." },
            { id: "C", text: "The students went inside, the weather was cold." },
            { id: "D", text: "Because cold weather." },
          ]}
          correctId="B"
          explanation="B нь subject, verb болон бүрэн санаатай. A ба D нь бүрэн санаа биш. C нь хоёр бүрэн санааг буруу таслалаар холбосон."
        />
      </div>
    </LessonLayout>
  );
}
