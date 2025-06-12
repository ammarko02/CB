import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Users,
  TrendingUp,
  DollarSign,
  Calendar,
  Building,
  Award,
  Target,
  Activity,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react";
import { formatDate } from "@/lib/dateUtils";

interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  newEmployeesThisMonth: number;
}

interface RedemptionStats {
  totalRedemptions: number;
  totalSavings: number;
  averageRedemptionsPerEmployee: number;
  mostPopularCategory: string;
}

interface DepartmentStats {
  id: string;
  name: string;
  employeeCount: number;
  redemptions: number;
  savings: number;
  engagementRate: number;
}

interface MonthlyData {
  month: string;
  employees: number;
  redemptions: number;
  savings: number;
  engagement: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function HRAnalytics() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("3months");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  // Analytics Data
  const [employeeStats, setEmployeeStats] = useState<EmployeeStats>({
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    newEmployeesThisMonth: 0,
  });

  const [redemptionStats, setRedemptionStats] = useState<RedemptionStats>({
    totalRedemptions: 0,
    totalSavings: 0,
    averageRedemptionsPerEmployee: 0,
    mostPopularCategory: "",
  });

  const [departmentStats, setDepartmentStats] = useState<DepartmentStats[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange, selectedDepartment]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      // Mock data - في التطبيق الحقيقي ستجلب البيانات من الAPI
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setEmployeeStats({
        totalEmployees: 1250,
        activeEmployees: 1180,
        inactiveEmployees: 70,
        newEmployeesThisMonth: 45,
      });

      setRedemptionStats({
        totalRedemptions: 3450,
        totalSavings: 125000,
        averageRedemptionsPerEmployee: 2.8,
        mostPopularCategory: "المطاعم",
      });

      setDepartmentStats([
        {
          id: "1",
          name: "تقنية المعلومات",
          employeeCount: 85,
          redemptions: 245,
          savings: 8500,
          engagementRate: 78,
        },
        {
          id: "2",
          name: "الموارد البشرية",
          employeeCount: 45,
          redemptions: 180,
          savings: 6200,
          engagementRate: 82,
        },
        {
          id: "3",
          name: "المالية",
          employeeCount: 65,
          redemptions: 195,
          savings: 7100,
          engagementRate: 75,
        },
        {
          id: "4",
          name: "التسويق",
          employeeCount: 55,
          redemptions: 220,
          savings: 7800,
          engagementRate: 85,
        },
        {
          id: "5",
          name: "المبيعات",
          employeeCount: 95,
          redemptions: 285,
          savings: 9800,
          engagementRate: 80,
        },
      ]);

      setMonthlyData([
        {
          month: "يناير",
          employees: 1150,
          redemptions: 2800,
          savings: 98000,
          engagement: 72,
        },
        {
          month: "فبراير",
          employees: 1180,
          redemptions: 3100,
          savings: 108000,
          engagement: 75,
        },
        {
          month: "مارس",
          employees: 1200,
          redemptions: 3350,
          savings: 118000,
          engagement: 78,
        },
        {
          month: "أبريل",
          employees: 1220,
          redemptions: 3450,
          savings: 125000,
          engagement: 80,
        },
        {
          month: "مايو",
          employees: 1250,
          redemptions: 3200,
          savings: 115000,
          engagement: 76,
        },
      ]);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const categoryData = [
    { name: "المطاعم", value: 35, count: 1208 },
    { name: "الأزياء", value: 25, count: 863 },
    { name: "الإلكترونيات", value: 20, count: 690 },
    { name: "الصحة", value: 12, count: 414 },
    { name: "السفر", value: 8, count: 276 },
  ];

  const engagementData = departmentStats.map((dept) => ({
    name: dept.name,
    معدل_المشاركة: dept.engagementRate,
    عدد_الاستخدامات: dept.redemptions,
  }));

