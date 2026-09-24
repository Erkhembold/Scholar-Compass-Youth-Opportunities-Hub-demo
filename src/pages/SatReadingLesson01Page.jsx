import { useState } from "react";
import LessonLayout from "../components/lessons/LessonLayout.jsx";
import LessonHeader from "../components/lessons/LessonHeader.jsx";
import ConceptCard from "../components/lessons/ConceptCard.jsx";
import QuestionCard from "../components/lessons/QuestionCard.jsx";
import AnswerChoice from "../components/lessons/AnswerChoice.jsx";
import AnswerExplanation from "../components/lessons/AnswerExplanation.jsx";
import TakeawayCard from "../components/lessons/TakeawayCard.jsx";
import { useActiveSection } from "../components/lessons/useActiveSection.js";
import { categoryHref, satBeginnerGuideHref, satWritingSentencesHref } from "../router.js";

const STEP_IDS = ["common-trap", "trap-types", "worked-example", "practice-1", "practice-2", "takeaway"];
const STEP_LABELS = {
  "common-trap": "Түгээмэл урхи",
  "trap-types": "Урхины төрлүүд",
  "worked-example": "Жишээ асуулт",
  "practice-1": "Practice 1",
  "practice-2": "Practice 2",
  takeaway: "Дүгнэлт",
};

const LETTERS = ["A", "B", "C", "D"];

function WorkedExample() {
  const [selectedId, setSelectedId] = useState(null);
  const [checked, setChecked] = useState(false);
  const correctId = "C";

  const choices = [
    { id: "A", text: "Students generally believe that printed materials are outdated." },
    {
      id: "B",
      text: "Digital materials are more effective than printed materials for every type of study.",
    },
    {
      id: "C",
      text: "Students value some advantages of digital materials while still preferring printed materials in certain situations.",
    },
    { id: "D", text: "The university plans to remove all printed materials in the future." },
  ];

  const elimination = [
    { id: "A", note: "Хэлсэнгүй" },
    { id: "B", note: "Хэт хүчтэй" },
    { id: "C", note: "Текстийн хоёр санааг хоёуланг нь зөв хамруулж байна", correct: true },
    { id: "D", note: "Хэлсэнгүй" },
  ];

  function stateFor(id) {
    if (!checked) return selectedId === id ? "active" : "default";
    if (id === correctId) return "correct";
    if (id === selectedId) return "incorrect";
    return "default";
  }

  return (
    <section className="lesson-question">
      <span className="lesson-question__number">Жишээ асуулт</span>

      <div className="exercise-runner__passage">
        A university recently replaced several printed course materials with digital versions.
        Students appreciated being able to search for specific information and receive updated
        materials without waiting for a new edition. However, a survey found that many students
        still preferred printed materials when studying for several hours at a time.
      </div>

      <p className="lesson-question__prompt">Which statement is best supported by the text?</p>

      <div className="lesson-question__choices">
        {choices.map((c, i) => (
          <AnswerChoice
            key={c.id}
            label={LETTERS[i]}
            text={c.text}
            state={stateFor(c.id)}
            disabled={checked}
            onClick={() => setSelectedId(c.id)}
          />
        ))}
      </div>

      {checked ? (
        <>
          <AnswerExplanation
            isCorrect={selectedId === correctId}
            text="Энэ асуулт “best supported” гэж асууж байна. Тиймээс хамгийн үнэн сонсогдох хариултыг биш, текстээр хамгийн сайн батлагдах хариултыг сонгоно."
          />
          <div className="lesson-elimination">
            {elimination.map((e) => (
              <div
                key={e.id}
                className={`lesson-elimination__item ${e.correct ? "lesson-elimination__item--correct" : ""}`}
              >
                <span className="lesson-elimination__letter">{e.id}</span>
                <span>{e.note}</span>
              </div>
            ))}
          </div>
          <p>
            <strong>Correct answer: C</strong>
          </p>
          <button
            type="button"
            className="btn btn--ghost lesson-question__retry"
            onClick={() => {
              setSelectedId(null);
              setChecked(false);
            }}
          >
            Try again
          </button>
        </>
      ) : (
        <button
          type="button"
          className="btn btn--accent"
          disabled={!selectedId}
          onClick={() => setChecked(true)}
        >
          Check answer
        </button>
      )}
    </section>
  );
}

