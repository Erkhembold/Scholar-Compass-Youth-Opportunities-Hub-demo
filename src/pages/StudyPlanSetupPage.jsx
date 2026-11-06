import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useStudyPlanner } from "../hooks/useStudyPlanner.js";
import ToggleGroup from "../components/ToggleGroup.jsx";
import { CATALOGUE, DAYS, INTENSITIES, SESSION_OPTIONS, validateForm } from "../utils/studyPlan.js";
import { plannerHref, signInHref } from "../router.js";

const STEPS = ["Goals and scores", "Exam dates", "Time and preferences", "Weak areas"];
const MINUTE_OPTIONS = [0, 15, 30, 45, 60, 90, 120, 180];

function Field({ id, label, children, hint }) {
  return (
    <div className="sp-field">
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && <span className="sp-field__hint">{hint}</span>}
    </div>
  );
}

function NumberInput({ id, value, onChange, min, max, step = 1, placeholder }) {
  return (
    <input id={id} type="number" inputMode="decimal" min={min} max={max} step={step} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
  );
}

// #/planner/setup: the updated setup (version 2). Used for new accounts, for
// existing accounts that have not completed it (pre-filled from what is
// already saved), and for "Edit my study preferences". Every question can be
// skipped; nothing is required.
export default function StudyPlanSetupPage() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const p = useStudyPlanner();
  const [form, setForm] = useState(null);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [adjust, setAdjust] = useState(false);
  const [adjusting, setAdjusting] = useState(false);

  // Fill the form once, from what is already saved (profile answers from the
  // original onboarding and any saved draft), and not again, so typing is
  // never overwritten by a refetch.
  useEffect(() => {
    if (form === null && !p.loading && !p.unavailable) setForm(p.form);
  }, [p.loading, p.unavailable, p.form, form]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const setDay = (key, v) => setForm((f) => ({ ...f, availability: { ...f.availability, [key]: v } }));
  const toggleWeak = (key) =>
    setForm((f) => ({ ...f, weakAreas: f.weakAreas.includes(key) ? f.weakAreas.filter((k) => k !== key) : [...f.weakAreas, key] }));

  const weekMinutes = useMemo(() => (form ? DAYS.reduce((s, d) => s + (Number(form.availability[d.key]) || 0), 0) : 0), [form]);

  if (authLoading || p.loading || (form === null && !p.unavailable)) {
    return (
      <section className="section sp-page">
        <div className="sp-page__inner">
          <p className="section__lede">{t("Loading…")}</p>
        </div>
      </section>
    );
  }
  if (!user) {
    return (
      <section className="section sp-page">
        <div className="sp-page__inner">
          <h1 className="sp-page__title">{t("Study plan setup")}</h1>
          <p className="section__lede">
            <a href={signInHref()}>{t("Sign in")}</a> {t("to create your study plan.")}
          </p>
        </div>
      </section>
    );
  }
  if (p.unavailable) {
    return (
      <section className="section sp-page">
        <div className="sp-page__inner">
          <h1 className="sp-page__title">{t("Study plan setup")}</h1>
          <p className="section__lede">{t("The study planner is being set up. Please check back soon.")}</p>
        </div>
      </section>
    );
  }

  const editing = p.state === "complete";
  const last = step === STEPS.length - 1;

  async function save(complete) {
    setError("");
    const problem = validateForm(form, p.today);
    if (problem) {
      setError(t(problem));
      return;
    }
    setSaving(true);
    const res = await p.savePreferences(form, { complete });
    setSaving(false);
    if (res.error) {
      setError(`${t("We couldn't save your answers.")} ${res.error}`);
      return;
    }
    if (!complete) {
      window.location.hash = "#/";
    } else if (res.offerAdjust) {
      setAdjust(true);
    } else {
      window.location.hash = editing ? plannerHref() : "#/";
    }
  }

  async function updatePlan() {
    setAdjusting(true);
    const e = await p.regenerate();
    setAdjusting(false);
    if (e) setError(e);
    else window.location.hash = plannerHref();
  }

  if (adjust) {
    return (
      <section className="section sp-page">
        <div className="sp-page__inner sp-setup">
          <h1 className="sp-page__title">{t("Preferences saved")}</h1>
          <p className="section__lede">
            {t("Your changes affect your weekly plan. Update the rest of this week's plan to match? Tasks you have already completed are kept.")}
          </p>
          {error && <p className="friend-note friend-note--error" role="alert">{error}</p>}
          <div className="sp-setup__nav">
            <button type="button" className="btn btn--accent" onClick={updatePlan} disabled={adjusting}>
              {adjusting ? t("Updating…") : t("Update my plan")}
            </button>
            <a className="btn btn--ghost" href={plannerHref()}>
              {t("Keep my current plan")}
            </a>
          </div>
        </div>
      </section>
    );
  }

  const yn = (v) => (v === true ? t("Yes") : v === false ? t("No") : t("Not sure yet"));
  const ynOptions = [t("Yes"), t("No"), t("Not sure yet")];
  const fromYn = (label) => (label === t("Yes") ? true : label === t("No") ? false : null);
  const exams = [form.prepSat ? "SAT" : null, form.prepIelts ? "IELTS" : null].filter(Boolean);
  const weakGroups = (exams.length ? CATALOGUE.filter((c) => exams.includes(c.exam)) : CATALOGUE).reduce((acc, c) => {
    const k = `${c.exam} ${c.skill}`;
    (acc[k] = acc[k] || []).push(c);
    return acc;
  }, {});

  return (
    <section className="section sp-page">
      <div className="sp-page__inner sp-setup">
        <p className="cmp-page__back">
          <a href={editing ? plannerHref() : "#/"}>&larr; {editing ? t("Back to planner") : t("Back to home")}</a>
        </p>
        <h1 className="sp-page__title">{editing ? t("Edit my study preferences") : t("Let's build your study plan.")}</h1>
        <p className="section__lede">
          {t("Skip anything you are not sure about. You can change all of this later.")}
        </p>

        <ol className="sp-steps" aria-label="Setup steps">
          {STEPS.map((s, i) => (
            <li key={s} className={`sp-steps__item ${i === step ? "sp-steps__item--on" : ""} ${i < step ? "sp-steps__item--past" : ""}`}>
              <button type="button" onClick={() => setStep(i)} aria-current={i === step ? "step" : undefined}>
                <span className="sp-steps__n">{i + 1}</span>
                <span className="sp-steps__label">{t(s)}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="sp-card">
          {step === 0 && (
            <>
              <h2 className="sp-card__title">{t("What are you preparing for?")}</h2>
              <div className="sp-q">
                <p className="sp-q__label">SAT</p>
                <ToggleGroup options={ynOptions} selected={yn(form.prepSat)} onToggle={(v) => set({ prepSat: fromYn(v) })} />
              </div>
              <div className="sp-q">
                <p className="sp-q__label">IELTS</p>
                <ToggleGroup options={ynOptions} selected={yn(form.prepIelts)} onToggle={(v) => set({ prepIelts: fromYn(v) })} />
              </div>
              <Field id="sp-other" label={t("Other academic goals (optional)")}>
                <input id="sp-other" type="text" maxLength={200} value={form.otherGoal} onChange={(e) => set({ otherGoal: e.target.value })} />
              </Field>

              {form.prepSat && (
                <fieldset className="sp-fieldset">
                  <legend>SAT</legend>
                  <div className="sp-fields">
                    <Field id="sp-cur-sat" label={t("Current total score")} hint="400-1600">
                      <NumberInput id="sp-cur-sat" value={form.curSat} onChange={(v) => set({ curSat: v })} min={400} max={1600} step={10} placeholder={t("Not sure yet")} />
                    </Field>
                    <Field id="sp-cur-sat-math" label={t("Current Math")} hint="200-800">
                      <NumberInput id="sp-cur-sat-math" value={form.curSatMath} onChange={(v) => set({ curSatMath: v })} min={200} max={800} step={10} />
                    </Field>
                    <Field id="sp-cur-sat-rw" label={t("Current Reading and Writing")} hint="200-800">
                      <NumberInput id="sp-cur-sat-rw" value={form.curSatRw} onChange={(v) => set({ curSatRw: v })} min={200} max={800} step={10} />
                    </Field>
                    <Field id="sp-sat-target" label={t("Target total score")} hint="400-1600">
                      <NumberInput id="sp-sat-target" value={form.satTarget} onChange={(v) => set({ satTarget: v })} min={400} max={1600} step={10} />
                    </Field>
                  </div>
                </fieldset>
              )}

              {form.prepIelts && (
                <fieldset className="sp-fieldset">
                  <legend>IELTS</legend>
                  <div className="sp-fields">
                    <Field id="sp-cur-ielts" label={t("Current overall band")} hint="1-9">
                      <NumberInput id="sp-cur-ielts" value={form.curIelts} onChange={(v) => set({ curIelts: v })} min={1} max={9} step={0.5} placeholder={t("Not sure yet")} />
                    </Field>
                    <Field id="sp-ielts-target" label={t("Target overall band")} hint="1-9">
                      <NumberInput id="sp-ielts-target" value={form.ieltsTarget} onChange={(v) => set({ ieltsTarget: v })} min={1} max={9} step={0.5} />
                    </Field>
                  </div>
                  <table className="sp-bands">
                    <thead>
                      <tr><th scope="col">{t("Component")}</th><th scope="col">{t("Current")}</th><th scope="col">{t("Target")}</th></tr>
                    </thead>
                    <tbody>
                      {["Listening", "Reading", "Writing", "Speaking"].map((c) => (
                        <tr key={c}>
                          <th scope="row">{t(c)}</th>
                          <td><NumberInput id={`sp-cur-${c}`} value={form[`curIelts${c}`]} onChange={(v) => set({ [`curIelts${c}`]: v })} min={1} max={9} step={0.5} /></td>
                          <td><NumberInput id={`sp-tgt-${c}`} value={form[`tgtIelts${c}`]} onChange={(v) => set({ [`tgtIelts${c}`]: v })} min={1} max={9} step={0.5} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="sp-field__hint">{t("Listening and Speaking scores are saved, but practice tasks for them are not available yet.")}</p>
                </fieldset>
              )}
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="sp-card__title">{t("When are your exams?")}</h2>
              {[["SAT", "satDate"], ["IELTS", "ieltsDate"]].map(([name, key]) => (
                <div className="sp-q" key={name}>
                  <p className="sp-q__label">{name}</p>
                  <div className="sp-date">
                    <input
                      type="date"
                      aria-label={`${name} exam date`}
                      value={form[key]}
                      min={p.today}
                      disabled={!form[key]}
                      onChange={(e) => set({ [key]: e.target.value })}
                    />
                    <label className="sp-check">
                      <input
                        type="checkbox"
                        checked={!form[key]}
                        onChange={(e) => set({ [key]: e.target.checked ? "" : p.today })}
                      />
                      {t("Not scheduled yet")}
                    </label>
                  </div>
                </div>
              ))}
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="sp-card__title">{t("How much time can you study each day?")}</h2>
              <p className="sp-field__hint">{t("Choose a realistic amount. Pick Rest for days off.")}</p>
              <div className="sp-days">
                {DAYS.map((d) => {
                  const cur = form.availability[d.key];
                  const opts = cur !== "" && !MINUTE_OPTIONS.includes(Number(cur)) ? [...MINUTE_OPTIONS, Number(cur)].sort((a, b) => a - b) : MINUTE_OPTIONS;
                  return (
                    <div className="sp-days__row" key={d.key}>
                      <label htmlFor={`sp-day-${d.key}`}>{d.label}</label>
                      <select id={`sp-day-${d.key}`} value={cur === "" ? "0" : String(cur)} onChange={(e) => setDay(d.key, e.target.value)}>
                        {opts.map((m) => (
                          <option key={m} value={m}>{m === 0 ? t("Rest") : `${m} min`}</option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
              <p className="sp-field__hint">{t("Total per week")}: {Math.floor(weekMinutes / 60)} h {weekMinutes % 60} min</p>

              <div className="sp-q">
                <p className="sp-q__label">{t("Workload")}</p>
                <ToggleGroup
                  options={INTENSITIES.map((i) => t(i.label))}
                  selected={t((INTENSITIES.find((i) => i.id === form.intensity) || INTENSITIES[1]).label)}
                  onToggle={(v) => set({ intensity: INTENSITIES.find((i) => t(i.label) === v).id })}
                />
                <span className="sp-field__hint">{t((INTENSITIES.find((i) => i.id === form.intensity) || INTENSITIES[1]).hint)}</span>
              </div>
              <div className="sp-q">
                <p className="sp-q__label">{t("Preferred session length")}</p>
                <ToggleGroup
                  options={SESSION_OPTIONS.map((m) => `${m} min`)}
                  selected={`${form.sessionMinutes} min`}
                  onToggle={(v) => set({ sessionMinutes: parseInt(v, 10) })}
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="sp-card__title">{t("Which topics are hardest for you?")}</h2>
              <p className="sp-field__hint">{t("Pick any that apply. These get more time in your plan. You can skip this.")}</p>
              {p.suggestedWeak.length > 0 && (
                <div className="sp-suggest">
                  <p>
                    {t("Based on your practice so far, these look hardest:")}{" "}
                    <strong>{p.suggestedWeak.map((k) => CATALOGUE.find((c) => c.key === k).topic).join(", ")}</strong>
                  </p>
                  <button
                    type="button"
                    className="btn btn--ghost btn--small"
                    onClick={() => set({ weakAreas: Array.from(new Set([...form.weakAreas, ...p.suggestedWeak])) })}
                  >
                    {t("Add these")}
                  </button>
                </div>
              )}
              {Object.entries(weakGroups).map(([group, items]) => (
                <div className="sp-q" key={group}>
                  <p className="sp-q__label">{group}</p>
                  <ToggleGroup
                    options={items.map((c) => c.topic)}
                    selected={items.filter((c) => form.weakAreas.includes(c.key)).map((c) => c.topic)}
                    onToggle={(v) => toggleWeak(items.find((c) => c.topic === v).key)}
                    multi
                  />
                </div>
              ))}
            </>
          )}

          {error && <p className="friend-note friend-note--error" role="alert">{error}</p>}

          <div className="sp-setup__nav">
            {step > 0 && (
              <button type="button" className="btn btn--ghost" onClick={() => setStep(step - 1)} disabled={saving}>
                {t("Back")}
              </button>
            )}
            {!last && (
              <button type="button" className="btn btn--accent" onClick={() => setStep(step + 1)} disabled={saving}>
                {t("Next")}
              </button>
            )}
            {last && (
              <button type="button" className="btn btn--accent" onClick={() => save(true)} disabled={saving}>
                {saving ? t("Saving…") : editing ? t("Save changes") : t("Save and build my plan")}
              </button>
            )}
            {!editing && (
              <button type="button" className="btn btn--ghost sp-setup__later" onClick={() => save(false)} disabled={saving}>
                {t("Save and finish later")}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
