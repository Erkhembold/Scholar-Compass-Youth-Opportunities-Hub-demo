import { useState } from "react";
import { CONTACT_EMAIL } from "../data/config.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialForm = {
  name: "",
  role: "student",
  email: "",
  title: "",
  link: "",
  deadline: "",
  description: "",
};

function buildMailto(form) {
  const subject = `New opportunity submission: ${form.title || "Untitled"}`;
  const bodyLines = [
    `Submitted by: ${form.name} (${form.role})`,
    `Reply-to email: ${form.email}`,
    `Opportunity title: ${form.title}`,
    `Link: ${form.link || "—"}`,
    `Deadline: ${form.deadline || "—"}`,
    "",
    "Description:",
    form.description || "—",
  ];
  const params = new URLSearchParams({
    subject,
    body: bodyLines.join("\n"),
  });
  // URLSearchParams encodes spaces as "+"; mailto needs %20 for a clean body.
  return `mailto:${CONTACT_EMAIL}?${params.toString().replace(/\+/g, "%20")}`;
}

export default function SubmitOpportunitySection() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | error | success
  const [message, setMessage] = useState("");

  function update(field) {
    return (event) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
      if (status !== "idle") setStatus("idle");
    };
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.title.trim() || !form.description.trim()) {
      setStatus("error");
      setMessage("Fill in your name, the opportunity title, and a short description.");
      return;
    }
    if (!EMAIL_PATTERN.test(form.email.trim())) {
      setStatus("error");
      setMessage("Enter a valid email address so we can follow up.");
      return;
    }

    window.location.href = buildMailto(form);
    setStatus("success");
    setMessage(
      "Opening your email app with everything filled in — just hit send and we'll review it."
    );
  }

  return (
    <section id="submit-opportunity" className="section submit-opp" aria-labelledby="submit-opp-heading">
      <div className="section__inner submit-opp__inner">
        <div className="submit-opp__copy">
          <h2 id="submit-opp-heading" className="section__title">
            Know an opportunity we're missing?
          </h2>
          <p className="section__lede">
            Teachers and students can send in scholarships, competitions, clubs, or internships
            for other students to find. Every submission is reviewed by hand before it goes on
            the board — no fake or paid listings.
          </p>
        </div>

        <form className="submit-opp__form" onSubmit={handleSubmit} noValidate>
          <div className="submit-opp__row">
            <div className="submit-opp__field">
              <label htmlFor="submit-name">Your name</label>
              <input
                id="submit-name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={update("name")}
              />
            </div>

            <div className="submit-opp__field">
              <label htmlFor="submit-role">I am a</label>
              <select id="submit-role" value={form.role} onChange={update("role")}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="submit-opp__field">
            <label htmlFor="submit-email">Your email</label>
            <input
              id="submit-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={update("email")}
            />
          </div>

          <div className="submit-opp__field">
            <label htmlFor="submit-title">Opportunity title</label>
            <input
              id="submit-title"
              type="text"
              placeholder="e.g. National Youth Robotics Challenge"
              value={form.title}
              onChange={update("title")}
            />
          </div>

          <div className="submit-opp__row">
            <div className="submit-opp__field">
              <label htmlFor="submit-link">Link (if there is one)</label>
              <input
                id="submit-link"
                type="url"
                placeholder="https://"
                value={form.link}
                onChange={update("link")}
              />
            </div>

            <div className="submit-opp__field">
              <label htmlFor="submit-deadline">Deadline (if known)</label>
              <input
                id="submit-deadline"
                type="text"
                placeholder="e.g. 15 Nov 2026"
                value={form.deadline}
                onChange={update("deadline")}
              />
            </div>
          </div>

          <div className="submit-opp__field">
            <label htmlFor="submit-description">Short description</label>
            <textarea
              id="submit-description"
              rows={4}
              placeholder="What is it, who's it for, and why should students know about it?"
              value={form.description}
              onChange={update("description")}
            />
          </div>

          <button type="submit" className="btn btn--accent">
            Send this opportunity
          </button>

          <p
            id="submit-opp-status"
            className={`submit-opp__status submit-opp__status--${status}`}
            role="status"
          >
            {status === "idle"
              ? "This opens your email app with the details pre-filled — nothing is sent automatically."
              : message}
          </p>
        </form>
      </div>
    </section>
  );
}
