import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";

const POLL_MS = 2500;

// Shared-state hook for the SAT Math 1v1.
//
// Unlike the IELTS / SAT Reading-Writing hooks, this one never writes to a
// table. Every action is a Supabase RPC (create/join/start/leave/submit) and
// the server decides who may do what; the browser just displays whatever
// get_sat_math_match returns. Realtime pushes a "something changed" nudge and
// a 2.5s poll acts as the safety net (and doubles as the connection heartbeat).
export function useSatMathMatch(initialMatchId) {
  const { user, profile } = useAuth();
  const [match, setMatch] = useState(null);
  const [myAnswers, setMyAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [resuming, setResuming] = useState(!!initialMatchId);
  const [online, setOnline] = useState(true);

  const matchIdRef = useRef(null);
  const channelRef = useRef(null);
  const offsetRef = useRef(0); // serverNow - Date.now()
  const pendingRef = useRef(new Set());

  const getServerNow = useCallback(() => Date.now() + offsetRef.current, []);

  const teardownChannel = useCallback(() => {
    if (channelRef.current && supabase) supabase.removeChannel(channelRef.current);
    channelRef.current = null;
  }, []);

  const refresh = useCallback(async () => {
    const id = matchIdRef.current;
    if (!id || !supabase) return;
    let data;
    let rpcError;
    try {
      ({ data, error: rpcError } = await supabase.rpc("get_sat_math_match", { p_match_id: id }));
    } catch (e) {
      rpcError = e;
    }
    if (matchIdRef.current !== id) return; // user moved on while we were waiting
    if (rpcError) {
      if (/not found/i.test(rpcError.message || "")) {
        matchIdRef.current = null;
        teardownChannel();
        setMatch(null);
        setError("That challenge couldn't be found. It may belong to someone else or have been removed.");
      } else {
        setOnline(false); // network hiccup: keep showing the last known state and keep retrying
      }
      return;
    }
    setOnline(true);
    offsetRef.current = Date.parse(data.server_now) - Date.now();
    setMatch(data.match);
    setResults(data.results || null);
    const serverAnswers = {};
    for (const a of data.my_answers || []) serverAnswers[a.question_index] = a.answer;
    // union, never remove: answers are immutable once accepted
    setMyAnswers((prev) => ({ ...prev, ...serverAnswers }));
  }, [teardownChannel]);

  const subscribe = useCallback(
    (id) => {
      if (!supabase) return;
      teardownChannel();
      channelRef.current = supabase
        .channel(`sat_math_match_${id}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "sat_math_matches", filter: `id=eq.${id}` },
          () => refresh()
        )
        .subscribe();
    },
    [refresh, teardownChannel]
  );

  const adopt = useCallback(
    (row) => {
      matchIdRef.current = row.id;
      setMatch(row);
      setMyAnswers({});
      setResults(null);
      subscribe(row.id);
      refresh();
    },
    [refresh, subscribe]
  );

  // Resume from the URL (page refresh, reconnect, back button, shared link).
  useEffect(() => {
    if (!initialMatchId) {
      setResuming(false);
      return;
    }
    if (matchIdRef.current === initialMatchId) {
      setResuming(false);
      return;
    }
    matchIdRef.current = initialMatchId;
    setResuming(true);
    subscribe(initialMatchId);
    refresh().finally(() => setResuming(false));
  }, [initialMatchId, refresh, subscribe]);

  // Poll (also the heartbeat) + refresh right away when the tab/network comes back.
  useEffect(() => {
    const interval = setInterval(refresh, POLL_MS);
    const nudge = () => refresh();
    document.addEventListener("visibilitychange", nudge);
    window.addEventListener("online", nudge);
    window.addEventListener("focus", nudge);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", nudge);
      window.removeEventListener("online", nudge);
      window.removeEventListener("focus", nudge);
    };
  }, [refresh]);

  useEffect(() => teardownChannel, [teardownChannel]);

  async function createMatch({ questionCount, seconds }) {
    if (!supabase || !user) return;
    setBusy(true);
    setError(null);
    const { data, error: rpcError } = await supabase.rpc("create_sat_math_match", {
      p_question_count: questionCount,
      p_seconds: seconds,
      p_name: profile?.name || null,
    });
    setBusy(false);
    if (rpcError) {
      setError(rpcError.message);
      return;
    }
    adopt(data);
    window.location.hash = `/sat/math/challenge/${data.id}`;
  }

  async function joinMatch(pin) {
    if (!supabase || !user) return;
    setBusy(true);
    setError(null);
    const { data, error: rpcError } = await supabase.rpc("join_sat_math_match", {
      p_pin: pin,
      p_name: profile?.name || null,
    });
    setBusy(false);
    if (rpcError) {
      setError(rpcError.message);
      return;
    }
    adopt(data);
    window.location.hash = `/sat/math/challenge/${data.id}`;
  }

  async function startMatch() {
    if (!supabase || !matchIdRef.current) return;
    setBusy(true);
    setError(null);
    const { error: rpcError } = await supabase.rpc("start_sat_math_match", { p_match_id: matchIdRef.current });
    setBusy(false);
    if (rpcError) setError(rpcError.message);
    await refresh();
  }

  async function leaveMatch() {
    const id = matchIdRef.current;
    if (supabase && id) {
      try {
        await supabase.rpc("leave_sat_math_match", { p_match_id: id });
      } catch {
        /* leaving is best-effort */
      }
    }
    resetLocal();
  }

  function resetLocal() {
    teardownChannel();
    matchIdRef.current = null;
    setMatch(null);
    setMyAnswers({});
    setResults(null);
    setError(null);
    window.location.hash = "/sat/math/challenge";
  }

  // Locks in one answer. Returns "accepted" | "duplicate" | "late" | "early" |
  // "invalid" | "not_active" | "failed". Retries a few times on network errors
  // (the server still enforces the time window, so retrying cannot cheat).
  async function submitAnswer(index, answer) {
    const id = matchIdRef.current;
    if (!supabase || !id) return "failed";
    const key = `${id}:${index}`;
    if (pendingRef.current.has(key)) return "duplicate";
    pendingRef.current.add(key);
    setMyAnswers((prev) => (prev[index] ? prev : { ...prev, [index]: String(answer) }));

    let result = "failed";
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const { data, error: rpcError } = await supabase.rpc("submit_sat_math_answer", {
          p_match_id: id,
          p_index: index,
          p_answer: String(answer),
        });
        if (!rpcError) {
          result = data?.result || "failed";
          break;
        }
      } catch {
        /* fall through to retry */
      }
      await new Promise((r) => setTimeout(r, 800));
    }
    pendingRef.current.delete(key);
    if (result === "late" || result === "early" || result === "invalid" || result === "not_active" || result === "failed") {
      setMyAnswers((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    }
    refresh();
    return result;
  }

  return {
    match,
    myAnswers,
    results,
    error,
    busy,
    resuming,
    online,
    userId: user?.id || null,
    getServerNow,
    createMatch,
    joinMatch,
    startMatch,
    leaveMatch,
    resetLocal,
    submitAnswer,
    setError,
  };
}