  const savingsData = departmentStats.map((dept) => ({
    name: dept.name,
    المدخرات: dept.savings,
    الموظفين: dept.employeeCount,
  }));

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    color = "blue",
  }: {
    title: string;
    value: string | number;
    icon: any;
    trend?: "up" | "down";
    trendValue?: string;
    color?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="flex items-center gap-2 mt-2">
              <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
              {trend && trendValue && (
                <Badge
                  variant={trend === "up" ? "default" : "destructive"}
                  className="text-xs"
                >
                  {trend === "up" ? "+" : "-"}
                  {trendValue}
                </Badge>
              )}
            </div>
          </div>
          <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            تحليلات الموارد البشرية
          </h1>
          <p className="text-gray-600 mt-2">
            مراقبة أداء الموظفين واستخدام العروض
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">الشهر الماضي</SelectItem>
              <SelectItem value="3months">آخر 3 أشهر</SelectItem>
              <SelectItem value="6months">آخر 6 أشهر</SelectItem>
              <SelectItem value="1year">السنة الماضية</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={loadAnalytics} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 ml-2" />
            تحديث
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 ml-2" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="إجمالي الموظفين"
          value={employeeStats.totalEmployees.toLocaleString()}
          icon={Users}
          trend="up"
          trendValue="3.2%"
          color="blue"
        />
        <StatCard
          title="إجمالي الاستخدامات"
          value={redemptionStats.totalRedemptions.toLocaleString()}
          icon={Activity}
          trend="up"
          trendValue="12.5%"
          color="green"
        />
        <StatCard
          title="إجمالي المدخرات"
          value={`${redemptionStats.totalSavings.toLocaleString()} ر.س`}
          icon={DollarSign}
          trend="up"
          trendValue="8.1%"
          color="yellow"
        />
        <StatCard
          title="معدل الاستخدام"
          value={redemptionStats.averageRedemptionsPerEmployee}
          icon={Target}
          trend="up"
          trendValue="5.3%"
          color="purple"
        />
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="employees">الموظفين</TabsTrigger>
          <TabsTrigger value="departments">الأقسام</TabsTrigger>
          <TabsTrigger value="engagement">المشاركة</TabsTrigger>
          <TabsTrigger value="trends">الاتجاهات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>الفئات الأكثر استخداماً</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الاتجاهات الشهرية</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="redemptions"
                      stroke="#8884d8"
                      name="الاستخدامات"
                    />
                    <Line
                      type="monotone"
                      dataKey="engagement"
                      stroke="#82ca9d"
                      name="المشاركة %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="employees" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات الموظفين</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>الموظفين النشطين</span>
                  <Badge variant="default">
                    {employeeStats.activeEmployees}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>الموظفين غير النشطين</span>
                  <Badge variant="secondary">
                    {employeeStats.inactiveEmployees}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>موظفين جدد هذا الشهر</span>
                  <Badge variant="outline">
                    {employeeStats.newEmployeesThisMonth}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>معدل النشاط</span>
                  <Badge className="bg-green-100 text-green-800">
                    {(
                      (employeeStats.activeEmployees /
                        employeeStats.totalEmployees) *
                      100
                    ).toFixed(1)}
                    %
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>نمو الموظفين الشهري</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="employees"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>أداء الأقسام</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentStats.map((dept) => (
                  <div
                    key={dept.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{dept.name}</h4>
                      <p className="text-sm text-gray-600">
                        {dept.employeeCount} موظف
                      </p>
                    </div>
                    <div className="flex gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-600">الاستخدامات</p>
                        <p className="font-bold">{dept.redemptions}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">المدخرات</p>
                        <p className="font-bold">{dept.savings} ر.س</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">المشاركة</p>
                        <Badge
                          variant={
                            dept.engagementRate > 80
                              ? "default"
                              : dept.engagementRate > 60
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {dept.engagementRate}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>معدلات المشاركة بالأقسام</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="معدل_المشاركة" fill="#8884d8" />
                  <Bar dataKey="عدد_الاستخدامات" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>اتجاهات المدخرات</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="savings"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
