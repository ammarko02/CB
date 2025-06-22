import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { User, UserRole } from "@/types";
import { userService } from "@/services/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Building,
  MoreHorizontal,
  Eye,
  RefreshCw,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/dateUtils";
import { DEPARTMENTS } from "@/lib/constants";
import { BulkEmployeeUpload } from "@/components/BulkEmployeeUpload";

export default function EmployeeManagement() {
  const { t, i18n } = useTranslation();
  const [employees, setEmployees] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<User | null>(null);

  // Form state for create/edit
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    employeeId: "",
    role: "employee" as UserRole,
    phone: "",
    position: "",
    salary: 0,
    joinDate: "",
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getUsers({ role: "employee" });
      setEmployees(response.data);
    } catch (error) {
      console.error("Failed to load employees:", error);
      toast({
        title: t("notifications.error"),
        description: "فشل في تحميل بيانات الموظفين",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEmployee = async () => {
    try {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        toast({
          title: "خطأ في البيانات",
          description: "يرجى ملء جميع الحقول المطلوبة",
          variant: "destructive",
        });
        return;
      }

      await userService.createUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        department: formData.department,
        employeeId: formData.employeeId,
        role: formData.role,
        password: "password123", // Default password
      });

      toast({
        title: t("notifications.success"),
        description: "تم إنشاء حساب الموظف بنجاح",
      });

      setIsCreateDialogOpen(false);
      resetForm();
      loadEmployees();
    } catch (error) {
      toast({
        title: t("notifications.error"),
        description: "فشل في إنشاء حساب الموظف",
        variant: "destructive",
      });
    }
  };

  const handleUpdateEmployee = async () => {
    if (!editingEmployee) return;

    try {
      await userService.updateUser(editingEmployee.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        department: formData.department,
        role: formData.role,
      });

      toast({
        title: t("notifications.success"),
        description: "تم تحديث بيانات الموظف بنجاح",
      });

      setEditingEmployee(null);
      resetForm();
      loadEmployees();
    } catch (error) {
      toast({
        title: t("notifications.error"),
        description: "فشل في تحديث بيانات الموظف",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الموظف؟")) return;

    try {
      await userService.deleteUser(employeeId);
      toast({
        title: t("notifications.success"),
        description: "تم حذف الموظف بنجاح",
      });
      loadEmployees();
    } catch (error) {
      toast({
        title: t("notifications.error"),
        description: "فشل في حذف الموظف",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      department: "",
      employeeId: "",
      role: "employee",
      phone: "",
      position: "",
      salary: 0,
      joinDate: "",
    });
  };

  const handleBulkImport = async (employees: any[]) => {
    try {
      setIsLoading(true);

      // Process employees in batches for better performance
      const batchSize = 10;
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < employees.length; i += batchSize) {
        const batch = employees.slice(i, i + batchSize);

        for (const employeeData of batch) {
          try {
            await userService.createUser({
              firstName: employeeData.firstName,
              lastName: employeeData.lastName,
              email: employeeData.email,
              department: employeeData.department,
              employeeId:
                employeeData.employeeId ||
                `EMP${Date.now()}${Math.random().toString(36).substr(2, 4)}`,
              role: "employee",
              password: "password123", // Default password - should be changed on first login
              phone: employeeData.phone,
              position: employeeData.position,
              salary: employeeData.salary,
              joinDate:
                employeeData.joinDate || new Date().toISOString().split("T")[0],
            });
            successCount++;
          } catch (error) {
            console.error(
              `Failed to create employee ${employeeData.firstName} ${employeeData.lastName}:`,
              error,
            );
            errorCount++;
          }
        }
      }

      // Show summary
      if (successCount > 0) {
        toast({
          title: "نجح الاستيراد",
          description: `تم إضافة ${successCount} موظف بنجاح${errorCount > 0 ? ` وفشل في إضافة ${errorCount}` : ""}`,
        });
      }

      if (errorCount > 0 && successCount === 0) {
        toast({
          title: "فشل الاستيراد",
          description: `فشل في إضافة جميع الموظفين (${errorCount})`,
          variant: "destructive",
        });
      }

      // Reload employees list
      loadEmployees();
    } catch (error) {
      toast({
        title: t("notifications.error"),
        description: "فشل في استيراد الموظفين",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (employee: User) => {
    setEditingEmployee(employee);
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      department: employee.department || "",
      employeeId: employee.employeeId || "",
      role: employee.role,
      phone: employee.phone || "",
      position: employee.position || "",
      salary: employee.salary || 0,
      joinDate: employee.joinDate || "",
    });
  };

  // Filter employees
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "all" ||
      employee.department === selectedDepartment;
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "active" && employee.isActive) ||
      (selectedStatus === "inactive" && !employee.isActive);

    return matchesSearch && matchesDepartment && matchesStatus;
  });

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
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة الموظفين</h1>
          <p className="text-muted-foreground">
            إضافة وتعديل وإدارة حسابات الموظفين
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button variant="outline" onClick={loadEmployees}>
            <RefreshCw
              className={`w-4 h-4 ${i18n.language === "ar" ? "ml-2" : "mr-2"}`}
            />
            {t("common.refresh")}
          </Button>
          <Button variant="outline">
            <Download
              className={`w-4 h-4 ${i18n.language === "ar" ? "ml-2" : "mr-2"}`}
            />
            تصدير
          </Button>

          <BulkEmployeeUpload onEmployeesImported={handleBulkImport} />
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <UserPlus
                  className={`w-4 h-4 ${i18n.language === "ar" ? "ml-2" : "mr-2"}`}
                />
                {t("dashboard.addEmployee")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>إضافة موظف جد��د</DialogTitle>
                <DialogDescription>أدخل بيانات الموظف الجديد</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("common.firstName")}</Label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      placeholder="أدخل الاسم الأول"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("common.lastName")}</Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      placeholder="أدخل اسم العائلة"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t("common.email")}</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="أدخل البريد الإلكتروني"
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("common.department")}</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) =>
                      setFormData({ ...formData, department: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر القسم" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {t(
                            `departments.${dept.toLowerCase().replace(" ", "")}`,
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>رقم الموظف (اختياري)</Label>
                  <Input
                    value={formData.employeeId}
                    onChange={(e) =>
                      setFormData({ ...formData, employeeId: e.target.value })
                    }
                    placeholder="أدخل رقم الموظف"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleCreateEmployee} className="flex-1">
                    {t("common.create")} الحساب
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="flex-1"
                  >
                    {t("common.cancel")}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {employees.length.toLocaleString("ar-SA")}
              </p>
              <p className="text-sm text-muted-foreground">إجمالي الموظفين</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {employees
                  .filter((e) => e.isActive)
                  .length.toLocaleString("ar-SA")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("dashboard.activeEmployees")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {new Set(
                  employees.map((e) => e.department).filter(Boolean),
                ).size.toLocaleString("ar-SA")}
              </p>
              <p className="text-sm text-muted-foreground">الأقسام</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {employees
                  .filter((e) => {
                    const joinDate = new Date(e.joinDate);
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return joinDate > thirtyDaysAgo;
                  })
                  .length.toLocaleString("ar-SA")}
              </p>
              <p className="text-sm text-muted-foreground">انضموا حديثاً</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className={`absolute ${i18n.language === "ar" ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4`}
                />
                <Input
                  placeholder="البحث في الموظفين..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={i18n.language === "ar" ? "pr-9" : "pl-9"}
                />
              </div>
            </div>

            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="جميع الأقسام" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأقسام</SelectItem>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {t(`departments.${dept.toLowerCase().replace(" ", "")}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="جميع الحالات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">{t("common.active")}</SelectItem>
                <SelectItem value="inactive">{t("common.inactive")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            قائمة الموظفين ({filteredEmployees.length.toLocaleString("ar-SA")})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">لا يوجد موظفون</h3>
              <p className="text-muted-foreground">
                {searchTerm ||
                selectedDepartment !== "all" ||
                selectedStatus !== "all"
                  ? "لا توجد نتائج تطابق معايير البحث"
                  : "لم يتم إضافة أي موظفين بعد"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الموظف</TableHead>
                    <TableHead>البريد الإلكتروني</TableHead>
                    <TableHead>القسم</TableHead>
                    <TableHead>تاريخ الانضمام</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead className="w-[100px]">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {employee.firstName[0]}
                              {employee.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {employee.firstName} {employee.lastName}
                            </p>
                            {employee.employeeId && (
                              <p className="text-sm text-muted-foreground">
                                رقم: {employee.employeeId}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {employee.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        {employee.department && (
                          <Badge variant="outline">
                            {t(
                              `departments.${employee.department.toLowerCase().replace(" ", "")}`,
                            )}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {new Date(employee.joinDate).toLocaleDateString(
                            "ar-SA",
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={employee.isActive ? "default" : "secondary"}
                        >
                          {employee.isActive
                            ? t("common.active")
                            : t("common.inactive")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => startEdit(employee)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              {t("common.edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              عرض التفاصيل
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteEmployee(employee.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              {t("common.delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Employee Dialog */}
      <Dialog
        open={!!editingEmployee}
        onOpenChange={(open) => !open && setEditingEmployee(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تعديل بيانات الموظف</DialogTitle>
            <DialogDescription>تحديث معلومات الموظف</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("common.firstName")}</Label>
                <Input
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="أدخل الاسم الأول"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("common.lastName")}</Label>
                <Input
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder="أدخل اسم العائلة"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("common.email")}</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="أدخل البريد الإلكتروني"
              />
            </div>

            <div className="space-y-2">
              <Label>{t("common.department")}</Label>
              <Select
                value={formData.department}
                onValueChange={(value) =>
                  setFormData({ ...formData, department: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر القسم" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {t(`departments.${dept.toLowerCase().replace(" ", "")}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleUpdateEmployee} className="flex-1">
                {t("common.update")}
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingEmployee(null)}
                className="flex-1"
              >
                {t("common.cancel")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
