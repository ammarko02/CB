import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// English translations
const enTranslations = {
  common: {
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    update: "Update",
    submit: "Submit",
    approve: "Approve",
    reject: "Reject",
    search: "Search",
    filter: "Filter",
    clear: "Clear",
    viewAll: "View All",
    refresh: "Refresh",
    back: "Back",
    next: "Next",
    previous: "Previous",
    close: "Close",
    confirm: "Confirm",
    yes: "Yes",
    no: "No",
    email: "Email",
    password: "Password",
    firstName: "First Name",
    lastName: "Last Name",
    phone: "Phone",
    address: "Address",
    department: "Department",
    role: "Role",
    status: "Status",
    active: "Active",
    inactive: "Inactive",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    expired: "Expired",
    points: "Points",
    discount: "Discount",
    category: "Category",
    location: "Location",
    description: "Description",
    title: "Title",
    date: "Date",
    time: "Time",
    price: "Price",
    total: "Total",
    welcome: "Welcome",
    dashboard: "Dashboard",
    profile: "Profile",
    settings: "Settings",
    help: "Help",
    logout: "Logout",
    login: "Login",
    register: "Register",
    language: "Language",
    english: "English",
    arabic: "العربية",
  },
  auth: {
    welcomeBack: "Welcome back",
    signInToAccount: "Sign in to your account to continue",
    signIn: "Sign in",
    signUp: "Sign up",
    signingIn: "Signing in...",
    createAccount: "Create Account",
    creatingAccount: "Creating Account...",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    forgotPassword: "Forgot password?",
    confirmPassword: "Confirm Password",
    fillDetails: "Fill in your details to create an account",
    invalidCredentials: "Invalid credentials",
    loginFailed: "Login failed",
    registrationFailed: "Registration failed",
    loggedOut: "Logged out",
    loggedOutSuccess: "You have been logged out successfully",
    accountCreated: "Account created!",
    accountCreatedSuccess: "Your account has been created successfully",
    demoAccounts: "Demo Accounts",
    demoAccountsDesc: "Click on any account below to quick login for testing",
    useAccount: "Use Account",
  },
  app: {
    title: "Happy Perks Hub",
    subtitle: "Employee perks management platform",
    description: "Discover amazing perks and rewards just for you",
    copyright: "© 2024 Happy Perks Hub. All rights reserved.",
  },
  navigation: {
    dashboard: "Dashboard",
    offersApproval: "Offers Approval",
    analytics: "Analytics",
    users: "Users",
    suppliers: "Suppliers",
    employees: "Employees",
    reports: "Reports",
    departments: "Departments",
    myOffers: "My Offers",
    createOffer: "Create Offer",
    browseOffers: "Browse Offers",
    myRedemptions: "My Redemptions",
    favorites: "Favorites",
    profileSettings: "Profile Settings",
    helpSupport: "Help & Support",
  },
  dashboard: {
    totalUsers: "Total Users",
    totalOffers: "Total Offers",
    totalRedemptions: "Total Redemptions",
    activeEmployees: "Active Employees",
    pendingOffers: "Pending Offers",
    topPerformers: "Top Performers",
    recentActivity: "Recent Activity",
    quickActions: "Quick Actions",
    welcomeBack: "Welcome back",
    manageOffers: "Manage Offers",
    viewAnalytics: "View Analytics",
    manageUsers: "Manage Users",
    addEmployee: "Add Employee",
    createNewOffer: "Create New Offer",
    pointsBalance: "Points Balance",
    availablePoints: "Available points",
    offersRedeemed: "Offers Redeemed",
    thisMonth: "This month",
    savingsEarned: "Savings Earned",
    totalSavings: "Total savings",
    featuredOffers: "Featured Offers",
    handpickedOffers: "Handpicked offers just for you",
    checkBackLater: "Check back later for new exciting offers!",
    yourPoints: "Your Points",
    pointsAvailable: "Points available to spend",
    pointsUntilNext: "{{points}} more points until next reward level",
    maxLevelReached: "Maximum level reached!",
    dontMissOffers: "Don't miss these offers!",
    latestRedemptions: "Your latest redemptions",
    noRedemptions: "No redemptions yet",
    commonTasks: "Common tasks and shortcuts",
  },
  offers: {
    title: "Offers",
    browseOffers: "Browse Offers",
    createOffer: "Create Offer",
    editOffer: "Edit Offer",
    offerTitle: "Offer Title",
    offerDescription: "Offer Description",
    discountPercentage: "Discount Percentage",
    originalPrice: "Original Price",
    finalPrice: "Final Price",
    pointsCost: "Points Cost",
    expiryDate: "Expiry Date",
    maxRedemptions: "Max Redemptions",
    termsConditions: "Terms & Conditions",
    submitForApproval: "Submit for Approval",
    updateOffer: "Update Offer",
    redeemOffer: "Redeem Offer",
    redeeming: "Redeeming...",
    offerRedeemed: "Offer redeemed!",
    redemptionFailed: "Redemption failed",
    offerApproved: "Offer approved",
    offerRejected: "Offer rejected",
    noOffersFound: "No offers found",
    noOffersDesc:
      "Try adjusting your filters or search terms to find what you're looking for",
    expiringOffer: "Expiring Soon",
    daysLeft: "days left",
    dayLeft: "day left",
    views: "Views",
    redemptions: "Redemptions",
    by: "by",
    expires: "Expires",
    offersStatus: "Offers Status Overview",
    currentStatus: "Current status of all your offers",
    searchPlaceholder: "Search offers, suppliers...",
    allCategories: "All Categories",
    allSuppliers: "All Suppliers",
    allStatus: "All Status",
    newest: "Newest First",
    oldest: "Oldest First",
    highestDiscount: "Highest Discount",
    expiringFirst: "Expiring Soon",
    mostPopular: "Most Popular",
    lowestPoints: "Lowest Points",
    highestPoints: "Highest Points",
    pointsRange: "Points Range",
    clearFilters: "Clear Filters",
    moreFilters: "More Filters",
    showing: "Showing",
    of: "of",
    filtered: "Filtered",
  },
  categories: {
    food: "Food & Dining",
    fitness: "Fitness & Health",
    entertainment: "Entertainment",
    travel: "Travel & Transportation",
    retail: "Retail & Shopping",
    technology: "Technology",
    other: "Other",
  },
  roles: {
    super_admin: "Super Admin",
    hr: "HR Manager",
    supplier: "Supplier",
    employee: "Employee",
  },
  departments: {
    engineering: "Engineering",
    marketing: "Marketing",
    sales: "Sales",
    humanresources: "Human Resources",
    finance: "Finance",
    operations: "Operations",
    customersupport: "Customer Support",
    design: "Design",
    legal: "Legal",
    executive: "Executive",
  },
  errors: {
    accessDenied: "Access Denied",
    noPermission: "You don't have permission to access this page",
    contactAdmin:
      "Please contact your administrator if you believe this is an error",
    currentRole: "Current Role",
    goToDashboard: "Go to Dashboard",
    signOut: "Sign Out",
    pageNotFound: "Page Not Found",
    pageNotFoundDesc: "The page you're looking for doesn't exist",
    goHome: "Go Home",
    somethingWrong: "Something went wrong",
    tryAgain: "Try again",
    loadingFailed: "Failed to load data",
    saveFailed: "Failed to save",
    deleteFailed: "Failed to delete",
    updateFailed: "Failed to update",
  },
  validation: {
    required: "This field is required",
    invalidEmail: "Please enter a valid email address",
    passwordTooShort: "Password must be at least 6 characters",
    passwordsNotMatch: "Passwords do not match",
    invalidDate: "Please enter a valid date",
    futureDate: "Date must be in the future",
    invalidNumber: "Please enter a valid number",
    positiveNumber: "Number must be greater than 0",
    maxFileSize: "File size must be less than 5MB",
    invalidFileType: "Please select a valid image file",
  },
  notifications: {
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Info",
    offerCreated: "Offer created successfully",
    offerUpdated: "Offer updated successfully",
    offerDeleted: "Offer deleted successfully",
    userCreated: "User created successfully",
    userUpdated: "User updated successfully",
    userDeleted: "User deleted successfully",
    settingsSaved: "Settings saved successfully",
  },
};

