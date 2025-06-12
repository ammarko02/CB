import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardStats } from "@/types";
import { analyticsService } from "@/services/api";
import { StatsCard } from "@/components/StatsCard";
import { MessageCenter } from "@/components/MessageCenter";
import { CompanyAnalytics } from "@/components/CompanyAnalytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  Clock,
  Eye,
  Calendar,
  ArrowUpRight,
  Activity,
  MessageCircle,
  BarChart3,
  Settings,
  Bell,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/lib/dateUtils";
import { OFFER_STATUS_COLORS } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "info",
      message: "5 عروض جديدة تحتاج للمراجعة",
      timestamp: new Date().toISOString(),
      read: false,
    },
    {
      id: "2",
      type: "warning",
      message: "3 طلبات دعم عالية الأولوية",
      timestamp: new Date().toISOString(),
      read: false,
    },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true);
      const response = await analyticsService.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
      toast({
        title: "خطأ في التحميل",
        description: "فشل في تحميل إحصائيات لوحة التحكم",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  const quickActions = [
    {
      title: "مراجعة العروض",
      description: "عروض تحتاج للموافقة",
      icon: Package,
      count: stats?.pendingOffers || 0,
      action: () => navigate("/admin/offers-approval"),
      color: "blue",
    },
    {
      title: "إدارة المستخدمين",
      description: "إضافة أو تعديل المستخدمين",
      icon: Users,
      count: stats?.totalUsers || 0,
      action: () => navigate("/admin/users"),
      color: "green",
    },
    {
      title: "التحليلات المتقدمة",
      description: "تقارير مفصلة",
      icon: BarChart3,
      count: null,
      action: () => navigate("/admin/analytics"),
      color: "purple",
    },
    {
      title: "إعدادات النظام",
      description: "تكوين النظام",
      icon: Settings,
      count: null,
      action: () => navigate("/admin/settings"),
      color: "orange",
    },
  ];

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">لوحة تحكم الإدارة</h1>
          <p className="text-muted-foreground">نظرة عامة على النظام والأنشطة</p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <MessageCenter
            trigger={
              <Button variant="outline">
                <MessageCircle className="w-4 h-4 ml-2" />
                الرسائل والدعم
              </Button>
            }
          />
          <Button onClick={loadDashboardStats} variant="outline">
            <Activity className="w-4 h-4 ml-2" />
            تحديث
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {notifications.some((n) => !n.read) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-orange-800 mb-2">إشعارات</h4>
                <div className="space-y-2">
                  {notifications
                    .filter((n) => !n.read)
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-center justify-between bg-white rounded p-3"
                      >
                        <div className="flex items-center gap-2">
                          {notification.type === "warning" ? (
                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                          )}
                          <span className="text-sm">
                            {notification.message}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            markNotificationAsRead(notification.id)
                          }
                        >
                          تم الاطلاع
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Stats */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="إجمالي المستخدمين"
            value={stats.totalUsers.toString()}
            description={`${stats.activeEmployees} موظف نشط`}
            icon={Users}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="إجمالي العروض"
            value={stats.totalOffers.toString()}
            description={`${stats.pendingOffers} معلق`}
            icon={Package}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="عمليات الاستبدال"
            value={stats.totalRedemptions.toString()}
            description="هذا الشهر"
            icon={ShoppingCart}
            trend={{ value: 25, isPositive: true }}
          />
          <StatsCard
            title="النمو الشهري"
            value={`${stats.monthlyGrowth.redemptions}%`}
            description="مقارنة بالشهر السابق"
            icon={TrendingUp}
            trend={{ value: stats.monthlyGrowth.redemptions, isPositive: true }}
          />
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="analytics">تحليلات الشركة</TabsTrigger>
          <TabsTrigger value="actions">إجراءات سريعة</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Offers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  العروض الأخيرة
                </CardTitle>
                <CardDescription>أحدث العروض المضافة للنظام</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.topOffers.slice(0, 5).map((offer) => (
                    <div
                      key={offer.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{offer.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {offer.supplierName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={OFFER_STATUS_COLORS[offer.status]}>
                          {offer.status === "pending"
                            ? "معلق"
                            : offer.status === "approved"
                              ? "مقبول"
                              : "مرفوض"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(offer.createdAt, "MMM dd", i18n.language)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  نشاط النظام
                </CardTitle>
                <CardDescription>الأنشطة والأحداث الأخيرة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        تم قبول 3 عروض جديدة
                      </p>
                      <p className="text-xs text-muted-foreground">منذ ساعة</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">انضم 5 موظفين جدد</p>
                      <p className="text-xs text-muted-foreground">
                        منذ 3 ساعات
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        25 كوبون جديد تم استبداله
                      </p>
                      <p className="text-xs text-muted-foreground">اليوم</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">2 طلب دعم جديد</p>
                      <p className="text-xs text-muted-foreground">
                        منذ 30 دقيقة
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <CompanyAnalytics />
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Card
                  key={index}
                  className="cursor-pointer transition-all hover:shadow-md"
                  onClick={action.action}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          action.color === "blue"
                            ? "bg-blue-100"
                            : action.color === "green"
                              ? "bg-green-100"
                              : action.color === "purple"
                                ? "bg-purple-100"
                                : "bg-orange-100"
                        }`}
                      >
                        <IconComponent
                          className={`w-6 h-6 ${
                            action.color === "blue"
                              ? "text-blue-600"
                              : action.color === "green"
                                ? "text-green-600"
                                : action.color === "purple"
                                  ? "text-purple-600"
                                  : "text-orange-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{action.title}</h4>
                          {action.count !== null && (
                            <Badge variant="secondary">{action.count}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Additional Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>إجراءات إضافية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => navigate("/admin/offers-approval")}
                >
                  <Package className="w-4 h-4 ml-2" />
                  مراجعة العروض المعلقة
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => navigate("/admin/analytics")}
                >
                  <BarChart3 className="w-4 h-4 ml-2" />
                  عرض التحليلات التفصيلية
                </Button>
                <Button variant="outline" className="justify-start">
                  <Settings className="w-4 h-4 ml-2" />
                  إعدادات النظام
                </Button>
                <Button variant="outline" className="justify-start">
                  <Users className="w-4 h-4 ml-2" />
                  إدارة المستخدمين
                </Button>
                <Button variant="outline" className="justify-start">
                  <Calendar className="w-4 h-4 ml-2" />
                  تقارير شهرية
                </Button>
                <Button variant="outline" className="justify-start">
                  <MessageCircle className="w-4 h-4 ml-2" />
                  مركز الرسائل
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
