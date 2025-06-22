import React, { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface RTLProviderProps {
  children: React.ReactNode;
}

export function RTLProvider({ children }: RTLProviderProps) {
  const { isRTL, currentLanguage } = useLanguage();

  useEffect(() => {
    // Force update CSS custom properties
    const root = document.documentElement;
    const body = document.body;

    root.style.setProperty("--direction", isRTL ? "rtl" : "ltr");
    root.style.setProperty("--text-align", isRTL ? "right" : "left");
    root.style.setProperty("--text-align-reverse", isRTL ? "left" : "right");
    root.style.setProperty(
      "--margin-start",
      isRTL ? "margin-right" : "margin-left",
    );
    root.style.setProperty(
      "--margin-end",
      isRTL ? "margin-left" : "margin-right",
    );
    root.style.setProperty(
      "--padding-start",
      isRTL ? "padding-right" : "padding-left",
    );
    root.style.setProperty(
      "--padding-end",
      isRTL ? "padding-left" : "padding-right",
    );
    root.style.setProperty(
      "--border-start",
      isRTL ? "border-right" : "border-left",
    );
    root.style.setProperty(
      "--border-end",
      isRTL ? "border-left" : "border-right",
    );
    root.style.setProperty("--start", isRTL ? "right" : "left");
    root.style.setProperty("--end", isRTL ? "left" : "right");

    // FORCE DOCUMENT LEVEL RTL/LTR
    root.setAttribute("dir", isRTL ? "rtl" : "ltr");
    body.setAttribute("dir", isRTL ? "rtl" : "ltr");

    // Force direction on html and body
    root.style.direction = isRTL ? "rtl" : "ltr";
    body.style.direction = isRTL ? "rtl" : "ltr";
    body.style.textAlign = isRTL ? "right" : "left";

    // Update language-specific font families
    if (isRTL) {
      root.style.setProperty(
        "--font-family",
        '"Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif", "Arabic UI Text", "Arabic UI Display", "Noto Sans Arabic"',
      );
    } else {
      root.style.setProperty(
        "--font-family",
        '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", sans-serif',
      );
    }

    // Add global class to body for easier styling
    document.body.classList.toggle("rtl-layout", isRTL);
    document.body.classList.toggle("ltr-layout", !isRTL);

    // NUCLEAR OPTION: Force direction on ALL existing elements
    const allElements = document.querySelectorAll("*");
    allElements.forEach((element) => {
      if (isRTL) {
        element.setAttribute("dir", "rtl");
        (element as HTMLElement).style.direction = "rtl";
        (element as HTMLElement).style.textAlign = "right";
      } else {
        element.setAttribute("dir", "ltr");
        (element as HTMLElement).style.direction = "ltr";
        (element as HTMLElement).style.textAlign = "left";
      }
    });
  }, [isRTL, currentLanguage]);

  return (
    <div
      className={cn(
        "min-h-screen w-full",
        isRTL ? "rtl-content text-right" : "ltr-content text-left",
      )}
      dir={isRTL ? "rtl" : "ltr"}
      data-direction={isRTL ? "rtl" : "ltr"}
      data-language={currentLanguage}
    >
      {children}
    </div>
  );
}

// Hook for components to easily check RTL status
export function useRTL() {
  const { isRTL, currentLanguage } = useLanguage();

  return {
    isRTL,
    isLTR: !isRTL,
    currentLanguage,
    dir: isRTL ? "rtl" : "ltr",
    textAlign: isRTL ? "right" : "left",
    textAlignReverse: isRTL ? "left" : "right",
    flexDirection: isRTL ? "row-reverse" : "row",
    marginStart: isRTL ? "mr" : "ml",
    marginEnd: isRTL ? "ml" : "mr",
    paddingStart: isRTL ? "pr" : "pl",
    paddingEnd: isRTL ? "pl" : "pr",
    borderStart: isRTL ? "border-r" : "border-l",
    borderEnd: isRTL ? "border-l" : "border-r",
    start: isRTL ? "right" : "left",
    end: isRTL ? "left" : "right",
  };
}
