import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Offer, OfferStatus } from "@/types";
import { offerService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { OfferCard } from "@/components/OfferCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Download,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  TrendingUp,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { OFFER_CATEGORIES, OFFER_STATUS_COLORS } from "@/lib/constants";
import { formatDate, getDaysUntilExpiry } from "@/lib/dateUtils";

export default function SupplierOffers() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<OfferStatus | "all">(
    "all",
  );

  useEffect(() => {
    loadOffers();
  }, []);

  useEffect(() => {
    filterOffers();
  }, [offers, searchTerm, selectedCategory, selectedStatus]);

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
        description: "فشل في تحميل العروض",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterOffers = () => {
    let filtered = [...offers];

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((offer) => offer.status === selectedStatus);
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (offer) => offer.category === selectedCategory,
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (offer) =>
          offer.title.toLowerCase().includes(term) ||
          offer.description.toLowerCase().includes(term),
      );
    }

    setFilteredOffers(filtered);
  };

  const handleDeleteOffer = async (offerId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العرض؟")) return;

    try {
      await offerService.deleteOffer(offerId);
      setOffers((prev) => prev.filter((offer) => offer.id !== offerId));
      toast({
        title: t("notifications.success"),
        description: "تم حذف العرض بنجاح",
      });
    } catch (error) {
      toast({
        title: t("notifications.error"),
        description: "فشل في حذف العرض",
        variant: "destructive",
      });
    }
  };

  const handleEditOffer = (offer: Offer) => {
    navigate("/supplier/create-offer", { state: { editOffer: offer } });
  };

  // Calculate stats
  const stats = {
    total: offers.length,
    pending: offers.filter((o) => o.status === "pending").length,
    approved: offers.filter((o) => o.status === "approved").length,
    rejected: offers.filter((o) => o.status === "rejected").length,
    totalViews: offers.reduce((sum, o) => sum + o.views, 0),
    totalRedemptions: offers.reduce((sum, o) => sum + o.redemptions, 0),
    expiringSoon: offers.filter(
      (o) =>
        getDaysUntilExpiry(o.expiryDate) <= 7 &&
        getDaysUntilExpiry(o.expiryDate) > 0,
    ).length,
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
        <div className="flex gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة العروض</h1>
          <p className="text-muted-foreground">
            إنشاء وإدارة عروضك ومتابعة أدائها
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button variant="outline" onClick={loadOffers}>
            <RefreshCw className="w-4 h-4 mr-2" />
            تحديث
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            تصدير
          </Button>
          <Button onClick={() => navigate("/supplier/create-offer")}>
            <Plus className="w-4 h-4 mr-2" />
            إنشاء عرض جديد
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {stats.total.toLocaleString("ar-SA")}
              </p>
              <p className="text-sm text-muted-foreground">إجمالي العروض</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {stats.approved.toLocaleString("ar-SA")}
              </p>
              <p className="text-sm text-muted-foreground">العروض المقبولة</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {stats.totalViews.toLocaleString("ar-SA")}
              </p>
              <p className="text-sm text-muted-foreground">إجمالي المشاهدات</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {stats.totalRedemptions.toLocaleString("ar-SA")}
              </p>
              <p className="text-sm text-muted-foreground">
                إجمالي الاستبدالات
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">حالة العروض</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">في الانتظار</span>
                <Badge variant="secondary">
                  {stats.pending.toLocaleString("ar-SA")}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">مقبولة</span>
                <Badge variant="default">
                  {stats.approved.toLocaleString("ar-SA")}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">مرفوضة</span>
                <Badge variant="destructive">
                  {stats.rejected.toLocaleString("ar-SA")}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">معدل الأداء</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">معدل المشاهدة</span>
                <span className="font-medium">
                  {stats.total > 0
                    ? Math.round(stats.totalViews / stats.total).toLocaleString(
                        "ar-SA",
                      )
                    : "0"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">معدل التحويل</span>
                <span className="font-medium">
                  {stats.totalViews > 0
                    ? (
                        (stats.totalRedemptions / stats.totalViews) *
                        100
                      ).toFixed(1)
                    : "0"}
                  %
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">معدل القبول</span>
                <span className="font-medium">
                  {stats.total > 0
                    ? ((stats.approved / stats.total) * 100).toFixed(1)
                    : "0"}
                  %
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">تنبيهات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.pending > 0 && (
                <div className="flex items-center gap-2 text-sm text-yellow-600">
                  <Clock className="w-4 h-4" />
                  {stats.pending} عرض في انتظار الموافقة
                </div>
              )}
              {stats.expiringSoon > 0 && (
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <Clock className="w-4 h-4" />
                  {stats.expiringSoon} عرض ينتهي قريباً
                </div>
              )}
              {stats.rejected > 0 && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <XCircle className="w-4 h-4" />
                  {stats.rejected} عرض مرفوض
                </div>
              )}
              {stats.pending === 0 &&
                stats.expiringSoon === 0 &&
                stats.rejected === 0 && (
                  <div className="text-sm text-green-600">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    جميع العروض في حالة جيدة
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="البحث في العروض..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="جميع الفئات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("offers.allCategories")}</SelectItem>
                {Object.keys(OFFER_CATEGORIES).map((key) => (
                  <SelectItem key={key} value={key}>
                    {t(`categories.${key}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedStatus}
              onValueChange={(value) =>
                setSelectedStatus(value as OfferStatus | "all")
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="جميع الحالات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">في الانتظار</SelectItem>
                <SelectItem value="approved">مقبول</SelectItem>
                <SelectItem value="rejected">مرفوض</SelectItem>
                <SelectItem value="expired">منتهي الصلاحية</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Offers Tabs */}
      <Tabs
        value={selectedStatus === "all" ? "all" : selectedStatus}
        onValueChange={(value) =>
          setSelectedStatus(value as OfferStatus | "all")
        }
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            الكل ({stats.total})
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            انتظار ({stats.pending})
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            مقبول ({stats.approved})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            مرفوض ({stats.rejected})
          </TabsTrigger>
          <TabsTrigger value="expired" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            منتهي الصلاحية
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedStatus} className="mt-6">
          {filteredOffers.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">لا توجد عروض</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm ||
                  selectedCategory !== "all" ||
                  selectedStatus !== "all"
                    ? "لا توجد عروض تطابق معايير البحث المحددة."
                    : "لم تقم بإنشاء أي عروض بعد. ابدأ بإنشاء عرضك الأول!"}
                </p>
                {!searchTerm &&
                  selectedCategory === "all" &&
                  selectedStatus === "all" && (
                    <Button onClick={() => navigate("/supplier/create-offer")}>
                      <Plus className="w-4 h-4 mr-2" />
                      إنشاء عرض جديد
                    </Button>
                  )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredOffers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onEdit={handleEditOffer}
                  onDelete={handleDeleteOffer}
                  variant="supplier"
                  showActions={true}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
