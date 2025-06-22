import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface DirectionAwareTextProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: "span" | "div" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  forceDirection?: "ltr" | "rtl" | "auto";
  className?: string;
}

export function DirectionAwareText({
  children,
  as: Component = "span",
  forceDirection = "auto",
  className,
  ...props
}: DirectionAwareTextProps) {
  const { isRTL } = useLanguage();

  const getDirection = () => {
    if (forceDirection !== "auto") return forceDirection;
    return isRTL ? "rtl" : "ltr";
  };

  const getTextAlign = () => {
    if (forceDirection === "ltr") return "left";
    if (forceDirection === "rtl") return "right";
    return isRTL ? "right" : "left";
  };

  const direction = getDirection();
  const textAlign = getTextAlign();

  // Force RTL styles for Arabic text
  const forcedStyles = isRTL
    ? {
        direction: "rtl" as const,
        textAlign: "right" as const,
        unicodeBidi: "isolate" as const,
        writingMode: "horizontal-tb" as const,
      }
    : {
        direction: "ltr" as const,
        textAlign: "left" as const,
      };

  return (
    <Component
      {...props}
      dir={direction}
      className={cn(
        isRTL ? "!text-right !direction-rtl" : "!text-left !direction-ltr",
        direction === "rtl" ? "rtl-content" : "ltr-content",
        className,
      )}
      style={{
        ...forcedStyles,
        ...props.style,
      }}
    >
      {children}
    </Component>
  );
}

// Helper components for common use cases
export const DirectionAwareHeading = ({
  level = 1,
  children,
  ...props
}: {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
} & Omit<DirectionAwareTextProps, "as">) => (
  <DirectionAwareText as={`h${level}` as any} {...props}>
    {children}
  </DirectionAwareText>
);

export const DirectionAwareParagraph = ({
  children,
  ...props
}: {
  children: React.ReactNode;
} & Omit<DirectionAwareTextProps, "as">) => (
  <DirectionAwareText as="p" {...props}>
    {children}
  </DirectionAwareText>
);

export const DirectionAwareDiv = ({
  children,
  ...props
}: {
  children: React.ReactNode;
} & Omit<DirectionAwareTextProps, "as">) => (
  <DirectionAwareText as="div" {...props}>
    {children}
  </DirectionAwareText>
);
