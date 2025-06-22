import React from "react";
import { useTranslation } from "react-i18next";
import {
  DirectionAwareText,
  DirectionAwareTextProps,
} from "./DirectionAwareText";

interface TranslatedTextProps
  extends Omit<DirectionAwareTextProps, "children"> {
  tKey: string;
  values?: Record<string, any>;
  fallback?: string;
  count?: number;
}

export function TranslatedText({
  tKey,
  values,
  fallback,
  count,
  ...props
}: TranslatedTextProps) {
  const { t } = useTranslation();

  const translatedText = React.useMemo(() => {
    try {
      return t(tKey, { ...values, count }) || fallback || tKey;
    } catch (error) {
      console.warn(`Translation missing for key: ${tKey}`);
      return fallback || tKey;
    }
  }, [t, tKey, values, count, fallback]);

  return <DirectionAwareText {...props}>{translatedText}</DirectionAwareText>;
}

// Helper components for common translations
export const TranslatedHeading = ({
  level = 1,
  tKey,
  ...props
}: {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  tKey: string;
} & Omit<TranslatedTextProps, "as">) => (
  <TranslatedText as={`h${level}` as any} tKey={tKey} {...props} />
);

export const TranslatedParagraph = ({
  tKey,
  ...props
}: {
  tKey: string;
} & Omit<TranslatedTextProps, "as">) => (
  <TranslatedText as="p" tKey={tKey} {...props} />
);

export const TranslatedLabel = ({
  tKey,
  ...props
}: {
  tKey: string;
} & Omit<TranslatedTextProps, "as">) => (
  <TranslatedText as="label" tKey={tKey} {...props} />
);
