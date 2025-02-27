
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon?: React.ReactNode;
  className?: string;
  valuePrefix?: string;
  valueSuffix?: string;
}

const MetricCard = ({
  title,
  value,
  trend,
  trendLabel,
  icon,
  className,
  valuePrefix = "",
  valueSuffix = "",
}: MetricCardProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const formatTrend = (value: number) => {
    return value > 0 ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`;
  };

  const renderTrendIcon = (value?: number) => {
    if (value === undefined) return null;
    
    if (value > 0) {
      return <ArrowUpIcon className="h-4 w-4 text-green-500" />;
    } else if (value < 0) {
      return <ArrowDownIcon className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-500 transform",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold tracking-tight">
              {valuePrefix}{typeof value === 'number' ? value.toLocaleString('en-US') : value}{valueSuffix}
            </h3>
            
            {trend !== undefined && (
              <div className="flex items-center mt-2 text-sm font-medium">
                {renderTrendIcon(trend)}
                <span 
                  className={cn(
                    "ml-1",
                    trend > 0 ? "text-green-500" : trend < 0 ? "text-red-500" : "text-muted-foreground"
                  )}
                >
                  {formatTrend(trend)}
                </span>
                {trendLabel && (
                  <span className="ml-1 text-muted-foreground">
                    {trendLabel}
                  </span>
                )}
              </div>
            )}
          </div>
          
          {icon && (
            <div className="p-2 rounded-full bg-primary/10">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
