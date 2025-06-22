import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { NAVIGATION_ITEMS } from "@/lib/constants";
import { getDefaultRoute } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MessageCenter } from "@/components/MessageCenter";
import { DirectionAwareText } from "@/components/DirectionAwareText";
import { TranslatedText } from "@/components/TranslatedText";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  CheckSquare,
  BarChart3,
  Users,
  Store,
  FileText,
  Building,
  Package,
  Plus,
  TrendingUp,
  Search,
  History,
  Heart,
  LogOut,
  Menu,
  X,
  MessageCircle,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const iconMap = {
  LayoutDashboard,
  CheckSquare,
  BarChart3,
  Users,
  Store,
  FileText,
  Building,
  Package,
  Plus,
  TrendingUp,
  MessageCircle,
  Search,
  History,
  Heart,
};

export function Navigation() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const navigationItems = NAVIGATION_ITEMS[user.role] || [];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  // Translation mapping for navigation items
  const getTranslatedLabel = (label: string) => {
    const labelMap: { [key: string]: string } = {
      Dashboard: t("navigation.dashboard"),
      "Offers Approval": t("navigation.offersApproval"),
      Analytics: t("navigation.analytics"),
      Users: t("navigation.users"),
      Suppliers: t("navigation.suppliers"),
      Employees: t("navigation.employees"),
      Reports: t("navigation.reports"),
      Departments: t("navigation.departments"),
      "My Offers": t("navigation.myOffers"),
      "Create Offer": t("navigation.createOffer"),
      "Browse Offers": t("navigation.browseOffers"),
      "My Redemptions": t("navigation.myRedemptions"),
      "My Coupons": t("navigation.myRedemptions"),
      Favorites: t("navigation.favorites"),
    };
    return labelMap[label] || label;
  };

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      className={cn("flex gap-2", mobile ? "flex-col space-y-2" : "flex-row")}
    >
      {navigationItems.map((item) => {
        const Icon = iconMap[item.icon as keyof typeof iconMap];
        const isActive = location.pathname === item.path;

        return (
          <Button
            key={item.path}
            variant={isActive ? "default" : "ghost"}
            className={cn("justify-start gap-2", mobile ? "w-full" : "h-10")}
            onClick={() => handleNavigation(item.path)}
          >
            <Icon className="h-4 w-4" />
            <TranslatedText
              tKey={`navigation.${item.label.toLowerCase().replace(" ", "")}`}
              fallback={getTranslatedLabel(item.label)}
            />
          </Button>
        );
      })}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col">
      <div className="container flex justify-between w-full h-16 items-center">
        {/* User Controls - Right Side */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Message Center */}
          <MessageCenter
            trigger={
              <Button variant="ghost" size="icon">
                <MessageCircle className="h-5 w-5" />
                <span className="sr-only">الرسائل والدعم</span>
              </Button>
            }
          />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.firstName} />
                  <AvatarFallback>
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {t(`roles.${user.role}`)}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                {t("navigation.profileSettings")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/help")}>
                {t("navigation.helpSupport")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
                <span>{t("common.logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-bold">
                      HP
                    </span>
                  </div>
                  <span className="font-bold">{t("app.title")}</span>
                </div>
                <nav>
                  <NavItems mobile />
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Navigation - Left Side */}
        <div className="flex gap-6 flex-wrap">
          <Link
            to={getDefaultRoute(user.role)}
            className="flex items-center gap-2 font-bold text-lg"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-bold">
                HP
              </span>
            </div>
            <TranslatedText tKey="app.title" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <NavItems />
          </nav>
        </div>
      </div>
    </header>
  );
}
