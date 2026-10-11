import { useEffect, useState } from "react";
import Avatar from "../components/Avatar.jsx";
import { LeaguesGate } from "./LeaguesPage.jsx";
import { FriendPicker } from "./LeagueCreatePage.jsx";
import { useCustomLeague, runLeagueAction } from "../hooks/useCustomLeagues.js";
import { useFriendships } from "../hooks/useFriendships.js";
import { publicProfileHref } from "../router.js";
import { getWeekInfo, formatCountdown } from "../utils/leaderboard.js";
import { DESC_MAX, MAX_MEMBERS, MODE_HELP, MODE_LABEL, NAME_MAX, validateLeagueForm } from "../utils/customLeague.js";

function Period({ mode }) {
  const [ms, setMs] = useState(() => getWeekInfo().msRemaining);
  useEffect(() => {
    if (mode !== "weekly") return undefined;
    const id = setInterval(() => setMs(getWeekInfo().msRemaining), 30000);
    return () => clearInterval(id);
  }, [mode]);
  if (mode !== "weekly") return <>No reset. XP counts from when each person joined.</>;
  const { days, hours, minutes } = formatCountdown(ms);
  return (
    <>
      This week's XP. Resets in {days}d {hours}h {minutes}m.
    </>
  );
}

function OwnerTools({ league, members, pending, userId, reload }) {
  const { friends } = useFriendships();
  const [selected, setSelected] = useState(() => new Set());
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(league.name);
  const [description, setDescription] = useState(league.description || "");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const taken = new Set([...members.map((m) => m.user_id), ...pending.map((p) => p.user_id)]);
  const invitable = friends.filter((f) => !taken.has(f.user_id));
  const room = MAX_MEMBERS - members.length - pending.length;

  async function act(fn, args, after) {
    setBusy(true);
    setMsg("");
    const res = await runLeagueAction(fn, args);
    setBusy(false);
    if (!res.ok) setMsg(res.error);
    else after?.(res);
    reload();
  }

  async function sendInvites() {
    setBusy(true);
    setMsg("");
    let failed = "";
    for (const id of selected) {
      const res = await runLeagueAction("invite_to_custom_league", { p_league: league.id, p_user: id });
      if (!res.ok) failed = res.error;
    }
    setBusy(false);
    setSelected(new Set());
    setMsg(failed);
    reload();
  }

  return (
    <div className="cleague-owner">
      <h2 className="cleague-block__title">Manage league</h2>

      {pending.length > 0 && (
        <>
          <h3 className="cleague-sub">Waiting for an answer</h3>
          <ul className="cleague-people">
            {pending.map((p) => (
              <li key={p.invite_id} className="cleague-person">
                <Avatar path={p.avatar_path} name={p.name} size={32} />
                <span className="cleague-person__name">{p.name || "ScholarCompass student"}</span>
                <button
                  type="button"
                  className="btn btn--ghost btn--small"
                  disabled={busy}
                  onClick={() => act("cancel_league_invite", { p_invite: p.invite_id })}
                >
                  Cancel invite
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <h3 className="cleague-sub">Invite friends</h3>
      {room <= 0 ? (
        <p className="cleague-empty">The league is full.</p>
      ) : (
        <>
          <FriendPicker
            friends={invitable}
            selected={selected}
            disabled={busy}
            onToggle={(id) =>
              setSelected((s) => {
                const n = new Set(s);
                if (n.has(id)) n.delete(id);
                else if (n.size < room) n.add(id);
                return n;
              })
            }
          />
          {selected.size > 0 && (
            <button type="button" className="btn btn--accent btn--small" disabled={busy} onClick={sendInvites}>
              Send {selected.size} {selected.size === 1 ? "invite" : "invites"}
            </button>
          )}
        </>
      )}

      {msg && (
        <p className="cleague-error" role="alert">
          {msg}
        </p>
      )}

      {editing ? (
        <form
          className="cleague-form cleague-form--inline"
          onSubmit={(e) => {
            e.preventDefault();
            const problem = validateLeagueForm({ name, description });
            if (problem) return setMsg(problem);
            act("update_custom_league", { p_league: league.id, p_name: name.trim(), p_description: description.trim() || null }, () =>
              setEditing(false),
            );
          }}
        >
          <input className="cleague-input" value={name} maxLength={NAME_MAX} onChange={(e) => setName(e.target.value)} aria-label="League name" />
          <textarea className="cleague-input" rows={2} value={description} maxLength={DESC_MAX} onChange={(e) => setDescription(e.target.value)} aria-label="Description" />
          <div className="cleague-form__actions">
            <button type="submit" className="btn btn--accent btn--small" disabled={busy}>
              Save
            </button>
            <button type="button" className="btn btn--ghost btn--small" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="cleague-owner__row">
          <button type="button" className="btn btn--ghost btn--small" onClick={() => setEditing(true)}>
            Rename or edit
          </button>
          {confirmDelete ? (
            <>
              <span className="cleague-owner__warn">Delete for everyone?</span>
              <button
                type="button"
                className="btn btn--danger-ghost btn--small"
                disabled={busy}
                onClick={() => act("delete_custom_league", { p_league: league.id }, () => (window.location.hash = "#/leagues"))}
              >
                Yes, delete
              </button>
              <button type="button" className="btn btn--ghost btn--small" onClick={() => setConfirmDelete(false)}>
                Keep
              </button>
            </>
          ) : (
            <button type="button" className="btn btn--ghost btn--small" onClick={() => setConfirmDelete(true)}>
              Delete league
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Detail({ id }) {
  const { data, loading, isSetUp, reload, userId } = useCustomLeague(id);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  // Removed, left or deleted while looking at it: say so instead of a blank page.
  if (loading) return <p className="section__lede">Loading…</p>;
  if (!isSetUp) return <p className="section__lede">Friend leagues aren't switched on yet.</p>;
  if (!data) {
    return (
      <>
        <h1 className="section__title">League not available</h1>
        <p className="section__lede">
          You're not in this league, or it no longer exists. <a href="#/leagues">Back to your leagues</a>
        </p>
      </>
    );
  }

  const { league, members, pending } = data;
  const me = members.find((m) => m.user_id === userId);

  async function act(fn, args, after) {
    setBusy(true);
    setMsg("");
    const res = await runLeagueAction(fn, args);
    setBusy(false);
    if (!res.ok) setMsg(res.error);
    else after?.();
    reload();
  }

  return (
    <>
      <p className="cleague-back">
        <a href="#/leagues">← Friend leagues</a>
      </p>
      <div className="cleague-hero">
        <div>
          <h1 className="section__title cleague-hero__name">{league.name}</h1>
          {league.description && <p className="cleague-hero__desc">{league.description}</p>}
          <p className="cleague-hero__period">
            <strong>{MODE_LABEL[league.mode]}.</strong> <Period mode={league.mode} />
          </p>
        </div>
        {me && (
          <div className="cleague-hero__me" aria-label="Your standing">
            <span className="cleague-hero__rank">#{me.rank}</span>
            <span className="cleague-hero__xp">{me.xp.toLocaleString()} XP</span>
          </div>
        )}
      </div>

      <ol className="cleague-board" data-testid="league-board">
        {members.map((m) => (
          <li key={m.user_id} className={`cleague-board__row${m.user_id === userId ? " is-me" : ""}`}>
            <span className="cleague-board__rank">{m.rank}</span>
            <a className="cleague-board__who" href={publicProfileHref(m.user_id)}>
              <Avatar path={m.avatar_path} name={m.name} size={34} />
              <span className="cleague-board__name">
                {m.name || "ScholarCompass student"}
                {m.is_owner && <span className="cleague-tag">Owner</span>}
              </span>
            </a>
            <span className="cleague-board__xp">{m.xp.toLocaleString()}</span>
            {league.is_owner && !m.is_owner &&
              (confirmRemove === m.user_id ? (
                <span className="cleague-board__confirm">
                  <button
                    type="button"
                    className="btn btn--danger-ghost btn--small"
                    disabled={busy}
                    onClick={() => act("remove_league_member", { p_league: league.id, p_user: m.user_id }, () => setConfirmRemove(null))}
                  >
                    Remove
                  </button>
                  <button type="button" className="btn btn--ghost btn--small" onClick={() => setConfirmRemove(null)}>
                    Keep
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  className="cleague-board__remove"
                  aria-label={`Remove ${m.name || "member"}`}
                  onClick={() => setConfirmRemove(m.user_id)}
                >
                  Remove
                </button>
              ))}
          </li>
        ))}
      </ol>
      <p className="cleague-note">
        {members.length} of {MAX_MEMBERS} places filled. {MODE_HELP[league.mode]}
      </p>

      {msg && (
        <p className="cleague-error" role="alert">
          {msg}
        </p>
      )}

      {league.is_owner ? (
        <OwnerTools league={league} members={members} pending={pending} userId={userId} reload={reload} />
      ) : (
        <div className="cleague-owner__row">
          {confirmLeave ? (
            <>
              <span className="cleague-owner__warn">Leave this league?</span>
              <button
                type="button"
                className="btn btn--danger-ghost btn--small"
                disabled={busy}
                onClick={() => act("leave_custom_league", { p_league: league.id }, () => (window.location.hash = "#/leagues"))}
              >
                Leave
              </button>
              <button type="button" className="btn btn--ghost btn--small" onClick={() => setConfirmLeave(false)}>
                Stay
              </button>
            </>
          ) : (
            <button type="button" className="btn btn--ghost btn--small" onClick={() => setConfirmLeave(true)}>
              Leave league
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default function LeagueDetailPage({ id }) {
  return (
    <LeaguesGate>
      <section className="section cleague-page">
        <div className="section__inner cleague-narrow">
          <Detail id={id} />
        </div>
      </section>
    </LeaguesGate>
  );
}
