import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";

// My friends and friend requests, from public.get_my_friendships()
// (supabase/friends.sql). Every change goes through an RPC — the table has no
// client write access — and the list is re-fetched afterwards so the UI always
// shows what the database says. `isSetUp` is false until friends.sql has been
// run; the UI then shows a gentle notice instead of breaking.
const CHANGED = "sc:friends";

export function useFriendships() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSetUp, setIsSetUp] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!user || !supabase) {
      setRows([]);
      setLoading(false);
      return;
    }
    const { data, error: err } = await supabase.rpc("get_my_friendships");
    if (err) {
      setIsSetUp(false);
      setRows([]);
    } else {
      setIsSetUp(true);
      setRows(Array.isArray(data) ? data : []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
    // Keep every mounted copy of this hook (profile list + profile page
    // button) in sync after any change.
    window.addEventListener(CHANGED, load);
    return () => window.removeEventListener(CHANGED, load);
  }, [load]);

  const run = useCallback(async (fn, args) => {
    if (!supabase) return false;
    setBusy(true);
    setError("");
    const { error: err } = await supabase.rpc(fn, args);
    setBusy(false);
    if (err) {
      setError("Something went wrong. Please try again.");
    }
    window.dispatchEvent(new Event(CHANGED));
    return !err;
  }, []);

  return {
    loading,
    isSetUp,
    busy,
    error,
    friends: rows.filter((r) => r.status === "friends"),
    incoming: rows.filter((r) => r.status === "pending_in"),
    outgoing: rows.filter((r) => r.status === "pending_out"),
    statusWith: (userId) => rows.find((r) => r.user_id === userId) || null,
    sendRequest: (userId) => run("send_friend_request", { p_to: userId }),
    accept: (friendshipId) => run("respond_friend_request", { p_id: friendshipId, p_accept: true }),
    decline: (friendshipId) => run("respond_friend_request", { p_id: friendshipId, p_accept: false }),
    remove: (userId) => run("remove_friendship", { p_other: userId }),
  };
}
