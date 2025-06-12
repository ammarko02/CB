import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { User } from "@/types";
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
import { Textarea } from "@/components/ui/textarea";
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
  Building,
  Plus,
  Search,
  Users,
  TrendingUp,
  Edit,
  Trash2,
  MoreHorizontal,
  Eye,
  RefreshCw,
  UserCheck,
  Activity,
  Target,
  Award,
  Calendar,
  MapPin,
  Mail,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { DEPARTMENTS } from "@/lib/constants";

interface Department {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  manager?: User;
  employees: User[];
  location?: string;
  budget?: number;
  established: string;
  isActive: boolean;
}

interface DepartmentForm {
  name: string;
  nameAr: string;
  description: string;
  managerId?: string;
  location: string;
  budget: number;
}

export default function HRDepartments() {
  const { t, i18n } = useTranslation();
  const [employees, setEmployees] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null,
  );

  // Form state for create/edit
  const [formData, setFormData] = useState<DepartmentForm>({
    name: "",
    nameAr: "",
    description: "",
    managerId: "",
    location: "",
    budget: 0,
  });

  useEffect(() => {
    loadDepartmentsData();
  }, []);

  const loadDepartmentsData = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getUsers({ role: "employee" });
      const allEmployees = response.data;
      setEmployees(allEmployees);

      // Create department objects with employee data
      const departmentsList: Department[] = DEPARTMENTS.map(
        (deptName, index) => {
          const deptEmployees = allEmployees.filter(
            (emp) => emp.department === deptName,
          );
          const manager =
            deptEmployees.find((emp) => emp.role === "hr") || deptEmployees[0];

          return {
            id: `dept-${index + 1}`,
            name: deptName,
            nameAr: t(`departments.${deptName.toLowerCase().replace(" ", "")}`),
            description: `قسم ${t(`departments.${deptName.toLowerCase().replace(" ", "")}`)} يتولى مسؤوليات متنوعة في الشركة`,
            manager,
            employees: deptEmployees,
            location: `الطابق ${index + 1}`,
            budget: Math.floor(Math.random() * 500000) + 100000,
            established: `2020-0${(index % 9) + 1}-01`,
            isActive: deptEmployees.length > 0,
          };
        },
      ).filter((dept) => dept.isActive);

      setDepartments(departmentsList);
    } catch (error) {
      console.error("Failed to load departments data:", error);
      toast({
        title: t("notifications.error"),
        description: "فشل في تحميل بيانات الأقسام",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDepartment = async () => {
    try {
      if (!formData.name || !formData.nameAr) {
        toast({
          title: "خطأ في الب��انات",
          description: "يرجى ملء الحقول المطلوبة",
          variant: "destructive",
        });
        return;
      }

      // In a real app, this would be an API call
      const newDepartment: Department = {
        id: `dept-${Date.now()}`,
        name: formData.name,
        nameAr: formData.nameAr,
        description: formData.description,
        manager: formData.managerId
          ? employees.find((e) => e.id === formData.managerId)
          : undefined,
        employees: [],
        location: formData.location,
        budget: formData.budget,
        established: new Date().toISOString().split("T")[0],
        isActive: true,
      };

      setDepartments((prev) => [...prev, newDepartment]);

      toast({
        title: t("notifications.success"),
        description: "تم إنشاء القسم بنجاح",
      });

      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: t("notifications.error"),
        description: "فشل في إنشاء القسم",
        variant: "destructive",
      });
    }
  };

  const handleUpdateDepartment = async () => {
    if (!editingDepartment) return;

    try {
      const updatedDepartment: Department = {
        ...editingDepartment,
        name: formData.name,
        nameAr: formData.nameAr,
        description: formData.description,
        manager: formData.managerId
          ? employees.find((e) => e.id === formData.managerId)
          : undefined,
        location: formData.location,
        budget: formData.budget,
      };

      setDepartments((prev) =>
        prev.map((dept) =>
          dept.id === editingDepartment.id ? updatedDepartment : dept,
        ),
      );

      toast({
        title: t("notifications.success"),
        description: "تم تحديث بيانات القسم بنجاح",
      });

      setEditingDepartment(null);
      resetForm();
    } catch (error) {
      toast({
        title: t("notifications.error"),
        description: "فشل في تحديث بيانات القسم",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDepartment = async (departmentId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا القسم؟")) return;

    try {
      setDepartments((prev) => prev.filter((dept) => dept.id !== departmentId));
      toast({
        title: t("notifications.success"),
        description: "تم حذف القسم بنجاح",
      });
    } catch (error) {
      toast({
        title: t("notifications.error"),
        description: "فشل في حذف القسم",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      nameAr: "",
      description: "",
      managerId: "",
      location: "",
      budget: 0,
    });
  };

  const startEdit = (department: Department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      nameAr: department.nameAr,
      description: department.description,
      managerId: department.manager?.id || "",
      location: department.location || "",
      budget: department.budget || 0,
    });
  };

  // Filter departments
  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.nameAr.includes(searchTerm),
  );

  const totalEmployees = departments.reduce(
    (sum, dept) => sum + dept.employees.length,
    0,
  );

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
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة الأقسام</h1>
          <p className="text-muted-foreground">
            إضافة وتعديل وإدارة أقسام الشركة
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button variant="outline" onClick={loadDepartmentsData}>
            <RefreshCw
              className={`w-4 h-4 ${i18n.language === "ar" ? "ml-2" : "mr-2"}`}
            />
            {t("common.refresh")}
          </Button>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus
                  className={`w-4 h-4 ${i18n.language === "ar" ? "ml-2" : "mr-2"}`}
                />
                إضافة قسم جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>إضافة قسم جديد</DialogTitle>
                <DialogDescription>أدخل بيانات القسم الجديد</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>اسم القسم (إنجليزي)</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Marketing"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>اسم القسم (عربي)</Label>
                    <Input
                      value={formData.nameAr}
                      onChange={(e) =>
                        setFormData({ ...formData, nameAr: e.target.value })
                      }
                      placeholder="التسويق"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>وصف القسم</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="وصف مختصر عن القسم ومسؤولياته..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>مدير القسم</Label>
                  <Select
                    value={formData.managerId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, managerId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر مدير القسم" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.firstName} {emp.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>الموقع</Label>
                    <Input
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="الطابق الأول"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>الميزانية (ر.س)</Label>
                    <Input
                      type="number"
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          budget: Number(e.target.value),
                        })
                      }
                      placeholder="100000"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleCreateDepartment} className="flex-1">
                    {t("common.create")} القسم
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
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">
                {departments.length.toLocaleString("ar-SA")}
              </p>
              <p className="text-sm text-blue-700">إجمالي الأقسام</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-900">
                {totalEmployees.toLocaleString("ar-SA")}
              </p>
              <p className="text-sm text-green-700">إجمالي الموظفين</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-900">
                {departments
                  .filter((d) => d.manager)
                  .length.toLocaleString("ar-SA")}
              </p>
              <p className="text-sm text-purple-700">أقسام لها مدراء</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-900">
                {Math.round(totalEmployees / departments.length).toLocaleString(
                  "ar-SA",
                )}
              </p>
              <p className="text-sm text-orange-700">متوسط الموظفين/قسم</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search
              className={`absolute ${i18n.language === "ar" ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4`}
            />
            <Input
              placeholder="البحث في الأقسام..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={i18n.language === "ar" ? "pr-9" : "pl-9"}
            />
          </div>
        </CardContent>
      </Card>

      {/* Departments Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDepartments.map((department) => (
          <Card
            key={department.id}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-blue-600" />
                    {department.nameAr}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {department.name}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => startEdit(department)}>
                      <Edit className="w-4 h-4 mr-2" />
                      {t("common.edit")}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      عرض التفاصيل
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteDepartment(department.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t("common.delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {department.description}
              </p>

              {/* Department Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-lg font-bold text-blue-600">
                    {department.employees.length}
                  </p>
                  <p className="text-xs text-blue-700">موظف</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-lg font-bold text-green-600">
                    {department.employees.filter((e) => e.isActive).length}
                  </p>
                  <p className="text-xs text-green-700">نشط</p>
                </div>
              </div>

              {/* Manager Info */}
              {department.manager && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {department.manager.firstName[0]}
                      {department.manager.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {department.manager.firstName}{" "}
                      {department.manager.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">مدير القسم</p>
                  </div>
                </div>
              )}

              {/* Department Details */}
              <div className="space-y-2 text-sm">
                {department.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{department.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    تأسس في{" "}
                    {new Date(department.established).toLocaleDateString(
                      "ar-SA",
                    )}
                  </span>
                </div>
                {department.budget && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Target className="w-4 h-4" />
                    <span>
                      الميزانية: {department.budget.toLocaleString("ar-SA")} ر.س
                    </span>
                  </div>
                )}
              </div>

              {/* Performance Badge */}
              <div className="flex items-center justify-between">
                <Badge
                  variant={
                    department.employees.length > 5 ? "default" : "secondary"
                  }
                >
                  {department.employees.length > 5 ? "قسم كبير" : "قسم صغير"}
                </Badge>
                <Badge variant={department.manager ? "default" : "outline"}>
                  {department.manager ? "له مدير" : "بحاجة لمدير"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Departments Message */}
      {filteredDepartments.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد أقسام</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm
                ? "لا توجد أقسام تطابق البحث"
                : "لم يتم إضافة أي أقسام بعد"}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                إضافة قسم جديد
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Department Dialog */}
      <Dialog
        open={!!editingDepartment}
        onOpenChange={(open) => !open && setEditingDepartment(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تعديل بيانات القسم</DialogTitle>
            <DialogDescription>تحديث معلومات القسم</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>اسم القسم (إنجليزي)</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Marketing"
                />
              </div>
              <div className="space-y-2">
                <Label>اسم القسم (عربي)</Label>
                <Input
                  value={formData.nameAr}
                  onChange={(e) =>
                    setFormData({ ...formData, nameAr: e.target.value })
                  }
                  placeholder="التسويق"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>وصف القسم</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="وصف مختصر عن القسم ومسؤولياته..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>مدير القسم</Label>
              <Select
                value={formData.managerId}
                onValueChange={(value) =>
                  setFormData({ ...formData, managerId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر مدير القسم" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الموقع</Label>
                <Input
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="الطابق الأول"
                />
              </div>
              <div className="space-y-2">
                <Label>الميزانية (ر.س)</Label>
                <Input
                  type="number"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: Number(e.target.value) })
                  }
                  placeholder="100000"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleUpdateDepartment} className="flex-1">
                {t("common.update")}
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingDepartment(null)}
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
