import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { User } from "@/types";
import { userService, analyticsService } from "@/services/api";
import { StatsCard } from "@/components/StatsCard";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

export default function HRDashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<User[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [employeesResponse, statsResponse] = await Promise.all([
        userService.getUsers({ role: "employee" }),
        analyticsService.getDashboardStats(),
      ]);

      setEmployees(employeesResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast({
        title: t("notifications.error"),
        description: t("errors.loadingFailed"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate HR-specific stats
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((emp) => emp.isActive).length;
  const recentJoins = employees.filter((emp) => {
    const joinDate = new Date(emp.joinDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return joinDate > thirtyDaysAgo;
  }).length;

  // Group employees by department
  const departmentStats = employees.reduce(
    (acc, emp) => {
      const dept = emp.department || "Unassigned";
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const recentEmployees = employees
    .sort(
      (a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime(),
    )
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
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
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {t("navigation.dashboard")} - {t("roles.hr")}
          </h1>
          <p className="text-muted-foreground">
            إدارة الموظفين ومراقبة تحليلات القوى العاملة
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button onClick={() => navigate("/hr/employees")}>
            <UserPlus
              className={`w-4 h-4 ${i18n.language === "ar" ? "ml-2" : "mr-2"}`}
            />
            {t("dashboard.addEmployee")}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="إجمالي الموظفين"
          value={totalEmployees}
          description="جميع الموظفين"
          icon={Users}
        />
        <StatsCard
          title={t("dashboard.activeEmployees")}
          value={activeEmployees}
          description="النشطون حالياً"
          icon={UserCheck}
          className="bg-green-50 border-green-200"
        />
        <StatsCard
          title="الموظفون الجدد"
          value={recentJoins}
          description="آخر 30 يوماً"
          icon={TrendingUp}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="الأقسام"
          value={Object.keys(departmentStats).length}
          description="الأقسام النشطة"
          icon={Building}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Employees */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>الموظفون الجدد</CardTitle>
                <CardDescription>آخر الموظفين المضافين</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/hr/employees")}
              >
                {t("common.viewAll")}
                <ArrowUpRight
                  className={`w-4 h-4 ${i18n.language === "ar" ? "mr-1" : "ml-1"}`}
                />
              </Button>
            </CardHeader>
            <CardContent>
              {recentEmployees.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    لا يوجد موظفون بعد
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    أضف موظفك الأول للبدء
                  </p>
                  <Button onClick={() => navigate("/hr/employees")}>
                    <UserPlus
                      className={`w-4 h-4 ${i18n.language === "ar" ? "ml-2" : "mr-2"}`}
                    />
                    {t("dashboard.addEmployee")}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {employee.firstName[0]}
                            {employee.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {employee.firstName} {employee.lastName}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {employee.email}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {employee.department && (
                              <Badge variant="outline" className="text-xs">
                                {employee.department}
                              </Badge>
                            )}
                            <Badge
                              variant={
                                employee.isActive ? "default" : "secondary"
                              }
                              className="text-xs"
                            >
                              {employee.isActive
                                ? t("common.active")
                                : t("common.inactive")}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          انضم في{" "}
                          {new Date(employee.joinDate).toLocaleDateString(
                            "ar-SA",
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Department Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                توزيع الأقسام
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(departmentStats)
                  .sort(([, a], [, b]) => b - a)
                  .map(([department, count]) => {
                    const percentage = Math.round(
                      (count / totalEmployees) * 100,
                    );
                    return (
                      <div key={department} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {department}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                إحصائيات سريعة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  متوسط سنوات الخدمة
                </span>
                <span className="font-semibold">2.3 سنة</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  رضا الموظفين
                </span>
                <span className="font-semibold">4.2/5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  معدل المشاركة
                </span>
                <span className="font-semibold">78%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  معدل الاحتفاظ
                </span>
                <span className="font-semibold">85%</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.recentActivity")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    action: "تم تسجيل موظف جديد",
                    user: "أليس جونسون",
                    time: "منذ ساعتين",
                  },
                  {
                    action: "تم تحديث القسم",
                    user: "جون سميث",
                    time: "منذ 4 ساعات",
                  },
                  {
                    action: "تم تغيير الدور",
                    user: "سارة د��فيس",
                    time: "منذ يوم واحد",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg border"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.user} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.quickActions")}</CardTitle>
          <CardDescription>
            المهام الشائعة للموارد البشرية والاختصارات
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => navigate("/hr/employees")}
            >
              <UserPlus className="w-6 h-6" />
              <span>{t("dashboard.addEmployee")}</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => navigate("/hr/employees")}
            >
              <Users className="w-6 h-6" />
              <span>إدارة الموظفين</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => navigate("/hr/reports")}
            >
              <TrendingUp className="w-6 h-6" />
              <span>عرض التقارير</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => navigate("/profile")}
            >
              <Calendar className="w-6 h-6" />
              <span>{t("common.profile")}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
