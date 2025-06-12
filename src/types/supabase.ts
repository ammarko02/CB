export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          role: "super_admin" | "hr" | "supplier" | "employee";
          department: string | null;
          company_name: string | null;
          employee_id: string | null;
          is_active: boolean;
          avatar_url: string | null;
          phone: string | null;
          points_balance: number;
          join_date: string;
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          first_name: string;
          last_name: string;
          role: "super_admin" | "hr" | "supplier" | "employee";
          department?: string | null;
          company_name?: string | null;
          employee_id?: string | null;
          is_active?: boolean;
          avatar_url?: string | null;
          phone?: string | null;
          points_balance?: number;
          join_date?: string;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          role?: "super_admin" | "hr" | "supplier" | "employee";
          department?: string | null;
          company_name?: string | null;
          employee_id?: string | null;
          is_active?: boolean;
          avatar_url?: string | null;
          phone?: string | null;
          points_balance?: number;
          join_date?: string;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      offers: {
        Row: {
          id: string;
          title: string;
          description: string;
          discount_percentage: number;
          original_price: number | null;
          final_price: number | null;
          category:
            | "food"
            | "fitness"
            | "entertainment"
            | "travel"
            | "retail"
            | "technology"
            | "other";
          expiry_date: string;
          image_url: string | null;
          status: "pending" | "approved" | "rejected" | "expired";
          supplier_id: string;
          points_cost: number;
          location: string | null;
          terms_conditions: string | null;
          max_redemptions: number | null;
          remaining_redemptions: number | null;
          views: number;
          redemptions: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          discount_percentage: number;
          original_price?: number | null;
          final_price?: number | null;
          category:
            | "food"
            | "fitness"
            | "entertainment"
            | "travel"
            | "retail"
            | "technology"
            | "other";
          expiry_date: string;
          image_url?: string | null;
          status?: "pending" | "approved" | "rejected" | "expired";
          supplier_id: string;
          points_cost: number;
          location?: string | null;
          terms_conditions?: string | null;
          max_redemptions?: number | null;
          remaining_redemptions?: number | null;
          views?: number;
          redemptions?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          discount_percentage?: number;
          original_price?: number | null;
          final_price?: number | null;
          category?:
            | "food"
            | "fitness"
            | "entertainment"
            | "travel"
            | "retail"
            | "technology"
            | "other";
          expiry_date?: string;
          image_url?: string | null;
          status?: "pending" | "approved" | "rejected" | "expired";
          supplier_id?: string;
          points_cost?: number;
          location?: string | null;
          terms_conditions?: string | null;
          max_redemptions?: number | null;
          remaining_redemptions?: number | null;
          views?: number;
          redemptions?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      redemptions: {
        Row: {
          id: string;
          offer_id: string;
          employee_id: string;
          points_used: number;
          status: "active" | "used" | "expired";
          redeemed_at: string;
          used_at: string | null;
        };
        Insert: {
          id?: string;
          offer_id: string;
          employee_id: string;
          points_used: number;
          status?: "active" | "used" | "expired";
          redeemed_at?: string;
          used_at?: string | null;
        };
        Update: {
          id?: string;
          offer_id?: string;
          employee_id?: string;
          points_used?: number;
          status?: "active" | "used" | "expired";
          redeemed_at?: string;
          used_at?: string | null;
        };
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          details: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action: string;
          details?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          action?: string;
          details?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: "super_admin" | "hr" | "supplier" | "employee";
      offer_status: "pending" | "approved" | "rejected" | "expired";
      offer_category:
        | "food"
        | "fitness"
        | "entertainment"
        | "travel"
        | "retail"
        | "technology"
        | "other";
      redemption_status: "active" | "used" | "expired";
    };
  };
}
