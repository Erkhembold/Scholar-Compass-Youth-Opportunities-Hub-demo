import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const FIELD_DEFS = [
  { key: "school", label: "School" },
  { key: "grade", label: "Grade / year level" },
  { key: "intended_major", label: "Intended major or field of interest" },
  { key: "target_test", label: "Target scholarship/test" },
];

export default function ProfilePage() {
  const { user, profile, signOut, updateProfile, loading } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => ({
    school: profile?.school || "",
    grade: profile?.grade || "",
    intended_major: profile?.intended_major || "",
    target_test: profile?.target_test || "",
  }));
  const [saving, setSaving] = useState(false);

  if (loading) {
    return (
      <section className="section">
        <div className="section__inner">
          <p className="section__lede">Loading…</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="section">
        <div className="section__inner">
          <h1 className="section__title">You're not signed in</h1>
          <p className="section__lede">
            <a href="#/signin">Sign in</a> to view your profile.
          </p>
        </div>
      </section>
    );
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    await updateProfile(form);
    setSaving(false);
    setEditing(false);
  }

  return (
    <section className="section signin">
      <div className="section__inner signin__inner">
        <div className="signin__card">
          <h1 className="signin__title">{profile?.name || "Your profile"}</h1>
          <p className="signin__lede">{user.email}</p>

          {!editing ? (
            <>
              <dl className="essential-list" style={{ marginTop: 24 }}>
                {FIELD_DEFS.map((f) => (
                  <div className="essential-row" key={f.key}>
                    <dt>{f.label}</dt>
                    <dd>{profile?.[f.key] || "Not set"}</dd>
                  </div>
                ))}
              </dl>
              <button
                type="button"
                className="btn btn--ghost"
                style={{ marginTop: 20 }}
                onClick={() => setEditing(true)}
              >
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
              <button type="submit" className="btn btn--accent signin__submit" disabled={saving}>
                {saving ? "…" : "Save"}
              </button>
            </form>
          )}

          <button
            type="button"
            className="signin__back"
            style={{ background: "none", border: "none", cursor: "pointer" }}
            onClick={async () => {
              await signOut();
              window.location.hash = "#/";
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </section>
  );
}
