import ReadCard from "./ReadCard.jsx";
import { reads } from "../data/reads.js";

export default function SuggestedReads() {
  return (
    <section className="section reads" aria-labelledby="reads-heading">
      <div className="section__inner">
        <div className="section__head">
          <h2 id="reads-heading" className="section__title">
            Suggested Reads
          </h2>
          <p className="section__lede">
            Guides and short explainers on test prep, applications, and
            building a profile worth reading — written for students, not
            admissions consultants.
          </p>
        </div>

        <div className="reads-grid">
          {reads.map((read) => (
            <ReadCard key={read.id} read={read} />
          ))}
        </div>
      </div>
    </section>
  );
}
