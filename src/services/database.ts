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
import { getCurrentTimestamp, getFutureDate } from "@/lib/dateUtils";

// Database configuration examples - Replace with your actual database setup
// Note: These are just examples for documentation purposes and not used by the mock service
// The actual Supabase configuration is in src/lib/supabase.ts
const DB_CONFIG = {
  // Example configurations for different databases
  // PostgreSQL
  postgres: {
    host: import.meta.env.VITE_DB_HOST || "localhost",
    port: parseInt(import.meta.env.VITE_DB_PORT || "5432"),
    database: import.meta.env.VITE_DB_NAME || "happy_perks_hub",
    username: import.meta.env.VITE_DB_USER || "postgres",
    password: import.meta.env.VITE_DB_PASSWORD || "password",
  },
  // MongoDB
  mongodb: {
    uri:
      import.meta.env.VITE_MONGODB_URI ||
      "mongodb://localhost:27017/happy_perks_hub",
  },
  // Supabase (use the existing Supabase configuration instead)
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "",
    key: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
  },
  // Firebase
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  },
};

// Database Schema Definitions
export const DATABASE_SCHEMAS = {
  // SQL Schema (PostgreSQL/MySQL)
  sql: `
    -- Users table
    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      role VARCHAR(20) NOT NULL CHECK (role IN ('super_admin', 'hr', 'supplier', 'employee')),
      department VARCHAR(100),
      company_name VARCHAR(255),
      employee_id VARCHAR(50),
      is_active BOOLEAN DEFAULT true,
      avatar_url TEXT,
      phone VARCHAR(20),
      points_balance INTEGER DEFAULT 1000,
      join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Offers table
    CREATE TABLE offers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      discount_percentage INTEGER NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
      original_price DECIMAL(10,2),
      final_price DECIMAL(10,2),
      category VARCHAR(50) NOT NULL CHECK (category IN ('food', 'fitness', 'entertainment', 'travel', 'retail', 'technology', 'other')),
      expiry_date DATE NOT NULL,
      image_url TEXT,
      status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
      supplier_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      points_cost INTEGER NOT NULL CHECK (points_cost > 0),
      location VARCHAR(255),
      terms_conditions TEXT,
      max_redemptions INTEGER,
      remaining_redemptions INTEGER,
      views INTEGER DEFAULT 0,
      redemptions INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Redemptions table
    CREATE TABLE redemptions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
      employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      points_used INTEGER NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired')),
      redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      used_at TIMESTAMP,
      UNIQUE(offer_id, employee_id)
    );

    -- Activity logs table
    CREATE TABLE activity_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      action VARCHAR(100) NOT NULL,
      details JSONB,
      ip_address INET,
      user_agent TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Notifications table
    CREATE TABLE notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      type VARCHAR(50) NOT NULL,
      is_read BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Create indexes for better performance
    CREATE INDEX idx_users_email ON users(email);
    CREATE INDEX idx_users_role ON users(role);
    CREATE INDEX idx_offers_status ON offers(status);
    CREATE INDEX idx_offers_category ON offers(category);
    CREATE INDEX idx_offers_supplier_id ON offers(supplier_id);
    CREATE INDEX idx_offers_expiry_date ON offers(expiry_date);
    CREATE INDEX idx_redemptions_employee_id ON redemptions(employee_id);
    CREATE INDEX idx_redemptions_offer_id ON redemptions(offer_id);
    CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
    CREATE INDEX idx_notifications_user_id ON notifications(user_id);
  `,

  // MongoDB Schema (Mongoose-like structure)
  mongodb: {
    users: {
      _id: "ObjectId",
      email: { type: "String", required: true, unique: true },
      passwordHash: { type: "String", required: true },
      firstName: { type: "String", required: true },
      lastName: { type: "String", required: true },
      role: {
        type: "String",
        enum: ["super_admin", "hr", "supplier", "employee"],
        required: true,
      },
      department: "String",
      companyName: "String",
      employeeId: "String",
      isActive: { type: "Boolean", default: true },
      avatarUrl: "String",
      phone: "String",
      pointsBalance: { type: "Number", default: 1000 },
      joinDate: { type: "Date", default: Date.now },
      lastLogin: "Date",
      createdAt: { type: "Date", default: Date.now },
      updatedAt: { type: "Date", default: Date.now },
    },
    offers: {
      _id: "ObjectId",
      title: { type: "String", required: true },
      description: { type: "String", required: true },
      discountPercentage: { type: "Number", required: true, min: 1, max: 100 },
      originalPrice: "Number",
      finalPrice: "Number",
      category: {
        type: "String",
        enum: [
          "food",
          "fitness",
          "entertainment",
          "travel",
          "retail",
          "technology",
          "other",
        ],
        required: true,
      },
      expiryDate: { type: "Date", required: true },
      imageUrl: "String",
      status: {
        type: "String",
        enum: ["pending", "approved", "rejected", "expired"],
        default: "pending",
      },
      supplierId: { type: "ObjectId", ref: "User", required: true },
      pointsCost: { type: "Number", required: true, min: 1 },
      location: "String",
      termsConditions: "String",
      maxRedemptions: "Number",
      remainingRedemptions: "Number",
      views: { type: "Number", default: 0 },
      redemptions: { type: "Number", default: 0 },
      createdAt: { type: "Date", default: Date.now },
      updatedAt: { type: "Date", default: Date.now },
    },
    redemptions: {
      _id: "ObjectId",
      offerId: { type: "ObjectId", ref: "Offer", required: true },
      employeeId: { type: "ObjectId", ref: "User", required: true },
      pointsUsed: { type: "Number", required: true },
      status: {
        type: "String",
        enum: ["active", "used", "expired"],
        default: "active",
      },
      redeemedAt: { type: "Date", default: Date.now },
      usedAt: "Date",
    },
  },
};

