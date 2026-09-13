import { useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const initialForm = {
  name: "",
  email: "",
  password: "",
  school: "",
  grade: "",
  intendedMajor: "",
  targetTest: "",
};

export default function SignInPage() {
  const { t } = useLanguage();
  const { signUp, signIn, isConfigured, user } = useAuth();
  const [mode, setMode] = useState("signin"); // signin | signup
  const [form, setForm] = useState(initialForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function update(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);

    if (mode === "signup") {
      const { error: signUpError, needsEmailConfirmation } = await signUp(form);
      setBusy(false);
      if (signUpError) {
        setError(signUpError);
        return;
      }
      if (needsEmailConfirmation) {
        setNotice(
          "Almost there — check your email to confirm your account before signing in."
        );
      } else {
        window.location.hash = "#/profile";
      }
      return;
    }

    const { error: signInError } = await signIn(form);
    setBusy(false);
    if (signInError) {
      setError(signInError);
      return;
    }
    window.location.hash = "#/profile";
  }

  if (user) {
    return (
      <section className="section signin">
        <div className="section__inner signin__inner">
          <div className="signin__card">
            <p className="signin__lede">
              You're already signed in. <a href="#/profile">Go to your profile</a>.
            </p>
          </div>
        </div>
      </section>
    );
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
                setError("");
                setNotice("");
              }}
            >
              {t("Sign In")}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signup"}
              className={`signin__tab ${mode === "signup" ? "signin__tab--active" : ""}`}
              onClick={() => {
                setMode("signup");
                setError("");
                setNotice("");
              }}
            >
              {t("Create Account")}
            </button>
          </div>

          <h1 className="signin__title">
            {mode === "signin" ? t("Welcome back") : t("Create your ScholarCompass account")}
          </h1>
          <p className="signin__lede">
            {mode === "signin"
              ? t("Sign in to track saved opportunities and your IELTS practice scores.")
              : t("Create an account to save opportunities, track test scores, and earn points.")}
          </p>

          {!isConfigured && (
            <div className="signin__status" role="status">
              Sign-in isn't configured yet on this deployment — the site owner still needs to
              add the database keys.
            </div>
          )}

          {isConfigured && (
            <form className="signin__form" onSubmit={handleSubmit} noValidate>
              {mode === "signup" && (
                <div className="signin__field">
                  <label htmlFor="signin-name">{t("Full name")}</label>
                  <input
                    id="signin-name"
                    type="text"
                    autoComplete="name"
                    required
                    value={form.name}
                    onChange={update("name")}
                  />
                </div>
              )}

              <div className="signin__field">
                <label htmlFor="signin-email">{t("Email")}</label>
                <input
                  id="signin-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  value={form.email}
                  onChange={update("email")}
                />
              </div>

              <div className="signin__field">
                <label htmlFor="signin-password">{t("Password")}</label>
                <input
                  id="signin-password"
                  type="password"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  required
                  minLength={6}
                  value={form.password}
                  onChange={update("password")}
                />
              </div>

              {mode === "signup" && (
                <>
                  <p className="signin__optional-label">
                    Optional — helps us point you to relevant opportunities. You can fill
                    these in later from your profile too.
                  </p>

                  <div className="signin__field">
                    <label htmlFor="signin-school">School</label>
                    <input
                      id="signin-school"
                      type="text"
                      value={form.school}
                      onChange={update("school")}
                    />
                  </div>

                  <div className="signin__field">
                    <label htmlFor="signin-grade">Grade / year level</label>
                    <input
                      id="signin-grade"
                      type="text"
                      placeholder="e.g. Grade 11"
                      value={form.grade}
                      onChange={update("grade")}
                    />
                  </div>

                  <div className="signin__field">
                    <label htmlFor="signin-major">Intended major or field of interest</label>
                    <input
                      id="signin-major"
                      type="text"
                      value={form.intendedMajor}
                      onChange={update("intendedMajor")}
                    />
                  </div>

                  <div className="signin__field">
                    <label htmlFor="signin-test">Target scholarship/test</label>
                    <input
                      id="signin-test"
                      type="text"
                      placeholder="e.g. IELTS, SAT"
                      value={form.targetTest}
                      onChange={update("targetTest")}
                    />
                  </div>
                </>
              )}

              {error && (
                <p className="signin__status signin__status--error" role="alert">
                  {error}
                </p>
              )}
              {notice && (
                <p className="signin__status signin__status--success" role="status">
                  {notice}
                </p>
              )}

              <button type="submit" className="btn btn--accent signin__submit" disabled={busy}>
                {busy ? "…" : mode === "signin" ? t("Sign In") : t("Create Account")}
              </button>
            </form>
          )}

          <a className="signin__back" href="#/">
            {t("← Back to ScholarCompass")}
          </a>
        </div>
      </div>
    </section>
  );
}
