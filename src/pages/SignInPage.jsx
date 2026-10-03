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
  const { signUp, signIn, signInWithGoogle, isConfigured, user } = useAuth();
  const [mode, setMode] = useState("signin"); // signin | signup
  const [form, setForm] = useState(initialForm);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function update(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleGoogle() {
    setError("");
    setNotice("");
    setGoogleBusy(true);
    const { error: oauthError } = await signInWithGoogle();
    // On success the browser navigates to Google, so there's nothing more
    // to do here. Only an immediate failure (e.g. the provider isn't
    // turned on yet) comes back without leaving the page.
    if (oauthError) {
      setError(oauthError);
      setGoogleBusy(false);
    }
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
        window.location.hash = "#/";
      }
      return;
    }

    const { error: signInError } = await signIn(form);
    setBusy(false);
    if (signInError) {
      setError(signInError);
      return;
    }
    window.location.hash = "#/";
  }

  if (user) {
    return (
      <section className="section signin">
        <div className="section__inner signin__inner">
          <div className="signin__card">
            <p className="signin__lede">
              You're already signed in. <a href="#/">Go to your dashboard</a>.
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
            <>
              <button
                type="button"
                className="signin__oauth-btn"
                onClick={handleGoogle}
                disabled={googleBusy}
              >
                <GoogleIcon />
                {googleBusy
                  ? t("Redirecting to Google…")
                  : mode === "signin"
                  ? t("Continue with Google")
                  : t("Sign up with Google")}
              </button>

              <div className="signin__divider" role="separator">
                <span>{t("or")}</span>
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

// Google's standard four-color "G" mark, used unmodified as required by
// Google's own branding guidelines for "Sign in with Google" buttons.
function GoogleIcon() {
  return (
    <svg className="signin__oauth-icon" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.68-3.87 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z"
      />
    </svg>
  );
}
