import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";

// The signed-in student's own full card data (get_my_card_data in
// supabase/share_cards.sql). `isSetUp` is false until that SQL has been run;
// callers then show a notice instead of breaking.
export function useMyCardData() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSetUp, setIsSetUp] = useState(true);

  const load = useCallback(async () => {
    if (!user || !supabase) {
      setData(null);
      setLoading(false);
      return;
    }
    const { data: result, error } = await supabase.rpc("get_my_card_data");
    if (error || !result) {
      setIsSetUp(false);
      setData(null);
    } else {
      setIsSetUp(true);
      setData(result);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
    window.addEventListener("sc:activity", load);
    return () => window.removeEventListener("sc:activity", load);
  }, [load]);

  return { data, loading, isSetUp };
}
