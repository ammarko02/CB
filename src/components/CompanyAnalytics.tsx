import { useEffect, useState } from "react";
import { CompanyAnalytics as CompanyAnalyticsType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Users,
  Ticket,
  TrendingUp,
  Building,
  CreditCard,
  Activity,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface CompanyAnalyticsProps {
  className?: string;
}

export function CompanyAnalytics({ className }: CompanyAnalyticsProps) {
  const { t, i18n } = useTranslation();
  const [analytics, setAnalytics] = useState<CompanyAnalyticsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockData: CompanyAnalyticsType = {
        totalEmployees: 150,
        activeEmployees: 125,
        totalCouponsRedeemed: 1240,
        totalPointsSpent: 45600,
        departmentBreakdown: {
          الهندسة: {
            employeeCount: 45,
            couponsRedeemed: 380,
            pointsSpent: 14200,
          },
          التسويق: {
            employeeCount: 25,
            couponsRedeemed: 210,
            pointsSpent: 7800,
          },
          المبيعات: {
            employeeCount: 35,
            couponsRedeemed: 295,
            pointsSpent: 11500,
          },
          "الموارد البشرية": {
            employeeCount: 15,
            couponsRedeemed: 135,
            pointsSpent: 4900,
          },
          المالية: {
            employeeCount: 20,
            couponsRedeemed: 180,
            pointsSpent: 6200,
          },
          العمليات: {
            employeeCount: 10,
            couponsRedeemed: 40,
            pointsSpent: 1000,
          },
        },
        monthlyTrends: [
          { month: "يناير", couponsRedeemed: 95, pointsSpent: 3200 },
          { month: "فبراير", couponsRedeemed: 120, pointsSpent: 4100 },
          { month: "مارس", couponsRedeemed: 140, pointsSpent: 4800 },
          { month: "أبريل", couponsRedeemed: 110, pointsSpent: 3900 },
          { month: "مايو", couponsRedeemed: 165, pointsSpent: 5600 },
          { month: "يونيو", couponsRedeemed: 180, pointsSpent: 6200 },
          { month: "يوليو", couponsRedeemed: 200, pointsSpent: 7100 },
          { month: "أغسطس", couponsRedeemed: 175, pointsSpent: 6300 },
          { month: "سبتمبر", couponsRedeemed: 155, pointsSpent: 5500 },
          { month: "أكتوبر", couponsRedeemed: 100, pointsSpent: 2900 },
        ],
      };

      setAnalytics(mockData);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className={className}>جاري تحميل التحليلات...</div>;
  }

  if (!analytics) {
    return <div className={className}>فشل في تحميل البيانات</div>;
  }

  const departmentData = Object.entries(analytics.departmentBreakdown).map(
    ([dept, data]) => ({
      department: dept,
      employees: data.employeeCount,
      coupons: data.couponsRedeemed,
      points: data.pointsSpent,
    }),
  );

  const pieData = departmentData.map((dept, index) => ({
    name: dept.department,
    value: dept.coupons,
    color: ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1", "#d084d0"][
      index % 6
    ],
  }));

  const engagementRate = (
    (analytics.activeEmployees / analytics.totalEmployees) *
    100
  ).toFixed(1);
  const avgCouponsPerEmployee = (
    analytics.totalCouponsRedeemed / analytics.activeEmployees
  ).toFixed(1);
  const avgPointsPerEmployee = (
    analytics.totalPointsSpent / analytics.activeEmployees
  ).toFixed(0);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{analytics.totalEmployees}</p>
              <p className="text-sm text-muted-foreground">إجمالي الموظفين</p>
              <Badge variant="secondary" className="mt-1">
                {analytics.activeEmployees} نشط
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Ticket className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {analytics.totalCouponsRedeemed.toLocaleString("ar-SA")}
              </p>
              <p className="text-sm text-muted-foreground">كوبونات مستبدلة</p>
              <Badge variant="secondary" className="mt-1">
                {avgCouponsPerEmployee} لكل موظف
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {analytics.totalPointsSpent.toLocaleString("ar-SA")}
              </p>
              <p className="text-sm text-muted-foreground">نقاط منفقة</p>
              <Badge variant="secondary" className="mt-1">
                {avgPointsPerEmployee} لكل موظف
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{engagementRate}%</p>
              <p className="text-sm text-muted-foreground">معدل المشاركة</p>
              <Badge
                variant={
                  parseFloat(engagementRate) > 80 ? "default" : "secondary"
                }
                className="mt-1"
              >
                {parseFloat(engagementRate) > 80 ? "ممتاز" : "جيد"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              الكوبونات حسب القسم
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="department"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    value,
                    name === "coupons" ? "كوبونات" : "نقاط",
                  ]}
                  labelFormatter={(label) => `القسم: ${label}`}
                />
                <Bar dataKey="coupons" fill="#8884d8" name="coupons" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>توزيع الكوبونات</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
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
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            الاتجاهات الشهرية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={analytics.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="coupons" orientation="left" />
              <YAxis yAxisId="points" orientation="right" />
              <Tooltip
                formatter={(value, name) => [
                  value,
                  name === "couponsRedeemed" ? "كوبونات" : "نقاط",
                ]}
                labelFormatter={(label) => `الشهر: ${label}`}
              />
              <Line
                yAxisId="coupons"
                type="monotone"
                dataKey="couponsRedeemed"
                stroke="#8884d8"
                strokeWidth={2}
                name="couponsRedeemed"
              />
              <Line
                yAxisId="points"
                type="monotone"
                dataKey="pointsSpent"
                stroke="#82ca9d"
                strokeWidth={2}
                name="pointsSpent"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Department Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>تفصيل الأقسام</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3 font-medium">القسم</th>
                  <th className="text-right p-3 font-medium">عدد الموظفين</th>
                  <th className="text-right p-3 font-medium">الكوبونات</th>
                  <th className="text-right p-3 font-medium">النقاط المنفقة</th>
                  <th className="text-right p-3 font-medium">المعدل/موظف</th>
                </tr>
              </thead>
              <tbody>
                {departmentData.map((dept) => (
                  <tr key={dept.department} className="border-b">
                    <td className="p-3 font-medium">{dept.department}</td>
                    <td className="p-3">{dept.employees}</td>
                    <td className="p-3">{dept.coupons}</td>
                    <td className="p-3">
                      {dept.points.toLocaleString("ar-SA")}
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">
                        {(dept.coupons / dept.employees).toFixed(1)} كوبون
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
