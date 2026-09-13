import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(userId) {
    if (!supabase || !userId) {
      setProfile(null);
      return;
    }
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    setProfile(data || null);
  }

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data.session?.user || null;
      setUser(sessionUser);
      if (sessionUser) loadProfile(sessionUser.id);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user || null;
      setUser(sessionUser);
      if (sessionUser) {
        loadProfile(sessionUser.id);
      } else {
        setProfile(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      isConfigured: !!supabase,

      async signUp({ name, email, password, school, grade, intendedMajor, targetTest }) {
        if (!supabase) return { error: "Sign-in isn't configured yet." };

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        });
        if (error) return { error: error.message };

        // The DB trigger creates the profiles row (id, name, email) the
        // moment auth.users gets the new account. Fill in the optional
        // extras right after, if any were given.
        const newUserId = data.user?.id;
        const extras = {};
        if (school) extras.school = school;
        if (grade) extras.grade = grade;
        if (intendedMajor) extras.intended_major = intendedMajor;
        if (targetTest) extras.target_test = targetTest;

        if (newUserId && Object.keys(extras).length > 0) {
          await supabase.from("profiles").update(extras).eq("id", newUserId);
        }
        if (newUserId) await loadProfile(newUserId);

        return { error: null, needsEmailConfirmation: !data.session };
      },

      async signIn({ email, password }) {
        if (!supabase) return { error: "Sign-in isn't configured yet." };
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error ? error.message : null };
      },

      async signOut() {
        if (!supabase) return;
        await supabase.auth.signOut();
      },

      async updateProfile(fields) {
        if (!supabase || !user) return { error: "Not signed in." };
        const { error } = await supabase.from("profiles").update(fields).eq("id", user.id);
        if (!error) await loadProfile(user.id);
        return { error: error ? error.message : null };
      },
    }),
    [user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
