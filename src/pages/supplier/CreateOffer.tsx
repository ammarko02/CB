import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { offerService } from "@/services/api";
import {
  CreateOfferData,
  Offer,
  OfferCategory,
  OfferRedemptionType,
} from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  X,
  Image as ImageIcon,
  Save,
  Send,
  ArrowLeft,
  Calendar,
  Percent,
  MapPin,
  Clock,
  FileText,
  Store,
  Star,
  Gift,
  TrendingUp,
  Users,
  Award,
  Zap,
  Target,
  Info,
  Globe,
  Building,
  ExternalLink,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { OFFER_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const initialFormData: CreateOfferData = {
  title: "",
  description: "",
  discountPercentage: 10,
  category: "food",
  expiryDate: "",
  pointsCost: 100,
  location: "",
  termsConditions: "",
  maxRedemptions: undefined,
  redemptionType: "branch",
  websiteUrl: "",
  branchAddress: "",
  usageLimit: "once_per_employee",
  usesPerEmployee: 1,
  discountCodeType: "auto_generated",
  supplierDiscountCode: "",
};

export default function CreateOffer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const [formData, setFormData] = useState<CreateOfferData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitType, setSubmitType] = useState<"draft" | "submit">("submit");

  // Check if we're editing an existing offer
  const editOffer = location.state?.offer as Offer | undefined;
  const isEditing = !!editOffer;

  useEffect(() => {
    if (isEditing && editOffer) {
      setFormData({
        title: editOffer.title,
        description: editOffer.description,
        discountPercentage: editOffer.discountPercentage,
        category: editOffer.category,
        expiryDate: editOffer.expiryDate.split("T")[0],
        pointsCost: editOffer.pointsCost,
        location: editOffer.location || "",
        termsConditions: editOffer.termsConditions || "",
        maxRedemptions: editOffer.maxRedemptions,
        redemptionType: editOffer.redemptionType || "branch",
        websiteUrl: editOffer.websiteUrl || "",
        branchAddress: editOffer.branchAddress || "",
        usageLimit: editOffer.usageLimit || "once_per_employee",
        usesPerEmployee: editOffer.usesPerEmployee || 1,
        discountCodeType: editOffer.discountCodeType || "auto_generated",
        supplierDiscountCode: editOffer.supplierDiscountCode || "",
      });

      if (editOffer.imageUrl) {
        setImagePreview(editOffer.imageUrl);
      }
    }
  }, [isEditing, editOffer]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "عنوان العرض مطلوب";
    }

    if (!formData.description.trim()) {
      newErrors.description = "وصف العرض مطلوب";
    }

    if (formData.discountPercentage <= 0 || formData.discountPercentage > 100) {
      newErrors.discountPercentage = "نسبة الخصم يجب أن تكون بين 1 و 100";
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = "تاريخ انتهاء العرض مطلوب";
    } else {
      const expiryDate = new Date(formData.expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (expiryDate <= today) {
        newErrors.expiryDate = "تاريخ انتهاء العرض يجب أن يكون في المستقبل";
      }
    }

    if (formData.pointsCost <= 0) {
      newErrors.pointsCost = "تكلفة النقاط يجب أن تكون أكبر من 0";
    }

    if (formData.maxRedemptions && formData.maxRedemptions <= 0) {
      newErrors.maxRedemptions = "الحد الأقصى للاستبدال يجب أن يكون أكبر من 0";
    }

    // Validate redemption type specific fields
    if (formData.redemptionType === "online") {
      if (!formData.websiteUrl?.trim()) {
        newErrors.websiteUrl =
          "رابط الموقع الإلكتروني مطلوب للعروض الإلكترونية";
      } else if (!isValidUrl(formData.websiteUrl)) {
        newErrors.websiteUrl = "رابط الموقع الإلكتروني غير صحيح";
      }
    }

    if (formData.redemptionType === "branch") {
      if (!formData.branchAddress?.trim()) {
        newErrors.branchAddress = "عنوان الفرع مطلوب للعروض في الفرع";
      }
    }

    // Validate usage limits
    if (formData.usageLimit === "multiple_uses") {
      if (
        !formData.usesPerEmployee ||
        formData.usesPerEmployee < 2 ||
        formData.usesPerEmployee > 10
      ) {
        newErrors.usesPerEmployee = "عدد مرات الاستخدام يجب أن يكون بين 2 و 10";
      }
    }

    // Validate discount codes for online offers
    if (
      formData.redemptionType === "online" &&
      formData.discountCodeType === "supplier_provided"
    ) {
      if (!formData.supplierDiscountCode?.trim()) {
        newErrors.supplierDiscountCode =
          "كود الخصم مطلوب عند اختيار هذا الخيار";
      } else if (formData.supplierDiscountCode.length < 3) {
        newErrors.supplierDiscountCode =
          "كود الخصم يجب أن يكون 3 أحرف على الأقل";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (
    field: keyof CreateOfferData,
    value: string | number | File | OfferRedemptionType,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "حجم الملف كبير",
          description: "حجم الصورة يجب أن يكون أقل من 5 ميجابايت",
          variant: "destructive",
        });
        return;
      }

      handleInputChange("imageFile", file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    handleInputChange("imageFile", undefined as any);
  };

  const handleSubmit = async (type: "draft" | "submit") => {
    if (!validateForm()) {
      toast({
        title: "بيانات غير مكتملة",
        description: "يرجى تصحيح الأخطاء المذكورة أدناه",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitType(type);

    try {
      if (isEditing) {
        await offerService.updateOffer(editOffer!.id, formData);
        toast({
          title: "تم تحديث العرض",
          description: "تم تحديث العرض بنجاح",
        });
      } else {
        await offerService.createOffer(formData);
        toast({
          title:
            type === "draft" ? "تم حفظ المسودة" : "تم إرسال العرض للمراجعة",
          description:
            type === "draft"
              ? "تم حفظ العرض كمسودة"
              : "تم إرسال العرض للمراجعة من قبل الإدارة",
        });
      }

      navigate("/supplier/offers");
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "فشل في حفظ العرض",
        description:
          error instanceof Error ? error.message : "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate suggested points based on discount
  const suggestedPoints = Math.round(formData.discountPercentage * 10);

  // Tomorrow's date for min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/supplier/offers")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? "تعديل العرض" : "إضافة عرض جديد"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? "تعديل تفاصيل العرض الحالي"
              : "إنشاء عرض جديد لموظفي الشركة"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5" />
                المعلومات الأساسية
              </CardTitle>
              <CardDescription>أدخل التفاصيل الأساسية للعرض</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان العرض *</Label>
                <Input
                  id="title"
                  placeholder="مثال: خصم 20% على جميع المنتجات"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">وصف العرض *</Label>
                <Textarea
                  id="description"
                  placeholder="اكتب وصفاً تفصيلياً للعرض والمنتجات أو الخدمات المشمولة"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className={cn(
                    "min-h-24",
                    errors.description ? "border-red-500" : "",
                  )}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">فئة العرض *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value as OfferCategory)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر فئة العرض" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(OFFER_CATEGORIES).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {t(`categories.${key}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryDate">تاريخ انتهاء العرض *</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    min={minDate}
                    value={formData.expiryDate}
                    onChange={(e) =>
                      handleInputChange("expiryDate", e.target.value)
                    }
                    className={errors.expiryDate ? "border-red-500" : ""}
                  />
                  {errors.expiryDate && (
                    <p className="text-sm text-red-500">{errors.expiryDate}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Limits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                حدود الاستخدام
              </CardTitle>
              <CardDescription>
                حدد عدد المرات التي يمكن للموظف الاستفادة من العرض
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div
                  className={cn(
                    "border rounded-lg p-4 cursor-pointer transition-all",
                    formData.usageLimit === "once_per_employee"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                  onClick={() =>
                    handleInputChange("usageLimit", "once_per_employee")
                  }
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">مرة واحدة لكل موظف</h4>
                      <p className="text-sm text-muted-foreground">
                        يمكن للموظف الاستفادة من العرض مرة واحدة فقط
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={cn(
                    "border rounded-lg p-4 cursor-pointer transition-all",
                    formData.usageLimit === "multiple_uses"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                  onClick={() =>
                    handleInputChange("usageLimit", "multiple_uses")
                  }
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">عدد محدود من المرات</h4>
                      <p className="text-sm text-muted-foreground">
                        حدد عدد مرات معين للاستفادة لكل موظف
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={cn(
                    "border rounded-lg p-4 cursor-pointer transition-all",
                    formData.usageLimit === "unlimited"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                  onClick={() => handleInputChange("usageLimit", "unlimited")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">غير محدود</h4>
                      <p className="text-sm text-muted-foreground">
                        يمكن للموظف الاستفادة من العرض عدة مرات
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {formData.usageLimit === "multiple_uses" && (
                <div className="space-y-2">
                  <Label htmlFor="usesPerEmployee">
                    عدد مرات الاستخدام لكل موظف
                  </Label>
                  <Input
                    id="usesPerEmployee"
                    type="number"
                    min="2"
                    max="10"
                    value={formData.usesPerEmployee || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "usesPerEmployee",
                        parseInt(e.target.value) || 1,
                      )
                    }
                    placeholder="مثال: 3"
                  />
                  <p className="text-sm text-muted-foreground">
                    الحد الأقصى 10 مرات لكل موظف
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Redemption Type */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                طريقة الاستفادة من العرض
              </CardTitle>
              <CardDescription>
                حدد كيف سيتمكن الموظفون من الاستفادة من العرض
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div
                  className={cn(
                    "border rounded-lg p-4 cursor-pointer transition-all",
                    formData.redemptionType === "online"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                  onClick={() => handleInputChange("redemptionType", "online")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Globe className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">عبر الإنترنت</h4>
                      <p className="text-sm text-muted-foreground">
                        يتم توجيه الموظف للموقع الإلكتروني
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={cn(
                    "border rounded-lg p-4 cursor-pointer transition-all",
                    formData.redemptionType === "branch"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                  onClick={() => handleInputChange("redemptionType", "branch")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Building className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">في الفرع</h4>
                      <p className="text-sm text-muted-foreground">
                        يحصل الموظف على بطاقة خصم للفرع
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Website URL for online offers */}
              {formData.redemptionType === "online" && (
                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">رابط الموقع الإلكتروني *</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="websiteUrl"
                      placeholder="https://example.com"
                      value={formData.websiteUrl}
                      onChange={(e) =>
                        handleInputChange("websiteUrl", e.target.value)
                      }
                      className={cn(
                        "pl-9",
                        errors.websiteUrl ? "border-red-500" : "",
                      )}
                    />
                  </div>
                  {errors.websiteUrl && (
                    <p className="text-sm text-red-500">{errors.websiteUrl}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    سيتم توجيه الموظف لهذا الرابط بعد استبدال العرض
                  </p>
                </div>
              )}

              {/* Discount Code Type for Online Offers */}
              {formData.redemptionType === "online" && (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div
                      className={cn(
                        "border rounded-lg p-4 cursor-pointer transition-all",
                        formData.discountCodeType === "auto_generated"
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-300",
                      )}
                      onClick={() =>
                        handleInputChange("discountCodeType", "auto_generated")
                      }
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <Zap className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">توليد كود خصم تلقائي</h4>
                          <p className="text-sm text-muted-foreground">
                            سيتم إنشاء كود خصم فريد لكل موظف تلقائياً
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "border rounded-lg p-4 cursor-pointer transition-all",
                        formData.discountCodeType === "supplier_provided"
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300",
                      )}
                      onClick={() =>
                        handleInputChange(
                          "discountCodeType",
                          "supplier_provided",
                        )
                      }
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">كود خصم من المورد</h4>
                          <p className="text-sm text-muted-foreground">
                            أدخل كود الخصم الخاص بك ليستخدمه الموظفون
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {formData.discountCodeType === "supplier_provided" && (
                    <div className="space-y-2">
                      <Label htmlFor="supplierDiscountCode">كود الخصم *</Label>
                      <Input
                        id="supplierDiscountCode"
                        placeholder="مثال: COMPANY20"
                        value={formData.supplierDiscountCode}
                        onChange={(e) =>
                          handleInputChange(
                            "supplierDiscountCode",
                            e.target.value.toUpperCase(),
                          )
                        }
                        className={cn(
                          errors.supplierDiscountCode ? "border-red-500" : "",
                        )}
                      />
                      {errors.supplierDiscountCode && (
                        <p className="text-sm text-red-500">
                          {errors.supplierDiscountCode}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        سيستخدم جميع الموظفين هذا الكود في موقعك
                      </p>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-800">ملاحظة مهمة</p>
                        <p className="text-blue-700 mt-1">
                          {formData.discountCodeType === "auto_generated"
                            ? "سيتم توليد كود فريد لكل موظف لضمان التتبع الدقيق للاستخدام"
                            : formData.usageLimit === "once_per_employee"
                              ? "كود واحد للجميع - تأكد من قدرة نظامك على تتبع الاستخدام"
                              : "كود مشترك - مناسب للاستخدام المتعدد"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Branch address for branch offers */}
              {formData.redemptionType === "branch" && (
                <div className="space-y-2">
                  <Label htmlFor="branchAddress">عنوان الفرع *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="branchAddress"
                      placeholder="مثال: شارع التحلية، الرياض، المملكة العربية السعودية"
                      value={formData.branchAddress}
                      onChange={(e) =>
                        handleInputChange("branchAddress", e.target.value)
                      }
                      className={cn(
                        "pl-9",
                        errors.branchAddress ? "border-red-500" : "",
                      )}
                    />
                  </div>
                  {errors.branchAddress && (
                    <p className="text-sm text-red-500">
                      {errors.branchAddress}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    سيظهر ه��ا العنوان في بطاقة الخصم التي يحصل عليها الموظف
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Discount and Points */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="w-5 h-5" />
                الخصم والنقاط
              </CardTitle>
              <CardDescription>حدد نسبة الخصم وتكلفة النقاط</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="discountPercentage">
                  نسبة الخصم ({formData.discountPercentage}%)
                </Label>
                <Slider
                  value={[formData.discountPercentage]}
                  onValueChange={(value) =>
                    handleInputChange("discountPercentage", value[0])
                  }
                  max={100}
                  min={1}
                  step={1}
                  className="w-full"
                />
                {errors.discountPercentage && (
                  <p className="text-sm text-red-500">
                    {errors.discountPercentage}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pointsCost">تكلفة النقاط *</Label>
                <Input
                  id="pointsCost"
                  type="number"
                  min="1"
                  placeholder="100"
                  value={formData.pointsCost}
                  onChange={(e) =>
                    handleInputChange(
                      "pointsCost",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className={errors.pointsCost ? "border-red-500" : ""}
                />
                {errors.pointsCost && (
                  <p className="text-sm text-red-500">{errors.pointsCost}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  النقاط المقترحة: {suggestedPoints} (بناءً على نسبة الخصم)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                إعدادات إضافية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">الموقع (اختياري)</Label>
                <Input
                  id="location"
                  placeholder="مثال: الرياض، جدة، الدمام"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxRedemptions">
                  الحد الأقصى للاستبدال (اختياري)
                </Label>
                <Input
                  id="maxRedemptions"
                  type="number"
                  min="1"
                  placeholder="غير محدود"
                  value={formData.maxRedemptions || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "maxRedemptions",
                      e.target.value ? parseInt(e.target.value) : undefined,
                    )
                  }
                  className={errors.maxRedemptions ? "border-red-500" : ""}
                />
                {errors.maxRedemptions && (
                  <p className="text-sm text-red-500">
                    {errors.maxRedemptions}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="termsConditions">
                  الشروط والأحكام (اختياري)
                </Label>
                <Textarea
                  id="termsConditions"
                  placeholder="أدخل أي شروط خاصة بالعرض..."
                  value={formData.termsConditions}
                  onChange={(e) =>
                    handleInputChange("termsConditions", e.target.value)
                  }
                  className="min-h-20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                صورة العرض
              </CardTitle>
              <CardDescription>
                أضف صورة جذابة للعرض (اختياري - الحد الأقصى 5 ميجابايت)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="معاينة الصورة"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    اسحب وأفلت الصورة هنا أو انقر للاختيار
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      document.getElementById("image-upload")?.click()
                    }
                  >
                    اختيار صورة
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Preview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                معاينة العرض
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الفئة:</span>
                  <Badge variant="outline">
                    {t(`categories.${formData.category}`)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الخصم:</span>
                  <span className="font-semibold text-green-600">
                    {formData.discountPercentage}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">النقاط:</span>
                  <span className="font-semibold">
                    {formData.pointsCost.toLocaleString("ar-SA")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">النوع:</span>
                  <div className="flex items-center gap-1">
                    {formData.redemptionType === "online" ? (
                      <Globe className="w-3 h-3" />
                    ) : (
                      <Building className="w-3 h-3" />
                    )}
                    <span className="text-xs">
                      {formData.redemptionType === "online"
                        ? "إلكتروني"
                        : "فرع"}
                    </span>
                  </div>
                </div>
                {formData.expiryDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ينتهي:</span>
                    <span className="text-xs">
                      {new Date(formData.expiryDate).toLocaleDateString(
                        "ar-SA",
                      )}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                نصائح للعرض الناجح
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 mt-0.5 text-green-600" />
                  <span>اكتب عنواناً واضحاً وجذاباً</span>
                </li>
                <li className="flex items-start gap-2">
                  <Users className="w-4 h-4 mt-0.5 text-blue-600" />
                  <span>حدد الفئة المناسبة لتسهيل البحث</span>
                </li>
                <li className="flex items-start gap-2">
                  <Award className="w-4 h-4 mt-0.5 text-purple-600" />
                  <span>أضف صورة عالية الجودة</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 text-orange-600" />
                  <span>حدد مدة مناسبة للعرض</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => handleSubmit("submit")}
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting && submitType === "submit" ? (
                "جاري الإرسال..."
              ) : (
                <>
                  <Send
                    className={`w-4 h-4 ${i18n.language === "ar" ? "ml-2" : "mr-2"}`}
                  />
                  {isEditing ? "حفظ التعديلات" : "إرسال للمراجعة"}
                </>
              )}
            </Button>

            {!isEditing && (
              <Button
                onClick={() => handleSubmit("draft")}
                disabled={isSubmitting}
                variant="outline"
                className="w-full"
                size="lg"
              >
                {isSubmitting && submitType === "draft" ? (
                  "جاري الحفظ..."
                ) : (
                  <>
                    <Save
                      className={`w-4 h-4 ${i18n.language === "ar" ? "ml-2" : "mr-2"}`}
                    />
                    حفظ كمسودة
                  </>
                )}
              </Button>
            )}

            <Button
              variant="ghost"
              onClick={() => navigate("/supplier/offers")}
              className="w-full"
            >
              إلغاء
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
