import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DiscountCard as DiscountCardType, Redemption } from "@/types";
import { redemptionService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CreditCard,
  QrCode,
  Calendar,
  MapPin,
  Search,
  Eye,
  Download,
  Globe,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  Copy,
} from "lucide-react";
import { DiscountCard } from "@/components/DiscountCard";
import { formatDate } from "@/lib/dateUtils";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyRedemptions() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCard, setSelectedCard] = useState<DiscountCardType | null>(
    null,
  );
  const [showCardModal, setShowCardModal] = useState(false);

  useEffect(() => {
    loadRedemptions();
  }, []);

  const loadRedemptions = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await redemptionService.getEmployeeRedemptions(user.id);
      setRedemptions(response.data);
    } catch (error) {
      console.error("Failed to load redemptions:", error);
      toast({
        title: "خطأ في التحميل",
        description: "فشل في تحميل العروض المستبدلة",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateDiscountCard = (redemption: Redemption): DiscountCardType => {
    return {
      id: `card_${redemption.id}`,
      employeeId: user!.id,
      employeeName: `${user!.firstName} ${user!.lastName}`,
      employeeDepartment: user!.department || "غير محدد",
      companyName: "Happy Perks Hub",
      offerId: redemption.offer.id,
      offerTitle: redemption.offer.title,
      supplierName: redemption.offer.supplierName,
      discountPercentage: redemption.offer.discountPercentage,
      generatedAt: redemption.redeemedAt,
      expiryDate: redemption.offer.expiryDate,
      barcode:
        `DC${redemption.offer.id.substring(0, 4)}${user!.id.substring(0, 4)}${Date.now().toString().slice(-6)}`.toUpperCase(),
      branchAddress: redemption.offer.branchAddress,
      discountCode:
        redemption.offer.redemptionType === "online"
          ? generateDiscountCode(redemption)
          : undefined,
      isUsed: redemption.status === "used",
      usedAt: redemption.status === "used" ? redemption.redeemedAt : undefined,
    };
  };

  const generateDiscountCode = (redemption: Redemption): string => {
    if (redemption.offer.discountCodeType === "supplier_provided") {
      return redemption.offer.supplierDiscountCode || "";
    }
    // Generate auto code based on offer and employee
    return `${redemption.offer.id.substring(0, 3).toUpperCase()}${user!.id.substring(0, 3).toUpperCase()}${redemption.offer.discountPercentage}`;
  };

  const copyDiscountCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "تم النسخ!",
      description: "تم نسخ كود الخصم إلى الحافظة",
    });
  };

  const filteredRedemptions = redemptions.filter(
    (redemption) =>
      redemption.offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      redemption.offer.supplierName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const activeRedemptions = filteredRedemptions.filter(
    (r) => r.status === "active",
  );
  const usedRedemptions = filteredRedemptions.filter(
    (r) => r.status === "used",
  );
  const expiredRedemptions = filteredRedemptions.filter(
    (r) => r.status === "expired",
  );

  const handleViewCard = (redemption: Redemption) => {
    const card = generateDiscountCard(redemption);
    setSelectedCard(card);
    setShowCardModal(true);
  };

  const RedemptionCard = ({ redemption }: { redemption: Redemption }) => {
    const card = generateDiscountCard(redemption);
    const isExpired = new Date(redemption.offer.expiryDate) < new Date();
    const isUsed = redemption.status === "used";

    return (
      <Card
        className={`transition-all duration-200 hover:shadow-md ${isUsed ? "opacity-75" : isExpired ? "opacity-60" : ""}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant={
                    isUsed ? "secondary" : isExpired ? "destructive" : "default"
                  }
                >
                  {isUsed ? "مستخدم" : isExpired ? "منتهي الصلاحية" : "نشط"}
                </Badge>
                <Badge variant="outline">
                  {redemption.offer.redemptionType === "online" ? (
                    <Globe className="w-3 h-3 ml-1" />
                  ) : (
                    <Building className="w-3 h-3 ml-1" />
                  )}
                  {redemption.offer.redemptionType === "online"
                    ? "إلكتروني"
                    : "فرع"}
                </Badge>
              </div>
              <h3 className="font-semibold text-lg leading-tight">
                {redemption.offer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {redemption.offer.supplierName}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {redemption.offer.discountPercentage}%
              </div>
              <div className="text-xs text-muted-foreground">خصم</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Redemption Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>
                استُبدل:{" "}
                {formatDate(
                  redemption.redeemedAt,
                  "MMM dd, yyyy",
                  i18n.language,
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>
                ينتهي:{" "}
                {formatDate(
                  redemption.offer.expiryDate,
                  "MMM dd, yyyy",
                  i18n.language,
                )}
              </span>
            </div>
          </div>

          {/* Online Offer Discount Code */}
          {redemption.offer.redemptionType === "online" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-800 text-sm">كود الخصم</p>
                  <p className="font-mono text-lg font-bold text-blue-900">
                    {card.discountCode}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyDiscountCode(card.discountCode!)}
                  className="flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  نسخ
                </Button>
              </div>
              {redemption.offer.websiteUrl && (
                <Button
                  variant="default"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() =>
                    window.open(redemption.offer.websiteUrl, "_blank")
                  }
                >
                  <Globe className="w-4 h-4 ml-1" />
                  زيارة الموقع
                </Button>
              )}
            </div>
          )}

          {/* Branch Offer Address */}
          {redemption.offer.redemptionType === "branch" &&
            redemption.offer.branchAddress && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-purple-800 text-sm">
                      عنوان الفرع
                    </p>
                    <p className="text-purple-700 text-sm">
                      {redemption.offer.branchAddress}
                    </p>
                  </div>
                </div>
              </div>
            )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Dialog open={showCardModal} onOpenChange={setShowCardModal}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleViewCard(redemption)}
                  disabled={isExpired}
                >
                  <Eye className="w-4 h-4 ml-1" />
                  عرض البطاقة
                </Button>
              </DialogTrigger>
            </Dialog>

            {redemption.offer.redemptionType === "online" &&
              redemption.offer.websiteUrl && (
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() =>
                    window.open(redemption.offer.websiteUrl, "_blank")
                  }
                  disabled={isExpired}
                >
                  <Globe className="w-4 h-4 ml-1" />
                  زيارة الموقع
                </Button>
              )}
          </div>

          {/* Status Info */}
          {isUsed && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4" />
                <span>تم استخدام هذا العرض</span>
              </div>
            </div>
          )}

          {isExpired && !isUsed && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-2">
              <div className="flex items-center gap-2 text-sm text-red-600">
                <XCircle className="w-4 h-4" />
                <span>انتهت صلاحية هذا العرض</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const LoadingSkeleton = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-64" />
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-64" />
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">عروضي المستبدلة</h1>
        <p className="text-muted-foreground">
          جميع العروض التي استبدلتها وكوبونات الخصم الخاصة بك
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="البحث في العروض المستبدلة..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={i18n.language === "ar" ? "pr-9" : "pl-9"}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">
            نشطة ({activeRedemptions.length})
          </TabsTrigger>
          <TabsTrigger value="used">
            مستخدمة ({usedRedemptions.length})
          </TabsTrigger>
          <TabsTrigger value="expired">
            منتهية الصلاحية ({expiredRedemptions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {activeRedemptions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CreditCard className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  لا توجد عروض نشطة
                </h3>
                <p className="text-muted-foreground text-center">
                  لا توجد عروض نشطة حالياً. استبدل عروض جديدة لتظهر هنا.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeRedemptions.map((redemption) => (
                <RedemptionCard key={redemption.id} redemption={redemption} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="used">
          {usedRedemptions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  لا توجد عروض مستخدمة
                </h3>
                <p className="text-muted-foreground text-center">
                  العروض التي استخدمتها ستظهر هنا.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {usedRedemptions.map((redemption) => (
                <RedemptionCard key={redemption.id} redemption={redemption} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="expired">
          {expiredRedemptions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <XCircle className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  لا توجد عروض منتهية الصلاحية
                </h3>
                <p className="text-muted-foreground text-center">
                  العروض المنتهية الصلاحية ستظهر هنا.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {expiredRedemptions.map((redemption) => (
                <RedemptionCard key={redemption.id} redemption={redemption} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Discount Card Modal */}
      <Dialog open={showCardModal} onOpenChange={setShowCardModal}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>بطاقة الخصم</DialogTitle>
          </DialogHeader>
          {selectedCard && (
            <DiscountCard
              discountCard={selectedCard}
              onDownload={() => {
                toast({
                  title: "تم تحميل البطاقة!",
                  description: "تم حفظ بطاقة الخصم بنجاح",
                });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
