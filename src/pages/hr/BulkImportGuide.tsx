import React from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  Users,
  ArrowRight,
  Info,
  Lightbulb,
  Shield,
  Clock,
  Target,
} from "lucide-react";

export default function BulkImportGuide() {
  const { t, i18n } = useTranslation();

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-4xl">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
          <FileSpreadsheet className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold">دليل الاستيراد المجمع للموظفين</h1>
        <p className="text-muted-foreground text-lg">
          تعلم كيفية إضافة مئات الموظفين بسهولة باستخدام ملف Excel واحد
        </p>
      </div>

      {/* Overview */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            نظرة عامة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-blue-900">
            ميزة الاستيراد المجمع تمكنك من إضافة عدد كبير من الموظفين دفعة واحدة
            باستخدام ملف Excel، مما يوفر الوقت والجهد بدلاً من إدخال البيانات
            يدوياً.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-white/70 border border-blue-200">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900">توفير الوقت</h3>
              <p className="text-sm text-blue-700">
                إضافة مئات الموظفين في دقائق
              </p>
            </div>

            <div className="text-center p-4 rounded-lg bg-white/70 border border-blue-200">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900">دقة عالية</h3>
              <p className="text-sm text-blue-700">
                تحقق تلقائي من صحة البيانات
              </p>
            </div>

            <div className="text-center p-4 rounded-lg bg-white/70 border border-blue-200">
              <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900">أمان البيانات</h3>
              <p className="text-sm text-blue-700">
                معالجة آمنة ��محمية للملفات
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step-by-step Guide */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">خطوات الاستيراد</h2>

        {/* Step 1 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              تحميل النموذج
            </CardTitle>
            <CardDescription>
              احصل على ملف Excel النموذجي الجاهز للاستخدام
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Download className="h-4 w-4" />
              <AlertDescription>
                النموذج يحتوي على أمثلة توضيحية وتعليمات مفصلة داخل الملف
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">ما ستحصل عليه:</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  ملف Excel بتنسيق صحيح ومعد مسبقاً
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  أمثلة على بيانات موظفين نموذجية
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  تعليمات تفصيلية في صفحة منفصلة
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  قائمة بالأقسام المتاحة
                </li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">نصيحة هامة</span>
              </div>
              <p className="text-sm text-yellow-700">
                احتفظ بنسخة من النموذج الأصلي لاستخدامه في المرات القادمة
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              ملء البيانات
            </CardTitle>
            <CardDescription>
              أضف بيانات الموظفين في الملف النموذجي
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-600">
                  الحقول المطلوبة:
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">
                      مطلوب
                    </Badge>
                    <span className="text-sm">الاسم الأول</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">
                      مطلوب
                    </Badge>
                    <span className="text-sm">اسم العائلة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">
                      مطلوب
                    </Badge>
                    <span className="text-sm">البريد الإلكتروني</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">
                      مطلوب
                    </Badge>
                    <span className="text-sm">القسم</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-blue-600">
                  الحقول الاختيارية:
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      اختياري
                    </Badge>
                    <span className="text-sm">رقم الموظف</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      اختياري
                    </Badge>
                    <span className="text-sm">رقم الهاتف</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      اختياري
                    </Badge>
                    <span className="text-sm">المنصب</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      اختياري
                    </Badge>
                    <span className="text-sm">الراتب</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      اختياري
                    </Badge>
                    <span className="text-sm">تاريخ الانضمام</span>
                  </div>
                </div>
              </div>
            </div>

            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>تنبيه:</strong> احذف الصفوف النموذجية (الموظفين الثلاثة)
                قبل إضافة بياناتك الحقيقية
              </AlertDescription>
            </Alert>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">
                تنسيقات البيانات المطلوبة:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <strong>البريد الإلكتروني:</strong> user@company.com
                </div>
                <div>
                  <strong>التاريخ:</strong> 2024-01-15
                </div>
                <div>
                  <strong>الهاتف:</strong> 0551234567
                </div>
                <div>
                  <strong>الراتب:</strong> 8000 (أرقام فقط)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              رفع الملف والمراجعة
            </CardTitle>
            <CardDescription>
              ارفع الملف ومراجعة البيانات قبل الإضافة النهائية
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  التحقق التلقائي
                </h4>
                <ul className="space-y-1 text-sm text-green-700">
                  <li>• فحص صحة البريد الإلكتروني</li>
                  <li>• التأكد من وجود الحقول المطلوبة</li>
                  <li>• فحص صحة الأقسام</li>
                  <li>• التحقق من تنسيق التواريخ</li>
                </ul>
              </div>

              <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  تقرير المراجعة
                </h4>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• عدد البيانات الصالحة</li>
                  <li>• عدد البيانات التي بها أخطاء</li>
                  <li>• تفاصيل الأخطاء لكل صف</li>
                  <li>• إمكانية التصحيح والإعادة</li>
                </ul>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                يمكنك إضافة البيانات الصالحة فقط وتصحيح الأخطاء لاحقاً، أو تصحيح
                الملف وإعادة رفعه
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Best Practices */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Lightbulb className="w-5 h-5" />
            أفضل الممارسات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-800">قبل الرفع:</h4>
              <ul className="space-y-2 text-sm text-green-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  تأكد من مراجعة جميع البيانات
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  احذف الصفوف النموذجية
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  تحقق من عدم تكرار البريد الإلكتروني
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  احفظ نسخة احتياطية من الملف
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-green-800">بعد الرفع:</h4>
              <ul className="space-y-2 text-sm text-green-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  راجع تقرير التحقق بعناية
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  تحقق من إضافة الموظفين في القائمة
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  أرسل كلمات المرور للموظفين الجدد
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  اطلب منهم تغيير كلمة المرور
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notes */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <Shield className="w-5 h-5" />
            ملاحظات أمنية مهمة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Alert className="border-red-300 bg-red-100">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>كلمة المرور الافتراضية:</strong> جميع الموظفين الجدد
              سيحصلون على كلمة المرور الافتراضية "password123"
            </AlertDescription>
          </Alert>

          <div className="bg-white p-4 rounded-lg border border-red-200">
            <h4 className="font-semibold text-red-800 mb-2">
              الإجراءات المطلوبة بعد الاستيراد:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-red-700">
              <li>إرسال بيانات الدخول للموظفين الجدد</li>
              <li>طلب تغيير كلمة المرور في أول تسجيل دخول</li>
              <li>التأكد من تحديث معلومات الاتصال</li>
              <li>إضافة الموظفين للأقسام المناسبة</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle>حل المشاكل الشائعة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold mb-2">
                ❌ خطأ: "البريد الإلكتروني غير صالح"
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>السبب:</strong> تنسيق البريد الإلكتروني غير صحيح
              </p>
              <p className="text-sm text-green-600">
                <strong>الحل:</strong> تأكد من أن البريد يحتوي على @ ونطاق صالح
                (مثل: user@company.com)
              </p>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold mb-2">❌ خطأ: "القسم غير صالح"</h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>السبب:</strong> اسم القسم لا يطابق الأقسام المتاحة
              </p>
              <p className="text-sm text-green-600">
                <strong>الحل:</strong> استخدم الأقسام الموجودة في النموذج بنفس
                الكتابة
              </p>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold mb-2">❌ خطأ: "تاريخ غير صالح"</h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>السبب:</strong> تنسيق التاريخ غير مطابق للمطلوب
              </p>
              <p className="text-sm text-green-600">
                <strong>الحل:</strong> استخدم تنسيق YYYY-MM-DD (مثل: 2024-01-15)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-center text-purple-800">
            هل تحتاج مساعدة؟
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-purple-700">
            إذا واجهت أي مشاكل أو كان لديك أسئلة، لا تتردد في التواصل مع فريق
            الدعم التقني
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              className="border-purple-300 text-purple-700"
            >
              اتصل بالدعم التقني
            </Button>
            <Button
              variant="outline"
              className="border-purple-300 text-purple-700"
            >
              إرسال تذكرة دعم
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
