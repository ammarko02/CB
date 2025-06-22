import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: React.ReactNode;
  value: string;
  description?: React.ReactNode;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatsCardProps) {
  const { isRTL } = useLanguage();

  return (
    <Card className={cn("", className)} dir={isRTL ? "rtl" : "ltr"}>
      <CardHeader className={cn("flex justify-between flex-wrap space-y-0 pb-2", isRTL ? "flex-row-reverse" : "flex-row")}>
        <CardTitle className={cn("text-sm font-medium", isRTL ? "text-right" : "text-left")}>
          <DirectionAwareText>{title}</DirectionAwareText>
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent className={cn(isRTL ? "text-right" : "text-left")}>
        <DirectionAwareText className="text-2xl font-bold ltr-content">
          {value}
        </DirectionAwareText>
        {(description || trend) && (
          <div className={cn("flex items-center gap-2 text-xs text-muted-foreground", isRTL ? "flex-row-reverse justify-end" : "flex-row")}>
            {trend && (
              <DirectionAwareText
                className={cn(
                  "flex items-center",
                  trend.isPositive ? "text-green-600" : "text-red-600",
                )}
              >
                {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
              </DirectionAwareText>
            )}
            {description && (
              <DirectionAwareText>
                {description}
              </DirectionAwareText>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
}