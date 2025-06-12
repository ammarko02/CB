import { useEffect, useState } from "react";
import { Offer, OfferStatus } from "@/types";
import { offerService } from "@/services/api";
import { OfferCard } from "@/components/OfferCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  RefreshCw,
  MessageSquare,
  AlertTriangle,
  Send,
  FileText,
} from "lucide-react";
import { OFFER_CATEGORIES } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

interface ReviewAction {
  type: "approve" | "reject" | "review";
  offerId: string;
  offer: Offer;
}

export default function OffersApproval() {
  const { t } = useTranslation();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<OfferStatus | "all">(
    "pending",
  );

  // Review dialog state
  const [reviewAction, setReviewAction] = useState<ReviewAction | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setOffers(response.data);
    } catch (error) {
      console.error("Failed to load offers:", error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل العروض. يرجى المحاولة مرة أخرى.",
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
          offer.description.toLowerCase().includes(term) ||
          offer.supplierName.toLowerCase().includes(term),
      );
    }

    setFilteredOffers(filtered);
  };

  const openReviewDialog = (
    type: "approve" | "reject" | "review",
    offer: Offer,
  ) => {
    setReviewAction({ type, offerId: offer.id, offer });
    setAdminNotes("");
    setRejectReason("");
  };

  const closeReviewDialog = () => {
    setReviewAction(null);
    setAdminNotes("");
    setRejectReason("");
  };

  const handleReviewSubmit = async () => {
    if (!reviewAction) return;

    setIsSubmitting(true);
    try {
      const { type, offerId, offer } = reviewAction;

      // حفظ الملاحظات مع العرض
      const updatedOffer = {
        ...offer,
        adminNotes,
        rejectReason: type === "reject" ? rejectReason : undefined,
        reviewedAt: new Date().toISOString(),
      };

      let newStatus: OfferStatus;
      let toastMessage: string;

      switch (type) {
        case "approve":
          newStatus = "approved";
          toastMessage = "تم قبول العرض وأصبح مرئياً للموظفين";
          break;
        case "reject":
          newStatus = "rejected";
          toastMessage = "تم رفض العرض وإرسال سبب الرفض للمورد";
          // إرسال رسالة للمورد مع سبب الرفض
          await sendRejectMessage(offer, rejectReason);
          break;
        case "review":
          newStatus = "pending"; // يبقى معلق لكن مع ملاحظات
          toastMessage = "تم إرسال العرض للمراجعة مع الملاحظات";
          // إرسال رسالة للمورد مع ملاحظات المراجعة
          await sendReviewMessage(offer, adminNotes);
          break;
        default:
          throw new Error("Invalid action type");
      }

      await offerService.updateOfferStatus(offerId, newStatus);

      setOffers((prev) =>
        prev.map((o) =>
          o.id === offerId ? { ...o, status: newStatus, ...updatedOffer } : o,
        ),
      );

      toast({
        title: "تم التحديث بنجاح",
        description: toastMessage,
      });

      closeReviewDialog();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحديث العرض. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendRejectMessage = async (offer: Offer, reason: string) => {
    // Mock implementation - في التطبيق الحقيقي سيتم إرسال رسالة فعلية
    console.log(`Reject message sent to supplier ${offer.supplierId}:`, reason);
  };

  const sendReviewMessage = async (offer: Offer, notes: string) => {
    // Mock implementation - في التطبيق الحقيقي سيتم إرسال رسالة فعلية
    console.log(`Review message sent to supplier ${offer.supplierId}:`, notes);
  };

  const handleBulkApprove = async (offerIds: string[]) => {
    try {
      await Promise.all(
        offerIds.map((id) => offerService.updateOfferStatus(id, "approved")),
      );
      setOffers((prev) =>
        prev.map((offer) =>
          offerIds.includes(offer.id)
            ? { ...offer, status: "approved" as OfferStatus }
            : offer,
        ),
      );
      toast({
        title: "تم قبول العروض",
        description: `تم قبول ${offerIds.length} عرض.`,
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في قبول بعض العروض. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  const pendingOffers = offers.filter((offer) => offer.status === "pending");
  const approvedOffers = offers.filter((offer) => offer.status === "approved");
  const rejectedOffers = offers.filter((offer) => offer.status === "rejected");

  const getActionButtonText = () => {
    if (!reviewAction) return "";
    switch (reviewAction.type) {
      case "approve":
        return "قبول العرض";
      case "reject":
        return "رفض العرض";
      case "review":
        return "إرسال للمراجعة";
      default:
        return "";
    }
  };

  const getDialogTitle = () => {
    if (!reviewAction) return "";
    switch (reviewAction.type) {
      case "approve":
        return "قبول العرض";
      case "reject":
        return "رفض العرض";
      case "review":
        return "إرسال للمراجعة";
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-48" />
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
          <h1 className="text-3xl font-bold">موافقة العروض</h1>
          <p className="text-muted-foreground">
            مراجعة والموافقة على عروض الموردين
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button onClick={loadOffers} variant="outline">
            <RefreshCw className="w-4 h-4 ml-2" />
            تحديث
          </Button>
          {pendingOffers.length > 0 && (
            <Button
              onClick={() => handleBulkApprove(pendingOffers.map((o) => o.id))}
              variant="default"
            >
              <CheckCircle className="w-4 h-4 ml-2" />
              قبول جميع المعلقة
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingOffers.length}</p>
              <p className="text-sm text-muted-foreground">معلقة</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{approvedOffers.length}</p>
              <p className="text-sm text-muted-foreground">مقبولة</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{rejectedOffers.length}</p>
              <p className="text-sm text-muted-foreground">مرفوضة</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{offers.length}</p>
              <p className="text-sm text-muted-foreground">الإجمالي</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            المرشحات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="البحث في العروض والموردين..."
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
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="الفئة" />
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
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">معلقة</SelectItem>
                <SelectItem value="approved">مقبولة</SelectItem>
                <SelectItem value="rejected">مرفوضة</SelectItem>
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            معلقة ({pendingOffers.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            مقبولة ({approvedOffers.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            مرفوضة ({rejectedOffers.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            الكل ({offers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedStatus} className="mt-6">
          {filteredOffers.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">لا توجد عروض</h3>
                <p className="text-muted-foreground text-center">
                  {selectedStatus === "pending"
                    ? "لا توجد عروض في انتظار الموافقة حالياً."
                    : "لا توجد عروض تطابق المرشحات الحالية."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredOffers.map((offer) => (
                <div key={offer.id} className="relative">
                  <OfferCard
                    offer={offer}
                    variant="admin"
                    showActions={false}
                  />

                  {/* Custom Action Buttons */}
                  {offer.status === "pending" && (
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => openReviewDialog("approve", offer)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 ml-1" />
                        قبول
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openReviewDialog("review", offer)}
                        className="flex-1"
                      >
                        <AlertTriangle className="w-4 h-4 ml-1" />
                        مراجعة
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openReviewDialog("reject", offer)}
                        className="flex-1"
                      >
                        <XCircle className="w-4 h-4 ml-1" />
                        رفض
                      </Button>
                    </div>
                  )}

                  {/* Admin Notes Display */}
                  {offer.adminNotes && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="text-xs">
                        <FileText className="w-3 h-3 ml-1" />
                        يحتوي على ملاحظات
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={!!reviewAction} onOpenChange={closeReviewDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {reviewAction?.type === "approve" && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
              {reviewAction?.type === "reject" && (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              {reviewAction?.type === "review" && (
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              )}
              {getDialogTitle()}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {reviewAction && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-sm">
                  {reviewAction.offer.title}
                </p>
                <p className="text-xs text-gray-600">
                  المورد: {reviewAction.offer.supplierName}
                </p>
              </div>
            )}

            {reviewAction?.type === "reject" && (
              <div className="space-y-2">
                <Label htmlFor="reject-reason">سبب الرفض *</Label>
                <Textarea
                  id="reject-reason"
                  placeholder="اذكر سبب رفض العرض (سيتم إرساله للمورد)"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="admin-notes">
                {reviewAction?.type === "review"
                  ? "ملاحظات المراجعة *"
                  : "ملاحظات إدارية (اختيارية)"}
              </Label>
              <Textarea
                id="admin-notes"
                placeholder={
                  reviewAction?.type === "review"
                    ? "اكتب ملاحظات المراجعة للمورد..."
                    : "ملاحظات داخلية للإدارة..."
                }
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                required={reviewAction?.type === "review"}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeReviewDialog}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleReviewSubmit}
              disabled={
                isSubmitting ||
                (reviewAction?.type === "reject" && !rejectReason.trim()) ||
                (reviewAction?.type === "review" && !adminNotes.trim())
              }
              className={
                reviewAction?.type === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : reviewAction?.type === "reject"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-yellow-600 hover:bg-yellow-700"
              }
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
                  جاري التحديث...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 ml-2" />
                  {getActionButtonText()}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
