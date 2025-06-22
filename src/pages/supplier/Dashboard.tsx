import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  DirectionAwareText,
  DirectionAwareHeading,
} from "@/components/DirectionAwareText";
import { TranslatedText, TranslatedHeading } from "@/components/TranslatedText";
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
  Plus,
  TrendingUp,
  BarChart3,
  Eye,
  ShoppingCart,
  DollarSign,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Offer } from "@/types";

export default function SupplierDashboard() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOffers: 0,
    approvedOffers: 0,
    pendingOffers: 0,
    totalViews: 0,
    totalRedemptions: 0,
    totalRevenue: 0,
  });

  const [myOffers, setMyOffers] = useState<Offer[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Simulate API calls
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStats({
        totalOffers: 12,
        approvedOffers: 8,
        pendingOffers: 2,
        totalViews: 4520,
        totalRedemptions: 346,
        totalRevenue: 87500,
      });

      setMyOffers([
        {
          id: "1",
          title: "خصم 30% على منتجات التقنية",
          description: "خصم حصري على أحدث الأجهزة الإلكترونية والتقنية",
          discount: 30,
          pointsCost: 200,
          originalPrice: 1000,
          finalPrice: 700,
          supplier: user?.firstName + " " + user?.lastName || "My Store",
          category: "technology",
          expiryDate: "2025-08-15",
          imageUrl: "/placeholder.svg",
          status: "approved",
          redemptionType: "online",
          views: 856,
          redemptions: 45,
        },
        {
          id: "2",
          title: "عرض خاص على وجبات الطعام",
          description: "استمتع بأشهى الوجبات مع خصم مميز",
          discount: 25,
          pointsCost: 120,
          originalPrice: 80,
          finalPrice: 60,
          supplier: user?.firstName + " " + user?.lastName || "My Store",
          category: "food",
          expiryDate: "2025-07-30",
          imageUrl: "/placeholder.svg",
          status: "pending",
          redemptionType: "branch",
          branchAddress: "شارع التحلية، الرياض",
          views: 432,
          redemptions: 12,
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
      title: isRTL ? "إنشاء عرض جديد" : "Create New Offer",
      description: isRTL
        ? "أضف عرض جديد لعملائك"
        : "Add a new offer for your customers",
      icon: Plus,
      action: () => navigate("/supplier/create-offer"),
      color: "blue",
    },
    {
      title: isRTL ? "إدارة العروض" : "Manage Offers",
      description: isRTL
        ? "عرض وتعديل العروض الحالية"
        : "View and edit current offers",
      icon: Package,
      action: () => navigate("/supplier/offers"),
      color: "green",
    },
    {
      title: isRTL ? "التحليلات" : "Analytics",
      description: isRTL
        ? "رؤى تفصيلية عن الأداء"
        : "Detailed performance insights",
      icon: BarChart3,
      action: () => navigate("/supplier/analytics"),
      color: "purple",
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
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
            إدارة عروضك ومتابعة الأداء
          </DirectionAwareText>
        </div>
        <div
          className={cn("flex gap-2", isRTL ? "flex-row-reverse" : "flex-row")}
        >
          <Button
            onClick={() => navigate("/supplier/create-offer")}
            className={cn(isRTL ? "flex-row-reverse" : "flex-row")}
          >
            <Plus className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
            <TranslatedText tKey="navigation.createOffer" />
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/supplier/analytics")}
            className={cn(isRTL ? "flex-row-reverse" : "flex-row")}
          >
            <BarChart3 className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
            <TranslatedText tKey="navigation.analytics" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title={<TranslatedText tKey="dashboard.totalOffers" />}
          value={stats.totalOffers.toLocaleString(isRTL ? "ar-SA" : "en-US")}
          description={<TranslatedText tKey="offers.offersStatus" />}
          icon={Package}
          trend={{
            value: 15.2,
            isPositive: true,
          }}
        />
        <StatsCard
          title={<TranslatedText tKey="common.approved" />}
          value={stats.approvedOffers.toLocaleString(isRTL ? "ar-SA" : "en-US")}
          description={<TranslatedText tKey="offers.approved" />}
          icon={CheckCircle}
        />
        <StatsCard
          title={<TranslatedText tKey="common.pending" />}
          value={stats.pendingOffers.toLocaleString(isRTL ? "ar-SA" : "en-US")}
          description={<TranslatedText tKey="offers.pendingApproval" />}
          icon={Clock}
        />
        <StatsCard
          title={<TranslatedText tKey="offers.views" />}
          value={stats.totalViews.toLocaleString(isRTL ? "ar-SA" : "en-US")}
          description={<TranslatedText tKey="dashboard.thisMonth" />}
          icon={Eye}
          trend={{
            value: 8.7,
            isPositive: true,
          }}
        />
        <StatsCard
          title={<TranslatedText tKey="offers.redemptions" />}
          value={stats.totalRedemptions.toLocaleString(
            isRTL ? "ar-SA" : "en-US",
          )}
          description={<TranslatedText tKey="dashboard.totalRedemptions" />}
          icon={ShoppingCart}
          trend={{
            value: 12.3,
            isPositive: true,
          }}
        />
        <StatsCard
          title={<TranslatedText tKey="dashboard.totalRevenue" />}
          value={`${stats.totalRevenue.toLocaleString(isRTL ? "ar-SA" : "en-US")} ${isRTL ? "ر.س" : "SAR"}`}
          description={<TranslatedText tKey="dashboard.thisMonth" />}
          icon={DollarSign}
          trend={{
            value: 20.1,
            isPositive: true,
          }}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* My Offers */}
        <Card>
          <CardHeader
            className={cn(
              "flex",
              isRTL ? "flex-row-reverse justify-between" : "justify-between",
            )}
          >
            <div>
              <DirectionAwareText as="h3" className="text-xl font-semibold">
                <TranslatedText tKey="navigation.myOffers" />
              </DirectionAwareText>
              <DirectionAwareText className="text-muted-foreground">
                العروض الحالية وحالة الموافقة
              </DirectionAwareText>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/supplier/offers")}
              className={cn(isRTL ? "flex-row-reverse" : "flex-row")}
            >
              <TranslatedText tKey="common.viewAll" />
              <Package className={cn("w-4 h-4", isRTL ? "mr-1" : "ml-1")} />
            </Button>
          </CardHeader>
          <CardContent>
            {myOffers.length > 0 ? (
              <div className="space-y-4">
                {myOffers.slice(0, 3).map((offer) => (
                  <div
                    key={offer.id}
                    className={cn(
                      "p-4 border rounded-lg space-y-3",
                      isRTL ? "text-right" : "text-left",
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-start justify-between",
                        isRTL ? "flex-row-reverse" : "flex-row",
                      )}
                    >
                      <div className="flex-1">
                        <DirectionAwareText className="font-medium">
                          {offer.title}
                        </DirectionAwareText>
                        <DirectionAwareText className="text-sm text-muted-foreground mt-1">
                          {offer.description}
                        </DirectionAwareText>
                      </div>
                      <Badge
                        className={cn(
                          offer.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : offer.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800",
                        )}
                      >
                        {offer.status === "approved"
                          ? isRTL
                            ? "مقبول"
                            : "Approved"
                          : offer.status === "pending"
                            ? isRTL
                              ? "في الانتظار"
                              : "Pending"
                            : isRTL
                              ? "مرفوض"
                              : "Rejected"}
                      </Badge>
                    </div>
                    <div
                      className={cn(
                        "flex items-center gap-4 text-sm text-muted-foreground",
                        isRTL ? "flex-row-reverse justify-end" : "flex-row",
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center gap-1",
                          isRTL ? "flex-row-reverse" : "flex-row",
                        )}
                      >
                        <Eye className="w-4 h-4" />
                        <DirectionAwareText className="ltr-content">
                          {(offer.views || 0).toLocaleString(
                            isRTL ? "ar-SA" : "en-US",
                          )}
                        </DirectionAwareText>
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-1",
                          isRTL ? "flex-row-reverse" : "flex-row",
                        )}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <DirectionAwareText className="ltr-content">
                          {(offer.redemptions || 0).toLocaleString(
                            isRTL ? "ar-SA" : "en-US",
                          )}
                        </DirectionAwareText>
                      </div>
                      <DirectionAwareText className="ltr-content">
                        {offer.discount}% {isRTL ? "خصم" : "OFF"}
                      </DirectionAwareText>
                    </div>
                  </div>
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
                <DirectionAwareText className="text-muted-foreground">
                  لا توجد عروض بعد
                </DirectionAwareText>
                <Button
                  className={cn(
                    "mt-4",
                    isRTL ? "flex-row-reverse" : "flex-row",
                  )}
                  onClick={() => navigate("/supplier/create-offer")}
                >
                  <Plus className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
                  <TranslatedText tKey="navigation.createOffer" />
                </Button>
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
            <DirectionAwareText className="text-muted-foreground">
              <TranslatedText tKey="dashboard.commonTasks" />
            </DirectionAwareText>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