// Database service interface
export interface DatabaseService {
  // Authentication
  authenticateUser(
    credentials: LoginCredentials,
  ): Promise<{ user: User; token: string }>;
  createUser(userData: RegisterData): Promise<User>;

  // Users
  getUsers(
    params?: PaginationParams & { role?: UserRole },
  ): Promise<ApiResponse<User[]>>;
  getUserById(id: string): Promise<User>;
  updateUser(id: string, userData: UpdateUserData): Promise<User>;
  deleteUser(id: string): Promise<void>;

  // Offers
  getOffers(
    filters?: FilterOptions & PaginationParams,
  ): Promise<ApiResponse<Offer[]>>;
  createOffer(offerData: CreateOfferData): Promise<Offer>;
  updateOffer(id: string, offerData: Partial<CreateOfferData>): Promise<Offer>;
  updateOfferStatus(id: string, status: OfferStatus): Promise<Offer>;
  deleteOffer(id: string): Promise<void>;

  // Redemptions
  redeemOffer(offerId: string, employeeId: string): Promise<Redemption>;
  getUserRedemptions(userId: string): Promise<Redemption[]>;

  // Analytics
  getDashboardStats(): Promise<DashboardStats>;
  getAnalyticsData(): Promise<AnalyticsData>;

  // File uploads
  uploadImage(file: File): Promise<string>;
}

// Example implementation for different databases
export class PostgreSQLService implements DatabaseService {
  private client: any; // Replace with actual PostgreSQL client (pg, node-postgres, etc.)

  constructor() {
    // Initialize PostgreSQL connection
    // this.client = new Client(DB_CONFIG.postgres);
  }

  async authenticateUser(
    credentials: LoginCredentials,
  ): Promise<{ user: User; token: string }> {
    // Implement PostgreSQL authentication
    const query = `
      SELECT * FROM users
      WHERE email = $1 AND password_hash = crypt($2, password_hash)
    `;
    // const result = await this.client.query(query, [credentials.email, credentials.password]);

    // Mock implementation for now
    throw new Error("PostgreSQL service not fully implemented");
  }

  async createUser(userData: RegisterData): Promise<User> {
    // Implement PostgreSQL user creation
    throw new Error("PostgreSQL service not fully implemented");
  }

  // Implement other methods...
  async getUsers(): Promise<ApiResponse<User[]>> {
    throw new Error("PostgreSQL service not fully implemented");
  }

  async getUserById(): Promise<User> {
    throw new Error("PostgreSQL service not fully implemented");
  }

  async updateUser(): Promise<User> {
    throw new Error("PostgreSQL service not fully implemented");
  }

  async deleteUser(): Promise<void> {
    throw new Error("PostgreSQL service not fully implemented");
  }

  async getOffers(): Promise<ApiResponse<Offer[]>> {
    throw new Error("PostgreSQL service not fully implemented");
  }

  async createOffer(): Promise<Offer> {
    throw new Error("PostgreSQL service not fully implemented");
  }

  async updateOffer(): Promise<Offer> {
    throw new Error("PostgreSQL service not fully implemented");
  }

