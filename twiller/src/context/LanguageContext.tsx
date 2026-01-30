"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import i18n from "../i18n";

export type Lang = "en" | "hi" | "es" | "pt" | "zh" | "fr";

interface LangContextType {
  language: Lang;
  requestLanguageChange: (lang: Lang) => void;
  confirmLanguageChange: (lang: Lang) => void;
}

const LanguageContext = createContext<LangContextType | null>(null);

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguage] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved) {
      setLanguage(saved);
      i18n.changeLanguage(saved);
    }
  }, []);

  // Step 1: user selects language (OTP flow starts)
  const requestLanguageChange = (lang: Lang) => {
    setLanguage(lang); // temporary (UI purpose)
  };

  // Step 2: OTP verified → final switch
  const confirmLanguageChange = (lang: Lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <LanguageContext.Provider
      value={{ language, requestLanguageChange, confirmLanguageChange }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return ctx;
};
