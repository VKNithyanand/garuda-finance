
import { CardDescription, CardTitle } from "@/components/ui/card";
import { TrendingDown } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface OptimizationHeaderProps {
  savings: number;
  totalPotentialSavings: number;
  dataSource?: "mock" | "imported";
}

export const OptimizationHeader = ({ 
  savings, 
  totalPotentialSavings,
  dataSource = "mock"
}: OptimizationHeaderProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-2">
          <TrendingDown className="h-4 w-4 text-red-500" />
        </div>
        <CardTitle className="text-lg">Cost Optimization</CardTitle>
        {dataSource === "imported" && (
          <span className="ml-2 text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded">
            From imported data
          </span>
        )}
      </div>
      <CardDescription className="mt-1">
        Identify and implement cost-saving opportunities
      </CardDescription>
      <div className="mt-4 space-y-3">
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="text-sm text-muted-foreground">Current Savings</div>
          <div className="text-2xl font-semibold mt-1">{formatCurrency(savings)}</div>
          <div className="text-xs text-muted-foreground mt-1">
            of {formatCurrency(totalPotentialSavings)} potential savings
          </div>
        </div>
      </div>
    </div>
  );
};
