import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ToggleGroup from "./ToggleGroup.jsx";

const FIELD_DEFS = [
  { key: "school", label: "School" },
  { key: "grade", label: "Grade / year level" },
  { key: "intended_major", label: "Intended major or field of interest" },
  { key: "target_test", label: "Target scholarship/test" },
];

const TARGET_FIELD_DEFS = [
  { key: "sat_target_score", label: "SAT target score", type: "number", min: 400, max: 1600, step: 10 },
  { key: "ielts_target_score", label: "IELTS target score", type: "number", min: 1, max: 9, step: 0.5 },
];

const COUNTRIES = ["United States", "United Kingdom", "Canada", "Australia", "Europe", "Mongolia", "Other"];
const PREP_OPTIONS = ["Yes", "No", "Not sure yet"];

function prepToLabel(v) {
  return v === true ? "Yes" : v === false ? "No" : "Not sure yet";
}
function labelToPrep(v) {
  return v === "Yes" ? true : v === "No" ? false : null;
}

// The "Account details" editor: profile visibility toggle, then either the
// read-only list or the edit form. Used on the Settings page.
export default function AccountDetails() {
  const { profile, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => ({
    school: profile?.school || "",
    grade: profile?.grade || "",
    intended_major: profile?.intended_major || "",
    target_test: profile?.target_test || "",
    sat_target_score: profile?.sat_target_score ?? "",
    ielts_target_score: profile?.ielts_target_score ?? "",
    intended_countries: profile?.intended_countries || [],
    preparing_for_sat: profile?.preparing_for_sat ?? null,
    sat_target_date: profile?.sat_target_date || "",
    preparing_for_ielts: profile?.preparing_for_ielts ?? null,
    ielts_target_date: profile?.ielts_target_date || "",
  }));
  const [visible, setVisible] = useState(profile?.profile_visible !== false);
  const [visibilitySaving, setVisibilitySaving] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    await updateProfile({
      ...form,
      sat_target_score: form.sat_target_score === "" ? null : Number(form.sat_target_score),
      ielts_target_score: form.ielts_target_score === "" ? null : Number(form.ielts_target_score),
      intended_countries: form.intended_countries.length ? form.intended_countries : null,
      sat_target_date: form.sat_target_date || null,
      ielts_target_date: form.ielts_target_date || null,
    });
    setSaving(false);
    setEditing(false);
  }

  async function handleVisibilityToggle() {
    const next = !visible;
    setVisible(next); // optimistic — other students only ever see this via
    // get_public_profile(), which is fully server-enforced regardless
    setVisibilitySaving(true);
    const { error } = await updateProfile({ profile_visible: next });
    if (error) setVisible(!next);
    setVisibilitySaving(false);
  }

  return (
    <>
          <label className="visibility-toggle">
            <input type="checkbox" checked={visible} disabled={visibilitySaving} onChange={handleVisibilityToggle} />
            Let other students open my profile (turn off to hide it completely)
          </label>

          {!editing ? (
            <>
              <dl className="essential-list" style={{ marginTop: 24 }}>
                {FIELD_DEFS.map((f) => (
                  <div className="essential-row" key={f.key}>
                    <dt>{f.label}</dt>
                    <dd>{profile?.[f.key] || "Not set"}</dd>
                  </div>
                ))}
                <div className="essential-row">
                  <dt>Where you plan to apply</dt>
                  <dd>{profile?.intended_countries?.length ? profile.intended_countries.join(", ") : "Not set"}</dd>
                </div>
                {TARGET_FIELD_DEFS.map((f) => (
                  <div className="essential-row" key={f.key}>
                    <dt>{f.label}</dt>
                    <dd>{profile?.[f.key] ?? "Not set"}</dd>
                  </div>
                ))}
                <div className="essential-row">
                  <dt>Preparing for SAT</dt>
                  <dd>{prepToLabel(profile?.preparing_for_sat)}</dd>
                </div>
                <div className="essential-row">
                  <dt>SAT target date</dt>
                  <dd>{profile?.sat_target_date || "Not set"}</dd>
                </div>
                <div className="essential-row">
                  <dt>Preparing for IELTS</dt>
                  <dd>{prepToLabel(profile?.preparing_for_ielts)}</dd>
                </div>
                <div className="essential-row">
                  <dt>IELTS target date</dt>
                  <dd>{profile?.ielts_target_date || "Not set"}</dd>
                </div>
              </dl>
              <button type="button" className="btn btn--ghost" style={{ marginTop: 20 }} onClick={() => setEditing(true)}>
                Edit details
              </button>
            </>
          ) : (
            <form className="signin__form" onSubmit={handleSave}>
              {FIELD_DEFS.map((f) => (
                <div className="signin__field" key={f.key}>
                  <label htmlFor={`profile-${f.key}`}>{f.label}</label>
                  <input
                    id={`profile-${f.key}`}
                    type="text"
                    value={form[f.key]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  />
                </div>
              ))}
              <div className="signin__field">
                <label>Where you plan to apply</label>
                <ToggleGroup
                  options={COUNTRIES}
                  selected={form.intended_countries}
                  onToggle={(v) =>
                    setForm((prev) => ({
                      ...prev,
                      intended_countries: prev.intended_countries.includes(v)
                        ? prev.intended_countries.filter((x) => x !== v)
                        : [...prev.intended_countries, v],
                    }))
                  }
                  multi
                />
              </div>
              {TARGET_FIELD_DEFS.map((f) => (
                <div className="signin__field" key={f.key}>
                  <label htmlFor={`profile-${f.key}`}>{f.label}</label>
                  <input
                    id={`profile-${f.key}`}
                    type="number"
                    min={f.min}
                    max={f.max}
                    step={f.step}
                    placeholder="Not set"
                    value={form[f.key]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  />
                </div>
              ))}
              <div className="signin__field">
                <label>Preparing for SAT?</label>
                <ToggleGroup
                  options={PREP_OPTIONS}
                  selected={prepToLabel(form.preparing_for_sat)}
                  onToggle={(v) => setForm((prev) => ({ ...prev, preparing_for_sat: labelToPrep(v) }))}
                />
              </div>
              <div className="signin__field">
                <label htmlFor="profile-sat-date">SAT target date</label>
                <input
                  id="profile-sat-date"
                  type="date"
                  value={form.sat_target_date}
                  onChange={(e) => setForm((prev) => ({ ...prev, sat_target_date: e.target.value }))}
                />
              </div>
              <div className="signin__field">
                <label>Preparing for IELTS?</label>
                <ToggleGroup
                  options={PREP_OPTIONS}
                  selected={prepToLabel(form.preparing_for_ielts)}
                  onToggle={(v) => setForm((prev) => ({ ...prev, preparing_for_ielts: labelToPrep(v) }))}
                />
              </div>
              <div className="signin__field">
                <label htmlFor="profile-ielts-date">IELTS target date</label>
                <input
                  id="profile-ielts-date"
                  type="date"
                  value={form.ielts_target_date}
                  onChange={(e) => setForm((prev) => ({ ...prev, ielts_target_date: e.target.value }))}
                />
              </div>
              <button type="submit" className="btn btn--accent signin__submit" disabled={saving}>
                {saving ? "…" : "Save"}
              </button>
            </form>
          )}
    </>
  );
}
