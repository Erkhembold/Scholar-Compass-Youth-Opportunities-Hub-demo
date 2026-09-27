import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";

function randomPin() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

// IELTS twin of useSatMatch.js — same lifecycle (create/join/cancel/
// start/submit), same realtime-plus-poll-fallback approach, just
// pointed at the ielts_matches table and join_ielts_match RPC, with a
// `skill` (reading/writing) passed at creation time.
export function useIeltsMatch(initialMatchId) {
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
        .channel(`ielts_match_${matchId}`)
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "ielts_matches", filter: `id=eq.${matchId}` },
          (payload) => setMatch(payload.new)
        )
        .on(
          "postgres_changes",
          { event: "DELETE", schema: "public", table: "ielts_matches", filter: `id=eq.${matchId}` },
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

  useEffect(() => {
    if (!supabase) return;
    const interval = setInterval(async () => {
      const id = matchIdRef.current;
      if (!id) return;
      const { data } = await supabase.from("ielts_matches").select("*").eq("id", id).single();
      if (data) setMatch(data);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!initialMatchId || !supabase) {
      setResuming(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data, error: fetchError } = await supabase
        .from("ielts_matches")
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => teardownChannel, [teardownChannel]);

  async function createMatch({ skill, questionCount, timePerQuestion }) {
    if (!supabase || !user) return;
    setBusy(true);
    setError(null);
    let created = null;
    let lastError = null;
    for (let i = 0; i < 6 && !created; i++) {
      const pin = randomPin();
      const { data, error: insertError } = await supabase
        .from("ielts_matches")
        .insert({
          pin,
          host_id: user.id,
          host_name: profile?.name || "Host",
          skill,
          question_count: questionCount,
          time_per_question_seconds: timePerQuestion,
        })
        .select()
        .single();
      if (!insertError) {
        created = data;
      } else if (insertError.code === "23505") {
        lastError = insertError;
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
    window.location.hash = `/ielts/challenge/${created.id}`;
  }

  async function joinMatch(pin) {
    if (!supabase || !user) return;
    setBusy(true);
    setError(null);
    const { data, error: rpcError } = await supabase.rpc("join_ielts_match", { p_pin: pin.trim() });
    if (rpcError) {
      setBusy(false);
      setError(rpcError.message);
      return;
    }
    const { data: named } = await supabase
      .from("ielts_matches")
      .update({ opponent_name: profile?.name || "Opponent" })
      .eq("id", data.id)
      .select()
      .single();
    setBusy(false);
    setMatch(named || data);
    subscribe(data.id);
    window.location.hash = `/ielts/challenge/${data.id}`;
  }

  async function cancelMatch() {
    if (!supabase || !match) return;
    await supabase.from("ielts_matches").delete().eq("id", match.id);
    teardownChannel();
    matchIdRef.current = null;
    setMatch(null);
    window.location.hash = "/ielts/challenge";
  }

  async function startMatch(questionRefs) {
    if (!supabase || !match) return;
    const { data } = await supabase
      .from("ielts_matches")
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
    const { data } = await supabase.from("ielts_matches").update(fields).eq("id", match.id).select().single();
    if (data) setMatch(data);
  }

  function leaveToLanding() {
    teardownChannel();
    matchIdRef.current = null;
    setMatch(null);
    setError(null);
    window.location.hash = "/ielts/challenge";
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
