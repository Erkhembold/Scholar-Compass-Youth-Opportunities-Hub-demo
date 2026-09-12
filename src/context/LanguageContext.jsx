import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "../data/translations.js";

const LanguageContext = createContext(null);
const STORAGE_KEY = "scholarcompass-lang";

function getInitialLang() {
  if (typeof window === "undefined") return "en";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "mn") return stored;
  } catch (e) {
    // ignore
  }
  return "en";
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      // ignore
    }
    document.documentElement.setAttribute("lang", lang === "mn" ? "mn" : "en");
  }, [lang]);

  const value = useMemo(() => {
    function t(text) {
      if (lang !== "mn") return text;
      return translations[text] || text;
    }
    return {
      lang,
      setLang,
      toggleLang: () => setLang((l) => (l === "en" ? "mn" : "en")),
      t,
    };
  }, [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