  async updateOfferStatus(): Promise<Offer> {
    throw new Error("PostgreSQL service not fully implemented");
  }

  async deleteOffer(): Promise<void> {
    throw new Error("PostgreSQL service not fully implemented");
  }

  async redeemOffer(): Promise<Redemption> {
    throw new Error("PostgreSQL service not fully implemented");
  }

  async getUserRedemptions(): Promise<Redemption[]> {
    throw new Error("PostgreSQL service not fully implemented");
  }

  async getDashboardStats(): Promise<DashboardStats> {
    throw new Error("PostgreSQL service not fully implemented");
  }

  async getAnalyticsData(): Promise<AnalyticsData> {
    throw new Error("PostgreSQL service not fully implemented");
  }

  async uploadImage(): Promise<string> {
    throw new Error("PostgreSQL service not fully implemented");
  }
}

// Enhanced mock service with realistic data and proper date handling
export class RealtimeMockService implements DatabaseService {
  private users: User[] = [];
  private offers: Offer[] = [];
  private redemptions: Redemption[] = [];

  constructor() {
    console.log("🎭 Mock Service: Initializing with sample data");
    this.initializeData();
    console.log(
      "✅ Mock Service: Ready with",
      this.users.length,
      "users and",
      this.offers.length,
      "offers",
    );
  }

  private initializeData() {
    // Create realistic users with proper timestamps
    this.users = [
      {
        id: "1",
        email: "admin@company.com",
        firstName: "محمد",
        lastName: "أحمد",
        role: "super_admin",
        joinDate: getCurrentTimestamp(),
        isActive: true,
        lastLogin: getCurrentTimestamp(),
      },
      {
        id: "2",
        email: "hr@company.com",
        firstName: "فاطمة",
        lastName: "علي",
        role: "hr",
        department: "Human Resources",
        joinDate: getCurrentTimestamp(),
        isActive: true,
        lastLogin: getCurrentTimestamp(),
      },
      {
        id: "3",
        email: "supplier@example.com",
        firstName: "عبدالله",
        lastName: "محمد",
        role: "supplier",
        joinDate: getCurrentTimestamp(),
        isActive: true,
        lastLogin: getCurrentTimestamp(),
      },
      {
        id: "4",
        email: "employee@company.com",
        firstName: "سارة",
        lastName: "خالد",
        role: "employee",
        department: "Engineering",
        joinDate: getCurrentTimestamp(),
        isActive: true,
        lastLogin: getCurrentTimestamp(),
      },
    ];

    // Create realistic offers with proper dates
    this.offers = [
      {
        id: "1",
        title: "خصم 20% في مطعم البيتزا",
        description: "استمتع بأشهى البيتزا مع خصم 20% على جميع عناصر القائمة",
        discountPercentage: 20,
        category: "food",
        expiryDate: getFutureDate(30), // 30 days from now
        imageUrl: "/placeholder.svg",
        status: "approved",
        supplierId: "3",
        supplierName: "عبدالله محمد",
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
        views: 145,
        redemptions: 23,
        pointsCost: 200,
        location: "وسط المدينة",
        termsConditions: "صالح للتناول في المطعم فقط",
        maxRedemptions: 100,
        remainingRedemptions: 77,
        redemptionType: "branch",
        branchAddress: "شارع الأمير محمد بن عبدالعزيز، وسط المدينة، الرياض",
        usageLimit: "once_per_employee",
      },
      {
        id: "2",
        title: "عضوية نادي رياضي بخصم 30%",
        description:
          "احصل على لياقة بدنية مثالية مع مرافقنا الرياضية المتميزة بسعر مخفض",
        discountPercentage: 30,
        category: "fitness",
        expiryDate: getFutureDate(45), // 45 days from now
        imageUrl: "/placeholder.svg",
        status: "pending",
        supplierId: "3",
        supplierName: "عبدالله محمد",
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
        views: 89,
        redemptions: 0,
        pointsCost: 300,
        location: "مركز المدينة",
        maxRedemptions: 50,
        remainingRedemptions: 50,
        redemptionType: "online",
        websiteUrl: "https://fitness-club.example.com",
        usageLimit: "multiple_uses",
        usesPerEmployee: 3,
        discountCodeType: "auto_generated",
      },
      {
        id: "3",
        title: "تسوق ملابس بخصم 25%",
        description:
          "اكتشف أحدث الصيحات في عالم الموضة مع تشكيلة متنوعة من الملابس",
        discountPercentage: 25,
        category: "retail",
        expiryDate: getFutureDate(20),
        imageUrl: "/placeholder.svg",
        status: "approved",
        supplierId: "3",
        supplierName: "عبدالله محمد",
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
        views: 67,
        redemptions: 12,
        pointsCost: 250,
        location: "العليا",
        termsConditions: "لا يشمل الخصم البنود المخفضة سابقاً",
        maxRedemptions: 75,
        remainingRedemptions: 63,
        redemptionType: "branch",
        branchAddress: "طريق الملك فهد، حي العليا، الرياض",
        usageLimit: "multiple_uses",
        usesPerEmployee: 2,
      },
      {
        id: "4",
        title: "دورة تعلم البرمجة بخصم 40%",
        description:
          "تعلم أساسيات البرمجة مع مدربين محترفين عبر منصتنا التعليمية",
        discountPercentage: 40,
        category: "technology",
        expiryDate: getFutureDate(60),
        imageUrl: "/placeholder.svg",
        status: "approved",
        supplierId: "3",
        supplierName: "عبدالله محمد",
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
        views: 234,
        redemptions: 45,
        pointsCost: 400,
        location: "أونلاين",
        termsConditions: "الكورس متاح لمدة 6 أشهر من تاريخ التفعيل",
        maxRedemptions: 200,
        remainingRedemptions: 155,
        redemptionType: "online",
        websiteUrl: "https://learn-programming.example.com",
        usageLimit: "once_per_employee",
        discountCodeType: "supplier_provided",
        supplierDiscountCode: "PROG40OFF",
      },
      {
        id: "5",
        title: "رحلة سياحية بخصم 15%",
        description:
          "استمتع برحلة لا تُنسى إلى أجمل الوجهات ا��سياحية مع باقات متنوعة",
        discountPercentage: 15,
        category: "travel",
        expiryDate: getFutureDate(90),
        imageUrl: "/placeholder.svg",
        status: "approved",
        supplierId: "3",
        supplierName: "عبدالله محمد",
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
        views: 189,
        redemptions: 8,
        pointsCost: 500,
        location: "مكتب السفر",
        termsConditions: "يشمل الخصم رحلات معينة فقط، يُرجى التأكد عند الحجز",
        maxRedemptions: 25,
        remainingRedemptions: 17,
        redemptionType: "branch",
        branchAddress: "شارع العلية، برج الكندي، الطابق الثالث، جدة",
        usageLimit: "unlimited",
      },
    ];

    // Create realistic redemptions
    this.redemptions = [
      {
        id: "1",
        offerId: "1",
        employeeId: "4",
        redeemedAt: getCurrentTimestamp(),
        pointsUsed: 200,
        status: "active",
        offer: this.offers[0],
        employee: this.users[3] as any,
      },
    ];
  }

