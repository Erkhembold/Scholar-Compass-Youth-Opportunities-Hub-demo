import { useState } from "react";

const STORAGE_KEY = "scholarcompass:notify-email";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Prototype-only persistence. To go live, replace `saveEmail` with a call to
// a real service — Firebase, Supabase, Resend, Mailchimp, or ConvertKit all
// expose a simple "add subscriber" endpoint that can slot in here.
function saveEmail(email) {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    if (!existing.includes(email)) existing.push(email);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    return true;
  } catch {
    return false;
  }
}

export default function NotificationSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | error | success
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = email.trim();

    if (!EMAIL_PATTERN.test(trimmed)) {
      setStatus("error");
      setMessage("Enter a valid email address to continue.");
      return;
    }

    const saved = saveEmail(trimmed);
    if (!saved) {
      setStatus("error");
      setMessage("Something went wrong on this device. Try again.");
      return;
    }

    setStatus("success");
    setMessage(`You're on the list — reminders will be sent to ${trimmed}.`);
    setEmail("");
  }

  return (
    <section id="notify" className="section notify" aria-labelledby="notify-heading">
      <div className="section__inner notify__inner">
        <div className="notify__copy">
          <h2 id="notify-heading" className="section__title">
            Don&rsquo;t miss the deadline.
          </h2>
          <p className="section__lede">
            Get a short, occasional email when a new scholarship, competition,
            or internship deadline is added to the board.
          </p>
        </div>

        <form className="notify__form" onSubmit={handleSubmit} noValidate>
          <label className="notify__label" htmlFor="notify-email">
            Email address
          </label>
          <div className="notify__field">
            <input
              id="notify-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              aria-invalid={status === "error"}
              aria-describedby="notify-status"
            />
            <button type="submit" className="btn btn--accent">
              Notify me
            </button>
          </div>
          <p
            id="notify-status"
            className={`notify__status notify__status--${status}`}
            role="status"
          >
            {status === "idle"
              ? "This is a prototype — your email is stored on this device only, for now."
              : message}
          </p>
        </form>
      </div>
    </section>
  );
}
