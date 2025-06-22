import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import {
  DirectionAwareText,
  DirectionAwareHeading,
  DirectionAwareParagraph,
} from "@/components/DirectionAwareText";
import {
  TranslatedText,
  TranslatedHeading,
  TranslatedParagraph,
} from "@/components/TranslatedText";
import { StatsCard } from "@/components/StatsCard";
import { OfferCard } from "@/components/OfferCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  Zap,
  ShoppingCart,
  TrendingUp,
  History,
  Heart,
  Star,
  Gift,
  Trophy,
  Target,
} from "lucide-react";
import { Offer, UserStats } from "@/types";
import { cn } from "@/lib/utils";

export default function EmployeeDashboard() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats>({
    pointsBalance: 1250,
    offersRedeemed: 8,
    savingsEarned: 2450,
    favoriteOffers: 15,
  });

  const [featuredOffers, setFeaturedOffers] = useState<Offer[]>([
    {
      id: "1",
      title: "خصم 20% في مطعم البيتزا",
      description: "استمتع بأشهى البيتزا مع خصم 20% على جميع عناصر القائمة",
      discount: 20,
      pointsCost: 150,
      originalPrice: 100,
      finalPrice: 80,
      supplier: "مطعم البيتزا الذهبية",
      category: "food",
      expiryDate: "2025-07-22",
      imageUrl: "/placeholder.svg",
      status: "approved",
      redemptionType: "branch",
      branchAddress: "شارع الأمير محمد بن عبدالعزيز، وسط المدينة، الرياض",
      views: 234,
      redemptions: 45,
    },
    {
      id: "2",
      title: "تخفيضات حصرية على الملابس",
      description:
        "اكتشف أحدث الصيحات في عالم الموضة مع تشكيلة متنوعة من الملابس",
      discount: 30,
      pointsCost: 200,
      originalPrice: 200,
      finalPrice: 140,
      supplier: "متجر الأناقة",
      category: "retail",
      expiryDate: "2025-07-12",
      imageUrl: "/placeholder.svg",
      status: "approved",
      redemptionType: "branch",
      branchAddress: "طريق الملك فهد، حي العليا، الرياض",
      views: 189,
      redemptions: 23,
    },
    {
      id: "3",
      title: "دورة برمجة مجانية",
      description:
        "تعلم أساسيات البرمجة مع مدربين محترفين عبر منصتنا التعليمية",
      discount: 0,
      pointsCost: 400,
      originalPrice: 500,
      finalPrice: 0,
      supplier: "أكاديمية التقنية",
      category: "technology",
      expiryDate: "2025-08-21",
      imageUrl: "/placeholder.svg",
      status: "approved",
      redemptionType: "online",
      websiteUrl: "https://tech-academy.example.com",
      views: 156,
      redemptions: 67,
    },
  ]);

  const [recentRedemptions] = useState([
    {
      id: "1",
      offerTitle: "خصم 25% على القهوة",
      supplier: "مقهى المذاق",
      redeemedAt: "2024-01-15",
      pointsUsed: 100,
      savings: 15,
    },
    {
      id: "2",
      offerTitle: "تخفيض على الكتب",
      supplier: "مكتبة المعرفة",
      redeemedAt: "2024-01-12",
      pointsUsed: 80,
      savings: 25,
    },
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const pointsToNextLevel = 1500 - userStats.pointsBalance;
  const progressToNextLevel = (userStats.pointsBalance / 1500) * 100;

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
    <div
      className={cn(
        "container mx-auto p-6 space-y-6",
        isRTL ? "rtl-content" : "ltr-content",
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Welcome Section */}
      <div
        className={cn(
          "flex flex-col sm:flex-row items-start sm:items-center gap-4",
          isRTL ? "sm:flex-row-reverse justify-between" : "justify-between",
        )}
      >
        <div className={cn("space-y-2", isRTL ? "text-right" : "text-left")}>
          <DirectionAwareHeading level={1} className="text-3xl font-bold">
            <TranslatedText tKey="dashboard.welcomeBack" />, {user?.firstName}!
            👋
          </DirectionAwareHeading>
          <DirectionAwareParagraph className="text-muted-foreground pb-5">
            <TranslatedText tKey="app.description" />
          </DirectionAwareParagraph>
        </div>
        <div
          className={cn(
            "flex gap-2 mt-4 sm:mt-0",
            isRTL ? "flex-row-reverse" : "flex-row",
          )}
        >
          <Button
            onClick={() => navigate("/employee/offers")}
            className={cn(isRTL ? "flex-row-reverse" : "flex-row")}
          >
            <Package className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
            <TranslatedText tKey="offers.browseOffers" />
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/employee/my-redemptions")}
            className={cn(isRTL ? "flex-row-reverse" : "flex-row")}
          >
            <History className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
            <TranslatedText tKey="navigation.myRedemptions" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title={<TranslatedText tKey="dashboard.pointsBalance" />}
          description={<TranslatedText tKey="dashboard.availablePoints" />}
          value={userStats.pointsBalance.toLocaleString(
            isRTL ? "ar-SA" : "en-US",
          )}
          icon={Zap}
          className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"
        />
        <StatsCard
          title={<TranslatedText tKey="dashboard.offersRedeemed" />}
          description={<TranslatedText tKey="dashboard.thisMonth" />}
          value={userStats.offersRedeemed.toString()}
          icon={ShoppingCart}
        />
        <StatsCard
          title={<TranslatedText tKey="dashboard.savingsEarned" />}
          description={<TranslatedText tKey="dashboard.totalSavings" />}
          value={`${userStats.savingsEarned.toLocaleString(isRTL ? "ar-SA" : "en-US")} ${isRTL ? "ر.س" : "SAR"}`}
          icon={TrendingUp}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Featured Offers */}
        <div>
          <Card>
            <CardHeader
              className={cn(
                "flex justify-between",
                isRTL ? "flex-row-reverse" : "flex-row",
              )}
            >
              <div>
                <DirectionAwareText as="h3" className="text-2xl font-semibold">
                  <TranslatedText tKey="dashboard.featuredOffers" />
                </DirectionAwareText>
                <DirectionAwareText as="p" className="text-muted-foreground">
                  <TranslatedText tKey="dashboard.handpickedOffers" />
                </DirectionAwareText>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate("/employee/offers")}
                className={cn(isRTL ? "flex-row-reverse" : "flex-row")}
              >
                <TranslatedText tKey="common.viewAll" />
                <Package className={cn("w-4 h-4", isRTL ? "mr-2" : "ml-2")} />
              </Button>
            </CardHeader>
            <CardContent>
              {featuredOffers.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {featuredOffers.slice(0, 4).map((offer) => (
                    <OfferCard key={offer.id} offer={offer} compact />
                  ))}
                </div>
              ) : (
                <div
                  className={cn(
                    "text-center py-8",
                    isRTL ? "text-right" : "text-left",
                  )}
                >
                  <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <DirectionAwareParagraph className="text-muted-foreground">
                    <TranslatedText tKey="dashboard.checkBackLater" />
                  </DirectionAwareParagraph>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Points Progress & Recent Activity */}
        <div className="space-y-6">
          {/* Points Progress */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <DirectionAwareText as="h3" className="font-semibold">
                    <TranslatedText tKey="dashboard.yourPoints" />
                  </DirectionAwareText>
                  <DirectionAwareText
                    as="p"
                    className="text-sm text-muted-foreground"
                  >
                    <TranslatedText tKey="dashboard.pointsAvailable" />
                  </DirectionAwareText>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div
                  className={cn(
                    "flex justify-between text-sm mb-2",
                    isRTL ? "flex-row-reverse" : "flex-row",
                  )}
                >
                  <DirectionAwareText className="font-medium ltr-content">
                    {userStats.pointsBalance.toLocaleString(
                      isRTL ? "ar-SA" : "en-US",
                    )}
                  </DirectionAwareText>
                  <DirectionAwareText className="text-muted-foreground ltr-content">
                    1,500
                  </DirectionAwareText>
                </div>
                <Progress value={progressToNextLevel} className="h-2" />
              </div>
              {pointsToNextLevel > 0 ? (
                <DirectionAwareParagraph className="text-xs text-muted-foreground">
                  <TranslatedText
                    tKey="dashboard.pointsUntilNext"
                    values={{
                      points: pointsToNextLevel.toLocaleString(
                        isRTL ? "ar-SA" : "en-US",
                      ),
                    }}
                  />
                </DirectionAwareParagraph>
              ) : (
                <DirectionAwareParagraph className="text-xs text-green-600 font-medium">
                  <TranslatedText tKey="dashboard.maxLevelReached" />
                </DirectionAwareParagraph>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader
              className={cn(
                "flex justify-between",
                isRTL ? "flex-row-reverse" : "flex-row",
              )}
            >
              <div>
                <DirectionAwareText as="h3" className="text-xl font-semibold">
                  <TranslatedText tKey="dashboard.recentActivity" />
                </DirectionAwareText>
                <DirectionAwareText as="p" className="text-muted-foreground">
                  <TranslatedText tKey="dashboard.latestRedemptions" />
                </DirectionAwareText>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/employee/redemptions")}
                className={cn(isRTL ? "flex-row-reverse" : "flex-row")}
              >
                <History className={cn("w-4 h-4", isRTL ? "ml-1" : "mr-1")} />
                <TranslatedText tKey="common.viewAll" />
              </Button>
            </CardHeader>
            <CardContent>
              {recentRedemptions.length > 0 ? (
                <div className="space-y-3">
                  {recentRedemptions.map((redemption) => (
                    <div
                      key={redemption.id}
                      className={cn(
                        "flex justify-between items-center p-3 rounded-lg border",
                        isRTL ? "flex-row-reverse" : "flex-row",
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center gap-3",
                          isRTL ? "flex-row-reverse" : "flex-row",
                        )}
                      >
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Gift className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <DirectionAwareText className="font-medium text-sm">
                            {redemption.offerTitle}
                          </DirectionAwareText>
                          <DirectionAwareText className="text-xs text-muted-foreground">
                            {redemption.supplier}
                          </DirectionAwareText>
                        </div>
                      </div>
                      <div
                        className={cn(
                          "text-right",
                          isRTL ? "text-left" : "text-right",
                        )}
                      >
                        <DirectionAwareText className="text-sm font-medium text-green-600 ltr-content">
                          +
                          {redemption.savings.toLocaleString(
                            isRTL ? "ar-SA" : "en-US",
                          )}{" "}
                          {isRTL ? "ر.س" : "SAR"}
                        </DirectionAwareText>
                        <DirectionAwareText className="text-xs text-muted-foreground ltr-content">
                          -
                          {redemption.pointsUsed.toLocaleString(
                            isRTL ? "ar-SA" : "en-US",
                          )}{" "}
                          {isRTL ? "نقطة" : "pts"}
                        </DirectionAwareText>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className={cn(
                    "text-center py-6",
                    isRTL ? "text-right" : "text-left",
                  )}
                >
                  <History className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <DirectionAwareParagraph className="text-sm text-muted-foreground">
                    <TranslatedText tKey="dashboard.noRedemptions" />
                  </DirectionAwareParagraph>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <DirectionAwareText as="h3" className="text-xl font-semibold">
                <TranslatedText tKey="dashboard.quickActions" />
              </DirectionAwareText>
              <DirectionAwareText as="p" className="text-muted-foreground">
                <TranslatedText tKey="dashboard.commonTasks" />
              </DirectionAwareText>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate("/employee/offers")}
                  className={cn(
                    "justify-start",
                    isRTL ? "flex-row-reverse justify-end" : "justify-start",
                  )}
                >
                  <Package className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
                  <TranslatedText tKey="offers.browseOffers" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/employee/favorites")}
                  className={cn(
                    "justify-start",
                    isRTL ? "flex-row-reverse justify-end" : "justify-start",
                  )}
                >
                  <Heart className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
                  <TranslatedText tKey="navigation.favorites" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/employee/my-redemptions")}
                  className={cn(
                    "justify-start",
                    isRTL ? "flex-row-reverse justify-end" : "justify-start",
                  )}
                >
                  <Target className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
                  <TranslatedText tKey="navigation.myRedemptions" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
