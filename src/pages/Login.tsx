import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    console.log("🔐 Attempting login with:", { email, password: "***" });

    try {
      await login({ email, password });
      console.log("✅ Login successful, navigating to:", from);
      navigate(from, { replace: true });
    } catch (err) {
      console.error("❌ Login failed:", err);
      setError(err instanceof Error ? err.message : "فشل تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    {
      role: "المشرف العام",
      roleKey: "super_admin",
      email: "admin@company.com",
      password: "password",
    },
    {
      role: "مدير الموارد البشرية",
      roleKey: "hr",
      email: "hr@company.com",
      password: "password",
    },
    {
      role: "مورد",
      roleKey: "supplier",
      email: "supplier@example.com",
      password: "password",
    },
    {
      role: "موظف",
      roleKey: "employee",
      email: "employee@company.com",
      password: "password",
    },
  ];

  const quickLogin = (email: string) => {
    setEmail(email);
    setPassword("password");
  };

  const autoLogin = async (email: string) => {
    console.log("🚀 Auto login triggered for:", email);
    setEmail(email);
    setPassword("password");
    setError("");
    setIsLoading(true);

    try {
      await login({ email, password: "password" });
      console.log("✅ Auto login successful, navigating to:", from);
      navigate(from, { replace: true });
    } catch (err) {
      console.error("❌ Auto login failed:", err);
      setError(
        err instanceof Error ? err.message : "فشل تسجيل الدخول التلقائي",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Language Switcher */}
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>

        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">HP</span>
          </div>
          <h1 className="text-3xl font-bold">{t("app.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("app.subtitle")}</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>{t("auth.welcomeBack")}</CardTitle>
            <CardDescription>{t("auth.signInToAccount")}</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{t("common.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("common.email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("common.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("common.password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t("auth.signingIn") : t("auth.signIn")}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                {t("auth.dontHaveAccount")}{" "}
                <Link to="/register" className="text-primary hover:underline">
                  {t("auth.signUp")}
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Demo Accounts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">حسابات تجريبية</CardTitle>
                <CardDescription className="text-xs">
                  انقر على أي حساب أدناه للدخول السريع
                </CardDescription>
              </div>
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                🎭 وضع تجريبي
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoAccounts.map((account) => (
              <div
                key={account.email}
                className="flex items-center justify-between p-3 rounded-lg border bg-muted/50"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {account.role}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{account.email}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => quickLogin(account.email)}
                  >
                    ملء البيانات
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => autoLogin(account.email)}
                    disabled={isLoading}
                  >
                    {isLoading ? "جاري الدخول..." : "دخول سريع"}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          <p>{t("app.copyright")}</p>
        </div>
      </div>
    </div>
  );
}
