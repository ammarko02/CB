import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Offer, Supplier } from "@/types";
import { offerService, userService } from "@/services/api";
import { MessageCenter } from "@/components/MessageCenter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Store,
  Package,
  Search,
  MoreVertical,
  Eye,
  UserX,
  UserCheck,
  MessageCircle,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Send,
  BarChart3,
  Calendar,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/dateUtils";
import { OFFER_STATUS_COLORS } from "@/lib/constants";

interface SupplierWithStats extends Supplier {
  totalOffers: number;
  approvedOffers: number;
  pendingOffers: number;
  rejectedOffers: number;
  totalRedemptions: number;
  revenue: number;
  averageRating: number;
  lastActive: string;
}

export default function AdminSuppliers() {
  const { t, i18n } = useTranslation();
  const [suppliers, setSuppliers] = useState<SupplierWithStats[]>([]);
  const [selectedSupplier, setSelectedSupplier] =
    useState<SupplierWithStats | null>(null);
  const [supplierOffers, setSupplierOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showOffers, setShowOffers] = useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setIsLoading(true);
      // Mock suppliers data with statistics
      const mockSuppliers: SupplierWithStats[] = [
        {
          id: "sup1",
          email: "contact@techstore.com",
          firstName: "محمد",
          lastName: "أحمد",
          role: "supplier",
          joinDate: new Date().toISOString(),
          isActive: true,
          companyName: "متجر التقنية المتقدمة",
          contactPhone: "+966501234567",
          website: "https://techstore.com",
          description: "متخصصون في توفير أحدث الأجهزة التقنية والحلول الرقمية",
          totalOffers: 25,
          approvedOffers: 20,
          pendingOffers: 3,
          rejectedOffers: 2,
          totalRedemptions: 450,
          revenue: 125000,
          averageRating: 4.8,
          lastActive: new Date().toISOString(),
        },
        {
          id: "sup2",
          email: "info@healthfitness.com",
          firstName: "فاطمة",
          lastName: "خالد",
          role: "supplier",
          joinDate: new Date().toISOString(),
          isActive: true,
          companyName: "مركز اللياقة والصحة",
          contactPhone: "+966507654321",
          website: "https://healthfitness.com",
          description: "نوادي صحية ومراكز لياقة بدنية متطورة",
          totalOffers: 15,
          approvedOffers: 12,
          pendingOffers: 2,
          rejectedOffers: 1,
          totalRedemptions: 280,
          revenue: 85000,
          averageRating: 4.6,
          lastActive: new Date().toISOString(),
        },
        {
          id: "sup3",
          email: "orders@fooddelivery.com",
          firstName: "عبدالله",
          lastName: "السعد",
          role: "supplier",
          joinDate: new Date().toISOString(),
          isActive: false,
          companyName: "خدمات توصيل الطعام",
          contactPhone: "+966509876543",
          website: "https://fooddelivery.com",
          description: "خدمة توصيل طعام سريعة وموثوقة",
          totalOffers: 8,
          approvedOffers: 5,
          pendingOffers: 0,
          rejectedOffers: 3,
          totalRedemptions: 120,
          revenue: 35000,
          averageRating: 3.9,
          lastActive: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ];
      setSuppliers(mockSuppliers);
    } catch (error) {
      console.error("Failed to load suppliers:", error);
      toast({
        title: "خطأ في التحميل",
        description: "فشل في تحميل بيانات الموردين",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadSupplierOffers = async (supplierId: string) => {
    try {
      setIsLoadingOffers(true);
      // Mock offers data for supplier
      const mockOffers: Offer[] = [
        {
          id: "off1",
          title: "خصم 30% على جميع اللابتوبات",
          description: "عرض خاص على أحدث أجهزة اللابتوب",
          discountPercentage: 30,
          category: "technology",
          expiryDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          status: "approved",
          supplierId: supplierId,
          supplierName: "متجر التقنية المتقدمة",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          views: 245,
          redemptions: 67,
          pointsCost: 300,
          location: "الرياض",
          termsConditions: "العرض ساري على المخزون المتاح فقط",
          redemptionType: "online",
          websiteUrl: "https://techstore.com/laptops",
          usageLimit: "once_per_employee",
          discountCodeType: "auto_generated",
        },
        {
          id: "off2",
          title: "خصم 25% على اكسسوارات الهواتف",
          description: "تشكيلة واسعة من اكسسوارات الهواتف الذكية",
          discountPercentage: 25,
          category: "technology",
          expiryDate: new Date(
            Date.now() + 20 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          status: "pending",
          supplierId: supplierId,
          supplierName: "متجر التقنية المتقدمة",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          views: 156,
          redemptions: 23,
          pointsCost: 200,
          location: "جدة",
          redemptionType: "branch",
          branchAddress: "شارع التحلية، جدة",
          usageLimit: "multiple_uses",
          usesPerEmployee: 2,
        },
      ];
      setSupplierOffers(mockOffers);
    } catch (error) {
      console.error("Failed to load supplier offers:", error);
      toast({
        title: "خطأ في التحميل",
        description: "فشل في تحميل عروض المورد",
        variant: "destructive",
      });
    } finally {
      setIsLoadingOffers(false);
    }
  };

  const toggleSupplierStatus = async (
    supplierId: string,
    isActive: boolean,
  ) => {
    try {
      setSuppliers((prev) =>
        prev.map((sup) =>
          sup.id === supplierId ? { ...sup, isActive: !isActive } : sup,
        ),
      );
      toast({
        title: isActive ? "تم إيقاف المورد" : "تم تفعيل المورد",
        description: isActive
          ? "تم إيقاف المورد عن تقديم العروض"
          : "تم تفعيل المورد لتقديم العروض",
      });
    } catch (error) {
      toast({
        title: "خطأ في التحديث",
        description: "فشل في تحديث حالة المورد",
        variant: "destructive",
      });
    }
  };

  const handleViewOffers = async (supplier: SupplierWithStats) => {
    setSelectedSupplier(supplier);
    setShowOffers(true);
    await loadSupplierOffers(supplier.id);
  };

  const handleSelectSupplier = (supplierId: string) => {
    setSelectedSuppliers((prev) =>
      prev.includes(supplierId)
        ? prev.filter((id) => id !== supplierId)
        : [...prev, supplierId],
    );
  };

  const handleSelectAll = () => {
    setSelectedSuppliers(
      selectedSuppliers.length === suppliers.length
        ? []
        : suppliers.map((sup) => sup.id),
    );
  };

  const sendMessageToSelected = () => {
    if (selectedSuppliers.length === 0) {
      toast({
        title: "لا يوجد اختيار",
        description: "يرجى اختيار موردين لإرسال الرسالة إليهم",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "إرسال رسالة جماعية",
      description: `سيتم إرسال رسالة إلى ${selectedSuppliers.length} مورد`,
    });
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "active" && supplier.isActive) ||
      (selectedStatus === "inactive" && !supplier.isActive);
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
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
          <h1 className="text-3xl font-bold">
            {showOffers
              ? `عروض ${selectedSupplier?.companyName}`
              : "إدارة الموردين"}
          </h1>
          <p className="text-muted-foreground">
            {showOffers ? "إدارة عروض المورد المحدد" : "إدارة الموردين وعروضهم"}
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          {showOffers && (
            <Button
              variant="outline"
              onClick={() => {
                setShowOffers(false);
                setSelectedSupplier(null);
              }}
            >
              العودة للموردين
            </Button>
          )}
          <MessageCenter
            trigger={
              <Button variant="outline">
                <MessageCircle className="w-4 h-4 ml-2" />
                الرسائل
              </Button>
            }
          />
          <Button onClick={loadSuppliers}>
            <RefreshCw className="w-4 h-4 ml-2" />
            تحديث
          </Button>
        </div>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={
                    showOffers ? "البحث في العروض..." : "البحث في الموردين..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              {!showOffers && (
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="inactive">معطل</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            {!showOffers && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleSelectAll}
                  disabled={suppliers.length === 0}
                >
                  {selectedSuppliers.length > 0
                    ? "إلغاء التحديد"
                    : "تحديد الكل"}
                </Button>
                {selectedSuppliers.length > 0 && (
                  <Button onClick={sendMessageToSelected}>
                    <Send className="w-4 h-4 ml-2" />
                    إرسال رسالة ({selectedSuppliers.length})
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {showOffers ? (
        // Offers View
        <div className="space-y-4">
          {isLoadingOffers ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {supplierOffers.map((offer) => (
                <Card key={offer.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium line-clamp-2">
                          {offer.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {offer.description}
                        </p>
                      </div>
                      <Badge className={OFFER_STATUS_COLORS[offer.status]}>
                        {offer.status === "approved"
                          ? "مقبول"
                          : offer.status === "pending"
                            ? "معلق"
                            : "مرفوض"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">الخصم:</span>
                        <span className="font-medium text-green-600">
                          {offer.discountPercentage}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">النقاط:</span>
                        <span>{offer.pointsCost}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          المشاهدات:
                        </span>
                        <span>{offer.views}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          الاستبدالات:
                        </span>
                        <span>{offer.redemptions}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">ينتهي:</span>
                        <span>
                          {formatDate(
                            offer.expiryDate,
                            "MMM dd",
                            i18n.language,
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Suppliers View
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSuppliers.map((supplier) => (
            <Card
              key={supplier.id}
              className={`transition-all ${
                selectedSuppliers.includes(supplier.id)
                  ? "ring-2 ring-primary"
                  : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedSuppliers.includes(supplier.id)}
                      onChange={() => handleSelectSupplier(supplier.id)}
                      className="rounded"
                    />
                    <Store className="w-8 h-8 bg-blue-100 rounded p-2 text-blue-600" />
                    <div>
                      <h3 className="font-semibold line-clamp-1">
                        {supplier.companyName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {supplier.firstName} {supplier.lastName}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleViewOffers(supplier)}
                      >
                        <Package className="w-4 h-4 ml-2" />
                        عرض العروض ({supplier.totalOffers})
                      </DropdownMenuItem>
                      {supplier.website && (
                        <DropdownMenuItem
                          onClick={() =>
                            window.open(supplier.website, "_blank")
                          }
                        >
                          <ExternalLink className="w-4 h-4 ml-2" />
                          زيارة الموقع
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() =>
                          toggleSupplierStatus(supplier.id, supplier.isActive)
                        }
                      >
                        {supplier.isActive ? (
                          <>
                            <AlertTriangle className="w-4 h-4 ml-2" />
                            إيقاف المورد
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 ml-2" />
                            تفعيل المورد
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageCircle className="w-4 h-4 ml-2" />
                        إرسال رسالة
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <BarChart3 className="w-4 h-4 ml-2" />
                        إحصائيات المورد
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      إجمالي العروض:
                    </span>
                    <span>{supplier.totalOffers}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">المقبولة:</span>
                    <span className="text-green-600">
                      {supplier.approvedOffers}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">المعلقة:</span>
                    <span className="text-orange-600">
                      {supplier.pendingOffers}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">الاستبدالات:</span>
                    <span>{supplier.totalRedemptions}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">الإيرادات:</span>
                    <span>{supplier.revenue.toLocaleString("ar-SA")} ر.س</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">التقييم:</span>
                    <span className="flex items-center gap-1">
                      ⭐ {supplier.averageRating}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">الحالة:</span>
                    <Badge
                      variant={supplier.isActive ? "default" : "destructive"}
                    >
                      {supplier.isActive ? "نشط" : "معطل"}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => handleViewOffers(supplier)}
                    className="w-full mt-4"
                    variant="outline"
                  >
                    <Package className="w-4 h-4 ml-2" />
                    عرض العروض ({supplier.totalOffers})
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {(showOffers ? supplierOffers : filteredSuppliers).length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            {showOffers ? (
              <Package className="w-16 h-16 text-muted-foreground mb-4" />
            ) : (
              <Store className="w-16 h-16 text-muted-foreground mb-4" />
            )}
            <h3 className="text-lg font-semibold mb-2">
              {showOffers ? "لا توجد عروض" : "لا يوجد موردين"}
            </h3>
            <p className="text-muted-foreground text-center">
              {showOffers
                ? "لا توجد عروض لهذا المورد."
                : "لا يوجد موردين يطابقون المرشحات الحالية."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