// Arabic translations
const arTranslations = {
  common: {
    loading: "جاري التحميل...",
    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    edit: "تعديل",
    create: "إنشاء",
    update: "تحديث",
    submit: "إرسال",
    approve: "موافقة",
    reject: "رفض",
    search: "بحث",
    filter: "تصفية",
    clear: "مسح",
    viewAll: "عرض الكل",
    refresh: "تحديث",
    back: "رجوع",
    next: "التالي",
    previous: "السابق",
    close: "إغلاق",
    confirm: "تأكيد",
    yes: "نعم",
    no: "لا",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    phone: "رقم الهاتف",
    address: "العنوان",
    department: "القسم",
    role: "الدور",
    status: "الحالة",
    active: "نشط",
    inactive: "غير نشط",
    pending: "في الانتظار",
    approved: "مقبول",
    rejected: "مرفوض",
    expired: "منتهي الصلاحية",
    points: "النقاط",
    discount: "خصم",
    category: "الفئة",
    location: "الموقع",
    description: "الوصف",
    title: "العنوان",
    date: "التاريخ",
    time: "الوقت",
    price: "السعر",
    total: "المجموع",
    welcome: "مرحباً",
    dashboard: "لوحة التحكم",
    profile: "الملف الشخصي",
    settings: "الإعدادات",
    help: "المساعدة",
    logout: "تسجيل الخروج",
    login: "تسجيل الدخول",
    register: "التسجيل",
    language: "اللغة",
    english: "English",
    arabic: "العربية",
  },
  auth: {
    welcomeBack: "مرحباً بعودتك",
    signInToAccount: "سجل دخولك إلى حسابك للمتابعة",
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    signingIn: "جاري تسجيل الدخول...",
    createAccount: "إنشاء حساب",
    creatingAccount: "جاري إنشاء الحساب...",
    dontHaveAccount: "ليس لديك حساب؟",
    alreadyHaveAccount: "لديك حساب بالفعل؟",
    forgotPassword: "نسيت كلمة المرور؟",
    confirmPassword: "تأكيد كلمة المرور",
    fillDetails: "املأ التفاصيل الخاصة بك لإنشاء حساب",
    invalidCredentials: "بيانات الدخول غير صحيحة",
    loginFailed: "فشل تسجيل الدخول",
    registrationFailed: "فشل التسجيل",
    loggedOut: "تم تسجيل الخروج",
    loggedOutSuccess: "تم تسجيل خروجك بنجاح",
    accountCreated: "تم إنشاء الحساب!",
    accountCreatedSuccess: "تم إنشاء حسابك بنجاح",
    demoAccounts: "حسابات تجريبية",
    demoAccountsDesc: "انقر على أي حساب أدناه لتسجيل دخول سريع للاختبار",
    useAccount: "استخدام الحساب",
  },
  app: {
    title: "مركز المزايا السعيد",
    subtitle: "منصة إدارة مزايا الموظفين",
    description: "اكتشف المزايا والمكافآت الرائعة المخصصة لك",
    copyright: "© 2024 مركز المزايا السعيد. جميع الحقوق محفوظة.",
  },
  navigation: {
    dashboard: "لوحة التحكم",
    offersApproval: "موافقة العروض",
    analytics: "التحليلات",
    users: "المستخدمون",
    suppliers: "الموردون",
    employees: "الموظفون",
    reports: "التقارير",
    departments: "الأقسام",
    myOffers: "عروضي",
    createOffer: "إنشاء عرض",
    browseOffers: "تصفح العروض",
    myRedemptions: "عمليات الاستبدال",
    favorites: "المفضلة",
    analytics: "التحليلات",
    profileSettings: "إعدادات الملف الشخصي",
    helpSupport: "المساعدة والدعم",
  },
  dashboard: {
    totalUsers: "إجمالي المستخدمين",
    totalOffers: "إجمالي العروض",
    totalRedemptions: "إجمالي عمليات الاستبدال",
    activeEmployees: "الموظفون النشطون",
    pendingOffers: "العروض المعلقة",
    topPerformers: "الأفضل أداءً",
    recentActivity: "النشاط الحديث",
    quickActions: "إجراءات سريعة",
    welcomeBack: "مرحباً بعودتك",
    manageOffers: "إدارة العروض",
    viewAnalytics: "عرض التحليلات",
    manageUsers: "إدارة المستخدمين",
    addEmployee: "إضاف�� موظف",
    createNewOffer: "إنشاء عرض جديد",
    pointsBalance: "رصيد النقاط",
    availablePoints: "النقاط المتاحة",
    offersRedeemed: "العروض المستبدلة",
    thisMonth: "هذا الشهر",
    savingsEarned: "الوفورات المحققة",
    totalSavings: "إجمالي الوفورات",
    featuredOffers: "العروض المميزة",
    handpickedOffers: "عروض مختارة خصيصاً لك",
    checkBackLater: "تحقق لاحقاً من العروض الجديدة المثيرة!",
    yourPoints: "نقاطك",
    pointsAvailable: "النقاط المتاحة للإنفاق",
    pointsUntilNext: "{{points}} نقطة أخرى حتى مستوى المكافأة الت��لي",
    maxLevelReached: "تم الوصول للمستوى الأقصى!",
    dontMissOffers: "لا تفوت هذه العروض!",
    latestRedemptions: "عمليات الاستبدال الأخيرة",
    noRedemptions: "لا توجد عمليات استبدال بعد",
    commonTasks: "المهام الشائعة والاختصارات",
  },
  offers: {
    title: "العروض",
    browseOffers: "تصفح العروض",
    createOffer: "إنشاء عرض",
    editOffer: "تعديل العرض",
    offerTitle: "عنوان العرض",
    offerDescription: "وصف العرض",
    discountPercentage: "نسبة الخصم",
    originalPrice: "السعر ��لأصلي",
    finalPrice: "السعر النهائي",
    pointsCost: "تكلفة النقاط",
    expiryDate: "تاريخ انتهاء الصلاحية",
    maxRedemptions: "الحد الأقصى للاستبدالات",
    termsConditions: "الشروط والأحكام",
    submitForApproval: "إرسال للموافقة",
    updateOffer: "تحديث العرض",
    redeemOffer: "استبدال العرض",
    redeeming: "جاري الاستبدال...",
    offerRedeemed: "تم استبدال العرض!",
    redemptionFailed: "فشل الاستبدال",
    offerApproved: "تمت الموافقة على العرض",
    offerRejected: "تم رفض العرض",
    noOffersFound: "لم يتم العثور على عروض",
    noOffersDesc: "جرب تعديل المرشحات أو مصطلحات البحث للعثور على ما تبحث عنه",
    expiringOffer: "ينتهي قريباً",
    daysLeft: "أيام متبقية",
    dayLeft: "يوم متبقي",
    views: "المشاهدات",
    redemptions: "الاستبدالات",
    by: "بواسطة",
    expires: "ينتهي",
    offersStatus: "نظرة عامة على حالة العروض",
    currentStatus: "الحالة الحالية لجميع عروضك",
    searchPlaceholder: "البحث في العروض والموردين...",
    allCategories: "جميع الفئات",
    allSuppliers: "جميع الموردين",
    allStatus: "جميع الحالات",
    newest: "الأحدث أولاً",
    oldest: "الأقدم أولاً",
    highestDiscount: "أعلى خصم",
    expiringFirst: "ينتهي قريباً",
    mostPopular: "الأكثر شعبية",
    lowestPoints: "أقل نقاط",
    highestPoints: "أكثر نقاط",
    pointsRange: "نطاق النقاط",
    clearFilters: "مسح المرشحات",
    moreFilters: "مرشحات أكثر",
    showing: "عرض",
    of: "من",
    filtered: "مرشح",
    redemptionType: "طريقة الاستفادة",
    onlineOffer: "عرض إلكتروني",
    branchOffer: "عرض في الفرع",
    visitWebsite: "زيارة الموقع",
    visitBranch: "زيار�� الفرع",
    generateCard: "إنشاء بطاقة خصم",
    discountCard: "بطاقة الخصم",
    cardGenerated: "تم إنشاء البطاقة",
    downloadCard: "تحميل البطاقة",
    websiteUrl: "رابط الموقع الإلكتروني",
    branchAddress: "عنوان الفرع",
    usageLimits: "حدود الاستخدام",
    oncePerEmployee: "مرة واحدة لكل موظف",
    multipleUses: "عدد محدود من المرات",
    unlimitedUses: "غير محدود",
    usesPerEmployee: "عدد مرات الاستخدام لكل موظف",
    discountCodeType: "نوع كود الخصم",
    autoGenerated: "توليد تلقائي",
    supplierProvided: "من المورد",
    myRedemptions: "عروضي المستبدلة",
    myCoupons: "كوبوناتي",
    activeOffers: "العروض النشطة",
    usedOffers: "العروض المستخدمة",
    expiredOffers: "العروض المنتهية",
    copyCode: "نسخ الكود",
    codeGenerated: "تم إنشاء الكود",
    usageOnce: "للاستخدام مرة واحدة",
    multipleUsage: "للاستخدام المتعدد",
  },
  categories: {
    food: "الطعام والمأكولات",
    fitness: "اللياقة والصحة",
    entertainment: "الترفيه",
    travel: "السفر والمواصلات",
    retail: "الت��وق والبيع بالتجزئة",
    technology: "التكنولوجيا",
    other: "أخرى",
  },
  roles: {
    super_admin: "المشرف العام",
    hr: "مدير الموارد البشرية",
    supplier: "مورد",
    employee: "موظف",
  },
  ui: {
    loading: "جاري التحميل...",
    noData: "لا توجد بيانات",
    selectAll: "تحديد الكل",
    selected: "محدد",
    items: "عناصر",
    page: "صفحة",
    of: "من",
    rowsPerPage: "صفوف لكل صفحة",
    showing: "عرض",
    to: "إلى",
    results: "نتائج",
    actions: "إجراءات",
    filters: "مرشحات",
    apply: "تطبيق",
    reset: "إعادة تعيين",
    export: "تصدير",
    import: "استيراد",
    print: "طباعة",
    more: "المزيد",
    less: "أقل",
    expand: "توسيع",
    collapse: "طي",
    fullscreen: "ملء الشاشة",
    exitFullscreen: "خروج من ملء الشاشة",
    copy: "نسخ",
    copied: "تم النسخ",
    share: "مشاركة",
    download: "تحميل",
    upload: "رفع",
    dragAndDrop: "اسحب وأفلت",
    or: "أو",
    and: "و",
    optional: "اختياري",
    required: "مطلوب",
    recommended: "مستحسن",
  },
  departments: {
    engineering: "الهندسة",
    marketing: "التسويق",
    sales: "المبيعات",
    humanresources: "الموارد البشرية",
    finance: "المالية",
    operations: "العمليات",
    customersupport: "دعم العملاء",
    design: "التصميم",
    legal: "القانونية",
    executive: "التنفيذية",
  },
  errors: {
    accessDenied: "الوصول مرفوض",
    noPermission: "ليس لديك صلاحية للوصول إلى هذه الصفحة",
    contactAdmin: "يرجى الاتصال بالمشرف إذا كنت تعتقد أن هذا خطأ",
    currentRole: "الدور الحالي",
    goToDashboard: "الذهاب إلى لوحة التحكم",
    signOut: "تسجيل الخروج",
    pageNotFound: "الصفحة غير موجودة",
    pageNotFoundDesc: "الصفحة التي تبحث عنها غير موجودة",
    goHome: "الذهاب للرئيسية",
    somethingWrong: "حدث خطأ ما",
    tryAgain: "حاول مرة أخرى",
    loadingFailed: "فشل تحميل البيانات",
    saveFailed: "فشل الحفظ",
    deleteFailed: "فشل الحذف",
    updateFailed: "فشل التحديث",
  },
  validation: {
    required: "هذا الحقل مطلوب",
    invalidEmail: "يرجى إدخال عنوان بريد إلكتروني صالح",
    passwordTooShort: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
    passwordsNotMatch: "كلمات المرور غير متطابقة",
    invalidDate: "يرجى إدخال تاريخ صالح",
    futureDate: "التاريخ يجب أن يكون في المستقبل",
    invalidNumber: "يرجى إدخال رقم صالح",
    positiveNumber: "الرقم يجب أن يكون أكبر من 0",
    maxFileSize: "حجم الملف يجب أن يكون أقل من 5 ميجابايت",
    invalidFileType: "يرجى اختيار ملف صورة صالح",
  },
  notifications: {
    success: "نجح",
    error: "خطأ",
    warning: "تحذير",
    info: "معلومات",
    offerCreated: "تم إنشاء العرض بنجاح",
    offerUpdated: "تم تحديث العرض بنجاح",
    offerDeleted: "تم حذف العرض بنجاح",
    userCreated: "تم إنشاء المستخدم بنجاح",
    userUpdated: "تم تحديث المستخدم بنجاح",
    userDeleted: "تم حذف المستخدم بنجاح",
    settingsSaved: "تم حفظ الإعدادات بنجاح",
  },
  analytics: {
    overview: "نظرة عامة",
    performance: "الأداء",
    growth: "النمو",
    trends: "الاتجاهات",
    comparison: "مقارنة",
    report: "تقرير",
    charts: "المخططات",
    tables: "الجداول",
    metrics: "المقاييس",
    kpis: "مؤشرات الأداء الرئيسية",
    thisMonth: "هذا الشهر",
    lastMonth: "الشهر الماضي",
    thisYear: "هذا العام",
    lastYear: "العام الماضي",
    today: "اليوم",
    yesterday: "أمس",
    thisWeek: "هذا الأسبوع",
    lastWeek: "الأسبوع الماضي",
    last30Days: "آخر 30 يوماً",
    last90Days: "آخر 90 يوماً",
    lastYear_data: "العام الماضي",
    customRange: "نطاق مخصص",
    dateRange: "نطاق التاريخ",
    from: "من",
    to: "إلى",
    period: "الفترة",
    interval: "الفاصل الزمني",
    daily: "يومي",
    weekly: "أسبوعي",
    monthly: "شهري",
    quarterly: "ربع سنوي",
    yearly: "سنوي",
  },
  admin: {
    systemSettings: "إعدادات النظام",
    userManagement: "إدارة المستخدمين",
    contentManagement: "إدارة المحتوى",
    securitySettings: "إعدادات الأمان",
    backupRestore: "النسخ الاحتياطي والاستعادة",
    systemLogs: "سجلات النظام",
    permissions: "الصلاحيات",
    roles: "الأدوار",
    accessControl: "التحكم في الوصول",
    auditTrail: "سجل التدقيق",
    systemHealth: "صحة النظام",
    performance: "الأداء",
    monitoring: "المراقبة",
    alerts: "التنبيهات",
    maintenance: "الصيانة",
    updates: "التحديثات",
    configuration: "التكوين",
    integration: "التكامل",
    apiManagement: "إدارة واجهة برمجة التطبيقات",
    webhooks: "Webhooks",
    scheduledTasks: "المهام المجدولة",
    emailTemplates: "قوالب البريد الإلكتروني",
    notificationSettings: "إعدادات الإشعارات",
    themeCustomization: "تخصيص المظهر",
    languageSettings: "إعدادات اللغة",
    timeZoneSettings: "إعدادات المنطقة الزمنية",
    currencySettings: "إعدادات العملة",
    paymentGateways: "بوابات الدفع",
    shippingSettings: "إعدادات الشحن",
    taxSettings: "إعدادات الضرائب",
    discountCodes: "رموز الخصم",
    promotions: "العروض الترويجية",
    campaigns: "الحملات",
    newsletters: "النشرات الإخبارية",
    socialMedia: "وسائل التواصل الاجتماعي",
    seoSettings: "إعدادات تحسين محركات البحث",
    analyticsTracking: "تتبع التحليلات",
    gdprCompliance: "الامتثال لـ GDPR",
    privacyPolicy: "سياسة الخصوصية",
    termsOfService: "شروط الخدمة",
    cookiePolicy: "سياسة ملفات تعريف الارتباط",
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      ar: {
        translation: arTranslations,
      },
    },
    fallbackLng: "en",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
  });

// Set initial document direction
const currentLang = i18n.language || localStorage.getItem("i18nextLng") || "en";
if (currentLang === "ar") {
  document.documentElement.dir = "rtl";
  document.documentElement.lang = "ar";
} else {
  document.documentElement.dir = "ltr";
  document.documentElement.lang = "en";
}

// Listen for language changes
i18n.on("languageChanged", (lng) => {
  if (lng === "ar") {
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
  } else {
    document.documentElement.dir = "ltr";
    document.documentElement.lang = "en";
  }
});

export default i18n;
