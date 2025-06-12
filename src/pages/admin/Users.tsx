import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { User, Employee } from "@/types";
import { userService } from "@/services/api";
import { MessageCenter } from "@/components/MessageCenter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  Building,
  Search,
  MoreVertical,
  Eye,
  UserX,
  UserCheck,
  MessageCircle,
  RefreshCw,
  Filter,
  Plus,
  Settings,
  AlertTriangle,
  CheckCircle,
  Mail,
  Send,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

interface Company {
  id: string;
  name: string;
  domain: string;
  employeeCount: number;
  activeEmployees: number;
  isActive: boolean;
  subscription: "basic" | "premium" | "enterprise";
  createdAt: string;
}

export default function AdminUsers() {
  const { t, i18n } = useTranslation();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showEmployees, setShowEmployees] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setIsLoading(true);
      // Mock companies data
      const mockCompanies: Company[] = [
        {
          id: "comp1",
          name: "شركة التقنية المتقدمة",
          domain: "tech-advanced.com",
          employeeCount: 150,
          activeEmployees: 125,
          isActive: true,
          subscription: "enterprise",
          createdAt: new Date().toISOString(),
        },
        {
          id: "comp2",
          name: "مجموعة الخليج للتجارة",
          domain: "gulf-trading.com",
          employeeCount: 85,
          activeEmployees: 72,
          isActive: true,
          subscription: "premium",
          createdAt: new Date().toISOString(),
        },
        {
          id: "comp3",
          name: "شركة الابتكار الرقمي",
          domain: "digital-innovation.com",
          employeeCount: 45,
          activeEmployees: 38,
          isActive: false,
          subscription: "basic",
          createdAt: new Date().toISOString(),
        },
      ];
      setCompanies(mockCompanies);
    } catch (error) {
      console.error("Failed to load companies:", error);
      toast({
        title: "خطأ في التحميل",
        description: "فشل في تحميل بيانات الشركات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadEmployees = async (companyId: string) => {
    try {
      setIsLoadingEmployees(true);
      // Mock employees data
      const mockEmployees: Employee[] = [
        {
          id: "emp1",
          email: "ahmed.mohamed@tech-advanced.com",
          firstName: "أحمد",
          lastName: "محمد",
          role: "employee",
          department: "الهندسة",
          joinDate: new Date().toISOString(),
          isActive: true,
          employeeId: "EMP001",
          pointsBalance: 500,
        },
        {
          id: "emp2",
          email: "fatima.ali@tech-advanced.com",
          firstName: "فاطمة",
          lastName: "علي",
          role: "employee",
          department: "التسويق",
          joinDate: new Date().toISOString(),
          isActive: true,
          employeeId: "EMP002",
          pointsBalance: 750,
        },
        {
          id: "emp3",
          email: "omar.hassan@tech-advanced.com",
          firstName: "عمر",
          lastName: "حسن",
          role: "employee",
          department: "المبيعات",
          joinDate: new Date().toISOString(),
          isActive: false,
          employeeId: "EMP003",
          pointsBalance: 200,
        },
      ];
      setEmployees(mockEmployees);
    } catch (error) {
      console.error("Failed to load employees:", error);
      toast({
        title: "خطأ في التحميل",
        description: "فشل في تحميل بيانات الموظفين",
        variant: "destructive",
      });
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  const toggleCompanyStatus = async (companyId: string, isActive: boolean) => {
    try {
      setCompanies((prev) =>
        prev.map((comp) =>
          comp.id === companyId ? { ...comp, isActive: !isActive } : comp,
        ),
      );
      toast({
        title: isActive ? "تم إيقاف الشركة" : "تم تفعيل الشركة",
        description: isActive
          ? "تم إيقاف جميع موظفي الشركة عن استخدام المنصة"
          : "تم تفعيل الشركة وموظفيها",
      });
    } catch (error) {
      toast({
        title: "خطأ في التحديث",
        description: "فشل في تحديث حالة الشركة",
        variant: "destructive",
      });
    }
  };

  const toggleEmployeeStatus = async (
    employeeId: string,
    isActive: boolean,
  ) => {
    try {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === employeeId ? { ...emp, isActive: !isActive } : emp,
        ),
      );
      toast({
        title: isActive ? "تم إيقاف الموظف" : "تم تفعيل الموظف",
        description: isActive
          ? "تم إيقاف الموظف عن استخدام المنصة"
          : "تم تفعيل الموظف للاستخدام",
      });
    } catch (error) {
      toast({
        title: "خطأ في التحديث",
        description: "فشل في تحديث حالة الموظف",
        variant: "destructive",
      });
    }
  };

  const handleViewEmployees = async (company: Company) => {
    setSelectedCompany(company);
    setShowEmployees(true);
    await loadEmployees(company.id);
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleSelectAll = () => {
    if (showEmployees) {
      setSelectedUsers(
        selectedUsers.length === employees.length
          ? []
          : employees.map((emp) => emp.id),
      );
    } else {
      setSelectedUsers(
        selectedUsers.length === companies.length
          ? []
          : companies.map((comp) => comp.id),
      );
    }
  };

  const sendMessageToSelected = () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "لا يوجد اختيار",
        description: "يرجى اختيار مستخدمين لإرسال الرسالة إليهم",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "إرسال رسالة جماعية",
      description: `سيتم إرسال رسالة إلى ${selectedUsers.length} مستخدم`,
    });
  };

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "active" && company.isActive) ||
      (selectedStatus === "inactive" && !company.isActive);
    return matchesSearch && matchesStatus;
  });

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "active" && employee.isActive) ||
      (selectedStatus === "inactive" && !employee.isActive);
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
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
          <h1 className="text-3xl font-bold">
            {showEmployees
              ? `موظفو ${selectedCompany?.name}`
              : "إدارة المستخدمين"}
          </h1>
          <p className="text-muted-foreground">
            {showEmployees
              ? "إدارة موظفي الشركة المحددة"
              : "إدارة الشركات والمستخدمين"}
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          {showEmployees && (
            <Button
              variant="outline"
              onClick={() => {
                setShowEmployees(false);
                setSelectedCompany(null);
                setSelectedUsers([]);
              }}
            >
              العودة للشركات
            </Button>
          )}
          <MessageCenter
            trigger={
              <Button variant="outline">
                <MessageCircle className="w-4 h-4 ml-2" />
                الرسائل
              </Button>
            }
          />
          <Button onClick={loadCompanies}>
            <RefreshCw className="w-4 h-4 ml-2" />
            تحديث
          </Button>
        </div>
      </div>

      {/* Filters and Bulk Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={
                    showEmployees
                      ? "البحث في الموظفين..."
                      : "البحث في الشركات..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">معطل</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleSelectAll}
                disabled={
                  (showEmployees && employees.length === 0) ||
                  (!showEmployees && companies.length === 0)
                }
              >
                {selectedUsers.length > 0 ? "إلغاء التحديد" : "تحديد الكل"}
              </Button>
              {selectedUsers.length > 0 && (
                <Button onClick={sendMessageToSelected}>
                  <Send className="w-4 h-4 ml-2" />
                  إرسال رسالة ({selectedUsers.length})
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {showEmployees ? (
        // Employees View
        <div className="space-y-4">
          {isLoadingEmployees ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredEmployees.map((employee) => (
                <Card
                  key={employee.id}
                  className={`transition-all ${
                    selectedUsers.includes(employee.id)
                      ? "ring-2 ring-primary"
                      : ""
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(employee.id)}
                          onChange={() => handleSelectUser(employee.id)}
                          className="rounded"
                        />
                        <div>
                          <h4 className="font-medium">
                            {employee.firstName} {employee.lastName}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {employee.employeeId}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              toggleEmployeeStatus(
                                employee.id,
                                employee.isActive,
                              )
                            }
                          >
                            {employee.isActive ? (
                              <>
                                <UserX className="w-4 h-4 ml-2" />
                                إيقاف الموظف
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-4 h-4 ml-2" />
                                تفعيل الموظف
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageCircle className="w-4 h-4 ml-2" />
                            إرسال رسالة
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">القسم:</span>
                        <span>{employee.department}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">النقاط:</span>
                        <span>
                          {employee.pointsBalance.toLocaleString("ar-SA")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">الحالة:</span>
                        <Badge
                          variant={
                            employee.isActive ? "default" : "destructive"
                          }
                        >
                          {employee.isActive ? "نشط" : "معطل"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Companies View
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company) => (
            <Card
              key={company.id}
              className={`transition-all ${
                selectedUsers.includes(company.id) ? "ring-2 ring-primary" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(company.id)}
                      onChange={() => handleSelectUser(company.id)}
                      className="rounded"
                    />
                    <Building className="w-8 h-8 bg-blue-100 rounded p-2 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">{company.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {company.domain}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleViewEmployees(company)}
                      >
                        <Eye className="w-4 h-4 ml-2" />
                        عرض الموظفين
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          toggleCompanyStatus(company.id, company.isActive)
                        }
                      >
                        {company.isActive ? (
                          <>
                            <AlertTriangle className="w-4 h-4 ml-2" />
                            إيقاف الشركة
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 ml-2" />
                            تفعيل الشركة
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageCircle className="w-4 h-4 ml-2" />
                        إرسال رسالة
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="w-4 h-4 ml-2" />
                        إعدادات الشركة
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">الموظفين:</span>
                    <span>{company.employeeCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">النشطين:</span>
                    <span className="text-green-600">
                      {company.activeEmployees}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">الاشتراك:</span>
                    <Badge
                      variant={
                        company.subscription === "enterprise"
                          ? "default"
                          : company.subscription === "premium"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {company.subscription === "enterprise"
                        ? "مؤسسي"
                        : company.subscription === "premium"
                          ? "مميز"
                          : "أساسي"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">الحالة:</span>
                    <Badge
                      variant={company.isActive ? "default" : "destructive"}
                    >
                      {company.isActive ? "نشط" : "معطل"}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => handleViewEmployees(company)}
                    className="w-full mt-4"
                    variant="outline"
                  >
                    <Users className="w-4 h-4 ml-2" />
                    عرض الموظفين ({company.employeeCount})
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {(showEmployees ? filteredEmployees : filteredCompanies).length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            {showEmployees ? (
              <Users className="w-16 h-16 text-muted-foreground mb-4" />
            ) : (
              <Building className="w-16 h-16 text-muted-foreground mb-4" />
            )}
            <h3 className="text-lg font-semibold mb-2">
              {showEmployees ? "لا يوجد موظفين" : "لا توجد شركات"}
            </h3>
            <p className="text-muted-foreground text-center">
              {showEmployees
                ? "لا يوجد موظفين في هذ�� الشركة تطابق المرشحات."
                : "لا توجد شركات تطابق المرشحات الحالية."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
