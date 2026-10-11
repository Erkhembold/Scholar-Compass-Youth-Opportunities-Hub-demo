import { useState } from "react";
import Avatar from "../components/Avatar.jsx";
import { LeaguesGate } from "./LeaguesPage.jsx";
import { useFriendships } from "../hooks/useFriendships.js";
import { runLeagueAction } from "../hooks/useCustomLeagues.js";
import { DESC_MAX, MAX_MEMBERS, MODE_HELP, MODE_LABEL, NAME_MAX, leagueHref, validateLeagueForm } from "../utils/customLeague.js";

export function FriendPicker({ friends, selected, onToggle, disabled }) {
  if (friends.length === 0) {
    return <p className="cleague-empty">No friends to invite yet. Add some from the leaderboard first.</p>;
  }
  return (
    <ul className="cleague-pick">
      {friends.map((f) => {
        const on = selected.has(f.user_id);
        return (
          <li key={f.user_id}>
            <label className={`cleague-pick__row${on ? " is-on" : ""}`}>
              <input type="checkbox" checked={on} disabled={disabled} onChange={() => onToggle(f.user_id)} />
              <Avatar path={f.avatar_path} name={f.name} size={32} />
              <span className="cleague-pick__name">{f.name || "ScholarCompass student"}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}

function CreateForm() {
  const { friends } = useFriendships();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState("weekly");
  const [selected, setSelected] = useState(() => new Set());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function toggle(id) {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else if (n.size < MAX_MEMBERS - 1) n.add(id);
      return n;
    });
  }

  async function submit(e) {
    e.preventDefault();
    const problem = validateLeagueForm({ name, description });
    if (problem) {
      setError(problem);
      return;
    }
    setBusy(true);
    setError("");
    const res = await runLeagueAction("create_custom_league", {
      p_name: name.trim(),
      p_description: description.trim() || null,
      p_mode: mode,
      p_invitees: [...selected],
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    window.location.hash = leagueHref(res.data.id);
  }

  return (
    <form className="cleague-form" onSubmit={submit} noValidate>
      <label className="cleague-field">
        <span className="cleague-field__label">League name</span>
        <input
          className="cleague-input"
          value={name}
          maxLength={NAME_MAX}
          onChange={(e) => setName(e.target.value)}
          placeholder="Grade 11 SAT crew"
          autoComplete="off"
        />
      </label>
      <label className="cleague-field">
        <span className="cleague-field__label">
          Description <em>optional</em>
        </span>
        <textarea
          className="cleague-input"
          rows={2}
          value={description}
          maxLength={DESC_MAX}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's this league about?"
        />
      </label>

      <fieldset className="cleague-field cleague-modes">
        <legend className="cleague-field__label">How XP is counted</legend>
        {Object.keys(MODE_LABEL).map((m) => (
          <label key={m} className={`cleague-mode${mode === m ? " is-on" : ""}`}>
            <input type="radio" name="mode" value={m} checked={mode === m} onChange={() => setMode(m)} />
            <span className="cleague-mode__name">{MODE_LABEL[m]}</span>
            <span className="cleague-mode__help">{MODE_HELP[m]}</span>
          </label>
        ))}
      </fieldset>

      <div className="cleague-field">
        <span className="cleague-field__label">
          Invite friends <em>they'll need to accept</em>
        </span>
        <FriendPicker friends={friends} selected={selected} onToggle={toggle} disabled={busy} />
      </div>

      {error && (
        <p className="cleague-error" role="alert">
          {error}
        </p>
      )}
      <div className="cleague-form__actions">
        <button type="submit" className="btn btn--accent" disabled={busy}>
          {busy ? "Creating…" : selected.size ? `Create and invite ${selected.size}` : "Create league"}
        </button>
        <a className="btn btn--ghost" href="#/leagues">
          Cancel
        </a>
      </div>
    </form>
  );
}

export default function LeagueCreatePage() {
  return (
    <LeaguesGate>
      <section className="section cleague-page">
        <div className="section__inner cleague-narrow">
          <p className="cleague-back">
            <a href="#/leagues">← Friend leagues</a>
          </p>
          <h1 className="section__title">New league</h1>
          <CreateForm />
        </div>
      </section>
    </LeaguesGate>
  );
}
