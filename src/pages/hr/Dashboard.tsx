import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { User } from "@/types";
import { userService, analyticsService } from "@/services/api";
import { StatsCard } from "@/components/StatsCard";
import {
  DirectionAwareText,
  DirectionAwareHeading,
} from "@/components/DirectionAwareText";
import { TranslatedText, TranslatedHeading } from "@/components/TranslatedText";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserPlus,
  TrendingUp,
  Building,
  Activity,
  Calendar,
  ArrowUpRight,
  UserCheck,
  Package,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function HRDashboard() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    newEmployeesThisMonth: 0,
    totalDepartments: 0,
    pendingApprovals: 0,
    totalRedemptions: 0,
  });

  const [recentEmployees, setRecentEmployees] = useState<User[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Simulate API calls
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStats({
        totalEmployees: 245,
        activeEmployees: 238,
        newEmployeesThisMonth: 12,
        totalDepartments: 8,
        pendingApprovals: 5,
        totalRedemptions: 1540,
      });

      setRecentEmployees([
        {
          id: "1",
          firstName: "أحمد",
          lastName: "محمد",
          email: "ahmed.mohamed@company.com",
          role: "employee",
          department: "engineering",
          status: "active",
          createdAt: "2024-01-15T10:00:00Z",
          pointsBalance: 1200,
        },
        {
          id: "2",
          firstName: "فاطمة",
          lastName: "علي",
          email: "fatima.ali@company.com",
          role: "employee",
          department: "marketing",
          status: "active",
          createdAt: "2024-01-14T09:30:00Z",
          pointsBalance: 850,
        },
      ]);
    } catch (error) {
      toast({
        title: isRTL ? "خطأ في التحميل" : "Loading Error",
        description: isRTL
          ? "فشل في تحميل بيانات لوحة التحكم"
          : "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      title: isRTL ? "إضافة موظف جديد" : "Add New Employee",
      description: isRTL
        ? "إنشاء حساب موظف جديد"
        : "Create a new employee account",
      icon: UserPlus,
      action: () => navigate("/hr/employees"),
      color: "blue",
    },
    {
      title: isRTL ? "إدارة الأقسام" : "Manage Departments",
      description: isRTL
        ? "تنظيم وإدارة أقسام الشركة"
        : "Organize and manage company departments",
      icon: Building,
      action: () => navigate("/hr/departments"),
      color: "green",
    },
    {
      title: isRTL ? "عرض التقارير" : "View Reports",
      description: isRTL
        ? "تقارير شاملة عن الأداء"
        : "Comprehensive performance reports",
      icon: BarChart3,
      action: () => navigate("/hr/reports"),
      color: "purple",
    },
    {
      title: isRTL ? "التحليلات" : "Analytics",
      description: isRTL
        ? "رؤى تفصيلية عن الاستخدام"
        : "Detailed usage insights",
      icon: Activity,
      action: () => navigate("/hr/analytics"),
      color: "orange",
    },
  ];

  if (isLoading) {
    return (
      <div
        className={cn(
          "container mx-auto p-6 space-y-6",
          isRTL ? "rtl-content" : "ltr-content",
        )}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "container mx-auto p-6 space-y-6",
        isRTL ? "rtl-content" : "ltr-content",
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center",
          isRTL ? "flex-row-reverse justify-between" : "justify-between",
        )}
      >
        <div className={cn(isRTL ? "text-right" : "text-left")}>
          <DirectionAwareHeading level={1} className="text-3xl font-bold">
            <TranslatedText tKey="navigation.dashboard" />
          </DirectionAwareHeading>
          <DirectionAwareText className="text-muted-foreground">
            إدارة شاملة لنظام المزايا والموظفين
          </DirectionAwareText>
        </div>
        <div
          className={cn("flex gap-2", isRTL ? "flex-row-reverse" : "flex-row")}
        >
          <Button
            onClick={() => navigate("/hr/employees")}
            className={cn(isRTL ? "flex-row-reverse" : "flex-row")}
          >
            <UserPlus className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
            <TranslatedText tKey="dashboard.addEmployee" />
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/hr/reports")}
            className={cn(isRTL ? "flex-row-reverse" : "flex-row")}
          >
            <BarChart3 className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
            <TranslatedText tKey="dashboard.viewAnalytics" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={<TranslatedText tKey="dashboard.totalUsers" />}
          value={stats.totalEmployees.toLocaleString(isRTL ? "ar-SA" : "en-US")}
          description={<TranslatedText tKey="dashboard.activeEmployees" />}
          icon={Users}
          trend={{
            value: 8.2,
            isPositive: true,
          }}
        />
        <StatsCard
          title={<TranslatedText tKey="dashboard.activeEmployees" />}
          value={stats.activeEmployees.toLocaleString(
            isRTL ? "ar-SA" : "en-US",
          )}
          description={<TranslatedText tKey="dashboard.thisMonth" />}
          icon={UserCheck}
        />
        <StatsCard
          title={<TranslatedText tKey="dashboard.pendingOffers" />}
          value={stats.pendingApprovals.toLocaleString(
            isRTL ? "ar-SA" : "en-US",
          )}
          description={<TranslatedText tKey="dashboard.totalOffers" />}
          icon={Package}
          trend={{
            value: 12.5,
            isPositive: false,
          }}
        />
        <StatsCard
          title={<TranslatedText tKey="dashboard.totalRedemptions" />}
          value={stats.totalRedemptions.toLocaleString(
            isRTL ? "ar-SA" : "en-US",
          )}
          description={<TranslatedText tKey="dashboard.thisMonth" />}
          icon={TrendingUp}
          trend={{
            value: 15.3,
            isPositive: true,
          }}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <DirectionAwareText as="h3" className="text-xl font-semibold">
              <TranslatedText tKey="dashboard.quickActions" />
            </DirectionAwareText>
            <DirectionAwareText className="text-muted-foreground">
              <TranslatedText tKey="dashboard.commonTasks" />
            </DirectionAwareText>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {quickActions.map((action, index) => (
                <Card
                  key={index}
                  className="p-4 cursor-pointer hover:bg-accent transition-colors"
                  onClick={action.action}
                >
                  <div
                    className={cn(
                      "flex items-center gap-4",
                      isRTL ? "flex-row-reverse" : "flex-row",
                    )}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${action.color}-100`}
                    >
                      <action.icon
                        className={`w-5 h-5 text-${action.color}-600`}
                      />
                    </div>
                    <div
                      className={cn(
                        "flex-1",
                        isRTL ? "text-right" : "text-left",
                      )}
                    >
                      <DirectionAwareText className="font-medium">
                        {action.title}
                      </DirectionAwareText>
                      <DirectionAwareText className="text-sm text-muted-foreground">
                        {action.description}
                      </DirectionAwareText>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Employees */}
        <Card>
          <CardHeader
            className={cn(
              "flex",
              isRTL ? "flex-row-reverse justify-between" : "justify-between",
            )}
          >
            <div>
              <DirectionAwareText as="h3" className="text-xl font-semibold">
                <TranslatedText tKey="dashboard.recentActivity" />
              </DirectionAwareText>
              <DirectionAwareText className="text-muted-foreground">
                الموظفون الجدد هذا الشهر
              </DirectionAwareText>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/hr/employees")}
              className={cn(isRTL ? "flex-row-reverse" : "flex-row")}
            >
              <TranslatedText tKey="common.viewAll" />
              <ArrowUpRight
                className={cn("w-4 h-4", isRTL ? "mr-1" : "ml-1")}
              />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-lg border",
                    isRTL ? "flex-row-reverse" : "flex-row",
                  )}
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <DirectionAwareText className="text-sm font-semibold text-blue-600">
                      {employee.firstName[0]}
                      {employee.lastName[0]}
                    </DirectionAwareText>
                  </div>
                  <div
                    className={cn("flex-1", isRTL ? "text-right" : "text-left")}
                  >
                    <DirectionAwareText className="font-medium">
                      {employee.firstName} {employee.lastName}
                    </DirectionAwareText>
                    <DirectionAwareText className="text-sm text-muted-foreground">
                      {employee.email}
                    </DirectionAwareText>
                    <div
                      className={cn(
                        "flex items-center gap-2 mt-1",
                        isRTL ? "flex-row-reverse justify-end" : "flex-row",
                      )}
                    >
                      <Badge variant="outline">
                        <TranslatedText
                          tKey={`departments.${employee.department}`}
                        />
                      </Badge>
                      <DirectionAwareText className="text-xs text-muted-foreground ltr-content">
                        {employee.pointsBalance?.toLocaleString(
                          isRTL ? "ar-SA" : "en-US",
                        )}{" "}
                        {isRTL ? "نقطة" : "pts"}
                      </DirectionAwareText>
                    </div>
                  </div>
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800"
                  >
                    <TranslatedText tKey="common.active" />
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
