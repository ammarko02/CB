import { useState } from "react";
import { Offer, DiscountCard as DiscountCardType } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ExternalLink,
  MapPin,
  CreditCard,
  Globe,
  Building,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { DiscountCard } from "./DiscountCard";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

interface RedemptionModalProps {
  offer: Offer;
  isOpen: boolean;
  onClose: () => void;
  onRedeem: (offerId: string) => Promise<void>;
}

export function RedemptionModal({
  offer,
  isOpen,
  onClose,
  onRedeem,
}: RedemptionModalProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [discountCard, setDiscountCard] = useState<DiscountCardType | null>(
    null,
  );
  const [step, setStep] = useState<"selection" | "card" | "website">(
    "selection",
  );

  const generateBarcode = () => {
    const timestamp = new Date().getTime().toString();
    const random = Math.random().toString(36).substring(2, 8);
    return `DC${offer.id.substring(0, 4)}${user?.id.substring(0, 4)}${timestamp.substring(-6)}${random}`.toUpperCase();
  };

  const generateDiscountCode = () => {
    if (offer.discountCodeType === "supplier_provided") {
      return offer.supplierDiscountCode || "";
    }
    // Generate auto code based on offer and employee
    const timestamp = Date.now().toString().slice(-6);
    return `${offer.id.substring(0, 3).toUpperCase()}${user?.id.substring(0, 3).toUpperCase()}${timestamp}`;
  };

  const handleRedeemOnline = async () => {
    if (!offer.websiteUrl) return;

    setIsRedeeming(true);
    try {
      await onRedeem(offer.id);
      setStep("website");
    } catch (error) {
      console.error("Redemption failed:", error);
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleRedeemBranch = async () => {
    if (!user) return;

    setIsRedeeming(true);
    try {
      await onRedeem(offer.id);

      // Generate discount card
      const card: DiscountCardType = {
        id: `card_${Date.now()}`,
        employeeId: user.id,
        employeeName: `${user.firstName} ${user.lastName}`,
        employeeDepartment: user.department || "غير محدد",
        companyName: "Happy Perks Hub",
        offerId: offer.id,
        offerTitle: offer.title,
        supplierName: offer.supplierName,
        discountPercentage: offer.discountPercentage,
        generatedAt: new Date().toISOString(),
        expiryDate: offer.expiryDate,
        barcode: generateBarcode(),
        branchAddress: offer.branchAddress,
        discountCode:
          offer.redemptionType === "online"
            ? generateDiscountCode()
            : undefined,
        isUsed: false,
      };

      setDiscountCard(card);
      setStep("card");
    } catch (error) {
      console.error("Redemption failed:", error);
    } finally {
      setIsRedeeming(false);
    }
  };
  const handleClose = () => {
    setStep("selection");
    setDiscountCard(null);
    onClose();
  };

  const renderSelectionStep = () => (
    <div className="space-y-6">
      {/* Offer Summary */}
      <div className="text-center">
        <h3 className="text-lg font-bold mb-2">{offer.title}</h3>
        <p className="text-muted-foreground text-sm mb-3">
          {offer.description}
        </p>
        <div className="flex items-center justify-center gap-4">
          <Badge className="bg-green-100 text-green-800 border-green-200">
            خصم {offer.discountPercentage}%
          </Badge>
          <Badge variant="outline">{offer.pointsCost} نقطة</Badge>
        </div>
      </div>

      <Separator />

      {/* Redemption Options */}
      <div className="space-y-4">
        <h4 className="font-semibold text-center">اختر طريقة الاستفادة</h4>

        {/* Online Option */}
        {offer.redemptionType === "online" && offer.websiteUrl && (
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h5 className="font-medium">زيارة الموقع الإلكتروني</h5>
                <p className="text-sm text-muted-foreground">
                  احصل على العرض من خلال الموقع الإلكتروني للمورد
                </p>
              </div>
            </div>
            <Button
              onClick={handleRedeemOnline}
              disabled={isRedeeming}
              className="w-full"
            >
              <ExternalLink className="w-4 h-4 ml-2" />
              {isRedeeming ? "جاري التحضير..." : "زيارة الموقع"}
            </Button>
          </div>
        )}

        {/* Branch Option */}
        {offer.redemptionType === "branch" && (
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Building className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h5 className="font-medium">زيارة الفرع</h5>
                <p className="text-sm text-muted-foreground">
                  احصل على بطاقة خصم للاستفادة من العرض في الفرع
                </p>
                {offer.branchAddress && (
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {offer.branchAddress}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <Button
              onClick={handleRedeemBranch}
              disabled={isRedeeming}
              variant="outline"
              className="w-full"
            >
              <CreditCard className="w-4 h-4 ml-2" />
              {isRedeeming ? "جاري إنشاء البطاقة..." : "إنشاء بطاقة خصم"}
            </Button>
          </div>
        )}
      </div>

      {/* Terms Notice */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-orange-800">ملاحظة مهمة</p>
            <p className="text-orange-700 mt-1">
              {offer.termsConditions ||
                "يُرجى الاطلاع على الشروط والأحكام الخاصة بالعرض قبل الاستفادة منه."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCardStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-lg font-bold text-green-800">تم إنشاء البطاقة!</h3>
        <p className="text-muted-foreground text-sm">
          تم خصم {offer.pointsCost} نقطة من رصيدك
        </p>
      </div>

      {discountCard && <DiscountCard discountCard={discountCard} />}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-800">كيفية الاستفادة</p>
            <ul className="text-blue-700 mt-1 space-y-1 list-disc list-inside text-xs">
              <li>قم بتحميل البطاقة أو احفظ لقطة شاشة لها</li>
              <li>اذهب إلى الفرع المحدد في العنوان</li>
              <li>اعرض البطاقة مع بطاقة الهوية عند الدفع</li>
              <li>سيقوم الفرع بمسح الباركود لتطبيق الخصم</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWebsiteStep = () => {
    const discountCode = generateDiscountCode();

    return (
      <div className="space-y-4 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-lg font-bold text-green-800">
          تم تأكيد الاستبدال!
        </h3>
        <p className="text-muted-foreground">
          تم خصم {offer.pointsCost} نقطة من رصيدك
        </p>

        {/* Discount Code Display */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-800">
              كود الخصم الخاص بك
            </span>
          </div>
          <div className="bg-white border-2 border-dashed border-blue-300 rounded-lg p-3 mb-3">
            <div className="font-mono text-2xl font-bold text-blue-900 tracking-wider">
              {discountCode}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(discountCode);
              // Add toast here if needed
            }}
            className="mb-3"
          >
            <CreditCard className="w-4 h-4 ml-1" />
            نسخ الكود
          </Button>
          <p className="text-sm text-blue-700">
            استخدم هذا الكود عند الدفع في الموقع للحصول على خصم{" "}
            {offer.discountPercentage}%
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800 mb-3">
            سيتم توجيهك الآن إلى موقع المورد للاستفادة من العرض
          </p>
          <Button
            onClick={() => window.open(offer.websiteUrl, "_blank")}
            className="w-full"
          >
            <ExternalLink className="w-4 h-4 ml-2" />
            زيارة الموقع الآن
          </Button>
        </div>

        <div className="text-xs text-muted-foreground bg-gray-50 p-3 rounded">
          <p>
            <strong>ملاحظة:</strong> احتفظ بكود الخصم، يمكنك العودة إليه في صفحة
            "عروضي المستبدلة"
          </p>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === "selection"
              ? "استبدال العرض"
              : step === "card"
                ? "بطاقة الخصم"
                : "توجيه للموقع"}
          </DialogTitle>
        </DialogHeader>

        {step === "selection" && renderSelectionStep()}
        {step === "card" && renderCardStep()}
        {step === "website" && renderWebsiteStep()}

        {step !== "selection" && (
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              إغلاق
            </Button>
            {step === "website" && (
              <Button
                onClick={() => window.open(offer.websiteUrl, "_blank")}
                className="flex-1"
              >
                زيارة الموقع
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
