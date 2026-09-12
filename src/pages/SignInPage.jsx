import { useState } from "react";

export default function SignInPage() {
  const [mode, setMode] = useState("signin"); // signin | signup
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);

  function update(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="section signin">
      <div className="section__inner signin__inner">
        <div className="signin__card">
          <div className="signin__tabs" role="tablist" aria-label="Sign in or create an account">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signin"}
              className={`signin__tab ${mode === "signin" ? "signin__tab--active" : ""}`}
              onClick={() => {
                setMode("signin");
                setSubmitted(false);
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signup"}
              className={`signin__tab ${mode === "signup" ? "signin__tab--active" : ""}`}
              onClick={() => {
                setMode("signup");
                setSubmitted(false);
              }}
            >
              Create Account
            </button>
          </div>

          <h1 className="signin__title">
            {mode === "signin" ? "Welcome back" : "Create your ScholarCompass account"}
          </h1>
          <p className="signin__lede">
            {mode === "signin"
              ? "Sign in to track saved opportunities and your IELTS practice scores."
              : "Create an account to save opportunities, track test scores, and earn points."}
          </p>

          {submitted ? (
            <div className="signin__status" role="status">
              Accounts aren't connected to a database yet, so this is a preview of the sign-in
              flow rather than a working login. Once accounts are live, this is exactly what
              you'll see.
            </div>
          ) : (
            <form className="signin__form" onSubmit={handleSubmit} noValidate>
              {mode === "signup" && (
                <div className="signin__field">
                  <label htmlFor="signin-name">Full name</label>
                  <input
                    id="signin-name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={update("name")}
                  />
                </div>
              )}

              <div className="signin__field">
                <label htmlFor="signin-email">Email</label>
                <input
                  id="signin-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={update("email")}
                />
              </div>

              <div className="signin__field">
                <label htmlFor="signin-password">Password</label>
                <input
                  id="signin-password"
                  type="password"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  value={form.password}
                  onChange={update("password")}
                />
              </div>

              <button type="submit" className="btn btn--accent signin__submit">
                {mode === "signin" ? "Sign In" : "Create Account"}
              </button>
            </form>
          )}

          <a className="signin__back" href="#/">
            ← Back to ScholarCompass
          </a>
        </div>
      </div>
    </section>
  );
}
