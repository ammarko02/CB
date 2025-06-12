import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { Offer } from "@/types";
import { OfferCard } from "@/components/OfferCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Heart,
  Search,
  Filter,
  Grid,
  List,
  SortAsc,
  SortDesc,
  HeartOff,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Favorites() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      // تحميل المفضلة من Local Storage أو API
      const savedFavorites = localStorage.getItem(`favorites_${user?.id}`);
      if (savedFavorites) {
        const favoriteIds = JSON.parse(savedFavorites);

        // Mock data - في التطبيق الحقيقي ستجلب العروض من الAPI
        const mockOffers: Offer[] = [
          {
            id: "1",
            title: "خصم 20% على الملابس",
            description: "خصم رائع على جميع أنواع الملابس الرجالية والنسائية",
            discount: 20,
            category: "fashion",
            image: "/placeholder.svg",
            supplierId: "supplier1",
            supplierName: "متجر الأزياء",
            isActive: true,
            validFrom: new Date().toISOString(),
            validTo: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            usageLimit: "multiple_uses",
            usesPerEmployee: 3,
            discountCodeType: "auto_generated",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "2",
            title: "خصم 15% على الإلكترونيات",
            description: "عروض مميزة على الأجهزة الإلكترونية والجوالات",
            discount: 15,
            category: "electronics",
            image: "/placeholder.svg",
            supplierId: "supplier2",
            supplierName: "متجر التقنية",
            isActive: true,
            validFrom: new Date().toISOString(),
            validTo: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            usageLimit: "once_per_employee",
            discountCodeType: "supplier_provided",
            supplierDiscountCode: "TECH15",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "3",
            title: "وجبة مجانية في المطعم",
            description: "احصل على وجبة مجانية عند شراء وجبة بنفس القيمة",
            discount: 50,
            category: "food",
            image: "/placeholder.svg",
            supplierId: "supplier3",
            supplierName: "مطعم النخبة",
            isActive: true,
            validFrom: new Date().toISOString(),
            validTo: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            usageLimit: "multiple_uses",
            usesPerEmployee: 2,
            discountCodeType: "auto_generated",
            location: "شارع الملك فهد، الرياض",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];

        // فلترة العروض المفضلة فقط
        const favoriteOffers = mockOffers.filter((offer) =>
          favoriteIds.includes(offer.id),
        );

        setFavorites(favoriteOffers);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
      toast({
        title: "خطأ في التحميل",
        description: "فشل في تحميل المفضلة",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromFavorites = (offerId: string) => {
    try {
      const savedFavorites = localStorage.getItem(`favorites_${user?.id}`);
      if (savedFavorites) {
        const favoriteIds = JSON.parse(savedFavorites);
        const updatedFavorites = favoriteIds.filter(
          (id: string) => id !== offerId,
        );
        localStorage.setItem(
          `favorites_${user?.id}`,
          JSON.stringify(updatedFavorites),
        );

        setFavorites((prev) => prev.filter((offer) => offer.id !== offerId));

        toast({
          title: "تم الحذف",
          description: "تم حذف العرض من المفضلة",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حذف العرض من المفضلة",
        variant: "destructive",
      });
    }
  };

  const filteredOffers = favorites.filter((offer) => {
    const matchesSearch =
      offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || offer.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const sortedOffers = [...filteredOffers].sort((a, b) => {
    let aVal: string | number = "";
    let bVal: string | number = "";

    switch (sortBy) {
      case "name":
        aVal = a.title;
        bVal = b.title;
        break;
      case "discount":
        aVal = a.discount;
        bVal = b.discount;
        break;
      case "supplier":
        aVal = a.supplierName;
        bVal = b.supplierName;
        break;
      case "expiry":
        aVal = new Date(a.validTo).getTime();
        bVal = new Date(b.validTo).getTime();
        break;
      default:
        return 0;
    }

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal, "ar")
        : bVal.localeCompare(aVal, "ar");
    } else {
      return sortOrder === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    }
  });

  const getEmptyState = () => (
    <Card className="text-center py-16">
      <CardContent>
        <HeartOff className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          لا توجد عروض مفضلة
        </h3>
        <p className="text-gray-500 mb-6">
          {searchTerm || categoryFilter !== "all"
            ? "لا توجد نتائج مطابقة لبحثك"
            : "لم تقم بإضافة أي عروض للمفضلة بعد"}
        </p>
        <Button onClick={() => (window.location.href = "/employee/offers")}>
          <Search className="w-4 h-4 ml-2" />
          تصفح العروض
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-8 h-8 text-red-500" />
          <h1 className="text-3xl font-bold text-gray-900">المفضلة</h1>
          <Badge variant="secondary" className="px-3 py-1">
            {favorites.length} عرض
          </Badge>
        </div>
        <p className="text-gray-600">العروض التي أضفتها إلى المفضلة</p>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <Input
                placeholder="ابحث في المفضلة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="جميع الفئات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                <SelectItem value="fashion">الأزياء</SelectItem>
                <SelectItem value="electronics">الإلكترونيات</SelectItem>
                <SelectItem value="food">المطاعم</SelectItem>
                <SelectItem value="health">الصحة والجمال</SelectItem>
                <SelectItem value="travel">السفر</SelectItem>
                <SelectItem value="entertainment">الترفيه</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="ترتيب حسب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">الاسم</SelectItem>
                <SelectItem value="discount">قيمة الخصم</SelectItem>
                <SelectItem value="supplier">المورد</SelectItem>
                <SelectItem value="expiry">تاريخ الانتهاء</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={sortOrder === "asc" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortOrder("asc")}
                className="flex-1"
              >
                <SortAsc className="w-4 h-4 ml-1" />
                تصاعدي
              </Button>
              <Button
                variant={sortOrder === "desc" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortOrder("desc")}
                className="flex-1"
              >
                <SortDesc className="w-4 h-4 ml-1" />
                تنازلي
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            <span className="text-sm text-gray-500">
              {sortedOffers.length} من {favorites.length} عرض
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="pt-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : sortedOffers.length === 0 ? (
        getEmptyState()
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {sortedOffers.map((offer) => (
            <div key={offer.id} className="relative group">
              <OfferCard
                offer={offer}
                variant={viewMode === "list" ? "horizontal" : "vertical"}
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFromFavorites(offer.id)}
              >
                <Heart className="w-4 h-4 fill-current" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
