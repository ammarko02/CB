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
      document.documentElement.dir = isArabic ? "rtl" : "ltr";
      document.documentElement.lang = lng;

      // Also update body attributes for consistent styling
      document.body.dir = isArabic ? "rtl" : "ltr";
      document.body.setAttribute("data-language", lng);
      document.body.style.direction = isArabic ? "rtl" : "ltr";
      document.body.style.textAlign = isArabic ? "right" : "left";

      // Add/remove RTL class on document element and all containers
      if (isArabic) {
        document.documentElement.classList.add("rtl");
        document.body.classList.add("rtl");
        document.documentElement.setAttribute("data-rtl", "true");
        // Force refresh of styles
        document.body.offsetHeight;
      } else {
        document.documentElement.classList.remove("rtl");
        document.body.classList.remove("rtl");
        document.documentElement.removeAttribute("data-rtl");
        document.body.style.direction = "ltr";
        document.body.style.textAlign = "left";
      }
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
