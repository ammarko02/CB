import { UserRole } from "@/types";
import { ROLE_PERMISSIONS } from "./constants";

export function hasPermission(
  userRole: UserRole,
  permission: keyof typeof ROLE_PERMISSIONS.super_admin,
): boolean {
  return ROLE_PERMISSIONS[userRole]?.[permission] || false;
}

export function canAccessRoute(userRole: UserRole, route: string): boolean {
  const routeRoleMap: Record<string, UserRole[]> = {
    "/admin": ["super_admin"],
    "/hr": ["super_admin", "hr"],
    "/supplier": ["super_admin", "supplier"],
    "/employee": ["super_admin", "hr", "supplier", "employee"],
  };

  for (const [prefix, allowedRoles] of Object.entries(routeRoleMap)) {
    if (route.startsWith(prefix)) {
      return allowedRoles.includes(userRole);
    }
  }

  return false;
}

export function getDefaultRoute(userRole: UserRole): string {
  const defaultRoutes: Record<UserRole, string> = {
    super_admin: "/admin/dashboard",
    hr: "/hr/dashboard",
    supplier: "/supplier/dashboard",
    employee: "/employee/dashboard",
  };

  return defaultRoutes[userRole] || "/employee/dashboard";
}

export function canManageUser(
  currentUserRole: UserRole,
  targetUserRole: UserRole,
): boolean {
  if (currentUserRole === "super_admin") return true;
  if (currentUserRole === "hr" && targetUserRole === "employee") return true;
  return false;
}

export function canEditOffer(
  currentUserRole: UserRole,
  offerSupplierId: string,
  currentUserId: string,
): boolean {
  if (currentUserRole === "super_admin") return true;
  if (currentUserRole === "supplier" && offerSupplierId === currentUserId)
    return true;
  return false;
}

export function getVisibleOfferStatuses(userRole: UserRole): string[] {
  switch (userRole) {
    case "super_admin":
      return ["pending", "approved", "rejected", "expired"];
    case "hr":
      return ["approved", "expired"];
    case "supplier":
      return ["pending", "approved", "rejected", "expired"];
    case "employee":
      return ["approved"];
    default:
      return ["approved"];
  }
}

export function canPerformAction(userRole: UserRole, action: string): boolean {
  const actions: Record<string, UserRole[]> = {
    create_offer: ["supplier"],
    approve_offer: ["super_admin"],
    reject_offer: ["super_admin"],
    delete_offer: ["super_admin", "supplier"],
    create_user: ["super_admin", "hr"],
    edit_user: ["super_admin", "hr"],
    delete_user: ["super_admin"],
    view_analytics: ["super_admin", "hr"],
    redeem_offer: ["employee"],
    manage_suppliers: ["super_admin"],
    bulk_operations: ["super_admin", "hr"],
  };

  return actions[action]?.includes(userRole) || false;
}
