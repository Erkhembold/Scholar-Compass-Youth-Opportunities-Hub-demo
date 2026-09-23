import LessonLayout from "../components/lessons/LessonLayout.jsx";
import LessonHeader from "../components/lessons/LessonHeader.jsx";
import ConceptCard from "../components/lessons/ConceptCard.jsx";
import QuestionCard from "../components/lessons/QuestionCard.jsx";
import TakeawayCard from "../components/lessons/TakeawayCard.jsx";
import { useActiveSection } from "../components/lessons/useActiveSection.js";
import { categoryHref } from "../router.js";

const STEP_IDS = ["what-is-ielts", "four-sections", "skills-differ", "how-to-start", "mini-check", "takeaway"];
const STEP_LABELS = {
  "what-is-ielts": "IELTS ямар шалгалт вэ?",
  "four-sections": "Дөрвөн хэсэг",
  "skills-differ": "Хэсэг бүр өөр чадвар",
  "how-to-start": "Хэрхэн эхлэх вэ?",
  "mini-check": "Mini Check",
  takeaway: "Дүгнэлт",
};

export default function IeltsBeginnerGuidePage() {
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
        { label: "IELTS", href: categoryHref("ielts") },
        { label: "IELTS-ийг анхнаас нь ойлгох нь" },
      ]}
      steps={steps}
    >
      <LessonHeader
        eyebrow="IELTS"
        title="IELTS-ийг анхнаас нь ойлгох нь"
        description="IELTS-ийн дөрвөн хэсэг юу шалгадаг, бэлтгэлээ юунаас эхлүүлэхийг ойлго."
      />

      <div id="what-is-ielts">
        <ConceptCard title="IELTS ямар шалгалт вэ?">
          <p>IELTS бол англи хэлний чадварыг шалгадаг олон улсын шалгалт.</p>

          <div className="lesson-grid lesson-grid--2">
            <div className="lesson-mini-card">
              <span className="lesson-mini-card__label">Listening</span>
              <span className="lesson-mini-card__value">Ойлгож сонсох</span>
            </div>
            <div className="lesson-mini-card">
              <span className="lesson-mini-card__label">Reading</span>
              <span className="lesson-mini-card__value">Текстийг уншиж ойлгох</span>
            </div>
            <div className="lesson-mini-card">
              <span className="lesson-mini-card__label">Writing</span>
              <span className="lesson-mini-card__value">Санаагаа бичгээр ойлгуулах</span>
            </div>
            <div className="lesson-mini-card">
              <span className="lesson-mini-card__label">Speaking</span>
              <span className="lesson-mini-card__value">Санаагаа яриагаар ойлгуулах</span>
            </div>
          </div>
        </ConceptCard>
      </div>

      <div id="four-sections">
        <ConceptCard title="Дөрвөн хэсэг">
          <div className="lesson-timeline">
            <div className="lesson-timeline__item">
              <span className="lesson-timeline__item-label">Listening</span>
              <span className="lesson-timeline__item-value">≈ 30 мин</span>
            </div>
            <div className="lesson-timeline__item">
              <span className="lesson-timeline__item-label">Reading</span>
              <span className="lesson-timeline__item-value">60 мин · 40 асуулт</span>
            </div>
            <div className="lesson-timeline__item">
              <span className="lesson-timeline__item-label">Writing</span>
              <span className="lesson-timeline__item-value">60 мин</span>
            </div>
            <div className="lesson-timeline__item">
              <span className="lesson-timeline__item-label">Speaking</span>
              <span className="lesson-timeline__item-value">11–14 мин</span>
            </div>
          </div>
        </ConceptCard>
      </div>

      <div id="skills-differ">
        <ConceptCard title="Нэг хэсэг сайн байхад нөгөө нь автоматаар сайн болохгүй.">
          <p>
            Уншихад сайн ч сонсохдоо сул байж болно.
            <br />
            Эсвэл ярьж чаддаг ч бичихдээ алдаатай байж болно.
          </p>
          <p>Тиймээс хэсэг бүрээ өөрийнх нь чадвар гэж хар.</p>
        </ConceptCard>
      </div>

      <div id="how-to-start">
        <ConceptCard title="IELTS-д бэлдэхдээ юунаас эхлэх вэ?">
          <div className="lesson-grid lesson-grid--2">
            <div className="lesson-mini-card">
              <span className="lesson-mini-card__label">Unsha</span>
              <span className="lesson-mini-card__value">
                Энэ чадвар дээрээ одоо юу хийж чадаж байгаагаа шалга.
              </span>
            </div>
            <div className="lesson-mini-card">
              <span className="lesson-mini-card__label">Sonso</span>
              <span className="lesson-mini-card__value">
                Энэ чадвар дээрээ одоо юу хийж чадаж байгаагаа шалга.
              </span>
            </div>
            <div className="lesson-mini-card">
              <span className="lesson-mini-card__label">Bich</span>
              <span className="lesson-mini-card__value">
                Энэ чадвар дээрээ одоо юу хийж чадаж байгаагаа шалга.
              </span>
            </div>
            <div className="lesson-mini-card">
              <span className="lesson-mini-card__label">Yar</span>
              <span className="lesson-mini-card__value">
                Энэ чадвар дээрээ одоо юу хийж чадаж байгаагаа шалга.
              </span>
            </div>
          </div>
        </ConceptCard>
      </div>

      <div id="mini-check">
        <QuestionCard
          number={1}
          prompt="IELTS хэдэн үндсэн хэсэгтэй вэ?"
          choices={[
            { id: "A", text: "2" },
            { id: "B", text: "3" },
            { id: "C", text: "4" },
            { id: "D", text: "5" },
          ]}
          correctId="C"
          explanation="IELTS нь Listening, Reading, Writing, Speaking гэсэн дөрвөн үндсэн хэсэгтэй."
        />
      </div>

      <div id="takeaway">
        <TakeawayCard>
          <p>
            IELTS-д бүхнийг нэг дороос нь сайжруулах гэж бүү оролд.
            <br />
            Нэг чадвараа нэгээр нь сайжруул.
          </p>
        </TakeawayCard>
      </div>
    </LessonLayout>
  );
}
