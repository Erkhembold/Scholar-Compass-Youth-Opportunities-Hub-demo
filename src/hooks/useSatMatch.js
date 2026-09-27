import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";

function randomPin() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

// Manages the lifecycle of one SAT 1v1 Challenge match: creating a
// lobby, joining one by PIN, subscribing to live changes so both
// players see the same state, starting the match, and submitting each
// player's own final score. Deliberately keeps a poll-based refresh
// running alongside the realtime subscription as a safety net — this
// was built without the ability to test against a live Supabase
// project (sandboxed dev environment can't reach *.supabase.co), so a
// fallback that doesn't depend on realtime working perfectly matters
// more than usual here.
export function useSatMatch(initialMatchId) {
  const { user, profile } = useAuth();
  const [match, setMatch] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [resuming, setResuming] = useState(!!initialMatchId);
  const channelRef = useRef(null);
  const matchIdRef = useRef(null);

  const teardownChannel = useCallback(() => {
    if (channelRef.current && supabase) {
      supabase.removeChannel(channelRef.current);
    }
    channelRef.current = null;
  }, []);

  const subscribe = useCallback(
    (matchId) => {
      if (!supabase) return;
      teardownChannel();
      matchIdRef.current = matchId;
      const channel = supabase
        .channel(`sat_match_${matchId}`)
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "sat_matches", filter: `id=eq.${matchId}` },
          (payload) => setMatch(payload.new)
        )
        .on(
          "postgres_changes",
          { event: "DELETE", schema: "public", table: "sat_matches", filter: `id=eq.${matchId}` },
          () => {
            setMatch(null);
            matchIdRef.current = null;
            setError("The other player canceled the match.");
          }
        )
        .subscribe();
      channelRef.current = channel;
    },
    [teardownChannel]
  );

  // Safety-net poll — refetches the row every few seconds so the app
  // still works even if a realtime event is missed or never arrives.
  useEffect(() => {
    if (!supabase) return;
    const interval = setInterval(async () => {
      const id = matchIdRef.current;
      if (!id) return;
      const { data } = await supabase.from("sat_matches").select("*").eq("id", id).single();
      if (data) setMatch(data);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Resume a match from a URL (e.g. after a page refresh mid-game).
  useEffect(() => {
    if (!initialMatchId || !supabase) {
      setResuming(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data, error: fetchError } = await supabase
        .from("sat_matches")
        .select("*")
        .eq("id", initialMatchId)
        .single();
      if (cancelled) return;
      if (fetchError || !data) {
        setError("That match couldn't be found — it may have ended or been canceled.");
      } else {
        setMatch(data);
        subscribe(data.id);
      }
      setResuming(false);
    })();
    return () => {
      cancelled = true;
    };
    // Only ever run this for the matchId the page mounted with.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => teardownChannel, [teardownChannel]);

  async function createMatch({ questionCount, timePerQuestion }) {
    if (!supabase || !user) return;
    setBusy(true);
    setError(null);
    let created = null;
    let lastError = null;
    for (let i = 0; i < 6 && !created; i++) {
      const pin = randomPin();
      const { data, error: insertError } = await supabase
        .from("sat_matches")
        .insert({
          pin,
          host_id: user.id,
          host_name: profile?.name || "Host",
          question_count: questionCount,
          time_per_question_seconds: timePerQuestion,
        })
        .select()
        .single();
      if (!insertError) {
        created = data;
      } else if (insertError.code === "23505") {
        lastError = insertError; // PIN collision — try another one
      } else {
        setBusy(false);
        setError(insertError.message);
        return;
      }
    }
    setBusy(false);
    if (!created) {
      setError(lastError?.message || "Couldn't find a free match code — try again.");
      return;
    }
    setMatch(created);
    subscribe(created.id);
    window.location.hash = `/sat/challenge/${created.id}`;
  }

  async function joinMatch(pin) {
    if (!supabase || !user) return;
    setBusy(true);
    setError(null);
    const { data, error: rpcError } = await supabase.rpc("join_sat_match", { p_pin: pin.trim() });
    if (rpcError) {
      setBusy(false);
      setError(rpcError.message);
      return;
    }
    const { data: named } = await supabase
      .from("sat_matches")
      .update({ opponent_name: profile?.name || "Opponent" })
      .eq("id", data.id)
      .select()
      .single();
    setBusy(false);
    setMatch(named || data);
    subscribe(data.id);
    window.location.hash = `/sat/challenge/${data.id}`;
  }

  async function cancelMatch() {
    if (!supabase || !match) return;
    await supabase.from("sat_matches").delete().eq("id", match.id);
    teardownChannel();
    matchIdRef.current = null;
    setMatch(null);
    window.location.hash = "/sat/challenge";
  }

  async function startMatch(questionRefs) {
    if (!supabase || !match) return;
    const { data } = await supabase
      .from("sat_matches")
      .update({ question_ids: questionRefs, started_at: new Date().toISOString() })
      .eq("id", match.id)
      .select()
      .single();
    if (data) setMatch(data);
  }

  async function submitResult({ isHost, score }) {
    if (!supabase || !match) return;
    const fields = isHost
      ? { host_score: score, host_finished: true }
      : { opponent_score: score, opponent_finished: true };
    const { data } = await supabase.from("sat_matches").update(fields).eq("id", match.id).select().single();
    if (data) setMatch(data);
  }

  function leaveToLanding() {
    teardownChannel();
    matchIdRef.current = null;
    setMatch(null);
    setError(null);
    window.location.hash = "/sat/challenge";
  }

  return {
    match,
    error,
    busy,
    resuming,
    createMatch,
    joinMatch,
    cancelMatch,
    startMatch,
    submitResult,
    leaveToLanding,
    setError,
  };
}
