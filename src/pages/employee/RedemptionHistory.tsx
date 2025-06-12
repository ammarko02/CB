import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { History } from "lucide-react";

export default function RedemptionHistory() {
  const { t, i18n } = useTranslation();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {t("dashboard.latestRedemptions")}
        </h1>
        <p className="text-muted-foreground">
          {t("dashboard.latestRedemptions")} والوفورات المحققة
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History
              className={`w-5 h-5 ${i18n.language === "ar" ? "ml-2" : "mr-2"}`}
            />
            {t("dashboard.latestRedemptions")}
          </CardTitle>
          <CardDescription>
            ميزة تتبع عمليات الاستبدال قادمة قريباً
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <History className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {t("dashboard.latestRedemptions")}
          </h3>
          <p className="text-muted-foreground">
            تتبع جميع العروض المستبدلة وإجمالي الوفورات المحققة.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
