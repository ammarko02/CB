import {
  format,
  formatDistanceToNow,
  isAfter,
  isBefore,
  startOfDay,
  addDays,
  differenceInDays,
} from "date-fns";
import { enUS, ar } from "date-fns/locale";

// Get locale based on current language
export const getDateLocale = (language: string) => {
  switch (language) {
    case "ar":
      return ar;
    default:
      return enUS;
  }
};

// Format date for display
export const formatDate = (
  date: string | Date,
  pattern: string = "MMM dd, yyyy",
  language: string = "en",
): string => {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }

    return format(dateObj, pattern, {
      locale: getDateLocale(language),
    });
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid Date";
  }
};

// Format date for input fields (YYYY-MM-DD)
export const formatDateForInput = (date: string | Date): string => {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return "";
    }

    return format(dateObj, "yyyy-MM-dd");
  } catch (error) {
    console.error("Date formatting error:", error);
    return "";
  }
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (
  date: string | Date,
  language: string = "en",
): string => {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }

    return formatDistanceToNow(dateObj, {
      addSuffix: true,
      locale: getDateLocale(language),
    });
  } catch (error) {
    console.error("Relative time formatting error:", error);
    return "Invalid Date";
  }
};

// Check if a date is in the future
export const isFutureDate = (date: string | Date): boolean => {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return false;
    }

    return isAfter(dateObj, new Date());
  } catch (error) {
    return false;
  }
};

// Check if a date is in the past
export const isPastDate = (date: string | Date): boolean => {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return false;
    }

    return isBefore(dateObj, startOfDay(new Date()));
  } catch (error) {
    return false;
  }
};

// Check if offer is expiring soon (within 7 days)
export const isExpiringSoon = (
  expiryDate: string | Date,
  daysThreshold: number = 7,
): boolean => {
  try {
    const dateObj =
      typeof expiryDate === "string" ? new Date(expiryDate) : expiryDate;
    if (isNaN(dateObj.getTime())) {
      return false;
    }

    const today = startOfDay(new Date());
    const threshold = addDays(today, daysThreshold);

    return isAfter(dateObj, today) && isBefore(dateObj, threshold);
  } catch (error) {
    return false;
  }
};

// Get days until expiry
export const getDaysUntilExpiry = (expiryDate: string | Date): number => {
  try {
    const dateObj =
      typeof expiryDate === "string" ? new Date(expiryDate) : expiryDate;
    if (isNaN(dateObj.getTime())) {
      return 0;
    }

    const today = startOfDay(new Date());
    const days = differenceInDays(dateObj, today);

    return Math.max(0, days);
  } catch (error) {
    return 0;
  }
};

// Generate a current timestamp
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

// Generate a future date (for testing/demo purposes)
export const getFutureDate = (daysFromNow: number): string => {
  const futureDate = addDays(new Date(), daysFromNow);
  return futureDate.toISOString();
};

// Validate date string
export const isValidDate = (dateString: string): boolean => {
  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && dateString !== "";
  } catch (error) {
    return false;
  }
};

// Get minimum date for input (today)
export const getMinDateForInput = (): string => {
  return formatDateForInput(new Date());
};

// Get date range for filters
export const getDateRange = (range: "today" | "week" | "month" | "year") => {
  const today = startOfDay(new Date());

  switch (range) {
    case "today":
      return {
        start: today,
        end: addDays(today, 1),
      };
    case "week":
      return {
        start: today,
        end: addDays(today, 7),
      };
    case "month":
      return {
        start: today,
        end: addDays(today, 30),
      };
    case "year":
      return {
        start: today,
        end: addDays(today, 365),
      };
    default:
      return {
        start: today,
        end: addDays(today, 30),
      };
  }
};
