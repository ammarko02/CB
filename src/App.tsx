import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Navigation } from "@/components/Navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getDefaultRoute } from "@/lib/permissions";
import "@/lib/i18n";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

// Admin Pages
//import AdminDashboard from "./pages/admin/Dashboard";
//import OffersApproval from "./pages/admin/OffersApproval";
//import AdminAnalytics from "./pages/admin/Analytics";
//import AdminUsers from "./pages/admin/Users";
//import AdminSuppliers from "./pages/admin/Suppliers";

// HR Pages
//import HRDashboard from "./pages/hr/Dashboard";
//import EmployeeManagement from "./pages/hr/EmployeeManagement";
//import HRReports from "./pages/hr/Reports";
//import HRDepartments from "./pages/hr/Departments";
//import BulkImportGuide from "./pages/hr/BulkImportGuide";
//import HRAnalytics from "./pages/hr/Analytics";

// Supplier Pages
//import SupplierDashboard from "./pages/supplier/Dashboard";
//import SupplierOffers from "./pages/supplier/OfferManagement";
//import CreateOffer from "./pages/supplier/CreateOffer";
//import SupplierAnalytics from "./pages/supplier/Analytics";

// Employee Pages
//import EmployeeDashboard from "./pages/employee/Dashboard";
//import BrowseOffers from "./pages/employee/BrowseOffers";
//import RedemptionHistory from "./pages/employee/RedemptionHistory";
//import MyRedemptions from "./pages/employee/MyRedemptions";
//import EmployeeFavorites from "./pages/employee/Favorites";

// Test Pages (development only)
import TranslationTest from "./pages/TranslationTest";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <Login />
          ) : (
            <Navigate to={user ? getDefaultRoute(user.role) : "/"} />
          )
        }
      />
      <Route
        path="/register"
        element={
          !isAuthenticated ? (
            <Register />
          ) : (
            <Navigate to={user ? getDefaultRoute(user.role) : "/"} />
          )
        }
      />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected routes with navigation */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-background">
              <Navigation />
              <main>
                <Routes>
                  {/* Root redirect */}
                  <Route
                    path="/"
                    element={
                      user ? (
                        <Navigate to={getDefaultRoute(user.role)} replace />
                      ) : (
                        <Navigate to="/login" replace />
                      )
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin"]}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/offers-approval"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin"]}>
                        <OffersApproval />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/analytics"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin"]}>
                        <AdminAnalytics />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin"]}>
                        <AdminUsers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/suppliers"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin"]}>
                        <AdminSuppliers />
                      </ProtectedRoute>
                    }
                  />

                  {/* HR Routes */}
                  <Route
                    path="/hr/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin", "hr"]}>
                        <HRDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/hr/employees"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin", "hr"]}>
                        <EmployeeManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/hr/reports"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin", "hr"]}>
                        <HRReports />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/hr/departments"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin", "hr"]}>
                        <HRDepartments />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/hr/bulk-import-guide"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin", "hr"]}>
                        <BulkImportGuide />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/hr/analytics"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin", "hr"]}>
                        <HRAnalytics />
                      </ProtectedRoute>
                    }
                  />

                  {/* Supplier Routes */}
                  <Route
                    path="/supplier/dashboard"
                    element={
                      <ProtectedRoute
                        allowedRoles={["super_admin", "supplier"]}
                      >
                        <SupplierDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/supplier/offers"
                    element={
                      <ProtectedRoute
                        allowedRoles={["super_admin", "supplier"]}
                      >
                        <SupplierOffers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/supplier/create-offer"
                    element={
                      <ProtectedRoute
                        allowedRoles={["super_admin", "supplier"]}
                      >
                        <CreateOffer />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/supplier/analytics"
                    element={
                      <ProtectedRoute
                        allowedRoles={["super_admin", "supplier"]}
                      >
                        <SupplierAnalytics />
                      </ProtectedRoute>
                    }
                  />

                  {/* Employee Routes */}
                  <Route
                    path="/employee/dashboard"
                    element={
                      <ProtectedRoute
                        allowedRoles={[
                          "super_admin",
                          "hr",
                          "supplier",
                          "employee",
                        ]}
                      >
                        <EmployeeDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/employee/offers"
                    element={
                      <ProtectedRoute
                        allowedRoles={[
                          "super_admin",
                          "hr",
                          "supplier",
                          "employee",
                        ]}
                      >
                        <BrowseOffers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/employee/redemptions"
                    element={
                      <ProtectedRoute
                        allowedRoles={[
                          "super_admin",
                          "hr",
                          "supplier",
                          "employee",
                        ]}
                      >
                        <RedemptionHistory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/employee/my-redemptions"
                    element={
                      <ProtectedRoute
                        allowedRoles={[
                          "super_admin",
                          "hr",
                          "supplier",
                          "employee",
                        ]}
                      >
                        <MyRedemptions />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/employee/favorites"
                    element={
                      <ProtectedRoute
                        allowedRoles={[
                          "super_admin",
                          "hr",
                          "supplier",
                          "employee",
                        ]}
                      >
                        <EmployeeFavorites />
                      </ProtectedRoute>
                    }
                  />

                  {/* Test Routes (development only) */}
                  <Route
                    path="/translation-test"
                    element={<TranslationTest />}
                  />

                  {/* Catch all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;