  // Simulate network delay
  private delay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async authenticateUser(
    credentials: LoginCredentials,
  ): Promise<{ user: User; token: string }> {
    await this.delay();

    console.log("🔐 Mock Service: Authenticating user");
    console.log("📧 Email:", credentials.email);
    console.log("🔑 Password:", credentials.password);
    console.log(
      "👥 Available users:",
      this.users.map((u) => u.email),
    );

    const user = this.users.find((u) => u.email === credentials.email);
    console.log("👤 Found user:", user ? user.email : "Not found");

    if (user && credentials.password === "password") {
      // Update last login
      user.lastLogin = getCurrentTimestamp();

      console.log("✅ Authentication successful for:", user.email);
      return {
        user,
        token: "mock-jwt-token-" + Date.now(),
      };
    }

    console.log("❌ Authentication failed - Invalid credentials");
    throw new Error("بيانات الدخول غير صحيحة");
  }

  async createUser(userData: RegisterData): Promise<User> {
    await this.delay();

    const newUser: User = {
      id: String(this.users.length + 1),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      department: userData.department,
      joinDate: getCurrentTimestamp(),
      isActive: true,
    };

    this.users.push(newUser);
    return newUser;
  }

  async getUsers(
    params?: PaginationParams & { role?: UserRole },
  ): Promise<ApiResponse<User[]>> {
    await this.delay();

    let filteredUsers = [...this.users];

    if (params?.role) {
      filteredUsers = filteredUsers.filter((user) => user.role === params.role);
    }

    return {
      data: filteredUsers,
      message: "Users retrieved successfully",
      success: true,
      pagination: {
        currentPage: params?.page || 1,
        totalPages: 1,
        totalItems: filteredUsers.length,
        itemsPerPage: params?.limit || 10,
      },
    };
  }

