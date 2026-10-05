import { useState } from "react";
import { useFriendships } from "../hooks/useFriendships.js";

// Facebook-style relationship control shown on another student's profile:
// Add Friend -> Request Sent (cancel) / Accept + Decline -> Friends (unfriend).
// The database enforces every rule (see supabase/friends.sql); this only
// picks which buttons to show.
export default function FriendButton({ userId }) {
  const f = useFriendships();
  const [confirmUnfriend, setConfirmUnfriend] = useState(false);

  if (f.loading) return null;
  if (!f.isSetUp) {
    return <p className="friend-note">Friends aren't switched on yet.</p>;
  }

  const rel = f.statusWith(userId);
  const status = rel?.status || "none";

  let controls;
  if (status === "friends") {
    controls = confirmUnfriend ? (
      <>
        <span className="friend-actions__label">Remove this friend?</span>
        <button
          type="button"
          className="btn btn--danger-ghost"
          disabled={f.busy}
          onClick={async () => {
            await f.remove(userId);
            setConfirmUnfriend(false);
          }}
        >
          Unfriend
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setConfirmUnfriend(false)}>
          Keep
        </button>
      </>
    ) : (
      <>
        <span className="friend-pill friend-pill--on">✓ Friends</span>
        <button type="button" className="btn btn--ghost" onClick={() => setConfirmUnfriend(true)}>
          Unfriend
        </button>
      </>
    );
  } else if (status === "pending_out") {
    controls = (
      <>
        <span className="friend-pill">Friend request sent</span>
        <button type="button" className="btn btn--ghost" disabled={f.busy} onClick={() => f.remove(userId)}>
          Cancel request
        </button>
      </>
    );
  } else if (status === "pending_in") {
    controls = (
      <>
        <button type="button" className="btn btn--accent" disabled={f.busy} onClick={() => f.accept(rel.friendship_id)}>
          Accept
        </button>
        <button type="button" className="btn btn--ghost" disabled={f.busy} onClick={() => f.decline(rel.friendship_id)}>
          Decline
        </button>
      </>
    );
  } else {
    controls = (
      <button type="button" className="btn btn--accent" disabled={f.busy} onClick={() => f.sendRequest(userId)}>
        Add friend
      </button>
    );
  }

  return (
    <div className="friend-actions" role="group" aria-label="Friend actions">
      {controls}
      {f.error && (
        <p className="friend-note friend-note--error" role="alert">
          {f.error}
        </p>
      )}
    </div>
  );
}
