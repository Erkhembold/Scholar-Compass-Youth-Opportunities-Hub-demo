import { useLanguage } from "../context/LanguageContext.jsx";

const LABELS = {
  task1: { taskResponse: "Task Achievement" },
  task2: { taskResponse: "Task Response" },
};
const COMMON = {
  coherenceCohesion: "Coherence and Cohesion",
  lexicalResource: "Lexical Resource",
  grammar: "Grammatical Range and Accuracy",
};

// Shows a stored assessment. Pure display: opening an old assessment never
// triggers an AI call.
export default function WritingAssessmentView({ result, taskType, wordCount, essayText }) {
  const { t } = useLanguage();
  if (!result) return null;
  const labels = { ...COMMON, ...(LABELS[taskType] || LABELS.task2) };
  const order = ["taskResponse", "coherenceCohesion", "lexicalResource", "grammar"];

  return (
    <div className="wr-result">
      <div className="wr-result__banner">
        <p className="wr-result__eyebrow">{t("AI-estimated band")}</p>
        <p className="wr-result__band">{result.overallBand.toFixed(1)}</p>
        <p className="wr-result__meta">
          {wordCount ? `${wordCount} ${t("words")} · ` : ""}
          {t("AI estimate — not an official IELTS result")}
        </p>
      </div>

      {result.relevance === "off_topic" && (
        <p className="wr-result__warn">{t("This essay does not answer the question that was asked.")}</p>
      )}

      <p className="wr-result__summary">{result.summary}</p>

      <div className="wr-criteria">
        {order.map((key) => {
          const c = result.criteria[key];
          return (
            <section key={key} className="wr-criterion">
              <header>
                <strong>{labels[key]}</strong>
                <span className="wr-criterion__band">{c.band.toFixed(1)}</span>
              </header>
              {c.strengths.length > 0 && (
                <>
                  <h4>{t("Strengths")}</h4>
                  <ul>{c.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                </>
              )}
              {c.weaknesses.length > 0 && (
                <>
                  <h4>{t("To improve")}</h4>
                  <ul>{c.weaknesses.map((s, i) => <li key={i}>{s}</li>)}</ul>
                </>
              )}
              {c.evidence.length > 0 && (
                <>
                  <h4>{t("From your essay")}</h4>
                  {c.evidence.map((e, i) => (
                    <blockquote key={i} className="wr-evidence">
                      <q>{e.quote}</q>
                      <span>{e.comment}</span>
                    </blockquote>
                  ))}
                </>
              )}
            </section>
          );
        })}
      </div>

      {result.corrections.length > 0 && (
        <section className="wr-corrections">
          <h3>{t("Sentence corrections")}</h3>
          {result.corrections.map((c, i) => (
            <div key={i} className="wr-correction">
              <p className="wr-correction__old">{c.original}</p>
              <p className="wr-correction__new">{c.improved}</p>
              <p className="wr-correction__why">{c.explanation}</p>
            </div>
          ))}
        </section>
      )}

      <section className="wr-recs">
        <h3>{t("What to do next")}</h3>
        <ol>{result.recommendations.map((r, i) => <li key={i}>{r}</li>)}</ol>
      </section>

      {essayText && (
        <details className="wr-essay">
          <summary>{t("Your essay")}</summary>
          <p>{essayText}</p>
        </details>
      )}
    </div>
  );
}
