import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "../components/Avatar.jsx";
import { useMyLeagues, runLeagueAction } from "../hooks/useCustomLeagues.js";
import { MODE_LABEL, leagueHref } from "../utils/customLeague.js";

export function LeaguesGate({ children }) {
  const { user, loading } = useAuth();
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
          <h1 className="section__title">Friend leagues</h1>
          <p className="section__lede">
            <a href="#/signin">Sign in</a> to race your friends.
          </p>
        </div>
      </section>
    );
  }
  return children;
}

function InviteRow({ invite, onDone }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function respond(accept) {
    setBusy(true);
    setError("");
    const res = await runLeagueAction("respond_league_invite", { p_invite: invite.invite_id, p_accept: accept });
    setBusy(false);
    if (!res.ok) setError(res.error);
    else if (accept) window.location.hash = leagueHref(invite.league_id);
    onDone?.();
  }
  return (
    <li className="cleague-invite">
      <Avatar path={invite.inviter_avatar_path} name={invite.inviter_name} size={36} />
      <div className="cleague-invite__text">
        <p className="cleague-invite__title">{invite.league_name}</p>
        <p className="cleague-invite__meta">
          {invite.inviter_name || "A friend"} invited you · {invite.member_count} in · {MODE_LABEL[invite.mode]}
        </p>
        {error && <p className="cleague-error" role="alert">{error}</p>}
      </div>
      <div className="cleague-invite__actions">
        <button type="button" className="btn btn--accent btn--small" disabled={busy} onClick={() => respond(true)}>
          Join
        </button>
        <button type="button" className="btn btn--ghost btn--small" disabled={busy} onClick={() => respond(false)}>
          Decline
        </button>
      </div>
    </li>
  );
}

function LeaguesInner() {
  const { leagues, invites, loading, isSetUp, reload } = useMyLeagues();

  if (loading) return <p className="section__lede">Loading…</p>;
  if (!isSetUp) {
    return <p className="section__lede">Friend leagues aren't switched on yet.</p>;
  }

  return (
    <>
      {invites.length > 0 && (
        <div className="cleague-block" data-testid="league-invites">
          <h2 className="cleague-block__title">
            Invites <span className="cleague-count">{invites.length}</span>
          </h2>
          <ul className="cleague-invites">
            {invites.map((i) => (
              <InviteRow key={i.invite_id} invite={i} onDone={reload} />
            ))}
          </ul>
        </div>
      )}

      <div className="cleague-block">
        <h2 className="cleague-block__title">My leagues</h2>
        {leagues.length === 0 ? (
          <p className="cleague-empty">
            You're not in a friend league yet. Start one and invite a few friends. It runs next to your
            global league, so nothing there changes.
          </p>
        ) : (
          <ul className="cleague-list">
            {leagues.map((l) => (
              <li key={l.id}>
                <a className="cleague-row" href={leagueHref(l.id)}>
                  <span className="cleague-row__rank">{l.my_rank ? `#${l.my_rank}` : "–"}</span>
                  <span className="cleague-row__main">
                    <span className="cleague-row__name">{l.name}</span>
                    <span className="cleague-row__meta">
                      {l.member_count} {l.member_count === 1 ? "member" : "members"} · {MODE_LABEL[l.mode]}
                      {l.is_owner ? " · You own it" : l.owner_name ? ` · ${l.owner_name}` : ""}
                    </span>
                  </span>
                  <span className="cleague-row__xp">
                    {(l.my_xp ?? 0).toLocaleString()}
                    <small>XP</small>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default function LeaguesPage() {
  return (
    <LeaguesGate>
      <section className="section cleague-page">
        <div className="section__inner">
          <div className="cleague-head">
            <div>
              <h1 className="section__title">Friend leagues</h1>
              <p className="section__lede">Private leaderboards with people you pick. Your global league stays as it is.</p>
            </div>
            <a className="btn btn--accent" href="#/leagues/new">
              New league
            </a>
          </div>
          <LeaguesInner />
        </div>
      </section>
    </LeaguesGate>
  );
}
