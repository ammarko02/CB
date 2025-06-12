import {
  User,
  Offer,
  Redemption,
  DashboardStats,
  AnalyticsData,
  LoginCredentials,
  RegisterData,
  CreateOfferData,
  UpdateUserData,
  FilterOptions,
  PaginationParams,
  ApiResponse,
  UserRole,
  OfferStatus,
} from "@/types";
// SupabaseService temporarily disabled
// import { SupabaseService } from './supabaseService';
import { databaseService as mockDatabaseService } from "./database";

// Force disable Supabase temporarily and use Mock service only
const USE_SUPABASE = false; // Temporarily disabled to fix Load failed error

// Always use Mock database service
console.log("🏠 Supabase temporarily disabled, using Mock service");
const databaseService = mockDatabaseService;
console.log("📱 Using Mock database service only");

export const authService = {
  async login(
    credentials: LoginCredentials,
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      console.log("🔄 API Service: Login attempt");
      console.log("📨 Credentials:", {
        email: credentials.email,
        password: "***",
      });

      const result = await databaseService.authenticateUser(credentials);
      console.log("✅ API Service: Authentication successful");

      return {
        data: result,
        message: "تم تسجيل الدخول بنجاح",
        success: true,
      };
    } catch (error) {
      console.error("❌ API Service: Authentication failed:", error);
      throw error;
    }
  },

  async register(
    data: RegisterData,
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const user = await databaseService.createUser(data);
      return {
        data: { user, token: "auth-token" },
        message: "تم التسجيل بنجاح",
        success: true,
      };
    } catch (error) {
      throw error;
    }
  },

  async logout(): Promise<void> {
    // Since Supabase is temporarily disabled, just clear local storage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("current_user");
    console.log("🚪 Logged out - cleared local storage");
  },

  getCurrentUser(): User | null {
    const storedUser = localStorage.getItem("current_user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        localStorage.removeItem("current_user");
        return null;
      }
    }
    return null;
  },

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  },
};

export const userService = {
  async getUsers(
    params?: PaginationParams & { role?: UserRole },
  ): Promise<ApiResponse<User[]>> {
    return await databaseService.getUsers(params);
  },

  async createUser(userData: RegisterData): Promise<ApiResponse<User>> {
    try {
      const user = await databaseService.createUser(userData);
      return {
        data: user,
        message: "تم إنشاء المستخدم بنجاح",
        success: true,
      };
    } catch (error) {
      throw error;
    }
  },

  async updateUser(
    id: string,
    userData: UpdateUserData,
  ): Promise<ApiResponse<User>> {
    try {
      const user = await databaseService.updateUser(id, userData);
      return {
        data: user,
        message: "تم تحديث المستخدم بنجاح",
        success: true,
      };
    } catch (error) {
      throw error;
    }
  },

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    try {
      await databaseService.deleteUser(id);
      return {
        data: undefined as any,
        message: "تم حذف المستخدم بنجاح",
        success: true,
      };
    } catch (error) {
      throw error;
    }
  },
};

export const offerService = {
  async getOffers(
    filters?: FilterOptions & PaginationParams,
  ): Promise<ApiResponse<Offer[]>> {
    return await databaseService.getOffers(filters);
  },

  async createOffer(offerData: CreateOfferData): Promise<ApiResponse<Offer>> {
    try {
      const offer = await databaseService.createOffer(offerData);
      return {
        data: offer,
        message: "تم إنشاء العرض بنجاح وإرساله للموافقة",
        success: true,
      };
    } catch (error) {
      throw error;
    }
  },

  async updateOffer(
    id: string,
    offerData: Partial<CreateOfferData>,
  ): Promise<ApiResponse<Offer>> {
    try {
      const offer = await databaseService.updateOffer(id, offerData);
      return {
        data: offer,
        message: "تم تحديث العرض بنجاح",
        success: true,
      };
    } catch (error) {
      throw error;
    }
  },

  async updateOfferStatus(
    id: string,
    status: OfferStatus,
  ): Promise<ApiResponse<Offer>> {
    try {
      const offer = await databaseService.updateOfferStatus(id, status);
      return {
        data: offer,
        message: `تم ${status === "approved" ? "قبول" : "رفض"} العرض بنجاح`,
        success: true,
      };
    } catch (error) {
      throw error;
    }
  },

  async deleteOffer(id: string): Promise<ApiResponse<void>> {
    try {
      await databaseService.deleteOffer(id);
      return {
        data: undefined as any,
        message: "تم حذف العرض بنجاح",
        success: true,
      };
    } catch (error) {
      throw error;
    }
  },
};

export const redemptionService = {
  async redeemOffer(offerId: string): Promise<ApiResponse<Redemption>> {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error("المستخدم غير مسجل الدخول");
      }

      const redemption = await databaseService.redeemOffer(
        offerId,
        currentUser.id,
      );
      return {
        data: redemption,
        message: "تم استبدال العرض بنجاح",
        success: true,
      };
    } catch (error) {
      throw error;
    }
  },

  async getUserRedemptions(userId: string): Promise<ApiResponse<Redemption[]>> {
    try {
      const redemptions = await databaseService.getUserRedemptions(userId);
      return {
        data: redemptions,
        message: "تم جلب عمليات الاستبدال بنجاح",
        success: true,
      };
    } catch (error) {
      throw error;
    }
  },

  async getEmployeeRedemptions(
    employeeId: string,
  ): Promise<ApiResponse<Redemption[]>> {
    try {
      const redemptions =
        await databaseService.getEmployeeRedemptions(employeeId);
      return {
        data: redemptions,
        message: "تم جلب الكوبونات المستبدلة بنجاح",
        success: true,
      };
    } catch (error) {
      throw error;
    }
  },
};

export const analyticsService = {
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      const stats = await databaseService.getDashboardStats();
      return {
        data: stats,
        message: "تم جلب إحصائيات لوحة التحكم بنجاح",
        success: true,
      };
    } catch (error) {
      throw error;
    }
  },

  async getAnalyticsData(): Promise<ApiResponse<AnalyticsData>> {
    try {
      const data = await databaseService.getAnalyticsData();
      return {
        data,
        message: "تم جلب بيانات التحليلات بنجاح",
        success: true,
      };
    } catch (error) {
      throw error;
    }
  },
};
