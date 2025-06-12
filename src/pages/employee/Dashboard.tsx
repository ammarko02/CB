import { useEffect, useState } from "react";
import { Offer, Redemption } from "@/types";
import { offerService, redemptionService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
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
  Gift,
  TrendingUp,
  Star,
  Calendar,
  ArrowRight,
  Heart,
  Clock,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  formatDate,
  getDaysUntilExpiry,
  isExpiringSoon,
} from "@/lib/dateUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [points] = useState(850); // Mock points balance

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [offersResponse, redemptionsResponse] = await Promise.all([
        offerService.getOffers({ limit: 6 }),
        redemptionService.getUserRedemptions(user?.id || ""),
      ]);

      // Filter only approved offers for employees
      const approvedOffers = offersResponse.data.filter(
        (offer) => offer.status === "approved",
      );
      setOffers(approvedOffers);
      setRedemptions(redemptionsResponse.data);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast({
        title: t("errors.loadingFailed"),
        description: t("errors.tryAgain"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedeemOffer = async (offerId: string) => {
    try {
      await redemptionService.redeemOffer(offerId);
      // Refresh data after redemption
      loadDashboardData();
      toast({
        title: t("notifications.success"),
        description: t("offers.offerRedeemed"),
      });
    } catch (error) {
      toast({
        title: t("notifications.error"),
        description: t("offers.redemptionFailed"),
        variant: "destructive",
      });
      throw error;
    }
  };

  const featuredOffers = offers.slice(0, 3);
  const recentRedemptions = redemptions.slice(0, 3);
  const expiringOffers = offers.filter((offer) =>
    isExpiringSoon(offer.expiryDate, 7),
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
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
            {t("dashboard.welcomeBack")}, {user?.firstName}! 👋
          </h1>
          <p className="text-muted-foreground">{t("app.description")}</p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button onClick={() => navigate("/employee/offers")}>
            <Package className="w-4 h-4 mr-2" />
            {t("offers.browseOffers")}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title={t("dashboard.pointsBalance")}
          value={`${points.toLocaleString()}`}
          description={t("dashboard.availablePoints")}
          icon={Gift}
          className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"
        />
        <StatsCard
          title={t("dashboard.offersRedeemed")}
          value={redemptions.length}
          description={t("dashboard.thisMonth")}
          icon={TrendingUp}
          trend={{ value: 25, isPositive: true }}
        />
        <StatsCard
          title={t("dashboard.savingsEarned")}
          value={`${redemptions.reduce((sum, r) => sum + r.pointsUsed, 0)} نقطة`}
          description={t("dashboard.totalSavings")}
          icon={Star}
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Featured Offers */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t("dashboard.featuredOffers")}</CardTitle>
                <CardDescription>
                  {t("dashboard.handpickedOffers")}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/employee/offers")}
              >
                {t("common.viewAll")}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {featuredOffers.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {t("offers.noOffersFound")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("dashboard.checkBackLater")}
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {featuredOffers.map((offer) => (
                    <OfferCard
                      key={offer.id}
                      offer={offer}
                      onRedeem={handleRedeemOffer}
                      variant="default"
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Points Card */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-purple-600" />
                {t("dashboard.yourPoints")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {points.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("dashboard.pointsAvailable")}
                </p>
                <div className="w-full bg-purple-200 rounded-full h-2 mb-3">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min((points / 1000) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {1000 - points > 0
                    ? t("dashboard.pointsUntilNext", { points: 1000 - points })
                    : t("dashboard.maxLevelReached")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Expiring Soon */}
          {expiringOffers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <Clock className="w-5 h-5" />
                  {t("offers.expiringOffer")}
                </CardTitle>
                <CardDescription>
                  {t("dashboard.dontMissOffers")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expiringOffers.slice(0, 3).map((offer) => {
                    const daysLeft = getDaysUntilExpiry(offer.expiryDate);
                    return (
                      <div
                        key={offer.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-orange-200 bg-orange-50"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{offer.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {t("offers.by")} {offer.supplierName}
                          </p>
                          <Badge variant="destructive" className="text-xs mt-1">
                            {daysLeft}{" "}
                            {daysLeft === 1
                              ? t("offers.dayLeft")
                              : t("offers.daysLeft")}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => navigate("/employee/offers")}
                        >
                          {t("common.viewAll")}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t("dashboard.recentActivity")}</CardTitle>
                <CardDescription>
                  {t("dashboard.latestRedemptions")}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/employee/redemptions")}
              >
                {t("common.viewAll")}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentRedemptions.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <Heart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">{t("dashboard.noRedemptions")}</p>
                  </div>
                ) : (
                  recentRedemptions.map((redemption) => (
                    <div
                      key={redemption.id}
                      className="flex items-center gap-3 p-3 rounded-lg border"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Gift className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {redemption.offer.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(
                            redemption.redeemedAt,
                            "MMM dd, yyyy",
                            i18n.language,
                          )}
                        </p>
                        <Badge variant="outline" className="text-xs mt-1">
                          -{redemption.pointsUsed} {t("common.points")}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
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
              onClick={() => navigate("/employee/offers")}
            >
              <Package className="w-6 h-6" />
              <span>{t("offers.browseOffers")}</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => navigate("/employee/favorites")}
            >
              <Heart className="w-6 h-6" />
              <span>{t("navigation.favorites")}</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => navigate("/employee/redemptions")}
            >
              <Clock className="w-6 h-6" />
              <span>{t("navigation.myRedemptions")}</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => navigate("/profile")}
            >
              <Star className="w-6 h-6" />
              <span>{t("common.profile")}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
