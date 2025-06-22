import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { Offer } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DirectionAwareText } from "@/components/DirectionAwareText";
import { TranslatedText } from "@/components/TranslatedText";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/dateUtils";
import {
  Calendar,
  MapPin,
  Eye,
  ShoppingCart,
  Clock,
  Percent,
  Heart,
  MoreVertical,
  Globe,
  Building,
  ExternalLink,
  Zap,
} from "lucide-react";

interface OfferCardProps {
  offer: Offer;
  onRedeem?: (offerId: string) => Promise<void>;
  compact?: boolean;
  showRedeemButton?: boolean;
  className?: string;
}

export function OfferCard({
  offer,
  onRedeem,
  compact = false,
  showRedeemButton = true,
  className,
}: OfferCardProps) {
  const { t, i18n } = useTranslation();
  const { isRTL } = useLanguage();
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const isExpired = new Date(offer.expiryDate) < new Date();
  const daysLeft = Math.ceil(
    (new Date(offer.expiryDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const statusLabels = {
    pending: isRTL ? "في الانتظار" : "Pending",
    approved: isRTL ? "مقبول" : "Approved",
    rejected: isRTL ? "مرفوض" : "Rejected",
  };

  const categoryLabels = {
    food: isRTL ? "الطعام والمأكولات" : "Food & Dining",
    fitness: isRTL ? "اللياقة والصحة" : "Fitness & Health",
    entertainment: isRTL ? "الترفيه" : "Entertainment",
    travel: isRTL ? "السفر والمواصلات" : "Travel & Transportation",
    retail: isRTL ? "التسوق والبيع بالتجزئة" : "Retail & Shopping",
    technology: isRTL ? "التكنولوجيا" : "Technology",
    other: isRTL ? "أخرى" : "Other",
  };

  const redemptionTypeLabels = {
    online: isRTL ? "متاح أونلاين" : "Available Online",
    branch: isRTL ? "متاح في الفرع" : "Available in Branch",
  };

  const handleRedeem = async () => {
    if (!onRedeem) return;

    try {
      setIsRedeeming(true);
      await onRedeem(offer.id);
      toast({
        title: isRTL ? "تم الاستبدال بنجاح!" : "Offer redeemed successfully!",
        description: isRTL
          ? "تم استبدال العرض بنجاح"
          : "Your offer has been redeemed successfully",
      });
    } catch (error) {
      toast({
        title: isRTL ? "فشل الاستبدال" : "Redemption failed",
        description: isRTL
          ? "حدث خطأ أثناء استبدال العرض"
          : "An error occurred while redeeming the offer",
        variant: "destructive",
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite
        ? isRTL
          ? "تم الإزالة من المفضلة"
          : "Removed from favorites"
        : isRTL
          ? "تم الإضافة للمفضلة"
          : "Added to favorites",
    });
  };

  const OFFER_STATUS_COLORS = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all hover:shadow-lg flex flex-col",
        className,
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <CardContent className="p-4 flex flex-col ml-auto">
        <div className="space-y-4">
          <div
            className={cn(
              "flex items-start justify-between",
              isRTL ? "flex-row-reverse" : "flex-row",
            )}
          >
            <div className="flex-1">
              <div
                className={cn(
                  "flex items-center gap-2 mb-2 flex-wrap justify-end",
                  isRTL ? "justify-end" : "justify-start",
                )}
              >
                <Badge className={OFFER_STATUS_COLORS[offer.status]}>
                  {statusLabels[offer.status]}
                </Badge>
                <Badge variant="outline">
                  {categoryLabels[offer.category]}
                </Badge>
                {!isExpired && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {offer.redemptionType === "online" ? (
                      <Globe className="w-3 h-3" />
                    ) : (
                      <Building className="w-3 h-3" />
                    )}
                    {redemptionTypeLabels[offer.redemptionType]}
                  </Badge>
                )}
                {isExpired && (
                  <Badge variant="destructive">
                    <Clock className="w-3 h-3 mr-1" />
                    <TranslatedText tKey="offers.expired" />
                  </Badge>
                )}
                {!isExpired && daysLeft <= 7 && (
                  <Badge
                    variant="secondary"
                    className="bg-orange-100 text-orange-800"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    <TranslatedText tKey="offers.expiringOffer" />
                  </Badge>
                )}
              </div>
              <DirectionAwareText className="text-lg font-semibold mb-2">
                {offer.title}
              </DirectionAwareText>
              {offer.supplier && (
                <DirectionAwareText className="text-sm text-muted-foreground">
                  <TranslatedText tKey="offers.by" /> {offer.supplier}
                </DirectionAwareText>
              )}
              {offer.reviewedAt && (
                <DirectionAwareText className="text-xs text-blue-600 mt-1">
                  <TranslatedText tKey="offers.reviewDate" />:{" "}
                  {formatDate(offer.reviewedAt, "PPP", i18n.language)}
                </DirectionAwareText>
              )}
            </div>
            <div
              className={cn(
                "flex flex-col items-end gap-2",
                isRTL ? "items-start" : "items-end",
              )}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFavorite}
                className="h-8 w-8"
              >
                <Heart
                  className={cn(
                    "h-4 w-4",
                    isFavorite ? "fill-red-500 text-red-500" : "",
                  )}
                />
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
            <img
              src={offer.imageUrl || "/placeholder.svg"}
              alt={offer.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Description */}
          <DirectionAwareText className="text-muted-foreground mb-4 text-sm overflow-hidden text-right ml-auto">
            {offer.description}
          </DirectionAwareText>

          {/* Pricing Section */}
          <div className="space-y-3">
            <div
              className={cn(
                "flex flex-col justify-center items-start",
                isRTL ? "items-end" : "items-start",
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-2",
                  isRTL ? "flex-row-reverse" : "flex-row",
                )}
              >
                <Zap className="w-4 h-4 text-green-600" />
                <DirectionAwareText className="text-green-600 font-semibold ltr-content">
                  {offer.pointsCost.toLocaleString(isRTL ? "ar-SA" : "en-US")}{" "}
                  {isRTL ? "نقطة" : "points"}
                </DirectionAwareText>
              </div>
              {offer.discount > 0 && (
                <div
                  className={cn(
                    "flex items-center gap-2 mt-1",
                    isRTL ? "flex-row-reverse" : "flex-row",
                  )}
                >
                  <Percent className="w-4 h-4 text-blue-600" />
                  <DirectionAwareText className="text-blue-600 font-semibold ltr-content">
                    {offer.discount}% {isRTL ? "خصم" : "OFF"}
                  </DirectionAwareText>
                </div>
              )}
            </div>

            {/* Redemption Info */}
            <div className="mt-3">
              {offer.redemptionType === "online" ? (
                <div
                  className={cn(
                    "flex items-center gap-2 text-sm text-blue-600",
                    isRTL ? "flex-row-reverse justify-end" : "flex-row",
                  )}
                >
                  <ExternalLink className="w-4 h-4" />
                  <DirectionAwareText>
                    <TranslatedText tKey="offers.visitWebsite" />
                  </DirectionAwareText>
                </div>
              ) : (
                <div>
                  <div
                    className={cn(
                      "flex items-center gap-2 text-sm justify-end",
                      isRTL ? "flex-row-reverse justify-end" : "flex-row",
                    )}
                  >
                    <Building className="w-4 h-4 text-purple-600" />
                    <DirectionAwareText>
                      <TranslatedText tKey="offers.availableInBranch" />
                    </DirectionAwareText>
                  </div>
                  {offer.branchAddress && (
                    <div
                      className={cn(
                        "flex items-center gap-2 text-xs text-muted-foreground mt-1 justify-end",
                        isRTL ? "flex-row-reverse justify-end" : "flex-row",
                      )}
                    >
                      <MapPin className="w-3 h-3 mt-0.5" />
                      <DirectionAwareText>
                        {offer.branchAddress}
                      </DirectionAwareText>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Info */}
            <div
              className={cn(
                "flex items-center justify-end text-sm text-muted-foreground mt-3",
                isRTL ? "flex-row-reverse justify-end" : "flex-row",
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-1",
                  isRTL ? "flex-row-reverse" : "flex-row",
                )}
              >
                <Calendar className="w-4 h-4" />
                <DirectionAwareText>
                  <TranslatedText tKey="offers.expires" />{" "}
                  {formatDate(offer.expiryDate, "MMM dd, yyyy", i18n.language)}
                </DirectionAwareText>
              </div>
            </div>

            {/* Stats */}
            <div
              className={cn(
                "flex items-center justify-end text-sm mt-3",
                isRTL ? "flex-row-reverse justify-end" : "flex-row",
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-4",
                  isRTL ? "flex-row-reverse" : "flex-row",
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-1",
                    isRTL ? "flex-row-reverse" : "flex-row",
                  )}
                >
                  <Eye className="w-4 h-4 text-muted-foreground" />
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
                  <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                  <DirectionAwareText className="ltr-content">
                    {(offer.redemptions || 0).toLocaleString(
                      isRTL ? "ar-SA" : "en-US",
                    )}
                  </DirectionAwareText>
                </div>
              </div>
            </div>

            {/* Redeem Button */}
            {showRedeemButton && !isExpired && (
              <Button
                onClick={handleRedeem}
                disabled={isRedeeming}
                className={cn(
                  "w-full mt-4",
                  isRTL ? "flex-row-reverse" : "flex-row",
                )}
              >
                {isRedeeming ? (
                  <TranslatedText tKey="offers.redeeming" />
                ) : (
                  <TranslatedText tKey="offers.redeemOffer" />
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
