import { useState } from "react";
import { Offer } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Eye,
  ShoppingCart,
  Clock,
  Percent,
  Heart,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Globe,
  Building,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OFFER_CATEGORIES, OFFER_STATUS_COLORS } from "@/lib/constants";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { formatDate, getDaysUntilExpiry } from "@/lib/dateUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { RedemptionModal } from "./RedemptionModal";

interface OfferCardProps {
  offer: Offer;
  onRedeem?: (offerId: string) => void;
  onEdit?: (offer: Offer) => void;
  onDelete?: (offerId: string) => void;
  onApprove?: (offerId: string) => void;
  onReject?: (offerId: string) => void;
  showActions?: boolean;
  variant?: "default" | "admin" | "supplier" | "horizontal" | "vertical";
}

export function OfferCard({
  offer,
  onRedeem,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  showActions = true,
  variant = "default",
}: OfferCardProps) {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [isLiked, setIsLiked] = useState(() => {
    // تحقق من Local Storage لمعرفة إذا كان العرض في المفضلة
    if (user?.id) {
      const savedFavorites = localStorage.getItem(`favorites_${user.id}`);
      if (savedFavorites) {
        const favoriteIds = JSON.parse(savedFavorites);
        return favoriteIds.includes(offer.id);
      }
    }
    return false;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showRedemptionModal, setShowRedemptionModal] = useState(false);

  const toggleFavorite = () => {
    if (!user?.id) return;

    try {
      const savedFavorites = localStorage.getItem(`favorites_${user.id}`);
      let favoriteIds: string[] = savedFavorites
        ? JSON.parse(savedFavorites)
        : [];

      if (isLiked) {
        // إزالة من المفضلة
        favoriteIds = favoriteIds.filter((id) => id !== offer.id);
        setIsLiked(false);
        toast({
          title: "تم الحذف من المفضلة",
          description: `تم حذف "${offer.title}" من المفضلة`,
        });
      } else {
        // إضافة إلى المفضلة
        if (!favoriteIds.includes(offer.id)) {
          favoriteIds.push(offer.id);
        }
        setIsLiked(true);
        toast({
          title: "تم الإضافة للمفضلة",
          description: `تم إضافة "${offer.title}" للمفضلة`,
        });
      }

      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favoriteIds));
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحديث المفضلة",
        variant: "destructive",
      });
    }
  };

  const handleRedeem = async (offerId: string) => {
    if (!onRedeem) return;

    setIsLoading(true);
    try {
      await onRedeem(offerId);
      toast({
        title: "تم استبدال العرض!",
        description: `تم استبدال "${offer.title}" بنجاح`,
      });
    } catch (error) {
      toast({
        title: "فشل الاستبدال",
        description:
          error instanceof Error ? error.message : "فشل في استبدال العرض",
        variant: "destructive",
      });
      throw error; // Re-throw for modal handling
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!onApprove) return;

    try {
      await onApprove(offer.id);
      toast({
        title: "تم قبول العرض",
        description: `تم قبول "${offer.title}" وأصبح مرئياً للموظفين.`,
      });
    } catch (error) {
      toast({
        title: "فشل القبول",
        description:
          error instanceof Error ? error.message : "فشل في قبول العرض",
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    if (!onReject) return;

    try {
      await onReject(offer.id);
      toast({
        title: "تم رفض العرض",
        description: `تم رفض "${offer.title}".`,
      });
    } catch (error) {
      toast({
        title: "فشل الرفض",
        description:
          error instanceof Error ? error.message : "فشل في رفض العرض",
        variant: "destructive",
      });
    }
  };

  const isExpired = new Date(offer.expiryDate || offer.validTo) < new Date();
  const discount = offer.discountPercentage || offer.discount;
  const canRedeem =
    user?.role === "employee" && offer.status === "approved" && !isExpired;
  const canManage =
    user?.role === "super_admin" ||
    (user?.role === "supplier" && offer.supplierId === user.id);
  const daysLeft = getDaysUntilExpiry(offer.expiryDate || offer.validTo);

  // Status translations
  const statusLabels = {
    pending: "في الانتظار",
    approved: "مقبول",
    rejected: "مرفوض",
    expired: "منتهي الصلاحية",
  };

  const redemptionTypeLabels = {
    online: "عبر الإنترنت",
    branch: "في الفرع",
  };

  return (
    <>
      <Card
        className={cn(
          "group overflow-hidden transition-all duration-200 hover:shadow-lg",
          isExpired && "opacity-75",
        )}
      >
        <CardHeader className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap justify-end">
                <Badge className={OFFER_STATUS_COLORS[offer.status]}>
                  {statusLabels[offer.status]}
                </Badge>
                <Badge variant="outline">
                  {t(`categories.${offer.category}`)}
                </Badge>
                <Badge variant="secondary">
                  {offer.redemptionType === "online" ? (
                    <Globe className="w-3 h-3 ml-1" />
                  ) : (
                    <Building className="w-3 h-3 ml-1" />
                  )}
                  {redemptionTypeLabels[offer.redemptionType]}
                </Badge>
                {isExpired && (
                  <Badge variant="destructive">
                    <Clock className="w-3 h-3 ml-1" />
                    منتهي الصلاحية
                  </Badge>
                )}
                {daysLeft <= 7 && daysLeft > 0 && (
                  <Badge variant="destructive">
                    <Clock className="w-3 h-3 ml-1" />
                    {daysLeft} {daysLeft === 1 ? "يوم متبقي" : "أيام متبقية"}
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-lg leading-tight">
                {offer.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                بواسطة {offer.supplierName}
              </p>
            </div>

            {showActions && (
              <div className="flex items-center gap-2">
                {user?.role === "employee" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite()}
                    className="h-8 w-8"
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4",
                        isLiked && "fill-red-500 text-red-500",
                      )}
                    />
                  </Button>
                )}

                {(canManage || variant === "admin") && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {variant === "admin" && offer.status === "pending" && (
                        <>
                          <DropdownMenuItem onClick={handleApprove}>
                            <CheckCircle className="w-4 h-4 ml-2" />
                            قبول العرض
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={handleReject}>
                            <XCircle className="w-4 h-4 ml-2" />
                            رفض العرض
                          </DropdownMenuItem>
                        </>
                      )}
                      {canManage && (
                        <>
                          <DropdownMenuItem onClick={() => onEdit?.(offer)}>
                            <Edit className="w-4 h-4 ml-2" />
                            تعديل العرض
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete?.(offer.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف العرض
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          {offer.imageUrl && (
            <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-muted">
              <img
                src={offer.imageUrl}
                alt={offer.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {offer.description}
          </p>

          {/* Admin Notes for Suppliers */}
          {user?.role === "supplier" && offer.adminNotes && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  ملاحظات الإدارة
                </span>
              </div>
            <p className="text-muted-foreground mb-4 text-sm overflow-hidden text-right ml-auto"
              {offer.reviewedAt && (
                <p className="text-xs text-blue-600 mt-1">
                  تاريخ المراجعة:{" "}
                  {formatDate(offer.reviewedAt, "PPP", i18n.language)}
                </p>
              )}
            </div>
          )}

          {/* Reject Reason for Suppliers */}
          {user?.role === "supplier" &&
            offer.rejectReason &&
            offer.status === "rejected" && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">
                    سبب الرفض
                  </span>
                </div>
                <p className="text-sm text-red-700">{offer.rejectReason}</p>
                {offer.reviewedAt && (
                  <p className="text-xs text-red-600 mt-1">
                    تاريخ الرفض:{" "}
                    {formatDate(offer.reviewedAt, "PPP", i18n.language)}
                  </p>
                )}
              </div>
            )}

          <div className="space-y-3">
            {/* Discount and Points */}
              <div className="flex flex-col justify-center items-start mb-4">
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-600">
                  خصم {discount}%
                </span>
              </div>
              <div className="font-semibold text-primary">
                {offer.pointsCost.toLocaleString("ar-SA")} نقطة
              </div>
            </div>

            {/* Location/Website Info */}
            <div className="space-y-2">
              {offer.redemptionType === "online" && offer.websiteUrl && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Globe className="h-4 w-4" />
                  <span className="truncate">متاح عبر الموقع الإلكتروني</span>
                  <ExternalLink className="h-3 w-3" />
                </div>
              )}

              {offer.redemptionType === "branch" && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm justify-end">
                    <Building className="h-4 w-4 text-purple-600" />
                    <span>��تاح في الفرع</span>
                  </div>
                  {offer.branchAddress && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 justify-end">
                      <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>{offer.branchAddress}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Expiry and Stats */}
            <div className="flex items-center justify-end text-sm text-muted-foreground mt-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  ينتهي{" "}
                  {formatDate(offer.expiryDate, "MMM dd, yyyy", i18n.language)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end text-sm mt-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span>{offer.views.toLocaleString("ar-SA")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  <span>{offer.redemptions.toLocaleString("ar-SA")}</span>
                </div>
              </div>
            </div>

            {offer.remainingRedemptions !== undefined &&
              offer.remainingRedemptions <= 10 &&
              offer.remainingRedemptions > 0 && (
                <div className="text-xs text-orange-600 font-medium">
                  متبقي {offer.remainingRedemptions.toLocaleString("ar-SA")}{" "}
                  فقط!
                </div>
              )}

            {offer.termsConditions && (
              <div className="text-xs text-muted-foreground">
                <strong>الشروط:</strong> {offer.termsConditions}
              </div>
            )}
          </div>
        </CardContent>

        {showActions && (
          <CardFooter className="p-4 pt-0">
            {canRedeem ? (
              <Button
                onClick={() => setShowRedemptionModal(true)}
                disabled={isLoading || offer.remainingRedemptions === 0}
                className="w-full"
              >
                {isLoading ? "جاري المعالجة..." : "استبدال العرض"}
              </Button>
            ) : variant === "admin" && offer.status === "pending" ? (
              <div className="flex gap-2 w-full">
                <Button
                  onClick={handleApprove}
                  variant="default"
                  className="flex-1"
                >
                  قبول
                </Button>
                <Button
                  onClick={handleReject}
                  variant="destructive"
                  className="flex-1"
                >
                  رفض
                </Button>
              </div>
            ) : (
              <Button variant="outline" className="w-full" disabled>
                {isExpired
                  ? "منتهي الصلاحية"
                  : offer.status === "pending"
                    ? "في انتظار الموافقة"
                    : offer.status === "rejected"
                      ? "مرفوض"
                      : "عرض التفاصيل"}
              </Button>
            )}
          </CardFooter>
        )}
      </Card>

      {/* Redemption Modal */}
      <RedemptionModal
        offer={offer}
        isOpen={showRedemptionModal}
        onClose={() => setShowRedemptionModal(false)}
        onRedeem={handleRedeem}
      />
    </>
  );
}