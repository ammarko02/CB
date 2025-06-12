import { UserRole, OfferCategory } from "@/types";

export const USER_ROLES: Record<UserRole, string> = {
  super_admin: "Super Admin",
  hr: "HR Manager",
  supplier: "Supplier",
  employee: "Employee",
};

export const OFFER_CATEGORIES: Record<OfferCategory, string> = {
  food: "Food & Dining",
  fitness: "Fitness & Health",
  entertainment: "Entertainment",
  travel: "Travel & Transportation",
  retail: "Retail & Shopping",
  technology: "Technology",
  other: "Other",
};

export const OFFER_STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  expired: "bg-gray-100 text-gray-800",
};

export const ROLE_PERMISSIONS = {
  super_admin: {
    canManageUsers: true,
    canManageOffers: true,
    canApproveOffers: true,
    canViewAnalytics: true,
    canManageSuppliers: true,
    canAccessAllDashboards: true,
  },
  hr: {
    canManageUsers: true,
    canManageOffers: false,
    canApproveOffers: false,
    canViewAnalytics: true,
    canManageSuppliers: false,
    canAccessAllDashboards: false,
  },
  supplier: {
    canManageUsers: false,
    canManageOffers: true,
    canApproveOffers: false,
    canViewAnalytics: false,
    canManageSuppliers: false,
    canAccessAllDashboards: false,
  },
  employee: {
    canManageUsers: false,
    canManageOffers: false,
    canApproveOffers: false,
    canViewAnalytics: false,
    canManageSuppliers: false,
    canAccessAllDashboards: false,
  },
};

export const NAVIGATION_ITEMS = {
  super_admin: [
    { label: "Dashboard", path: "/admin/dashboard", icon: "LayoutDashboard" },
    {
      label: "Offers Approval",
      path: "/admin/offers-approval",
      icon: "CheckSquare",
    },
    { label: "Analytics", path: "/admin/analytics", icon: "BarChart3" },
    { label: "Users", path: "/admin/users", icon: "Users" },
    { label: "Suppliers", path: "/admin/suppliers", icon: "Store" },
  ],
  hr: [
    { label: "Dashboard", path: "/hr/dashboard", icon: "LayoutDashboard" },
    { label: "Employees", path: "/hr/employees", icon: "Users" },
    { label: "Analytics", path: "/hr/analytics", icon: "BarChart3" },
    { label: "Reports", path: "/hr/reports", icon: "FileText" },
    { label: "Departments", path: "/hr/departments", icon: "Building" },
  ],
  supplier: [
    {
      label: "Dashboard",
      path: "/supplier/dashboard",
      icon: "LayoutDashboard",
    },
    { label: "My Offers", path: "/supplier/offers", icon: "Package" },
    { label: "Create Offer", path: "/supplier/create-offer", icon: "Plus" },
    { label: "Analytics", path: "/supplier/analytics", icon: "TrendingUp" },
  ],
  employee: [
    {
      label: "Dashboard",
      path: "/employee/dashboard",
      icon: "LayoutDashboard",
    },
    { label: "Browse Offers", path: "/employee/offers", icon: "Search" },
    { label: "My Redemptions", path: "/employee/redemptions", icon: "History" },
    { label: "My Coupons", path: "/employee/my-redemptions", icon: "FileText" },
    { label: "Favorites", path: "/employee/favorites", icon: "Heart" },
  ],
};

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
};

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const DATE_FORMATS = {
  display: "MMM dd, yyyy",
  input: "yyyy-MM-dd",
  datetime: "MMM dd, yyyy HH:mm",
  time: "HH:mm",
};

export const DEPARTMENTS = [
  "Engineering",
  "Marketing",
  "Sales",
  "Human Resources",
  "Finance",
  "Operations",
  "Customer Support",
  "Design",
  "Legal",
  "Executive",
];

export const POINT_SYSTEM = {
  MONTHLY_ALLOWANCE: 1000,
  SIGNUP_BONUS: 500,
  REFERRAL_BONUS: 200,
  REVIEW_BONUS: 50,
};

export const NOTIFICATION_TYPES = {
  OFFER_APPROVED: "offer_approved",
  OFFER_REJECTED: "offer_rejected",
  NEW_OFFER_AVAILABLE: "new_offer_available",
  REDEMPTION_CONFIRMED: "redemption_confirmed",
  POINTS_AWARDED: "points_awarded",
  ACCOUNT_CREATED: "account_created",
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/profile",
  },
  USERS: {
    LIST: "/users",
    CREATE: "/users",
    UPDATE: "/users",
    DELETE: "/users",
    BULK_UPDATE: "/users/bulk",
  },
  OFFERS: {
    LIST: "/offers",
    CREATE: "/offers",
    UPDATE: "/offers",
    DELETE: "/offers",
    APPROVE: "/offers/approve",
    REJECT: "/offers/reject",
    UPLOAD_IMAGE: "/offers/upload-image",
  },
  REDEMPTIONS: {
    LIST: "/redemptions",
    CREATE: "/redemptions",
    HISTORY: "/redemptions/history",
  },
  ANALYTICS: {
    DASHBOARD: "/analytics/dashboard",
    OFFERS: "/analytics/offers",
    USERS: "/analytics/users",
    REDEMPTIONS: "/analytics/redemptions",
  },
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: "happyPerksHub_token",
  REFRESH_TOKEN: "happyPerksHub_refresh",
  USER_PREFERENCES: "happyPerksHub_preferences",
  THEME: "happyPerksHub_theme",
};
