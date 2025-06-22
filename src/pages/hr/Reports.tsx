import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  ShoppingCart,
  Zap,
  Package,
  Eye,
  TrendingUp,
  Target,
  Gift,
  Award,
  Activity,
  Download,
  Calendar,
  BarChart3,
  UserCheck,
  Star,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/dateUtils";

export default function HRReports() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  const [activeEmployees, setActiveEmployees] = useState<number | undefined>(
    undefined,
  );
  const [totalRedemptions, setTotalRedemptions] = useState<number | undefined>(
    undefined,
  );
  const [totalPointsUsed, setTotalPointsUsed] = useState<number | undefined>(
    undefined,
  );
  const [approvedOffers, setApprovedOffers] = useState<number | undefined>(
    undefined,
  );

  const [departmentData, setDepartmentData] = useState([
    {
      name: "الهندسة",
      employeeCount: 45,
      redemptions: 128,
      pointsUsed: 34500,
      avgPerEmployee: 766,
      topCategory: "التكنولوجيا",
    },
    {
      name: "التسويق",
      employeeCount: 28,
      redemptions: 92,
      pointsUsed: 24800,
      avgPerEmployee: 885,
      topCategory: "الطعام والمأكولات",
    },
    {
      name: "المبيعات",
      employeeCount: 35,
      redemptions: 156,
      pointsUsed: 42300,
      avgPerEmployee: 1208,
      topCategory: "الترفيه",
    },
    {
      name: "الموارد البشرية",
      employeeCount: 15,
      redemptions: 67,
      pointsUsed: 18900,
      avgPerEmployee: 1260,
      topCategory: "اللياقة والصحة",
    },
    {
      name: "المالية",
      employeeCount: 22,
      redemptions: 73,
      pointsUsed: 21100,
      avgPerEmployee: 958,
      topCategory: "السفر والمواصلات",
    },
  ]);

  const [topOffers, setTopOffers] = useState([
    {
      id: "1",
      title: "خصم 30% على مطعم البيك",
      supplier: "البيك",
      category: "طعام",
      views: 1250,
      redemptions: 89,
      conversionRate: 7.1,
      revenue: 24750,
      status: "approved",
    },
    {
      id: "2",
      title: "تخفيض 25% على نادي فتنس تايم",
      supplier: "فتنس تايم",
      category: "لياقة",
      views: 890,
      redemptions: 34,
      conversionRate: 3.8,
      revenue: 12850,
      status: "approved",
    },
    {
      id: "3",
      title: "عرض ��اص على سينما vox",
      supplier: "vox سينما",
      category: "ترفيه",
      views: 2150,
      redemptions: 156,
      conversionRate: 7.3,
      revenue: 31200,
      status: "approved",
    },
    {
      id: "4",
      title: "خصم 40% على متجر جرير",
      supplier: "مكتبة جرير",
      category: "تكنولوجيا",
      views: 780,
      redemptions: 67,
      conversionRate: 8.6,
      revenue: 22300,
      status: "pending",
    },
    {
      id: "5",
      title: "تخفيضات على أوبر للمواصلات",
      supplier: "أوبر",
      category: "مواصلات",
      views: 1890,
      redemptions: 234,
      conversionRate: 12.4,
      revenue: 45600,
      status: "approved",
    },
  ]);

  const [monthlyReports, setMonthlyReports] = useState([
    {
      month: "يناير 2024",
      activeUsers: 145,
      offersViewed: 3420,
      redemptions: 567,
      pointsDistributed: 84500,
      topCategory: "الطعام والمأكولات",
      satisfaction: 4.2,
    },
    {
      month: "فبراير 2024",
      activeUsers: 152,
      offersViewed: 3890,
      redemptions: 634,
      pointsDistributed: 92300,
      topCategory: "الترفيه",
      satisfaction: 4.3,
    },
    {
      month: "مارس 2024",
      activeUsers: 159,
      offersViewed: 4150,
      redemptions: 712,
      pointsDistributed: 98700,
      topCategory: "التكنولوجيا",
      satisfaction: 4.5,
    },
    {
      month: "أبريل 2024",
      activeUsers: 167,
      offersViewed: 4420,
      redemptions: 789,
      pointsDistributed: 105200,
      topCategory: "اللياقة والصحة",
      satisfaction: 4.4,
    },
    {
      month: "مايو 2024",
      activeUsers: 174,
      offersViewed: 4680,
      redemptions: 845,
      pointsDistributed: 112800,
      topCategory: "السفر والمواصلات",
      satisfaction: 4.6,
    },
    {
      month: "يونيو 2024",
      activeUsers: 181,
      offersViewed: 4950,
      redemptions: 923,
      pointsDistributed: 121500,
      topCategory: "الطعام والمأكولات",
      satisfaction: 4.7,
    },
  ]);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setActiveEmployees(181);
      setTotalRedemptions(923);
      setTotalPointsUsed(121500);
      setApprovedOffers(47);
      setIsLoading(false);
    }, 1000);
  }, []);

  const employeeEngagementRate =
    ((totalRedemptions || 0) / (activeEmployees || 1)) * 100;
  const offerConversionRate =
    topOffers.reduce((sum, offer) => sum + offer.conversionRate, 0) /
    topOffers.length;

  const exportReport = () => {
    // Export functionality would be implemented here
    console.log("Exporting report...");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
        </div>

        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("navigation.reports")}</h1>
          <p className="text-muted-foreground">
            تقارير شاملة عن أداء نظام المزايا والموظفين
          </p>
        </div>
        <Button onClick={exportReport} className="gap-2">
          <Download className="w-4 h-4" />
          تصدير التقرير
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">
                {(activeEmployees || 0).toLocaleString("ar-SA")}
              </p>
              <p className="text-sm text-blue-700">الموظفون النشطون</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-900">
                {(totalRedemptions || 0).toLocaleString("ar-SA")}
              </p>
              <p className="text-sm text-green-700">إجمالي الاستبدالات</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-900">
                {(totalPointsUsed || 0).toLocaleString("ar-SA")}
              </p>
              <p className="text-sm text-purple-700">النقاط المستخدمة</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-900">
                {(approvedOffers || 0).toLocaleString("ar-SA")}
              </p>
              <p className="text-sm text-orange-700">العروض المعتمدة</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="departments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="departments">تقارير الأقسام</TabsTrigger>
          <TabsTrigger value="offers">أداء العروض</TabsTrigger>
          <TabsTrigger value="monthly">التقارير الشهرية</TabsTrigger>
          <TabsTrigger value="insights">التحليلات والاستشارات</TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>أداء الأقسام</CardTitle>
              <CardDescription>
                إحصائيات تفصيلية لاستخدام المزايا حسب القسم
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {departmentData.map((dept, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">{dept.name}</h3>
                      <Badge variant="outline">{dept.employeeCount} موظف</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {(dept.redemptions || 0).toLocaleString("ar-SA")}
                        </p>
                        <p className="text-muted-foreground">استبدال</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">
                          {(dept.pointsUsed || 0).toLocaleString("ar-SA")}
                        </p>
                        <p className="text-muted-foreground">نقطة مستخدمة</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {(dept.avgPerEmployee || 0).toLocaleString("ar-SA")}
                        </p>
                        <p className="text-muted-foreground">متوسط لكل موظف</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-medium text-orange-600">
                          {dept.topCategory}
                        </p>
                        <p className="text-muted-foreground">
                          الفئة الأكثر شعبية
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>أداء العروض</CardTitle>
              <CardDescription>
                تحليل مفصل لأداء العروض والعائد على الاستثمار
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>العرض</TableHead>
                    <TableHead>المورد</TableHead>
                    <TableHead>الفئة</TableHead>
                    <TableHead>المشاهدات</TableHead>
                    <TableHead>الاستبدالات</TableHead>
                    <TableHead>معدل التحويل</TableHead>
                    <TableHead>العائد</TableHead>
                    <TableHead>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topOffers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell className="font-medium">
                        {offer.title}
                      </TableCell>
                      <TableCell>{offer.supplier}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{offer.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                          {(offer.views || 0).toLocaleString("ar-SA")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                          {(offer.redemptions || 0).toLocaleString("ar-SA")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            offer.conversionRate >= 5 ? "default" : "secondary"
                          }
                        >
                          {(offer.conversionRate || 0).toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">
                          {(offer.revenue || 0).toLocaleString("ar-SA")} ر.س
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            offer.status === "approved"
                              ? "default"
                              : offer.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {offer.status === "approved"
                            ? "معتمد"
                            : offer.status === "pending"
                              ? "في الانتظار"
                              : "مرفوض"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>التقارير الشهرية</CardTitle>
              <CardDescription>
                نظرة عامة على الأداء الشهري للنظام
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyReports.map((report, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold">{report.month}</h3>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">
                          {report.satisfaction}/5
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            المستخدمون النشطون
                          </p>
                          <p className="font-semibold">
                            {(report.activeUsers || 0).toLocaleString("ar-SA")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-green-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            العروض المشاهدة
                          </p>
                          <p className="font-semibold">
                            {(report.offersViewed || 0).toLocaleString("ar-SA")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-purple-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            الاستبدالات
                          </p>
                          <p className="font-semibold">
                            {(report.redemptions || 0).toLocaleString("ar-SA")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            النقاط الموزعة
                          </p>
                          <p className="font-semibold">
                            {(report.pointsDistributed || 0).toLocaleString(
                              "ar-SA",
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-muted-foreground">
                          الفئة الأكثر شعبية:
                        </span>
                        <Badge variant="outline">{report.topCategory}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">
                    ملخص الاتجاهات
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-blue-700 font-medium">نمو المشاركة</p>
                    <p className="text-blue-600">
                      زيادة {(((181 - 145) / 145) * 100).toFixed(1)}% في 6 أشهر
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-700 font-medium">متوسط النقاط</p>
                    <p className="text-blue-600">
                      <span className="font-semibold">
                        {Math.round((totalPointsUsed || 0) / 6).toLocaleString(
                          "ar-SA",
                        )}
                      </span>{" "}
                      نقطة شهرياً
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-700 font-medium">رضا المستخدمين</p>
                    <p className="text-blue-600">تحسن من 4.2 إلى 4.7 نجمة</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  مؤشرات الأداء الرئيسية
                </CardTitle>
                <CardDescription>
                  تحليل المقاييس المهمة لنجاح البرنامج
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      معدل مشاركة الموظفين
                    </span>
                    <Badge
                      variant={
                        employeeEngagementRate >= 80 ? "default" : "secondary"
                      }
                    >
                      {employeeEngagementRate.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(employeeEngagementRate, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      معدل تحويل العروض
                    </span>
                    <Badge
                      variant={
                        offerConversionRate >= 5 ? "default" : "secondary"
                      }
                    >
                      {offerConversionRate.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min((offerConversionRate / 10) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      متوسط النقاط لكل موظف
                    </span>
                    <Badge variant="outline">
                      {Math.round(
                        (totalPointsUsed || 0) / (activeEmployees || 1),
                      ).toLocaleString("ar-SA")}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    مقارنة بالهدف الشهري: 1000 نقطة
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  تحليل الأدا�� والتوصيات
                </CardTitle>
                <CardDescription>اقتراحات لتحسين نظام المزايا</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {employeeEngagementRate >= 80 ? (
                    <div className="p-3 rounded-lg border border-green-200 bg-green-50">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-800">
                          مشاركة ممتازة
                        </span>
                      </div>
                      <p className="text-sm text-green-700">
                        معدل مشاركة الموظفين عالي جداً، استمر في نفس
                        الاستراتيجية
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg border border-yellow-200 bg-yellow-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-yellow-800">
                          تحسين المشاركة
                        </span>
                      </div>
                      <p className="text-sm text-yellow-700">
                        يمكن تحسين معدل مشاركة الموظفين من خلال عروض أكثر جاذبية
                      </p>
                    </div>
                  )}

                  {offerConversionRate >= 5 ? (
                    <div className="p-3 rounded-lg border border-blue-200 bg-blue-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-800">
                          معدل تحويل جيد
                        </span>
                      </div>
                      <p className="text-sm text-blue-700">
                        العروض تحقق معدل تحويل جيد من المشاهدة للاستبدال
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg border border-orange-200 bg-orange-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="w-4 h-4 text-orange-600" />
                        <span className="font-medium text-orange-800">
                          تحسين جودة العروض
                        </span>
                      </div>
                      <p className="text-sm text-orange-700">
                        تحسين وصف العروض وقيمتها لزيادة معدل التحويل
                      </p>
                    </div>
                  )}

                  <div className="p-3 rounded-lg border border-purple-200 bg-purple-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Gift className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-purple-800">
                        توسيع الشراكا��
                      </span>
                    </div>
                    <p className="text-sm text-purple-700">
                      إضافة موردين جدد في فئات مختلفة لتنويع العروض المتاحة
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-indigo-200 bg-indigo-50">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-indigo-600" />
                      <span className="font-medium text-indigo-800">
                        تحليل البيانات
                      </span>
                    </div>
                    <p className="text-sm text-indigo-700">
                      تحليل أعمق لتفضيلات الموظفين حسب الأقسام والفئات العمرية
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
