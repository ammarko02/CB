import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { User, LoginCredentials, RegisterData } from "@/types";
import { authService } from "@/services/api";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = React.memo(function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    try {
      console.log("🔍 Checking auth status...");
      const currentUser = authService.getCurrentUser();
      console.log("👤 Current user:", currentUser);

      if (currentUser) {
        setUser(currentUser);
        console.log("✅ User authenticated");
      } else {
        console.log("❌ No authenticated user found");
      }
    } catch (error) {
      console.error("❌ Auth check failed:", error);
    } finally {
      setIsLoading(false);
      console.log("⏹️ Auth loading complete");
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      setUser(response.data.user);

      // Store user data in localStorage
      localStorage.setItem("auth_token", response.data.token);
      localStorage.setItem("current_user", JSON.stringify(response.data.user));

      toast({
        title: "مرحباً بعودتك!",
        description: "تم تسجيل دخولك بنجاح.",
      });
    } catch (error) {
      toast({
        title: "فشل تسجيل الدخول",
        description:
          error instanceof Error ? error.message : "بيانات الدخول غير صحيحة",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await authService.register(data);
      setUser(response.data.user);

      // Store user data in localStorage
      localStorage.setItem("auth_token", response.data.token);
      localStorage.setItem("current_user", JSON.stringify(response.data.user));

      toast({
        title: "تم إنشاء الحساب!",
        description: "تم إنشاء حسابك بنجاح.",
      });
    } catch (error) {
      toast({
        title: "فشل التسجيل",
        description: error instanceof Error ? error.message : "فشل التسجيل",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);

      // Clear storage
      localStorage.removeItem("auth_token");
      localStorage.removeItem("current_user");

      toast({
        title: "تم تسجيل الخروج",
        description: "تم تسجيل خروجك بنجاح.",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    // Update localStorage as well
    localStorage.setItem("current_user", JSON.stringify(updatedUser));
  }, []);

  const contextValue = React.useMemo<AuthContextType>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      updateUser,
    }),
    [user, isLoading, login, register, logout, updateUser],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Export the context itself for debugging if needed
export { AuthContext };
