import Avatar from "./Avatar.jsx";
import { useFriendships } from "../hooks/useFriendships.js";
import { publicProfileHref } from "../router.js";
import { LEAGUE_BY_ID } from "../data/leagues.js";

function PersonRow({ person, children }) {
  const league = person.current_league ? LEAGUE_BY_ID[person.current_league] : null;
  const hasStreak = typeof person.current_streak === "number";
  return (
    <li className="friend-row">
      <a className="friend-row__who" href={publicProfileHref(person.user_id)}>
        <Avatar path={person.avatar_path} name={person.name} size={40} />
        <span className="friend-row__text">
          <span className="friend-row__name">{person.name || "ScholarCompass student"}</span>
          {(league || hasStreak) && (
            <span className="friend-row__meta">
              {league ? `${league.name} League` : ""}
              {league && hasStreak ? " · " : ""}
              {hasStreak ? `🔥 ${person.current_streak}` : ""}
            </span>
          )}
        </span>
      </a>
      {children && <div className="friend-row__actions">{children}</div>}
    </li>
  );
}

// Friends + incoming/outgoing requests, shown beside "Account details" on the
// Profile page. Finding people to add happens by opening their profile from
// the leaderboard (or any name that links to #/u/<id>).
export default function FriendsSection() {
  const f = useFriendships();

  if (f.loading) return <p className="signin__lede">Loading…</p>;
  if (!f.isSetUp) {
    return <p className="signin__lede">Friends aren't switched on yet.</p>;
  }

  const empty = f.friends.length + f.incoming.length + f.outgoing.length === 0;

  return (
    <div className="friends-section">
      {f.error && (
        <p className="friend-note friend-note--error" role="alert">
          {f.error}
        </p>
      )}

      {f.incoming.length > 0 && (
        <>
          <h3 className="friends-section__subhead">
            Friend requests <span className="friends-section__count">{f.incoming.length}</span>
          </h3>
          <ul className="friend-list">
            {f.incoming.map((p) => (
              <PersonRow key={p.friendship_id} person={p}>
                <button type="button" className="btn btn--accent btn--small" disabled={f.busy} onClick={() => f.accept(p.friendship_id)}>
                  Accept
                </button>
                <button type="button" className="btn btn--ghost btn--small" disabled={f.busy} onClick={() => f.decline(p.friendship_id)}>
                  Decline
                </button>
              </PersonRow>
            ))}
          </ul>
        </>
      )}

      {f.outgoing.length > 0 && (
        <>
          <h3 className="friends-section__subhead">Sent requests</h3>
          <ul className="friend-list">
            {f.outgoing.map((p) => (
              <PersonRow key={p.friendship_id} person={p}>
                <button type="button" className="btn btn--ghost btn--small" disabled={f.busy} onClick={() => f.remove(p.user_id)}>
                  Cancel
                </button>
              </PersonRow>
            ))}
          </ul>
        </>
      )}

      <h3 className="friends-section__subhead">
        Friends <span className="friends-section__count">{f.friends.length}</span>
      </h3>
      {f.friends.length === 0 ? (
        <p className="signin__lede friends-section__empty">
          {empty ? "No friends yet. " : ""}
          Open a classmate's name on the <a href="#/leaderboard">leaderboard</a> and tap “Add friend”.
        </p>
      ) : (
        <ul className="friend-list">
          {f.friends.map((p) => (
            <PersonRow key={p.friendship_id} person={p} />
          ))}
        </ul>
      )}
    </div>
  );
}
