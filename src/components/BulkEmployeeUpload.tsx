import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  FileText,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { DEPARTMENTS } from "@/lib/constants";

interface EmployeeData {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  employeeId?: string;
  phone?: string;
  position?: string;
  salary?: number;
  joinDate?: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  data: EmployeeData;
  row: number;
}

interface BulkEmployeeUploadProps {
  onEmployeesImported: (employees: EmployeeData[]) => void;
}

export function BulkEmployeeUpload({
  onEmployeesImported,
}: BulkEmployeeUploadProps) {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<EmployeeData[]>([]);
  const [validationResults, setValidationResults] = useState<
    ValidationResult[]
  >([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // Generate and download template Excel file
  const downloadTemplate = () => {
    const templateData = [
      {
        "الاسم الأول (مطلوب)": "أحمد",
        "اسم العائلة (مطلوب)": "محمد",
        "البريد الإلكتروني (مطلوب)": "ahmed.mohamed@company.com",
        "القسم (مطلوب)": "Engineering",
        "رقم الموظف": "EMP001",
        "رقم الهاتف": "0551234567",
        المنصب: "مطور واجهات أمامية",
        الراتب: "8000",
        "تاريخ الانضمام": "2024-01-15",
      },
      {
        "الاسم الأول (مطلوب)": "فاطمة",
        "اسم العائلة (مطلوب)": "أحمد",
        "البريد الإلكتروني (مطلوب)": "fatima.ahmed@company.com",
        "القسم (مطلوب)": "Marketing",
        "رقم الموظف": "EMP002",
        "رقم الهاتف": "0559876543",
        المنصب: "مختصة تسويق رقمي",
        الراتب: "7000",
        "تاريخ الانضمام": "2024-02-01",
      },
      {
        "الاسم الأول (مطلوب)": "خالد",
        "اسم العائلة (مطلوب)": "علي",
        "البريد الإلكتروني (مطلوب)": "khalid.ali@company.com",
        "القسم (مطلوب)": "Sales",
        "رقم الموظف": "EMP003",
        "رقم الهاتف": "0555555555",
        المنصب: "مدير مبيعات",
        الراتب: "9000",
        "تاريخ الانضمام": "2024-01-01",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);

    // Set column widths
    const wscols = [
      { wch: 15 }, // الاسم الأول
      { wch: 15 }, // اسم العائلة
      { wch: 25 }, // البريد الإلكتروني
      { wch: 15 }, // القسم
      { wch: 12 }, // رقم الموظف
      { wch: 15 }, // رقم الهاتف
      { wch: 20 }, // المنصب
      { wch: 10 }, // الراتب
      { wch: 15 }, // تاريخ الانضمام
    ];
    ws["!cols"] = wscols;

    // Add header styles and comments
    const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (ws[cellAddress]) {
        ws[cellAddress].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "366092" } },
        };
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "نموذج الموظفين");

    // Add instructions sheet
    const instructionsData = [
      ["تعليمات استخدام نموذج إضافة الموظفين"],
      [""],
      ["الخطوات:"],
      ["1. احذف الصفوف النموذجية (الصفوف 2-4)"],
      ["2. أضف بيانات الموظفين الجدد"],
      ["3. تأكد من ملء الحقول المطلوبة"],
      ["4. احفظ الملف واضغط على 'رفع الملف'"],
      [""],
      ["الحقول المطلوبة:"],
      ["• الاسم الأول: لا يمكن أن يكون فارغاً"],
      ["• اسم العائلة: لا يمكن أن يكون فارغاً"],
      ["• البريد الإلكتروني: يجب أن يكون صالحاً وفريداً"],
      ["• القسم: يجب أن يكون من الأقسام المتاحة"],
      [""],
      ["الأقسام المتاحة:"],
      ...DEPARTMENTS.map((dept) => [`• ${dept}`]),
      [""],
      ["ملاحظات:"],
      ["• تاريخ الانضمام بصيغة: YYYY-MM-DD"],
      ["• الراتب بالأرقام فقط"],
      ["• رقم الهاتف يفضل أن يبدأ بـ 05"],
      ["• سيتم تجاهل الصفوف الفارغة"],
      ["• في حالة وجود أخطاء سيتم عرض تقرير مفصل"],
    ];

    const instructionsWs = XLSX.utils.aoa_to_sheet(instructionsData);
    instructionsWs["!cols"] = [{ wch: 50 }];

    // Style the header
    if (instructionsWs["A1"]) {
      instructionsWs["A1"].s = {
        font: { bold: true, size: 14, color: { rgb: "000000" } },
        fill: { fgColor: { rgb: "E6F3FF" } },
      };
    }

    XLSX.utils.book_append_sheet(wb, instructionsWs, "تعليمات");

    XLSX.writeFile(wb, "نموذج_اضافة_الموظفين.xlsx");

    toast({
      title: "تم تحميل النموذج",
      description: "تم تحميل ملف Excel النموذجي بنجاح",
    });
  };

  // Validate employee data
  const validateEmployee = (data: any, rowIndex: number): ValidationResult => {
    const errors: string[] = [];

    // Required fields validation
    if (
      !data["الاسم الأول (مطلوب)"] ||
      data["الاسم الأول (مطلوب)"].trim() === ""
    ) {
      errors.push("الاسم الأول مطلوب");
    }

    if (
      !data["اسم العائلة (مطلوب)"] ||
      data["اسم العائلة (مطلوب)"].trim() === ""
    ) {
      errors.push("اسم العائلة مطلوب");
    }

    if (
      !data["البريد الإلكتروني (مطلوب)"] ||
      data["البريد الإلكتروني (مطلوب)"].trim() === ""
    ) {
      errors.push("البريد الإلكتروني مطلوب");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data["البريد الإلكتروني (مطلوب)"])) {
        errors.push("البريد الإلكتروني غير صالح");
      }
    }

    if (!data["القسم (مطلوب)"] || data["القسم (مطلوب)"].trim() === "") {
      errors.push("القسم مطلوب");
    } else if (!DEPARTMENTS.includes(data["القسم (مطلوب)"])) {
      errors.push(`القسم غير صالح. الأقسام المتاحة: ${DEPARTMENTS.join(", ")}`);
    }

    // Date validation
    if (data["تاريخ الانضمام"] && data["تاريخ الانضمام"] !== "") {
      const dateStr = data["تاريخ الانضمام"];
      if (typeof dateStr === "number") {
        // Excel date number to JavaScript date
        const excelDate = new Date((dateStr - 25569) * 86400 * 1000);
        data["تاريخ الانضمام"] = excelDate.toISOString().split("T")[0];
      } else if (typeof dateStr === "string") {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateStr)) {
          errors.push("تاريخ الانضمام يجب أن يكون بصيغة YYYY-MM-DD");
        }
      }
    }

    // Salary validation
    if (data["الراتب"] && data["الراتب"] !== "") {
      const salary = Number(data["الراتب"]);
      if (isNaN(salary) || salary < 0) {
        errors.push("الراتب يجب أن يكون رقماً صالحاً");
      }
    }

    const employeeData: EmployeeData = {
      firstName: data["الاسم الأول (مطلوب)"] || "",
      lastName: data["اسم العائلة (مطلوب)"] || "",
      email: data["البريد الإلكتروني (مطلوب)"] || "",
      department: data["القسم (مطلوب)"] || "",
      employeeId: data["رقم الموظف"] || "",
      phone: data["رقم الهاتف"] || "",
      position: data["المنصب"] || "",
      salary: data["الراتب"] ? Number(data["الراتب"]) : undefined,
      joinDate: data["تاريخ الانضمام"] || "",
    };

    return {
      isValid: errors.length === 0,
      errors,
      data: employeeData,
      row: rowIndex + 2, // +2 because Excel starts from 1 and we have header
    };
  };

  // Handle file upload and parsing
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsProcessing(true);
    setUploadProgress(0);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);

      // Read the first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      setUploadProgress(50);

      // Validate data
      const results: ValidationResult[] = [];
      const validEmployees: EmployeeData[] = [];

      jsonData.forEach((row: any, index: number) => {
        // Skip empty rows
        const hasData = Object.values(row).some(
          (value) => value !== null && value !== undefined && value !== "",
        );

        if (hasData) {
          const validation = validateEmployee(row, index);
          results.push(validation);

          if (validation.isValid) {
            validEmployees.push(validation.data);
          }
        }
      });

      setValidationResults(results);
      setParsedData(validEmployees);
      setUploadProgress(100);
      setShowPreview(true);

      toast({
        title: "تم تحليل الملف",
        description: `تم العثور على ${results.length} صف من البيانات`,
      });
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      toast({
        title: "خطأ في قراءة الملف",
        description: "تأكد من أن الملف بصيغة Excel صالحة",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Import valid employees
  const handleImport = () => {
    const validEmployees = validationResults
      .filter((result) => result.isValid)
      .map((result) => result.data);

    if (validEmployees.length === 0) {
      toast({
        title: "لا توجد بيانات صالحة",
        description: "يرجى تصحيح الأخطاء والمحاولة مرة أخرى",
        variant: "destructive",
      });
      return;
    }

    onEmployeesImported(validEmployees);

    toast({
      title: "تم استيراد الموظفين",
      description: `تم إضافة ${validEmployees.length} موظف بنجاح`,
    });

    // Reset state
    setIsOpen(false);
    setSelectedFile(null);
    setParsedData([]);
    setValidationResults([]);
    setShowPreview(false);
    setUploadProgress(0);
  };

  const validCount = validationResults.filter((r) => r.isValid).length;
  const errorCount = validationResults.filter((r) => !r.isValid).length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload
            className={`w-4 h-4 ${i18n.language === "ar" ? "ml-2" : "mr-2"}`}
          />
          استيراد من Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            استيراد الموظفين من ملف Excel
          </DialogTitle>
          <DialogDescription>
            قم بتحميل ملف Excel يحتوي على بيانات الموظفين لإضافتهم دفعة واحدة
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Download Template */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <h3 className="font-semibold">الخطوة الأولى: تحميل النموذج</h3>
            </div>

            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                قم بتحميل ملف Excel النموذجي، املأ بيانات الموظفين، ثم ارفعه هنا
              </AlertDescription>
            </Alert>

            <Button
              onClick={downloadTemplate}
              variant="outline"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              تحميل ملف Excel النموذجي
            </Button>
          </div>

          {/* Step 2: Upload File */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <h3 className="font-semibold">الخطوة الثانية: رفع الملف</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excel-file">اختر ملف Excel</Label>
              <Input
                id="excel-file"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                disabled={isProcessing}
              />
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>جاري تحليل الملف...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}
          </div>

          {/* Step 3: Preview and Import */}
          {showPreview && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <h3 className="font-semibold">الخطوة الثالثة: مراجعة وإضافة</h3>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">
                    {validCount}
                  </p>
                  <p className="text-sm text-green-700">صالح</p>
                </div>

                <div className="text-center p-4 rounded-lg bg-red-50 border border-red-200">
                  <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600">
                    {errorCount}
                  </p>
                  <p className="text-sm text-red-700">خطأ</p>
                </div>

                <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">
                    {validationResults.length}
                  </p>
                  <p className="text-sm text-blue-700">إجمالي</p>
                </div>
              </div>

              {/* Validation Results */}
              {validationResults.length > 0 && (
                <div className="max-h-96 overflow-auto border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الصف</TableHead>
                        <TableHead>الاسم</TableHead>
                        <TableHead>البريد الإلكتروني</TableHead>
                        <TableHead>القسم</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>الأخطاء</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {validationResults.map((result, index) => (
                        <TableRow key={index}>
                          <TableCell>{result.row}</TableCell>
                          <TableCell>
                            {result.data.firstName} {result.data.lastName}
                          </TableCell>
                          <TableCell>{result.data.email}</TableCell>
                          <TableCell>{result.data.department}</TableCell>
                          <TableCell>
                            {result.isValid ? (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                صالح
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                <XCircle className="w-3 h-3 mr-1" />
                                خطأ
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {result.errors.length > 0 && (
                              <div className="space-y-1">
                                {result.errors.map((error, errorIndex) => (
                                  <div
                                    key={errorIndex}
                                    className="text-xs text-red-600 flex items-center gap-1"
                                  >
                                    <AlertTriangle className="w-3 h-3" />
                                    {error}
                                  </div>
                                ))}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Import Button */}
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleImport}
                  className="flex-1"
                  disabled={validCount === 0}
                >
                  <Users className="w-4 h-4 mr-2" />
                  إضافة {validCount} موظف
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    setShowPreview(false);
                    setSelectedFile(null);
                    setParsedData([]);
                    setValidationResults([]);
                  }}
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
