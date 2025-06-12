import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TranslationTest() {
  const { t, i18n } = useTranslation();
  const { currentLanguage, isRTL, changeLanguage } = useLanguage();

  const testCategories = [
    "food",
    "fitness",
    "entertainment",
    "travel",
    "retail",
    "technology",
    "other",
  ];
  const testRoles = ["super_admin", "hr", "supplier", "employee"];

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Translation Test Page</CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={() => changeLanguage("en")}
              variant={currentLanguage === "en" ? "default" : "outline"}
            >
              English
            </Button>
            <Button
              onClick={() => changeLanguage("ar")}
              variant={currentLanguage === "ar" ? "default" : "outline"}
            >
              العربية
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Current Language: {currentLanguage} | RTL: {isRTL ? "Yes" : "No"} |
            i18n.language: {i18n.language}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Common Translations */}
          <div>
            <h3 className="font-semibold mb-2">Common Translations</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Badge>{t("common.loading")}</Badge>
              <Badge>{t("common.save")}</Badge>
              <Badge>{t("common.cancel")}</Badge>
              <Badge>{t("common.delete")}</Badge>
              <Badge>{t("common.edit")}</Badge>
              <Badge>{t("common.create")}</Badge>
            </div>
          </div>

          {/* App Translations */}
          <div>
            <h3 className="font-semibold mb-2">App Translations</h3>
            <div className="space-y-1">
              <p>
                <strong>Title:</strong> {t("app.title")}
              </p>
              <p>
                <strong>Subtitle:</strong> {t("app.subtitle")}
              </p>
              <p>
                <strong>Description:</strong> {t("app.description")}
              </p>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-2">Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {testCategories.map((cat) => (
                <Badge key={cat} variant="outline">
                  {t(`categories.${cat}`)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Roles */}
          <div>
            <h3 className="font-semibold mb-2">Roles</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {testRoles.map((role) => (
                <Badge key={role} variant="secondary">
                  {t(`roles.${role}`)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Dashboard */}
          <div>
            <h3 className="font-semibold mb-2">Dashboard</h3>
            <div className="space-y-1">
              <p>
                <strong>Welcome Back:</strong> {t("dashboard.welcomeBack")}
              </p>
              <p>
                <strong>Total Users:</strong> {t("dashboard.totalUsers")}
              </p>
              <p>
                <strong>Total Offers:</strong> {t("dashboard.totalOffers")}
              </p>
              <p>
                <strong>Points Balance:</strong> {t("dashboard.pointsBalance")}
              </p>
            </div>
          </div>

          {/* Offers */}
          <div>
            <h3 className="font-semibold mb-2">Offers</h3>
            <div className="space-y-1">
              <p>
                <strong>Browse Offers:</strong> {t("offers.browseOffers")}
              </p>
              <p>
                <strong>Create Offer:</strong> {t("offers.createOffer")}
              </p>
              <p>
                <strong>No Offers Found:</strong> {t("offers.noOffersFound")}
              </p>
              <p>
                <strong>Search Placeholder:</strong>{" "}
                {t("offers.searchPlaceholder")}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-2">Navigation</h3>
            <div className="space-y-1">
              <p>
                <strong>Dashboard:</strong> {t("navigation.dashboard")}
              </p>
              <p>
                <strong>Analytics:</strong> {t("navigation.analytics")}
              </p>
              <p>
                <strong>Users:</strong> {t("navigation.users")}
              </p>
              <p>
                <strong>Suppliers:</strong> {t("navigation.suppliers")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
