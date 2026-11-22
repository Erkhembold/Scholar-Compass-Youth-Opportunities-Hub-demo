import { useState } from "react";
import ReadCard from "./ReadCard.jsx";
import { reads } from "../data/reads.js";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function SuggestedReads({ initialCount }) {
  const { t } = useLanguage();
  const [all, setAll] = useState(false);
  const list = initialCount && !all ? reads.slice(0, initialCount) : reads;

  return (
    <section className="section reads" aria-labelledby="reads-heading">
      <div className="section__inner">
        <div className="section__head">
          <h2 id="reads-heading" className="section__title">
            {t("Suggested Reads")}
          </h2>
          <p className="section__lede">
            Guides and short explainers on test prep, applications, and
            building a profile worth reading — written for students, not
            admissions consultants.
          </p>
        </div>

        <div className="reads-grid">
          {list.map((read) => (
            <ReadCard key={read.id} read={read} />
          ))}
        </div>
        {initialCount && !all && reads.length > initialCount && (
          <p style={{ textAlign: "center", marginTop: 18 }}>
            <button type="button" className="btn btn--ghost" onClick={() => setAll(true)}>
              {t("Show more")}
            </button>
          </p>
        )}
      </div>
    </section>
  );
}
