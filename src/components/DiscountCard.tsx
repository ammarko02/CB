import { useRef } from "react";
import { DiscountCard as DiscountCardType } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Barcode } from "@/components/ui/barcode";
import {
  Calendar,
  MapPin,
  Building,
  User,
  Download,
  QrCode,
} from "lucide-react";
import html2canvas from "html2canvas";
import { formatDate } from "@/lib/dateUtils";
import { useTranslation } from "react-i18next";

interface DiscountCardProps {
  discountCard: DiscountCardType;
  onDownload?: () => void;
}

export function DiscountCard({ discountCard, onDownload }: DiscountCardProps) {
  const { t, i18n } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const link = document.createElement("a");
      link.download = `discount-card-${discountCard.id}.png`;
      link.href = canvas.toDataURL();
      link.click();

      onDownload?.();
    } catch (error) {
      console.error("Failed to download card:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div
        ref={cardRef}
        className="bg-gradient-to-br from-blue-600 to-purple-700 p-1 rounded-xl shadow-lg"
      >
        <Card className="bg-white relative overflow-hidden">
          {/* Header with company branding */}
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full flex items-center justify-center">
                  <Building className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">
                    {discountCard.companyName}
                  </h3>
                  <p className="text-xs text-muted-foreground">بطاقة الخصم</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                خصم {discountCard.discountPercentage}%
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Employee Information */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-sm">بيانات الموظف</span>
              </div>
              <div className="space-y-1 text-xs">
                <p>
                  <span className="font-medium">الاسم:</span>{" "}
                  {discountCard.employeeName}
                </p>
                <p>
                  <span className="font-medium">القسم:</span>{" "}
                  {discountCard.employeeDepartment}
                </p>
                <p>
                  <span className="font-medium">رقم الموظف:</span>{" "}
                  {discountCard.employeeId}
                </p>
              </div>
            </div>

            {/* Offer Information */}
            <div>
              <h4 className="font-bold text-sm mb-1">
                {discountCard.offerTitle}
              </h4>
              <p className="text-xs text-muted-foreground mb-2">
                المقدم من: {discountCard.supplierName}
              </p>

              {discountCard.branchAddress && (
                <div className="flex items-start gap-2 text-xs">
                  <MapPin className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>{discountCard.branchAddress}</span>
                </div>
              )}
            </div>

            {/* Barcode */}
            <div className="text-center">
              <div className="bg-white p-2 rounded border inline-block">
                <Barcode
                  value={discountCard.barcode}
                  width={2}
                  height={60}
                  displayValue={true}
                  fontSize={12}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                اعرض هذا الباركود عند الدفع
              </p>
            </div>

            {/* Validity Information */}
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-orange-600" />
                <span className="font-semibold text-xs">صالحة حتى</span>
              </div>
              <p className="text-xs">
                {formatDate(
                  discountCard.expiryDate,
                  "MMMM dd, yyyy",
                  i18n.language,
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                تم إنشاؤها:{" "}
                {formatDate(
                  discountCard.generatedAt,
                  "MMM dd, yyyy - hh:mm a",
                  i18n.language,
                )}
              </p>
            </div>

            {/* Terms Notice */}
            <div className="text-xs text-center text-muted-foreground bg-gray-50 p-2 rounded space-y-1">
              <QrCode className="w-4 h-4 mx-auto mb-1" />
              <p>
                يُرجى تقديم هذه البطاقة مع بطاقة الهوية عند الاستفادة من العرض
              </p>
              {discountCard.isUsed ? (
                <div className="text-red-600 font-medium">
                  ⚠️ تم استخدام هذه البطاقة
                </div>
              ) : (
                <div className="text-green-600 font-medium">
                  ✅ صالحة للاستخدام
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Download Button */}
      <div className="mt-4 text-center">
        <Button onClick={handleDownload} className="w-full">
          <Download
            className={`w-4 h-4 ${i18n.language === "ar" ? "ml-2" : "mr-2"}`}
          />
          تحميل البطاقة
        </Button>
      </div>
    </div>
  );
}
