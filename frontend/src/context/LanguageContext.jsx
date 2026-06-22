import { createContext, useContext, useEffect, useState, useCallback } from "react";

const LanguageContext = createContext(null);

const STORAGE_KEY = "provelt-language";

function applyDocumentLang(language) {
  if (typeof document === "undefined") return;
  const isRTL = language === "ar";
  document.documentElement.dir = isRTL ? "rtl" : "ltr";
  document.documentElement.lang = isRTL ? "ar" : "en";
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") return "en";
    return window.localStorage.getItem(STORAGE_KEY) || "en";
  });

  // Keep <html> dir/lang and localStorage in sync with the current language.
  useEffect(() => {
    applyDocumentLang(language);
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      /* ignore storage errors */
    }
  }, [language]);

  const toggle = useCallback(() => {
    setLanguage((prev) => (prev === "en" ? "ar" : "en"));
  }, []);

  const value = {
    language,
    toggle,
    isRTL: language === "ar",
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}

export default LanguageContext;
