import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnalyticsData } from "@/types";
import { analyticsService } from "@/services/api";
import { StatsCard } from "@/components/StatsCard";
import { CompanyAnalytics } from "@/components/CompanyAnalytics";
import { MessageCenter } from "@/components/MessageCenter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  Eye,
  Calendar,
  Download,
  RefreshCw,
  PieChart,
  LineChart,
  Activity,
  MessageCircle,
  Building,
  Ticket,
  CreditCard,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

export default function AdminAnalytics() {
  const { t, i18n } = useTranslation();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("last30Days");
  const [selectedMetric, setSelectedMetric] = useState("overview");

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await analyticsService.getAnalyticsData();
      setAnalytics(response.data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
      toast({
        title: "خطأ في التحميل",
        description: "فشل في تحميل بيانات التحليلات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = () => {
    toast({
      title: "تصدير البيانات",
      description: "سيتم تصدير التقرير قريباً",
    });
  };

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
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد بيانات</h3>
            <p className="text-muted-foreground text-center mb-4">
              فشل في تحميل بيانات التحليلات
            </p>
            <Button onClick={loadAnalytics}>
              <RefreshCw className="w-4 h-4 ml-2" />
              إعادة المحاولة
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare chart data
  const usersByRoleData = Object.entries(analytics.usersByRole).map(
    ([role, count]) => ({
      role:
        role === "employee"
          ? "موظف"
          : role === "supplier"
            ? "مورد"
            : role === "hr"
              ? "موارد بشرية"
              : "إدارة",
      count,
    }),
  );

  const offersByCategoryData = Object.entries(analytics.offersByCategory).map(
    ([category, count]) => ({
      category:
        category === "food"
          ? "طعام"
          : category === "fitness"
            ? "لياقة"
            : category === "entertainment"
              ? "ترفيه"
              : category === "travel"
                ? "سفر"
                : category === "retail"
                  ? "تسوق"
                  : category === "technology"
                    ? "تكنولوجيا"
                    : "أخرى",
      count,
      color: [
        "#8884d8",
        "#82ca9d",
        "#ffc658",
        "#ff7300",
        "#8dd1e1",
        "#d084d0",
        "#ffb347",
      ][
        [
          "food",
          "fitness",
          "entertainment",
          "travel",
          "retail",
          "technology",
          "other",
        ].indexOf(category)
      ],
    }),
  );

  const supplierData = analytics.topSuppliers.map((supplier, index) => ({
    ...supplier,
    color: ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1"][index % 5],
  }));

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">التحليلات المتقدمة</h1>
          <p className="text-muted-foreground">
            تحليل شامل لأداء النظام والمستخدمين
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <MessageCenter
            trigger={
              <Button variant="outline">
                <MessageCircle className="w-4 h-4 ml-2" />
                الرسائل
              </Button>
            }
          />
          <Button onClick={exportData} variant="outline">
            <Download className="w-4 h-4 ml-2" />
            تصدير التقرير
          </Button>
          <Button onClick={loadAnalytics}>
            <RefreshCw className="w-4 h-4 ml-2" />
            تحديث
          </Button>
        </div>
      </div>

      {/* Time Period Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">الفترة الزمنية:</label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7Days">آخر 7 أيام</SelectItem>
                <SelectItem value="last30Days">آخر 30 يوم</SelectItem>
                <SelectItem value="last90Days">آخر 3 أشهر</SelectItem>
                <SelectItem value="lastYear">العام الماضي</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="إجمالي المستخدمين"
          value={analytics.totalUsers.toString()}
          description="جميع أنواع المستخدمين"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="العروض النشطة"
          value={analytics.activeOffers.toString()}
          description="العروض المقبولة والمتاحة"
          icon={Package}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="عمليات الاستبدال"
          value={analytics.totalRedemptions.toString()}
          description="إجمالي الاستبدالات"
          icon={ShoppingCart}
          trend={{ value: 25, isPositive: true }}
        />
        <StatsCard
          title="مشاركة الموظفين"
          value={`${((analytics.totalRedemptions / analytics.totalUsers) * 100).toFixed(1)}%`}
          description="نسبة المشاركة النشطة"
          icon={Activity}
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="users">المستخدمين</TabsTrigger>
          <TabsTrigger value="offers">العروض</TabsTrigger>
          <TabsTrigger value="company">تحليلات الشركة</TabsTrigger>
          <TabsTrigger value="engagement">المشاركة</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Users by Role */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  توزيع المستخدمين حسب الدور
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={usersByRoleData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ role, percent }) =>
                        `${role} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {usersByRoleData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"][index]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Offers by Category */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  العروض حسب الفئة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={offersByCategoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5" />
                اتجاهات الاستبدال الشهرية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={analytics.redemptionsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* User Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات المستخدمين</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.usersByRole).map(
                    ([role, count]) => (
                      <div
                        key={role}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <span className="font-medium">
                          {role === "employee"
                            ? "الموظفين"
                            : role === "supplier"
                              ? "الموردين"
                              : role === "hr"
                                ? "الموارد البشرية"
                                : "الإدارة"}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">{count}</span>
                          <span className="text-sm text-muted-foreground">
                            مستخدم
                          </span>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            {/* User Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>نمو المستخدمين</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={usersByRoleData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="role" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="offers" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top Suppliers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  أفضل الموردين
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topSuppliers.map((supplier, index) => (
                    <div
                      key={supplier.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                          {index + 1}
                        </div>
                        <span className="font-medium">{supplier.name}</span>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">
                          {supplier.offers} عرض
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {supplier.redemptions} استبدال
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Offer Categories Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>توزيع فئات العروض</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={offersByCategoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ category, percent }) =>
                        `${category} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {offersByCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="company">
          <CompanyAnalytics />
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Employee Engagement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  مشاركة الموظفين حسب القسم
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.employeeEngagement.map((dept) => (
                    <div
                      key={dept.department}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <span className="font-medium">{dept.department}</span>
                      <div className="text-left">
                        <p className="text-sm font-medium">
                          {dept.engagementRate.toFixed(1)}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dept.activeUsers} من {dept.totalUsers}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Engagement Trends */}
            <Card>
              <CardHeader>
                <CardTitle>اتجاه المشاركة</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={analytics.employeeEngagement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="engagementRate"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
