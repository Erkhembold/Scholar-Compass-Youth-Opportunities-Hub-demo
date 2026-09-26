import LessonLayout from "../components/lessons/LessonLayout.jsx";
import LessonHeader from "../components/lessons/LessonHeader.jsx";
import QuestionCard from "../components/lessons/QuestionCard.jsx";
import TakeawayCard from "../components/lessons/TakeawayCard.jsx";
import { useActiveSection } from "../components/lessons/useActiveSection.js";
import { categoryHref, satWritingSentencesHref } from "../router.js";

const STEP_IDS = ["four-relationships", "example", "takeaway"];
const STEP_LABELS = {
  "four-relationships": "Дөрвөн харилцаа",
  example: "Жишээ",
  takeaway: "Дүгнэлт",
};

export default function SatWritingLesson02Page() {
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
        { label: "Өгүүлбэрүүдийг зөв холбоо" },
      ]}
      steps={steps}
      prev={{ href: satWritingSentencesHref(), label: "Writing 01 — Complete Sentences" }}
      next={{ href: categoryHref("sat"), label: "Back to SAT lessons" }}
    >
      <LessonHeader
        eyebrow="SAT • READING & WRITING"
        title="Өгүүлбэрүүдийг зөв холбоо"
        description="Холбоос үгийг үгээр нь биш, өгүүлбэрийн утгын хоорондын холбоогоор нь сонго."
        level="Beginner"
        lessonNumber="02"
        estMinutes="6–8"
      />

      <div id="four-relationships">
        <div className="lesson-grid lesson-grid--2">
          <div className="lesson-mini-card">
            <span className="lesson-mini-card__label">Contrast</span>
            <span className="lesson-mini-card__value">however / although</span>
          </div>
          <div className="lesson-mini-card">
            <span className="lesson-mini-card__label">Cause</span>
            <span className="lesson-mini-card__value">because / since</span>
          </div>
          <div className="lesson-mini-card">
            <span className="lesson-mini-card__label">Result</span>
            <span className="lesson-mini-card__value">therefore / so</span>
          </div>
          <div className="lesson-mini-card">
            <span className="lesson-mini-card__label">Addition</span>
            <span className="lesson-mini-card__value">also / moreover</span>
          </div>
        </div>
      </div>

      <div id="example">
        <QuestionCard
          number={1}
          prompt="The course was difficult. ________, many students completed it successfully."
          choices={[
            { id: "A", text: "Therefore" },
            { id: "B", text: "However" },
            { id: "C", text: "Because" },
            { id: "D", text: "For example" },
          ]}
          correctId="B"
          explanation="Эхний өгүүлбэрт курс хэцүү байсан. Хоёр дахь өгүүлбэрт олон сурагч амжилттай дуусан. Энэ нь эсрэгцэл. Тиймээс: however."
        />
      </div>

      <div id="takeaway">
        <TakeawayCard>
          <p>Холбоос үгийг цээжээрээ сонгохгүй.</p>
          <p>
            Эхлээд: эсрэгцэл үү? шалтгаан уу? үр дүн үү? нэмэлт үү?
            <br />
            Дараа нь холбоос үгээ сонго.
          </p>
        </TakeawayCard>
      </div>
    </LessonLayout>
  );
}
