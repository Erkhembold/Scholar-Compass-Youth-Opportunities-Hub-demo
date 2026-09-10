const PILLARS = [
  {
    title: "Find it",
    body: "Scholarships, competitions, volunteering, and internships collected in one board instead of a dozen separate sites.",
  },
  {
    title: "Understand it",
    body: "Plain-language eligibility, deadlines, and descriptions, so you can tell what's worth applying to in under a minute.",
  },
  {
    title: "Act on it",
    body: "Deadline reminders and short guides on IELTS, SAT, and applications, so nothing worth doing slips past you.",
  },
];

export default function AboutSection() {
  return (
    <section className="section about" aria-labelledby="about-heading">
      <div className="section__inner about__inner">
        <div className="about__intro">
          <h2 id="about-heading" className="section__title">
            ScholarCompass exists to make student opportunities easier to
            find, understand, and act on.
          </h2>
          <p className="section__lede">
            We're centralizing the scattered world of scholarships,
            competitions, volunteering, internships, and test-prep resources
            into a single, current source that a high-school student can
            actually keep up with.
          </p>
        </div>

        <div className="about__pillars">
          {PILLARS.map((pillar) => (
            <div className="about__pillar" key={pillar.title}>
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
