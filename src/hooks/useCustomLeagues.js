import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";
import { leagueErrorMessage } from "../utils/customLeague.js";

// Custom (friend) leagues, from supabase/custom_leagues.sql.
// Reads and writes both go through RPCs. Realtime only tells us "something
// changed, re-fetch": the tables are row-level secured, so a student is only
// ever notified about leagues/invites they are allowed to see. A slow poll
// backs this up in case the realtime socket drops.
const CHANGED = "sc:leagues";
const TABLES = ["custom_leagues", "custom_league_members", "custom_league_invites"];

function useLeagueRealtime(userId, reload) {
  useEffect(() => {
    if (!userId || !supabase) return undefined;
    let timer = null;
    const bump = () => {
      clearTimeout(timer);
      timer = setTimeout(reload, 250);
    };
    const channel = supabase.channel(`custom-leagues-${userId}-${Math.random().toString(36).slice(2, 8)}`);
    TABLES.forEach((table) => {
      channel.on("postgres_changes", { event: "*", schema: "public", table }, bump);
    });
    channel.subscribe();
    const poll = setInterval(reload, 30000);
    window.addEventListener(CHANGED, reload);
    return () => {
      clearTimeout(timer);
      clearInterval(poll);
      window.removeEventListener(CHANGED, reload);
      supabase.removeChannel(channel);
    };
  }, [userId, reload]);
}

// Runs one league action; always re-fetches afterwards.
export async function runLeagueAction(fn, args) {
  if (!supabase) return { ok: false, error: "Not connected." };
  const { data, error } = await supabase.rpc(fn, args);
  window.dispatchEvent(new Event(CHANGED));
  if (error) return { ok: false, error: leagueErrorMessage(error) };
  return { ok: true, data };
}

export function useMyLeagues() {
  const { user } = useAuth();
  const [leagues, setLeagues] = useState([]);
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSetUp, setIsSetUp] = useState(true);
  const alive = useRef(true);

  const load = useCallback(async () => {
    if (!user || !supabase) {
      setLeagues([]);
      setInvites([]);
      setLoading(false);
      return;
    }
    const [a, b] = await Promise.all([supabase.rpc("get_my_custom_leagues"), supabase.rpc("get_my_league_invites")]);
    if (!alive.current) return;
    if (a.error || b.error) {
      setIsSetUp(false);
    } else {
      setIsSetUp(true);
      setLeagues(Array.isArray(a.data) ? a.data : []);
      setInvites(Array.isArray(b.data) ? b.data : []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    alive.current = true;
    load();
    return () => {
      alive.current = false;
    };
  }, [load]);
  useLeagueRealtime(user?.id, load);

  return { leagues, invites, loading, isSetUp, reload: load, userId: user?.id || null };
}

export function useCustomLeague(leagueId) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSetUp, setIsSetUp] = useState(true);
  const alive = useRef(true);

  const load = useCallback(async () => {
    if (!user || !supabase || !leagueId) {
      setData(null);
      setLoading(false);
      return;
    }
    const { data: d, error } = await supabase.rpc("get_custom_league", { p_league: leagueId });
    if (!alive.current) return;
    if (error) {
      setIsSetUp(false);
    } else {
      setIsSetUp(true);
      setData(d || null);
    }
    setLoading(false);
  }, [user, leagueId]);

  useEffect(() => {
    alive.current = true;
    setLoading(true);
    load();
    return () => {
      alive.current = false;
    };
  }, [load]);
  useLeagueRealtime(user?.id, load);

  return { data, loading, isSetUp, reload: load, userId: user?.id || null };
}
