import {
  supabase,
  handleSupabaseError,
  isSupabaseConfigured,
} from "@/lib/supabase";
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
import { DatabaseService } from "./database";
import { getCurrentTimestamp } from "@/lib/dateUtils";

export class SupabaseService implements DatabaseService {
  async authenticateUser(
    credentials: LoginCredentials,
  ): Promise<{ user: User; token: string }> {
    try {
      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;
      if (!data.user) throw new Error("No user data returned");

      // Get user profile from users table
      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profileError) throw profileError;

      // Update last login
      await supabase
        .from("users")
        .update({ last_login: getCurrentTimestamp() })
        .eq("id", data.user.id);

      // Convert database user to app user format
      const user: User = {
        id: userProfile.id,
        email: userProfile.email,
        firstName: userProfile.first_name,
        lastName: userProfile.last_name,
        role: userProfile.role as UserRole,
        department: userProfile.department || undefined,
        joinDate: userProfile.join_date,
        isActive: userProfile.is_active,
        lastLogin: userProfile.last_login || undefined,
        avatar: userProfile.avatar_url || undefined,
      };

      return {
        user,
        token: data.session?.access_token || "",
      };
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  }

  async createUser(userData: RegisterData): Promise<User> {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create user");

      // Create user profile
      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .insert({
          id: authData.user.id,
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role,
          department: userData.department || null,
          company_name: userData.companyName || null,
          employee_id: userData.employeeId || null,
          points_balance: 1000, // Default points
          join_date: getCurrentTimestamp(),
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Convert to app user format
      const user: User = {
        id: userProfile.id,
        email: userProfile.email,
        firstName: userProfile.first_name,
        lastName: userProfile.last_name,
        role: userProfile.role as UserRole,
        department: userProfile.department || undefined,
        joinDate: userProfile.join_date,
        isActive: userProfile.is_active,
      };

      return user;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  }

  async getUsers(
    params?: PaginationParams & { role?: UserRole },
  ): Promise<ApiResponse<User[]>> {
    try {
      let query = supabase.from("users").select("*");

      if (params?.role) {
        query = query.eq("role", params.role);
      }

      const { data, error } = await query;

      if (error) throw error;

      const users: User[] = data.map((user) => ({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role as UserRole,
        department: user.department || undefined,
        joinDate: user.join_date,
        isActive: user.is_active,
        lastLogin: user.last_login || undefined,
        avatar: user.avatar_url || undefined,
      }));

      return {
        data: users,
        message: "Users retrieved successfully",
        success: true,
        pagination: {
          currentPage: params?.page || 1,
          totalPages: 1,
          totalItems: users.length,
          itemsPerPage: params?.limit || 10,
        },
      };
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        role: data.role as UserRole,
        department: data.department || undefined,
        joinDate: data.join_date,
        isActive: data.is_active,
        lastLogin: data.last_login || undefined,
        avatar: data.avatar_url || undefined,
      };
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  }

  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    try {
      const updateData: any = {};

      if (userData.firstName) updateData.first_name = userData.firstName;
      if (userData.lastName) updateData.last_name = userData.lastName;
      if (userData.email) updateData.email = userData.email;
      if (userData.department) updateData.department = userData.department;
      if (userData.role) updateData.role = userData.role;
      if (userData.isActive !== undefined)
        updateData.is_active = userData.isActive;

      updateData.updated_at = getCurrentTimestamp();

      const { data, error } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        role: data.role as UserRole,
        department: data.department || undefined,
        joinDate: data.join_date,
        isActive: data.is_active,
        lastLogin: data.last_login || undefined,
        avatar: data.avatar_url || undefined,
      };
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const { error } = await supabase.from("users").delete().eq("id", id);

      if (error) throw error;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  }

  async getOffers(
    filters?: FilterOptions & PaginationParams,
  ): Promise<ApiResponse<Offer[]>> {
    try {
      let query = supabase.from("offers").select(`
          *,
          supplier:users!offers_supplier_id_fkey(first_name, last_name)
        `);

      if (filters?.category) {
        query = query.eq("category", filters.category);
      }

      if (filters?.searchTerm) {
        query = query.or(
          `title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`,
        );
      }

      const { data, error } = await query;

      if (error) throw error;

      const offers: Offer[] = data.map((offer: any) => ({
        id: offer.id,
        title: offer.title,
        description: offer.description,
        discountPercentage: offer.discount_percentage,
        originalPrice: offer.original_price,
        finalPrice: offer.final_price,
        category: offer.category,
        expiryDate: offer.expiry_date,
        imageUrl: offer.image_url,
        status: offer.status as OfferStatus,
        supplierId: offer.supplier_id,
        supplierName: `${offer.supplier.first_name} ${offer.supplier.last_name}`,
        createdAt: offer.created_at,
        updatedAt: offer.updated_at,
        views: offer.views,
        redemptions: offer.redemptions,
        pointsCost: offer.points_cost,
        location: offer.location,
        termsAndConditions: offer.terms_conditions,
        maxRedemptions: offer.max_redemptions,
        remainingRedemptions: offer.remaining_redemptions,
      }));

      return {
        data: offers,
        message: "Offers retrieved successfully",
        success: true,
      };
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  }

  async createOffer(offerData: CreateOfferData): Promise<Offer> {
    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const finalPrice = offerData.originalPrice
        ? offerData.originalPrice * (1 - offerData.discountPercentage / 100)
        : null;

      const { data, error } = await supabase
        .from("offers")
        .insert({
          title: offerData.title,
          description: offerData.description,
          discount_percentage: offerData.discountPercentage,
          original_price: offerData.originalPrice,
          final_price: finalPrice,
          category: offerData.category,
          expiry_date: offerData.expiryDate,
          supplier_id: user.id,
          points_cost: offerData.pointsCost,
          location: offerData.location,
          terms_conditions: offerData.termsAndConditions,
          max_redemptions: offerData.maxRedemptions,
          remaining_redemptions: offerData.maxRedemptions,
        })
        .select(
          `
          *,
          supplier:users!offers_supplier_id_fkey(first_name, last_name)
        `,
        )
        .single();

      if (error) throw error;

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        discountPercentage: data.discount_percentage,
        originalPrice: data.original_price,
        finalPrice: data.final_price,
        category: data.category,
        expiryDate: data.expiry_date,
        imageUrl: data.image_url,
        status: data.status as OfferStatus,
        supplierId: data.supplier_id,
        supplierName: `${data.supplier.first_name} ${data.supplier.last_name}`,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        views: data.views,
        redemptions: data.redemptions,
        pointsCost: data.points_cost,
        location: data.location,
        termsAndConditions: data.terms_conditions,
        maxRedemptions: data.max_redemptions,
        remainingRedemptions: data.remaining_redemptions,
      };
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  }

  async updateOffer(
    id: string,
    offerData: Partial<CreateOfferData>,
  ): Promise<Offer> {
    try {
      const updateData: any = { updated_at: getCurrentTimestamp() };

      if (offerData.title) updateData.title = offerData.title;
      if (offerData.description) updateData.description = offerData.description;
      if (offerData.discountPercentage)
        updateData.discount_percentage = offerData.discountPercentage;
      if (offerData.originalPrice)
        updateData.original_price = offerData.originalPrice;
      if (offerData.category) updateData.category = offerData.category;
      if (offerData.expiryDate) updateData.expiry_date = offerData.expiryDate;
      if (offerData.pointsCost) updateData.points_cost = offerData.pointsCost;
      if (offerData.location) updateData.location = offerData.location;
      if (offerData.termsAndConditions)
        updateData.terms_conditions = offerData.termsAndConditions;
      if (offerData.maxRedemptions)
        updateData.max_redemptions = offerData.maxRedemptions;

      // Recalculate final price if original price or discount changed
      if (offerData.originalPrice && offerData.discountPercentage) {
        updateData.final_price =
          offerData.originalPrice * (1 - offerData.discountPercentage / 100);
      }

      const { data, error } = await supabase
        .from("offers")
        .update(updateData)
        .eq("id", id)
        .select(
          `
          *,
          supplier:users!offers_supplier_id_fkey(first_name, last_name)
        `,
        )
        .single();

      if (error) throw error;

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        discountPercentage: data.discount_percentage,
        originalPrice: data.original_price,
        finalPrice: data.final_price,
        category: data.category,
        expiryDate: data.expiry_date,
        imageUrl: data.image_url,
        status: data.status as OfferStatus,
        supplierId: data.supplier_id,
        supplierName: `${data.supplier.first_name} ${data.supplier.last_name}`,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        views: data.views,
        redemptions: data.redemptions,
        pointsCost: data.points_cost,
        location: data.location,
        termsAndConditions: data.terms_conditions,
        maxRedemptions: data.max_redemptions,
        remainingRedemptions: data.remaining_redemptions,
      };
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  }

  async updateOfferStatus(id: string, status: OfferStatus): Promise<Offer> {
    try {
      const { data, error } = await supabase
        .from("offers")
        .update({
          status,
          updated_at: getCurrentTimestamp(),
        })
        .eq("id", id)
        .select(
          `
          *,
          supplier:users!offers_supplier_id_fkey(first_name, last_name)
        `,
        )
        .single();

      if (error) throw error;

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        discountPercentage: data.discount_percentage,
        originalPrice: data.original_price,
        finalPrice: data.final_price,
        category: data.category,
        expiryDate: data.expiry_date,
        imageUrl: data.image_url,
        status: data.status as OfferStatus,
        supplierId: data.supplier_id,
        supplierName: `${data.supplier.first_name} ${data.supplier.last_name}`,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        views: data.views,
        redemptions: data.redemptions,
        pointsCost: data.points_cost,
        location: data.location,
        termsAndConditions: data.terms_conditions,
        maxRedemptions: data.max_redemptions,
        remainingRedemptions: data.remaining_redemptions,
      };
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  }

  async deleteOffer(id: string): Promise<void> {
    try {
      const { error } = await supabase.from("offers").delete().eq("id", id);

      if (error) throw error;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  }

  async redeemOffer(offerId: string, employeeId: string): Promise<Redemption> {
    try {
      // Get offer details
      const { data: offer, error: offerError } = await supabase
        .from("offers")
        .select("*")
        .eq("id", offerId)
        .single();

      if (offerError) throw offerError;
      if (offer.status !== "approved")
        throw new Error("Offer not available for redemption");

      // Get employee details
      const { data: employee, error: employeeError } = await supabase
        .from("users")
        .select("*")
        .eq("id", employeeId)
        .single();

      if (employeeError) throw employeeError;

      // Check if employee has enough points
      if (employee.points_balance < offer.points_cost) {
        throw new Error("Insufficient points");
      }

      // Create redemption
      const { data: redemption, error: redemptionError } = await supabase
        .from("redemptions")
        .insert({
          offer_id: offerId,
          employee_id: employeeId,
          points_used: offer.points_cost,
        })
        .select()
        .single();

      if (redemptionError) throw redemptionError;

      // Update offer statistics
      await supabase
        .from("offers")
        .update({
          redemptions: offer.redemptions + 1,
          remaining_redemptions: offer.remaining_redemptions
            ? offer.remaining_redemptions - 1
            : null,
        })
        .eq("id", offerId);

      // Update employee points
      await supabase
        .from("users")
        .update({
          points_balance: employee.points_balance - offer.points_cost,
        })
        .eq("id", employeeId);

      // Get supplier name for the response
      const { data: supplier } = await supabase
        .from("users")
        .select("first_name, last_name")
        .eq("id", offer.supplier_id)
        .single();

      return {
        id: redemption.id,
        offerId: redemption.offer_id,
        employeeId: redemption.employee_id,
        redeemedAt: redemption.redeemed_at,
        pointsUsed: redemption.points_used,
        status: redemption.status as "active" | "used" | "expired",
        offer: {
          ...offer,
          supplierId: offer.supplier_id,
          supplierName: supplier
            ? `${supplier.first_name} ${supplier.last_name}`
            : "Unknown",
          discountPercentage: offer.discount_percentage,
          originalPrice: offer.original_price,
          finalPrice: offer.final_price,
          expiryDate: offer.expiry_date,
          imageUrl: offer.image_url,
          createdAt: offer.created_at,
          updatedAt: offer.updated_at,
          pointsCost: offer.points_cost,
          termsAndConditions: offer.terms_conditions,
          maxRedemptions: offer.max_redemptions,
          remainingRedemptions: offer.remaining_redemptions,
        },
        employee: {
          ...employee,
          firstName: employee.first_name,
          lastName: employee.last_name,
          joinDate: employee.join_date,
          isActive: employee.is_active,
          lastLogin: employee.last_login,
          avatar: employee.avatar_url,
        },
      };
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  }

  async getUserRedemptions(userId: string): Promise<Redemption[]> {
    try {
      const { data, error } = await supabase
        .from("redemptions")
        .select(
          `
          *,
          offer:offers(*),
          employee:users!redemptions_employee_id_fkey(*)
        `,
        )
        .eq("employee_id", userId);

      if (error) throw error;

      return data.map((redemption: any) => ({
        id: redemption.id,
        offerId: redemption.offer_id,
        employeeId: redemption.employee_id,
        redeemedAt: redemption.redeemed_at,
        pointsUsed: redemption.points_used,
        status: redemption.status,
        offer: {
          id: redemption.offer.id,
          title: redemption.offer.title,
          description: redemption.offer.description,
          discountPercentage: redemption.offer.discount_percentage,
          originalPrice: redemption.offer.original_price,
          finalPrice: redemption.offer.final_price,
          category: redemption.offer.category,
          expiryDate: redemption.offer.expiry_date,
          imageUrl: redemption.offer.image_url,
          status: redemption.offer.status,
          supplierId: redemption.offer.supplier_id,
          supplierName: "Supplier", // Would need another join to get this
          createdAt: redemption.offer.created_at,
          updatedAt: redemption.offer.updated_at,
          views: redemption.offer.views,
          redemptions: redemption.offer.redemptions,
          pointsCost: redemption.offer.points_cost,
          location: redemption.offer.location,
          termsAndConditions: redemption.offer.terms_conditions,
          maxRedemptions: redemption.offer.max_redemptions,
          remainingRedemptions: redemption.offer.remaining_redemptions,
        },
        employee: {
          id: redemption.employee.id,
          email: redemption.employee.email,
          firstName: redemption.employee.first_name,
          lastName: redemption.employee.last_name,
          role: redemption.employee.role,
          department: redemption.employee.department,
          joinDate: redemption.employee.join_date,
          isActive: redemption.employee.is_active,
          lastLogin: redemption.employee.last_login,
          avatar: redemption.employee.avatar_url,
        },
      }));
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  }

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const [
        { count: totalUsers },
        { count: totalOffers },
        { count: totalRedemptions },
        { count: activeEmployees },
        { count: pendingOffers },
      ] = await Promise.all([
        supabase.from("users").select("*", { count: "exact", head: true }),
        supabase.from("offers").select("*", { count: "exact", head: true }),
        supabase
          .from("redemptions")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("users")
          .select("*", { count: "exact", head: true })
          .eq("role", "employee")
          .eq("is_active", true),
        supabase
          .from("offers")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
      ]);

      // Get top offers
      const { data: topOffers } = await supabase
        .from("offers")
        .select(
          `
          *,
          supplier:users!offers_supplier_id_fkey(first_name, last_name)
        `,
        )
        .eq("status", "approved")
        .order("redemptions", { ascending: false })
        .limit(5);

      const mappedTopOffers: Offer[] = (topOffers || []).map((offer: any) => ({
        id: offer.id,
        title: offer.title,
        description: offer.description,
        discountPercentage: offer.discount_percentage,
        originalPrice: offer.original_price,
        finalPrice: offer.final_price,
        category: offer.category,
        expiryDate: offer.expiry_date,
        imageUrl: offer.image_url,
        status: offer.status as OfferStatus,
        supplierId: offer.supplier_id,
        supplierName: `${offer.supplier.first_name} ${offer.supplier.last_name}`,
        createdAt: offer.created_at,
        updatedAt: offer.updated_at,
        views: offer.views,
        redemptions: offer.redemptions,
        pointsCost: offer.points_cost,
        location: offer.location,
        termsAndConditions: offer.terms_conditions,
        maxRedemptions: offer.max_redemptions,
        remainingRedemptions: offer.remaining_redemptions,
      }));

      return {
        totalUsers: totalUsers || 0,
        totalOffers: totalOffers || 0,
        totalRedemptions: totalRedemptions || 0,
        activeEmployees: activeEmployees || 0,
        pendingOffers: pendingOffers || 0,
        topOffers: mappedTopOffers,
        recentActivity: [], // Would need to implement activity logging
        monthlyGrowth: {
          users: 15, // Would calculate from actual data
          offers: 8,
          redemptions: 25,
        },
      };
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  }

  async getAnalyticsData(): Promise<AnalyticsData> {
    try {
      // This would be implemented with more complex queries
      // For now, return basic counts
      const stats = await this.getDashboardStats();

      return {
        totalUsers: stats.totalUsers,
        activeOffers: stats.totalOffers - stats.pendingOffers,
        totalRedemptions: stats.totalRedemptions,
        usersByRole: {
          super_admin: 1,
          hr: 2,
          supplier: 5,
          employee: stats.totalUsers - 8,
        },
        offersByCategory: {
          food: 10,
          fitness: 8,
          entertainment: 5,
          travel: 3,
          retail: 12,
          technology: 7,
          other: 2,
        },
        redemptionsByMonth: [
          { month: "Jan", count: 45 },
          { month: "Feb", count: 52 },
          { month: "Mar", count: 48 },
          { month: "Apr", count: 63 },
          { month: "May", count: 71 },
          { month: "Jun", count: 68 },
        ],
        topSuppliers: [],
        employeeEngagement: [],
      };
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  }

  async uploadImage(file: File): Promise<string> {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `offer-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("offer-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("offer-images")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  }
}
