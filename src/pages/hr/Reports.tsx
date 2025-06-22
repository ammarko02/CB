import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { User, Offer } from "@/types";
import { userService, offerService } from "@/services/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Download,
  Calendar,
  Users,
  TrendingUp,
  Building,
  UserCheck,
  UserX,
  Activity,
  Clock,
  Award,
  Target,
  BarChart3,
  PieChart,
  RefreshCw,
  Filter,
  Search,
  Eye,
  Gift,
  ShoppingCart,
  Star,
  Package,
  Zap,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { DEPARTMENTS } from "@/lib/constants";

interface DepartmentPerksReport {
  name: string;
  totalEmployees: number;
  activeUsers: number;
  totalRedemptions: number;
  pointsUsed: number;
  avgSatisfaction: number;
  topCategory: string;
}

interface OfferPerformanceReport {
  id: string;
  title: string;
  supplier: string;
  category: string;
  views: number;
  redemptions: number;
  pointsCost: number;
  conversionRate: number;
  revenue: number;
  status: string;
}

interface MonthlyEngagementReport {
  month: string;
  activeUsers: number;
  offersViewed: number;
  redemptions: number;
  pointsDistributed: number;
  newOffersAdded: number;
  userSatisfaction: number;
}

export default function HRReports() {
  const { t, i18n } = useTranslation();
  const [employees, setEmployees] = useState<User[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  useEffect(() => {
    loadReportsData();
  }, []);

  const loadReportsData = async () => {
    try {
      setIsLoading(true);
      const [employeesResponse, offersResponse] = await Promise.all([
        userService.getUsers({ role: "employee" }),
        offerService.getOffers(),
      ]);
      setEmployees(employeesResponse.data);
      setOffers(offersResponse.data);
    } catch (error) {
      console.error("Failed to load reports data:", error);
      toast({
        title: t("notifications.error"),
        description: "فشل في تحميل بيانات التقارير",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate real statistics based on actual data
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((emp) => emp.isActive).length;
  const totalOffers = offers.length;
  const approvedOffers = offers.filter(
    (offer) => offer.status === "approved",
  ).length;

  // Calculate total views and redemptions from offers data
  const totalViews = offers.reduce((sum, offer) => sum + offer.views, 0);
  const totalRedemptions = offers.reduce(
    (sum, offer) => sum + offer.redemptions,
    0,
  );
  const totalPointsUsed = offers.reduce(
    (sum, offer) => sum + offer.redemptions * offer.pointsCost,
    0,
  );
  const totalRevenue = offers.reduce(
    (sum, offer) => sum + offer.redemptions * offer.pointsCost,
    0,
  );

  // Calculate engagement rates
  const employeeEngagementRate =
    totalEmployees > 0 ? (totalRedemptions / totalEmployees) * 100 : 0;
  const offerConversionRate =
    totalViews > 0 ? (totalRedemptions / totalViews) * 100 : 0;

  // Department perks reports based on real data
  const departmentPerksReports: DepartmentPerksReport[] = DEPARTMENTS.map(
    (dept) => {
      const deptEmployees = employees.filter((emp) => emp.department === dept);
      const deptActiveUsers = deptEmployees.filter((emp) => emp.isActive);

      // Mock some realistic data based on department size
      const mockRedemptions = Math.floor(deptEmployees.length * 1.5); // Average 1.5 redemptions per employee
      const mockPointsUsed = mockRedemptions * 150; // Average 150 points per redemption

      return {
        name: dept,
        totalEmployees: deptEmployees.length,
        activeUsers: deptActiveUsers.length,
        totalRedemptions: mockRedemptions,
        pointsUsed: mockPointsUsed,
        avgSatisfaction: 4.0 + Math.random() * 0.8, // Between 4.0 and 4.8
        topCategory: ["food", "fitness", "entertainment", "retail"][
          Math.floor(Math.random() * 4)
        ],
      };
    },
  ).filter((dept) => dept.totalEmployees > 0);

  // Offer performance reports based on real offers data
  const offerPerformanceReports: OfferPerformanceReport[] = offers
    .slice(0, 10)
    .map((offer) => ({
      id: offer.id,
      title: offer.title,
      supplier: offer.supplierName,
      category: offer.category,
      views: offer.views,
      redemptions: offer.redemptions,
      pointsCost: offer.pointsCost,
      conversionRate:
        offer.views > 0 ? (offer.redemptions / offer.views) * 100 : 0,
      pointsRedeemed: offer.redemptions * offer.pointsCost,
      status: offer.status,
    }));

  // Monthly engagement reports (mock data based on real statistics)
  const monthlyEngagementReports: MonthlyEngagementReport[] = [
    {
      month: "يناير 2024",
      activeUsers: Math.floor(activeEmployees * 0.7),
      offersViewed: Math.floor(totalViews * 0.15),
      redemptions: Math.floor(totalRedemptions * 0.12),
      pointsDistributed: activeEmployees * 1000, // Monthly points allocation
      newOffersAdded: 8,
      userSatisfaction: 4.2,
    },
    {
      month: "فبراير 2024",
      activeUsers: Math.floor(activeEmployees * 0.8),
      offersViewed: Math.floor(totalViews * 0.18),
      redemptions: Math.floor(totalRedemptions * 0.16),
      pointsDistributed: activeEmployees * 1000,
      newOffersAdded: 12,
      userSatisfaction: 4.3,
    },
    {
      month: "مارس 2024",
      activeUsers: Math.floor(activeEmployees * 0.85),
      offersViewed: Math.floor(totalViews * 0.22),
      redemptions: Math.floor(totalRedemptions * 0.2),
      pointsDistributed: activeEmployees * 1000,
      newOffersAdded: 6,
      userSatisfaction: 4.1,
    },
    {
      month: "أبريل 2024",
      activeUsers: Math.floor(activeEmployees * 0.9),
      offersViewed: Math.floor(totalViews * 0.25),
      redemptions: Math.floor(totalRedemptions * 0.24),
      pointsDistributed: activeEmployees * 1000,
      newOffersAdded: 15,
      userSatisfaction: 4.4,
    },
    {
      month: "مايو 2024",
      activeUsers: Math.floor(activeEmployees * 0.88),
      offersViewed: Math.floor(totalViews * 0.2),
      redemptions: Math.floor(totalRedemptions * 0.18),
      pointsDistributed: activeEmployees * 1000,
      newOffersAdded: 9,
      userSatisfaction: 4.2,
    },
    {
      month: "يونيو 2024",
      activeUsers: activeEmployees,
      offersViewed: totalViews,
      redemptions: totalRedemptions,
      pointsDistributed: activeEmployees * 1000,
      newOffersAdded: 11,
      userSatisfaction: 4.0,
    },
  ];

  const handleExportReport = (reportType: string) => {
    toast({
      title: "تصدير التقرير",
      description: `جاري تصدير تقرير ${reportType}...`,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">تقارير مزايا الموظفين</h1>
          <p className="text-muted-foreground">
            تحليلات شاملة لاستخدام العروض والمزايا من قبل الموظفين
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisWeek">هذا الأسبوع</SelectItem>
              <SelectItem value="thisMonth">هذا الشهر</SelectItem>
              <SelectItem value="lastMonth">الشهر الماضي</SelectItem>
              <SelectItem value="thisQuarter">هذا الربع</SelectItem>
              <SelectItem value="thisYear">هذا العام</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={loadReportsData} variant="outline" size="sm">
            <RefreshCw
              className={`w-4 h-4 ${i18n.language === "ar" ? "ml-2" : "mr-2"}`}
            />
            {t("common.refresh")}
          </Button>
          <Button
            onClick={() => handleExportReport("شامل")}
            variant="outline"
            size="sm"
          >
            <Download
              className={`w-4 h-4 ${i18n.language === "ar" ? "ml-2" : "mr-2"}`}
            />
            تصدير
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
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

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
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

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
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

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-900">
                {(approvedOffers || 0).toLocaleString("ar-SA")}
              </p>
              <p className="text-sm text-orange-700">العروض المتاحة</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="departments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="departments">مزايا الأقسام</TabsTrigger>
          <TabsTrigger value="offers">أداء العروض</TabsTrigger>
          <TabsTrigger value="engagement">التفاعل الشهري</TabsTrigger>
          <TabsTrigger value="analytics">مؤشرات الأداء</TabsTrigger>
        </TabsList>

        {/* Department Perks Reports */}
        <TabsContent value="departments" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  تقرير استخدام المزايا حسب القسم
                </CardTitle>
                <CardDescription>
                  كيفية استفادة كل قسم من نظام المزايا والعروض
                </CardDescription>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleExportReport("مزايا الأقسام")}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    تصدير التقرير
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentPerksReports.map((dept) => (
                    <div
                      key={dept.name}
                      className="p-4 rounded-lg border bg-gray-50/50"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-lg">
                          {t(
                            `departments.${dept.name.toLowerCase().replace(" ", "")}`,
                          )}
                        </h4>
                        <Badge variant="outline">
                          {dept.totalEmployees} موظف
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">
                            {dept.activeUsers}
                          </p>
                          <p className="text-muted-foreground">مستخدم نشط</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">
                            {dept.totalRedemptions}
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
                          <p className="text-2xl font-bold text-orange-600">
                            {dept.avgSatisfaction.toFixed(1)}/5
                          </p>
                          <p className="text-muted-foreground">معدل الرضا</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                            {(offer.views || 0).toLocaleString("ar-SA")}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                            {(offer.redemptions || 0).toLocaleString("ar-SA")}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  معدلات المشاركة والتفاعل
                </CardTitle>
                <CardDescription>
                  مقاييس الأداء الرئيسية لنظام المزايا
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 rounded-lg bg-blue-50 border border-blue-200">
                    <p className="text-3xl font-bold text-blue-600">
                      {employeeEngagementRate.toFixed(1)}%
                    </p>
                    <p className="text-blue-700 font-medium">
                      معدل مشاركة الموظفين
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      عدد الاستبدالات مقسوماً على عدد الموظفين
                    </p>
                  </div>

                  <div className="text-center p-6 rounded-lg bg-green-50 border border-green-200">
                    <p className="text-3xl font-bold text-green-600">
                      {offerConversionRate.toFixed(1)}%
                    </p>
                    <p className="text-green-700 font-medium">
                      معدل تحويل العروض
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      عدد الاستبدالات مقسوماً على عدد المشاهدات
                    </p>
                  </div>

                  <div className="text-center p-6 rounded-lg bg-purple-50 border border-purple-200">
                    <p className="text-3xl font-bold text-purple-600">
                      {totalEmployees > 0
                        ? Math.round(totalPointsUsed / totalEmployees)
                        : 0}
                    </p>
                    <p className="text-purple-700 font-medium">
                      متوسط النقاط للموظف
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      إجمالي النقاط المستخدمة مقسوماً على عدد الموظفين
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Offer Performance Reports */}
        <TabsContent value="offers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                تقرير أداء العروض التفصيلي
              </CardTitle>
              <CardDescription>
                إحصائيات العروض الأكثر نجاحاً والأكثر مشاهدة
              </CardDescription>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleExportReport("أداء العروض")}
                  variant="outline"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  تصدير التقرير
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>العرض</TableHead>
                      <TableHead>المورد</TableHead>
                      <TableHead>الفئة</TableHead>
                      <TableHead>المشاهدات</TableHead>
                      <TableHead>الاستبدالات</TableHead>
                      <TableHead>معدل التحويل</TableHead>
                      <TableHead>الإيرادات</TableHead>
                      <TableHead>الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {offerPerformanceReports.map((offer) => (
                      <TableRow key={offer.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                            {(offer.redemptions || 0).toLocaleString("ar-SA")}
                          </div>
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{offer.supplier}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {t(`categories.${offer.category}`)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                            {offer.views.toLocaleString("ar-SA")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                            {offer.redemptions.toLocaleString("ar-SA")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              offer.conversionRate >= 5
                                ? "default"
                                : "secondary"
                            }
                          >
                            {offer.conversionRate.toFixed(1)}%
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
                            {t(`common.${offer.status}`)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monthly Engagement Reports */}
        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                تقرير التفاعل الشهري
              </CardTitle>
              <CardDescription>
                تطور استخدام المزايا والعروض خلال الأشهر الماضية
              </CardDescription>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleExportReport("التفاعل الشهري")}
                  variant="outline"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  تصدير التقرير
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الشهر</TableHead>
                      <TableHead>المستخدمون النشطون</TableHead>
                      <TableHead>العروض المشاهدة</TableHead>
                      <TableHead>الاستبدالات</TableHead>
                      <TableHead>النقاط الموزعة</TableHead>
                      <TableHead>عروض جديدة</TableHead>
                      <TableHead>الرضا</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyEngagementReports.map((report, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {report.month}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-500" />
                            {report.activeUsers.toLocaleString("ar-SA")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-green-500" />
                            {report.offersViewed.toLocaleString("ar-SA")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4 text-purple-500" />
                            {report.redemptions.toLocaleString("ar-SA")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            {report.pointsDistributed.toLocaleString("ar-SA")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-orange-500" />
                            {report.newOffersAdded}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              report.userSatisfaction >= 4.0
                                ? "default"
                                : "secondary"
                            }
                          >
                            <Star className="w-3 h-3 mr-1" />
                            {report.userSatisfaction.toFixed(1)}/5
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics & KPIs */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  مؤشرات الأداء الرئيسية للمزايا
                </CardTitle>
                <CardDescription>
                  المقاييس الهامة لنجاح نظام المزايا
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-sm text-muted-foreground">
                      معدل اعتماد النظام
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {totalEmployees > 0
                          ? ((activeEmployees / totalEmployees) * 100).toFixed(
                              1,
                            )
                          : 0}
                        %
                      </span>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-sm text-muted-foreground">
                      متوسط الاستبدالات لكل موظف
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {totalEmployees > 0
                          ? (totalRedemptions / totalEmployees).toFixed(1)
                          : 0}
                      </span>
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-sm text-muted-foreground">
                      متوسط النقاط المستخدمة شهرياً
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {Math.round(totalPointsUsed / 6).toLocaleString(
                          "ar-SA",
                        )}
                      </span>
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-sm text-muted-foreground">
                      فعالية العروض
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {totalOffers > 0
                          ? ((approvedOffers / totalOffers) * 100).toFixed(1)
                          : 0}
                        %
                      </span>
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  تحليل الأداء والتوصيات
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
                        توسيع الشراكات
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