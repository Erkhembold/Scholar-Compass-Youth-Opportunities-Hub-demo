import LessonLayout from "../components/lessons/LessonLayout.jsx";
import LessonHeader from "../components/lessons/LessonHeader.jsx";
import ConceptCard from "../components/lessons/ConceptCard.jsx";
import QuestionCard from "../components/lessons/QuestionCard.jsx";
import TakeawayCard from "../components/lessons/TakeawayCard.jsx";
import { useActiveSection } from "../components/lessons/useActiveSection.js";
import { categoryHref, satReadingEvidenceHref } from "../router.js";

const STEP_IDS = ["what-is-sat", "reading-writing-skills", "how-to-start", "mini-check", "takeaway"];
const STEP_LABELS = {
  "what-is-sat": "SAT гэж юу вэ?",
  "reading-writing-skills": "Reading & Writing-д юу шалгадаг вэ?",
  "how-to-start": "Хэрхэн эхлэх вэ?",
  "mini-check": "Mini Check",
  takeaway: "Дүгнэлт",
};

export default function SatBeginnerGuidePage() {
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
        { label: "SAT-ийг анхнаас нь ойлгох нь" },
      ]}
      steps={steps}
      next={{ href: satReadingEvidenceHref(), label: "Reading 01 — Evidence-Based Inference" }}
    >
      <LessonHeader
        eyebrow="SAT"
        title="SAT-ийг анхнаас нь ойлгох нь"
        description="SAT ямар шалгалт болох, ямар хэсгүүдтэй, асуултууд нь хэрхэн ажилладгийг эндээс эхэлж ойлгооройг."
      />

      <div id="what-is-sat">
        <ConceptCard title="SAT гэж юу вэ?">
          <p>SAT бол их сургуульд элсэхэд ашиглагддаг стандартчилсан шалгалт.</p>
        </ConceptCard>

        <div className="lesson-grid lesson-grid--2">
          <div className="lesson-mini-card">
            <span className="lesson-mini-card__label">Reading and Writing</span>
            <span className="lesson-mini-card__value">64 минут</span>
            <span className="lesson-mini-card__value">54 асуулт</span>
          </div>
          <div className="lesson-mini-card">
            <span className="lesson-mini-card__label">Math</span>
            <span className="lesson-mini-card__value">70 минут</span>
            <span className="lesson-mini-card__value">44 асуулт</span>
          </div>
        </div>

        <p>Хоёр хэсэг тус бүр хоёр модультай.</p>
      </div>

      <div id="reading-writing-skills">
        <ConceptCard title="Reading and Writing хэсэгт юу шалгадаг вэ?">
          <div className="lesson-grid lesson-grid--2">
            <div className="lesson-mini-card">
              <span className="lesson-mini-card__label">Гол санаа</span>
              <span className="lesson-mini-card__value">Текстийн гол санааг олох</span>
            </div>
            <div className="lesson-mini-card">
              <span className="lesson-mini-card__label">Нотолгоо</span>
              <span className="lesson-mini-card__value">Хариултаа текстээр батлах</span>
            </div>
            <div className="lesson-mini-card">
              <span className="lesson-mini-card__label">Үгийн утга</span>
              <span className="lesson-mini-card__value">Үгийн утгыг нөхцөлөөс нь ойлгох</span>
            </div>
            <div className="lesson-mini-card">
              <span className="lesson-mini-card__label">Бичих</span>
              <span className="lesson-mini-card__value">Өгүүлбэрийг зөв бүтэцтэй болгох</span>
            </div>
            <div className="lesson-mini-card">
              <span className="lesson-mini-card__label">Холбоос</span>
              <span className="lesson-mini-card__value">Санаануудын хоорондын холбоог олох</span>
            </div>
            <div className="lesson-mini-card">
              <span className="lesson-mini-card__label">Хэл зүй</span>
              <span className="lesson-mini-card__value">Дүрэм, цэг тэмдгийг зөв ашиглах</span>
            </div>
          </div>
        </ConceptCard>
      </div>

      <div id="how-to-start">
        <ConceptCard title="SAT-д хэрхэн эхлэх вэ?">
          <TakeawayCard title="Сэтгэлгээний дараалал">
            <p>
              &ldquo;Би хэдэн оноо авах вэ?&rdquo; гэж бодохоосоо өмнө
              <br />
              &ldquo;Би яагаад энэ асуултыг буруу хийв?&rdquo; гэж асууж сур.
            </p>
          </TakeawayCard>

          <div className="lesson-flow">
            <span className="lesson-flow__step">Алдаа</span>
            <span className="lesson-flow__arrow">→</span>
            <span className="lesson-flow__step">Шалтгаан</span>
            <span className="lesson-flow__arrow">→</span>
            <span className="lesson-flow__step">Засах</span>
          </div>
        </ConceptCard>
      </div>

      <div id="mini-check">
        <QuestionCard
          number={1}
          prompt="Аль нь SAT-ийн Reading and Writing хэсэг вэ?"
          choices={[
            { id: "A", text: "70 минут, 44 асуулт" },
            { id: "B", text: "64 минут, 54 асуулт" },
            { id: "C", text: "60 минут, 40 асуулт" },
            { id: "D", text: "30 минут, 40 асуулт" },
          ]}
          correctId="B"
          explanation="Reading and Writing хэсэг 64 минут үргэлжилж, нийт 54 асуулттай."
        />
      </div>

      <div id="takeaway">
        <TakeawayCard>
          <p>
            SAT-д эхлээд оноогоосоо илүү
            <br />
            алдаанаасаа эхэл.
          </p>
        </TakeawayCard>
      </div>
    </LessonLayout>
  );
}
