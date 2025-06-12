import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { offerService } from "@/services/api";
import { Offer } from "@/types";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  Eye,
  ShoppingCart,
  Package,
  Calendar,
  Target,
  Award,
  Clock,
  RefreshCw,
  Download,
  Filter,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { OFFER_STATUS_COLORS } from "@/lib/constants";

export default function SupplierAnalytics() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("last30");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      const response = await offerService.getOffers();
      // Filter offers for current supplier
      const supplierOffers = response.data.filter(
        (offer) => offer.supplierId === user?.id,
      );
      setOffers(supplierOffers);
    } catch (error) {
      console.error("Failed to load analytics data:", error);
      toast({
        title: t("notifications.error"),
        description: t("errors.loadingFailed"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate metrics
  const totalOffers = offers.length;
  const activeOffers = offers.filter(
    (offer) => offer.status === "approved",
  ).length;
  const pendingOffers = offers.filter(
    (offer) => offer.status === "pending",
  ).length;
  const rejectedOffers = offers.filter(
    (offer) => offer.status === "rejected",
  ).length;
  const totalViews = offers.reduce((sum, offer) => sum + offer.views, 0);
  const totalRedemptions = offers.reduce(
    (sum, offer) => sum + offer.redemptions,
    0,
  );
  const totalRevenue = offers.reduce(
    (sum, offer) => sum + offer.redemptions * offer.pointsCost,
    0,
  );

  // Calculate rates
  const approvalRate = totalOffers > 0 ? (activeOffers / totalOffers) * 100 : 0;
  const conversionRate =
    totalViews > 0 ? (totalRedemptions / totalViews) * 100 : 0;
  const avgViewsPerOffer =
    totalOffers > 0 ? Math.round(totalViews / totalOffers) : 0;
  const avgRedemptionsPerOffer =
    totalOffers > 0 ? Math.round(totalRedemptions / totalOffers) : 0;

  // Get top performing offers
  const topOffers = offers
    .filter((offer) => offer.status === "approved")
    .sort((a, b) => b.redemptions - a.redemptions)
    .slice(0, 5);

  // Get recent offers
  const recentOffers = offers
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 10);

  // Category performance
  const categoryStats = offers.reduce(
    (acc, offer) => {
      if (!acc[offer.category]) {
        acc[offer.category] = {
          count: 0,
          views: 0,
          redemptions: 0,
          revenue: 0,
        };
      }
      acc[offer.category].count++;
      acc[offer.category].views += offer.views;
      acc[offer.category].redemptions += offer.redemptions;
      acc[offer.category].revenue += offer.redemptions * offer.pointsCost;
      return acc;
    },
    {} as Record<
      string,
      { count: number; views: number; redemptions: number; revenue: number }
    >,
  );

  const refreshData = () => {
    loadAnalyticsData();
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
          <h1 className="text-3xl font-bold">{t("navigation.analytics")}</h1>
          <p className="text-muted-foreground">
            تحليلات مفصلة عن أداء عروضك ومبيعاتك
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7">
                {t("analytics.last30Days").replace("30", "7")}
              </SelectItem>
              <SelectItem value="last30">
                {t("analytics.last30Days")}
              </SelectItem>
              <SelectItem value="last90">
                {t("analytics.last90Days")}
              </SelectItem>
              <SelectItem value="thisYear">
                {t("analytics.thisYear")}
              </SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={refreshData} variant="outline" size="sm">
            <RefreshCw
              className={`w-4 h-4 ${i18n.language === "ar" ? "ml-2" : "mr-2"}`}
            />
            {t("common.refresh")}
          </Button>
          <Button variant="outline" size="sm">
            <Download
              className={`w-4 h-4 ${i18n.language === "ar" ? "ml-2" : "mr-2"}`}
            />
            تصدير
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t("dashboard.totalOffers")}
          value={totalOffers}
          description="جميع العروض"
          icon={Package}
        />
        <StatsCard
          title="إجمالي المشاهدات"
          value={totalViews.toLocaleString()}
          description="عبر جميع العروض"
          icon={Eye}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title={t("dashboard.totalRedemptions")}
          value={totalRedemptions}
          description="العروض المستبدلة"
          icon={ShoppingCart}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="إجمالي النقاط"
          value={totalRevenue.toLocaleString()}
          description="من جميع الاستبدالات"
          icon={Award}
          trend={{ value: 12, isPositive: true }}
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="معدل الموافقة"
          value={`${approvalRate.toFixed(1)}%`}
          description="العروض المقبولة"
          icon={Target}
          className={
            approvalRate >= 70
              ? "bg-green-50 border-green-200"
              : "bg-yellow-50 border-yellow-200"
          }
        />
        <StatsCard
          title="معدل التحويل"
          value={`${conversionRate.toFixed(1)}%`}
          description="من المشاهدة للاستبدال"
          icon={TrendingUp}
          className={
            conversionRate >= 5
              ? "bg-green-50 border-green-200"
              : "bg-yellow-50 border-yellow-200"
          }
        />
        <StatsCard
          title="متوسط المشاهدات"
          value={avgViewsPerOffer}
          description="لكل عرض"
          icon={Eye}
        />
        <StatsCard
          title="متوسط الاستبدالات"
          value={avgRedemptionsPerOffer}
          description="لكل عرض"
          icon={ShoppingCart}
        />
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t("analytics.overview")}</TabsTrigger>
          <TabsTrigger value="offers">العروض</TabsTrigger>
          <TabsTrigger value="categories">الفئات</TabsTrigger>
          <TabsTrigger value="performance">
            {t("analytics.performance")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Offer Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>توزيع حالة العروض</CardTitle>
                <CardDescription>نظرة عامة على حالة جميع عروضك</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>{t("common.active")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{activeOffers}</span>
                      <Badge variant="secondary">
                        {((activeOffers / totalOffers) * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>{t("common.pending")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{pendingOffers}</span>
                      <Badge variant="secondary">
                        {((pendingOffers / totalOffers) * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>{t("common.rejected")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{rejectedOffers}</span>
                      <Badge variant="secondary">
                        {((rejectedOffers / totalOffers) * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Offers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  {t("dashboard.topPerformers")}
                </CardTitle>
                <CardDescription>العروض الأكثر نجاحاً</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topOffers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>لا توجد عروض نشطة</p>
                    </div>
                  ) : (
                    topOffers.map((offer, index) => (
                      <div
                        key={offer.id}
                        className="flex items-center gap-3 p-3 rounded-lg border"
                      >
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{offer.title}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>{offer.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ShoppingCart className="w-3 h-3" />
                              <span>{offer.redemptions}</span>
                            </div>
                            <Badge
                              className={OFFER_STATUS_COLORS[offer.status]}
                              size="sm"
                            >
                              {t(`common.${offer.status}`)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="offers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>جميع العروض</CardTitle>
              <CardDescription>
                قائمة تفصيلية بجميع عروضك مع الإحصائيات
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentOffers.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">لا توجد عروض</h3>
                  <p className="text-muted-foreground">
                    قم بإنشاء عرضك الأول للبدء
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOffers.map((offer) => (
                    <div
                      key={offer.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{offer.title}</h4>
                          <Badge
                            className={OFFER_STATUS_COLORS[offer.status]}
                            size="sm"
                          >
                            {t(`common.${offer.status}`)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {offer.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{offer.views} مشاهدة</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ShoppingCart className="w-3 h-3" />
                            <span>{offer.redemptions} استبدال</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(offer.createdAt).toLocaleDateString(
                                "ar-SA",
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          {offer.discountPercentage}%
                        </p>
                        <p className="text-sm text-muted-foreground">خصم</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>أداء الفئات</CardTitle>
              <CardDescription>إحصائيات العروض حسب الفئة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(categoryStats).map(([category, stats]) => (
                  <div
                    key={category}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div>
                      <h4 className="font-medium">
                        {t(`categories.${category}`)}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {stats.count} عروض
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold">{stats.views}</p>
                        <p className="text-xs text-muted-foreground">مشاهدة</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold">{stats.redemptions}</p>
                        <p className="text-xs text-muted-foreground">استبدال</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold">{stats.revenue}</p>
                        <p className="text-xs text-muted-foreground">نقطة</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>مؤشرات الأداء الرئيسية</CardTitle>
                <CardDescription>المقاييس المهمة لنجاح عروضك</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="text-sm text-muted-foreground">
                    معدل الموافقة
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {approvalRate.toFixed(1)}%
                    </span>
                    <div
                      className={`w-2 h-2 rounded-full ${approvalRate >= 70 ? "bg-green-500" : "bg-yellow-500"}`}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="text-sm text-muted-foreground">
                    معدل التحويل
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {conversionRate.toFixed(1)}%
                    </span>
                    <div
                      className={`w-2 h-2 rounded-full ${conversionRate >= 5 ? "bg-green-500" : "bg-yellow-500"}`}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="text-sm text-muted-foreground">
                    متوسط المشاهدات لكل عرض
                  </span>
                  <span className="font-semibold">{avgViewsPerOffer}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="text-sm text-muted-foreground">
                    متوسط الاستبدالات لكل عرض
                  </span>
                  <span className="font-semibold">
                    {avgRedemptionsPerOffer}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>توصيات للتحسين</CardTitle>
                <CardDescription>نصائح لتحسين أداء عروضك</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {approvalRate < 70 && (
                  <div className="p-3 rounded-lg border border-yellow-200 bg-yellow-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">
                        تحسين معدل الموافقة
                      </span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      معدل موافقة أقل من 70%. راجع متطلبات الموافقة وحسن جودة
                      عروضك.
                    </p>
                  </div>
                )}
                {conversionRate < 5 && (
                  <div className="p-3 rounded-lg border border-orange-200 bg-orange-50">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-orange-600" />
                      <span className="font-medium text-orange-800">
                        تحسين معدل التحويل
                      </span>
                    </div>
                    <p className="text-sm text-orange-700">
                      معدل تحويل منخفض. جرب تحسين عناوين العروض وتقديم قيمة
                      أفضل.
                    </p>
                  </div>
                )}
                {totalOffers > 0 && avgViewsPerOffer < 10 && (
                  <div className="p-3 rounded-lg border border-blue-200 bg-blue-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-800">
                        زيادة المشاهدات
                      </span>
                    </div>
                    <p className="text-sm text-blue-700">
                      متوسط مشاهدات منخفض. حسن كلمات البحث والأوصاف لجذب المزيد
                      من المستخدمين.
                    </p>
                  </div>
                )}
                {approvalRate >= 70 &&
                  conversionRate >= 5 &&
                  avgViewsPerOffer >= 10 && (
                    <div className="p-3 rounded-lg border border-green-200 bg-green-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-800">
                          أداء ممتاز!
                        </span>
                      </div>
                      <p className="text-sm text-green-700">
                        عروضك تحقق أداءً ممتازاً. استمر في نفس ��لاستراتيجية
                        وفكر في إنشاء المزيد من العروض.
                      </p>
                    </div>
                  )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