  async getUserById(id: string): Promise<User> {
    await this.delay();

    const user = this.users.find((u) => u.id === id);
    if (!user) throw new Error("User not found");

    return user;
  }

  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    await this.delay();

    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) throw new Error("User not found");

    this.users[userIndex] = { ...this.users[userIndex], ...userData };
    return this.users[userIndex];
  }

  async deleteUser(id: string): Promise<void> {
    await this.delay();

    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) throw new Error("User not found");

    this.users.splice(userIndex, 1);
  }

  async getOffers(
    filters?: FilterOptions & PaginationParams,
  ): Promise<ApiResponse<Offer[]>> {
    await this.delay();

    let filteredOffers = [...this.offers];

    if (filters?.category) {
      filteredOffers = filteredOffers.filter(
        (offer) => offer.category === filters.category,
      );
    }

    if (filters?.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filteredOffers = filteredOffers.filter(
        (offer) =>
          offer.title.toLowerCase().includes(term) ||
          offer.description.toLowerCase().includes(term) ||
          offer.supplierName.toLowerCase().includes(term),
      );
    }

    return {
      data: filteredOffers,
      message: "Offers retrieved successfully",
      success: true,
    };
  }

  async createOffer(offerData: CreateOfferData): Promise<Offer> {
    await this.delay();

    const newOffer: Offer = {
      id: String(this.offers.length + 1),
      title: offerData.title,
      description: offerData.description,
      discountPercentage: offerData.discountPercentage,
      category: offerData.category,
      expiryDate: offerData.expiryDate,
      imageUrl: "/placeholder.svg",
      status: "pending",
      supplierId: "3", // Mock supplier ID
      supplierName: "عبدالله محمد",
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
      views: 0,
      redemptions: 0,
      pointsCost: offerData.pointsCost,
      location: offerData.location,
      termsConditions: offerData.termsConditions,
      maxRedemptions: offerData.maxRedemptions,
      remainingRedemptions: offerData.maxRedemptions,
      redemptionType: offerData.redemptionType,
      websiteUrl: offerData.websiteUrl,
      branchAddress: offerData.branchAddress,
      usageLimit: offerData.usageLimit,
      usesPerEmployee: offerData.usesPerEmployee,
      discountCodeType: offerData.discountCodeType,
      supplierDiscountCode: offerData.supplierDiscountCode,
    };

    this.offers.push(newOffer);
    return newOffer;
  }

  async updateOffer(
    id: string,
    offerData: Partial<CreateOfferData>,
  ): Promise<Offer> {
    await this.delay();

    const offerIndex = this.offers.findIndex((o) => o.id === id);
    if (offerIndex === -1) throw new Error("Offer not found");

    this.offers[offerIndex] = {
      ...this.offers[offerIndex],
      ...offerData,
      updatedAt: getCurrentTimestamp(),
    };

    return this.offers[offerIndex];
  }

  async updateOfferStatus(id: string, status: OfferStatus): Promise<Offer> {
    await this.delay();

    const offerIndex = this.offers.findIndex((o) => o.id === id);
    if (offerIndex === -1) throw new Error("Offer not found");

    this.offers[offerIndex].status = status;
    this.offers[offerIndex].updatedAt = getCurrentTimestamp();

    return this.offers[offerIndex];
  }

  async deleteOffer(id: string): Promise<void> {
    await this.delay();

    const offerIndex = this.offers.findIndex((o) => o.id === id);
    if (offerIndex === -1) throw new Error("Offer not found");

    this.offers.splice(offerIndex, 1);
  }

  async redeemOffer(offerId: string, employeeId: string): Promise<Redemption> {
    await this.delay();

    const offer = this.offers.find((o) => o.id === offerId);
    if (!offer) throw new Error("Offer not found");
    if (offer.status !== "approved")
      throw new Error("Offer not available for redemption");

    const employee = this.users.find((u) => u.id === employeeId);
    if (!employee) throw new Error("Employee not found");

    const newRedemption: Redemption = {
      id: String(this.redemptions.length + 1),
      offerId,
      employeeId,
      redeemedAt: getCurrentTimestamp(),
      pointsUsed: offer.pointsCost,
      status: "active",
      offer,
      employee: employee as any,
    };

    this.redemptions.push(newRedemption);

    // Update offer statistics
    offer.redemptions += 1;
    if (offer.remainingRedemptions) {
      offer.remainingRedemptions -= 1;
    }

    return newRedemption;
  }

  async getUserRedemptions(userId: string): Promise<Redemption[]> {
    await this.delay();

    return this.redemptions.filter((r) => r.employeeId === userId);
  }

  async getEmployeeRedemptions(employeeId: string): Promise<Redemption[]> {
    await this.delay();

    // Get redemptions and add expiry status
    const redemptions = this.redemptions
      .filter((r) => r.employeeId === employeeId)
      .map((redemption) => {
        const isExpired = new Date(redemption.offer.expiryDate) < new Date();
        return {
          ...redemption,
          status: isExpired ? ("expired" as const) : redemption.status,
        };
      });

    return redemptions;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    await this.delay();

    return {
      totalUsers: this.users.length,
      totalOffers: this.offers.length,
      totalRedemptions: this.redemptions.length,
      activeEmployees: this.users.filter(
        (u) => u.role === "employee" && u.isActive,
      ).length,
      pendingOffers: this.offers.filter((o) => o.status === "pending").length,
      topOffers: this.offers.slice(0, 5),
      recentActivity: [],
      monthlyGrowth: {
        users: 15,
        offers: 8,
        redemptions: 25,
      },
    };
  }

  async getAnalyticsData(): Promise<AnalyticsData> {
    await this.delay();

    return {
      totalUsers: this.users.length,
      activeOffers: this.offers.filter((o) => o.status === "approved").length,
      totalRedemptions: this.redemptions.length,
      usersByRole: {
        super_admin: this.users.filter((u) => u.role === "super_admin").length,
        hr: this.users.filter((u) => u.role === "hr").length,
        supplier: this.users.filter((u) => u.role === "supplier").length,
        employee: this.users.filter((u) => u.role === "employee").length,
      },
      offersByCategory: {
        food: this.offers.filter((o) => o.category === "food").length,
        fitness: this.offers.filter((o) => o.category === "fitness").length,
        entertainment: this.offers.filter((o) => o.category === "entertainment")
          .length,
        travel: this.offers.filter((o) => o.category === "travel").length,
        retail: this.offers.filter((o) => o.category === "retail").length,
        technology: this.offers.filter((o) => o.category === "technology")
          .length,
        other: this.offers.filter((o) => o.category === "other").length,
      },
      redemptionsByMonth: [
        { month: "Jan", count: 45 },
        { month: "Feb", count: 52 },
        { month: "Mar", count: 48 },
        { month: "Apr", count: 63 },
        { month: "May", count: 71 },
        { month: "Jun", count: 68 },
      ],
      topSuppliers: [
        { id: "3", name: "عبدالله محمد", offers: 2, redemptions: 23 },
      ],
      employeeEngagement: [
        {
          department: "Engineering",
          activeUsers: 15,
          totalUsers: 20,
          engagementRate: 75,
        },
        {
          department: "Marketing",
          activeUsers: 8,
          totalUsers: 12,
          engagementRate: 67,
        },
        {
          department: "Sales",
          activeUsers: 12,
          totalUsers: 15,
          engagementRate: 80,
        },
      ],
    };
  }

  async uploadImage(file: File): Promise<string> {
    await this.delay(1000); // Simulate upload time

    // In a real implementation, you would upload to a cloud storage service
    // For now, return a placeholder URL
    return "/placeholder.svg";
  }
}

// Export the service instance
export const databaseService: DatabaseService = new RealtimeMockService();

// Database setup instructions
export const DATABASE_SETUP_INSTRUCTIONS = {
  postgresql: `
    1. Install PostgreSQL on your system
    2. Create a new database: createdb happy_perks_hub
    3. Run the SQL schema provided above
    4. Set environment variables for database connection
    5. Install pg package: npm install pg @types/pg
    6. Replace RealtimeMockService with PostgreSQLService in api.ts
  `,

  supabase: `
    1. Create a new project at https://supabase.com
    2. Run the SQL schema in Supabase SQL Editor
    3. Set environment variables for Supabase URL and key
    4. Install supabase client: npm install @supabase/supabase-js
    5. Implement SupabaseService class using the client
  `,

  firebase: `
    1. Create a new project at https://firebase.google.com
    2. Enable Firestore Database
    3. Set up security rules
    4. Install firebase SDK: npm install firebase
    5. Implement FirebaseService class using Firestore
  `,

  mongodb: `
    1. Set up MongoDB Atlas or local MongoDB
    2. Install mongoose: npm install mongoose
    3. Create models based on the schema provided
    4. Implement MongoDBService class using mongoose
  `,
};
