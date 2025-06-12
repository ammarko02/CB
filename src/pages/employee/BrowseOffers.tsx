import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Offer, FilterOptions } from "@/types";
import { offerService, redemptionService } from "@/services/api";
import { OfferCard } from "@/components/OfferCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Package,
  RefreshCw,
  Grid,
  List,
} from "lucide-react";
import { OFFER_CATEGORIES } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";
import { OfferUsageTracker } from "@/lib/offerUsageTracker";
import { useAuth } from "@/contexts/AuthContext";

export default function BrowseOffers() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [pointsRange, setPointsRange] = useState([0, 1000]);
  const [maxPoints, setMaxPoints] = useState(1000);

  useEffect(() => {
    loadOffers();
  }, []);

  useEffect(() => {
    filterOffers();
  }, [
    offers,
    searchTerm,
    selectedCategory,
    selectedSupplier,
    sortBy,
    pointsRange,
  ]);

  const loadOffers = async () => {
    try {
      setIsLoading(true);
      const response = await offerService.getOffers();
      // Filter only approved offers for employees
      const approvedOffers = response.data.filter(
        (offer) => offer.status === "approved",
      );
      setOffers(approvedOffers);

      // Calculate max points for slider
      const maxOfferPoints = Math.max(
        ...approvedOffers.map((offer) => offer.pointsCost),
      );
      setMaxPoints(maxOfferPoints);
      setPointsRange([0, maxOfferPoints]);
    } catch (error) {
      console.error("Failed to load offers:", error);
      toast({
        title: t("notifications.error"),
        description: t("errors.loadingFailed"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterOffers = () => {
    let filtered = [...offers];

    // Filter out offers that should be hidden for current user
    if (user) {
      filtered = filtered.filter(
        (offer) => !OfferUsageTracker.shouldHideOfferFromBrowse(user.id, offer),
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

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (offer) => offer.category === selectedCategory,
      );
    }

    // Filter by supplier
    if (selectedSupplier !== "all") {
      filtered = filtered.filter(
        (offer) => offer.supplierName === selectedSupplier,
      );
    }

    // Filter by points range
    filtered = filtered.filter(
      (offer) =>
        offer.pointsCost >= pointsRange[0] &&
        offer.pointsCost <= pointsRange[1],
    );

    // Filter out expired offers
    filtered = filtered.filter(
      (offer) => new Date(offer.expiryDate) > new Date(),
    );

    // Sort offers
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "discount":
        filtered.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
      case "expiry":
        filtered.sort(
          (a, b) =>
            new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime(),
        );
        break;
      case "popularity":
        filtered.sort((a, b) => b.redemptions - a.redemptions);
        break;
      case "points_low":
        filtered.sort((a, b) => a.pointsCost - b.pointsCost);
        break;
      case "points_high":
        filtered.sort((a, b) => b.pointsCost - a.pointsCost);
        break;
    }

    setFilteredOffers(filtered);
  };

  const handleRedeemOffer = async (offerId: string) => {
    if (!user) throw new Error("User not authenticated");

    const offer = offers.find((o) => o.id === offerId);
    if (!offer) throw new Error("Offer not found");

    // Check if user can redeem this offer
    const { canRedeem, reason } = OfferUsageTracker.canEmployeeRedeemOffer(
      user.id,
      offer,
    );
    if (!canRedeem) {
      throw new Error(reason || "Cannot redeem this offer");
    }

    try {
      await redemptionService.redeemOffer(offerId);

      // Record the usage
      OfferUsageTracker.recordUsage(user.id, offer);

      // Update the offer to show reduced remaining redemptions
      setOffers((prev) =>
        prev.map((prevOffer) =>
          prevOffer.id === offerId
            ? {
                ...prevOffer,
                redemptions: prevOffer.redemptions + 1,
                remainingRedemptions: prevOffer.remainingRedemptions
                  ? prevOffer.remainingRedemptions - 1
                  : undefined,
              }
            : prevOffer,
        ),
      );

      // If it's a once-per-employee offer, trigger re-filter to hide it
      if (offer.usageLimit === "once_per_employee") {
        filterOffers();
      }
    } catch (error) {
      throw error; // Let OfferCard handle the error display
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedSupplier("all");
    setSortBy("newest");
    setPointsRange([0, maxPoints]);
  };

  const uniqueSuppliers = [
    ...new Set(offers.map((offer) => offer.supplierName)),
  ];

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
          <h1 className="text-3xl font-bold">{t("offers.browseOffers")}</h1>
          <p className="text-muted-foreground">{t("app.description")}</p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button onClick={loadOffers} variant="outline" size="sm">
            <RefreshCw
              className={`w-4 h-4 ${i18n.language === "ar" ? "ml-2" : "mr-2"}`}
            />
            {t("common.refresh")}
          </Button>
          <div className="flex border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Quick Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={t("offers.searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={i18n.language === "ar" ? "pr-9" : "pl-9"}
                />
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={t("common.category")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("offers.allCategories")}
                  </SelectItem>
                  {Object.entries(OFFER_CATEGORIES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {t(`categories.${key}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={t("common.filter")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t("offers.newest")}</SelectItem>
                  <SelectItem value="oldest">{t("offers.oldest")}</SelectItem>
                  <SelectItem value="discount">
                    {t("offers.highestDiscount")}
                  </SelectItem>
                  <SelectItem value="expiry">
                    {t("offers.expiringFirst")}
                  </SelectItem>
                  <SelectItem value="popularity">
                    {t("offers.mostPopular")}
                  </SelectItem>
                  <SelectItem value="points_low">
                    {t("offers.lowestPoints")}
                  </SelectItem>
                  <SelectItem value="points_high">
                    {t("offers.highestPoints")}
                  </SelectItem>
                </SelectContent>
              </Select>

              <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline">
                    <SlidersHorizontal
                      className={`w-4 h-4 ${i18n.language === "ar" ? "ml-2" : "mr-2"}`}
                    />
                    {t("offers.moreFilters")}
                  </Button>
                </CollapsibleTrigger>

                {/* Advanced Filters */}
                <CollapsibleContent>
                  <CardContent className="border-t p-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {t("navigation.suppliers")}
                        </label>
                        <Select
                          value={selectedSupplier}
                          onValueChange={setSelectedSupplier}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("offers.allSuppliers")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">
                              {t("offers.allSuppliers")}
                            </SelectItem>
                            {uniqueSuppliers.map((supplier) => (
                              <SelectItem key={supplier} value={supplier}>
                                {supplier}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {t("offers.pointsRange")}: {pointsRange[0]} -{" "}
                          {pointsRange[1]}
                        </label>
                        <Slider
                          value={pointsRange}
                          onValueChange={setPointsRange}
                          max={maxPoints}
                          min={0}
                          step={10}
                          className="w-full"
                        />
                      </div>

                      <div className="flex items-end">
                        <Button
                          onClick={clearFilters}
                          variant="outline"
                          className="w-full"
                        >
                          {t("offers.clearFilters")}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">
            {t("offers.showing")} {filteredOffers.length} {t("offers.of")}{" "}
            {offers.length} {t("offers.title").toLowerCase()}
          </span>
          {(searchTerm ||
            selectedCategory !== "all" ||
            selectedSupplier !== "all") && (
            <Badge variant="secondary">{t("offers.filtered")}</Badge>
          )}
        </div>
      </div>

      {/* Offers Grid/List */}
      {filteredOffers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {t("offers.noOffersFound")}
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {t("offers.noOffersDesc")}
            </p>
            <Button onClick={clearFilters}>{t("offers.clearFilters")}</Button>
          </CardContent>
        </Card>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              : "space-y-4"
          }
        >
          {filteredOffers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onRedeem={handleRedeemOffer}
              variant="default"
            />
          ))}
        </div>
      )}
    </div>
  );
}
