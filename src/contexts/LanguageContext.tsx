import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface LanguageContextType {
  currentLanguage: string;
  isRTL: boolean;
  changeLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    // Listen for language changes
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng);

      // Update document direction and language
      const isArabic = lng === "ar";
      const direction = isArabic ? "rtl" : "ltr";

      // Force update all direction-related attributes
      document.documentElement.dir = direction;
      document.documentElement.lang = lng;
      document.documentElement.setAttribute("data-direction", direction);

      // Update body with comprehensive RTL/LTR support
      document.body.dir = direction;
      document.body.setAttribute("data-language", lng);
      document.body.setAttribute("data-direction", direction);
      document.body.style.direction = direction;
      document.body.style.textAlign = isArabic ? "right" : "left";

      // Add/remove direction classes
      if (isArabic) {
        document.documentElement.classList.add("rtl");
        document.documentElement.classList.remove("ltr");
        document.body.classList.add("rtl");
        document.body.classList.remove("ltr");
      } else {
        document.documentElement.classList.add("ltr");
        document.documentElement.classList.remove("rtl");
        document.body.classList.add("ltr");
        document.body.classList.remove("rtl");
      }

      // Force re-render of all styled components
      const event = new CustomEvent("directionchange", {
        detail: { direction, language: lng, isRTL: isArabic },
      });
      document.dispatchEvent(event);

      // Force style recalculation
      document.body.offsetHeight;

      // Update CSS custom properties for direction
      document.documentElement.style.setProperty("--text-direction", direction);
      document.documentElement.style.setProperty(
        "--text-align",
        isArabic ? "right" : "left",
      );
    };

    i18n.on("languageChanged", handleLanguageChange);

    // Set initial state
    handleLanguageChange(i18n.language || "en");

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
  };

  const value: LanguageContextType = {
    currentLanguage,
    isRTL: currentLanguage === "ar",
    changeLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