export default function SatReadingLesson01Page() {
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
        { label: "Evidence-Based Inference" },
      ]}
      steps={steps}
      prev={{ href: satBeginnerGuideHref(), label: "SAT-ийг анхнаас нь ойлгох нь" }}
      next={{ href: satWritingSentencesHref(), label: "Writing 01 — Complete Sentences" }}
    >
      <LessonHeader
        eyebrow="SAT • READING & WRITING"
        title="Evidence-Based Inference"
        description="Текстэд шууд бичээгүй мэт санагдах санааг текстийн нотолгооноос олж сур."
        level="Beginner"
        lessonNumber="01"
        estMinutes="8–10"
      />

      <div id="common-trap">
        <ConceptCard title="SAT асуултын нэг түгээмэл урхи">
          <p>SAT-ийн зарим асуулт текст дээр шууд бичигдээгүй зүйлийг асуудаг.</p>
          <p>Гэхдээ энэ нь тааж бодох асуулт биш.</p>
          <p>Зөв хариулт нь текстийн тодорхой баримтаас гарах ёстой.</p>
          <div className="lesson-callout">
            “Энэ хариултыг текстийн аль хэсэг батлаж байна?”
          </div>
        </ConceptCard>
      </div>

      <div id="trap-types">
        <div className="lesson-grid lesson-grid--2">
          <div className="lesson-mini-card">
            <span className="lesson-mini-card__label">Хэт ерөнхий</span>
            <span className="lesson-mini-card__value">Текстэй холбоотой ч хэт өргөн утгатай</span>
          </div>
          <div className="lesson-mini-card">
            <span className="lesson-mini-card__label">Хэтэрхий хүчтэй</span>
            <span className="lesson-mini-card__value">Текстийн санааг давруулсан</span>
          </div>
          <div className="lesson-mini-card">
            <span className="lesson-mini-card__label">Баталгаагүй</span>
            <span className="lesson-mini-card__value">Үнэн мэт сонсогддог ч текстэд байхгүй</span>
          </div>
          <div className="lesson-mini-card">
            <span className="lesson-mini-card__label">Хэсэгхэн зөв</span>
            <span className="lesson-mini-card__value">
              Текстийн нэг өгүүлбэртэй таарна, гэхдээ бүх санааг хамрахгүй
            </span>
          </div>
        </div>
      </div>

      <div id="worked-example">
        <WorkedExample />
      </div>

      <div id="practice-1">
        <QuestionCard
          number={1}
          prompt={
            <>
              <span className="lesson-mini-card__label" style={{ display: "block", marginBottom: 10 }}>
                Одоо чи
              </span>
              <span className="exercise-runner__passage" style={{ display: "block", marginBottom: 16 }}>
                Some students use recorded lectures when preparing for exams. Recordings allow
                them to review difficult sections more than once, but some students report that
                they remember information better when taking notes during a live lesson.
              </span>
              What does the text suggest about recorded lectures?
            </>
          }
          choices={[
            { id: "A", text: "They are more effective than live lessons for all students." },
            { id: "B", text: "They allow students to review difficult material repeatedly." },
            { id: "C", text: "Students who use them rarely take notes." },
            { id: "D", text: "Universities are replacing all live lectures with recordings." },
          ]}
          correctId="B"
          explanation="Текст “review difficult sections more than once” гэж шууд хэлсэн тул B зөв. A ба D текстэд байхгүй хэтрүүлсэн дүгнэлт, C нь текстийн санааг буруу эргүүлсэн байна."
        />
      </div>

      <div id="practice-2">
        <QuestionCard
          number={2}
          prompt={
            <>
              <span className="exercise-runner__passage" style={{ display: "block", marginBottom: 16 }}>
                A city introduced more bicycle lanes in several busy areas. Afterward, the number
                of people cycling in those areas increased. However, traffic congestion did not
                disappear, and some drivers argued that road space had become more limited.
              </span>
              Which conclusion is best supported by the text?
            </>
          }
          choices={[
            { id: "A", text: "Bicycle lanes completely solved the city's traffic problems." },
            { id: "B", text: "Drivers generally oppose bicycle use." },
            {
              id: "C",
              text: "Bicycle use increased, although the new lanes did not eliminate all traffic problems.",
            },
            { id: "D", text: "Most residents stopped using cars." },
          ]}
          correctId="C"
          explanation="Текст дугуйчдын тоо нэмэгдсэн ч түгжрэл бүрэн арилаагүйг өгүүлдэг тул C зөв. A хэт хүчтэй дүгнэлт, B ба D нь текстэд байхгүй."
        />
      </div>

      <div id="takeaway">
        <TakeawayCard>
          <p style={{ fontSize: "1.05em" }}>ТЕКСТ → НОТОЛГОО → ХАРИУЛТ</p>
          <p>
            Хариултыг өөрийн таамагт бус,
            <br />
            текстээс гарга.
          </p>
        </TakeawayCard>
      </div>
    </LessonLayout>
  );
}
