import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Offer } from "@/types";
import { offerService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { StatsCard } from "@/components/StatsCard";
import { OfferCard } from "@/components/OfferCard";
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
  Package,
  TrendingUp,
  Eye,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  BarChart3,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { OFFER_STATUS_COLORS } from "@/lib/constants";

export default function SupplierDashboard() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      setIsLoading(true);
      const response = await offerService.getOffers();
      // Filter offers for current supplier
      const supplierOffers = response.data.filter(
        (offer) => offer.supplierId === user?.id,
      );
      setOffers(supplierOffers);
    } catch (error) {
      console.error("Failed to load offers:", error);
      toast({
        title: t("notifications.error"),
        description: t("errors.loadingFailed"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOffer = async (offerId: string) => {
    try {
      await offerService.deleteOffer(offerId);
      setOffers((prev) => prev.filter((offer) => offer.id !== offerId));
      toast({
        title: t("notifications.offerDeleted"),
        description: t("notifications.offerDeleted"),
      });
    } catch (error) {
      toast({
        title: t("notifications.error"),
        description: t("errors.deleteFailed"),
        variant: "destructive",
      });
    }
  };

  const handleEditOffer = (offer: Offer) => {
    navigate("/supplier/create-offer", { state: { editOffer: offer } });
  };

  // Calculate stats
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

  // Recent offers
  const recentOffers = offers
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 6);

  // Top performing offers
  const topOffers = offers
    .filter((offer) => offer.status === "approved")
    .sort((a, b) => b.redemptions - a.redemptions)
    .slice(0, 3);

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
            {t("dashboard.welcomeBack")}, {user?.firstName}! 🎯
          </h1>
          <p className="text-muted-foreground">
            {t("dashboard.manageOffers")} وتتبع الأداء
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button onClick={() => navigate("/supplier/create-offer")}>
            <Plus
              className={`w-4 h-4 ${i18n.language === "ar" ? "ml-2" : "mr-2"}`}
            />
            {t("offers.createOffer")}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/supplier/offers")}
          >
            <Package
              className={`w-4 h-4 ${i18n.language === "ar" ? "ml-2" : "mr-2"}`}
            />
            {t("dashboard.manageOffers")}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t("dashboard.totalOffers")}
          value={totalOffers}
          description="جميع عروضك"
          icon={Package}
        />
        <StatsCard
          title="العروض النشطة"
          value={activeOffers}
          description="المنشورة حالياً"
          icon={CheckCircle}
          className="bg-green-50 border-green-200"
        />
        <StatsCard
          title="إجمالي المشاهدات"
          value={totalViews.toLocaleString()}
          description="عبر جميع العروض"
          icon={Eye}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title={t("dashboard.totalRedemptions")}
          value={totalRedemptions}
          description="العروض المستبدلة"
          icon={ShoppingCart}
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>{t("offers.offersStatus")}</CardTitle>
          <CardDescription>{t("offers.currentStatus")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-center gap-3 p-4 rounded-lg border">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeOffers}</p>
                <p className="text-sm text-green-600">{t("common.active")}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg border">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingOffers}</p>
                <p className="text-sm text-yellow-600">{t("common.pending")}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg border">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rejectedOffers}</p>
                <p className="text-sm text-red-600">{t("common.rejected")}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg border">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalOffers}</p>
                <p className="text-sm text-blue-600">{t("common.total")}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Offers */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>العروض الحديثة</CardTitle>
                <CardDescription>آخر العروض التي قمت بإنشائها</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/supplier/offers")}
              >
                {t("common.viewAll")}
              </Button>
            </CardHeader>
            <CardContent>
              {recentOffers.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    لا توجد عروض بعد
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    أنشئ عرضك الأول للبدء
                  </p>
                  <Button onClick={() => navigate("/supplier/create-offer")}>
                    <Plus
                      className={`w-4 h-4 ${i18n.language === "ar" ? "ml-2" : "mr-2"}`}
                    />
                    {t("offers.createOffer")}
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {recentOffers.slice(0, 4).map((offer) => (
                    <OfferCard
                      key={offer.id}
                      offer={offer}
                      onEdit={handleEditOffer}
                      onDelete={handleDeleteOffer}
                      variant="supplier"
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                {t("analytics.performance")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  متوسط المشاهدات لكل عرض
                </span>
                <span className="font-semibold">
                  {totalOffers > 0 ? Math.round(totalViews / totalOffers) : 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  معدل التحويل
                </span>
                <span className="font-semibold">
                  {totalViews > 0
                    ? ((totalRedemptions / totalViews) * 100).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  معدل الموافقة
                </span>
                <span className="font-semibold">
                  {totalOffers > 0
                    ? ((activeOffers / totalOffers) * 100).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Offers */}
          {topOffers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {t("dashboard.topPerformers")}
                </CardTitle>
                <CardDescription>عروضك الأكثر شعبية</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topOffers.map((offer, index) => (
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
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pending Approvals */}
          {pendingOffers > 0 && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-700">
                  <Clock className="w-5 h-5" />
                  في انتظار الموافقة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-yellow-700 mb-3">
                  لديك {pendingOffers} عرض{pendingOffers !== 1 ? " عروض" : ""}{" "}
                  في انتظار موافقة المشرف.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate("/supplier/offers")}
                >
                  عرض العروض المعلقة
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.quickActions")}</CardTitle>
          <CardDescription>{t("dashboard.commonTasks")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => navigate("/supplier/create-offer")}
            >
              <Plus className="w-6 h-6" />
              <span>{t("offers.createOffer")}</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => navigate("/supplier/offers")}
            >
              <Package className="w-6 h-6" />
              <span>{t("dashboard.manageOffers")}</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => navigate("/supplier/analytics")}
            >
              <BarChart3 className="w-6 h-6" />
              <span>{t("dashboard.viewAnalytics")}</span>
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
