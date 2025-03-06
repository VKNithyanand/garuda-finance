
import { BadgeDollarSign, Coins } from "lucide-react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/utils/optimizationReportUtils";

interface OptimizationHeaderProps {
  savings: number;
  totalPotentialSavings: number;
}

export const OptimizationHeader = ({ savings, totalPotentialSavings }: OptimizationHeaderProps) => {
  return (
    <div className="pb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BadgeDollarSign className="h-6 w-6 text-primary" />
          <div>
            <CardTitle className="text-lg font-medium">Cost Optimization</CardTitle>
            <CardDescription>AI-powered cost-saving opportunities</CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-2 rounded-lg hover-scale transition-all">
            <p className="text-sm font-medium">Implemented Savings</p>
            <p className="text-xl font-bold">{formatCurrency(savings)}</p>
          </div>
          <div className="flex items-center bg-primary/10 p-2 rounded-lg hover-scale transition-all">
            <Coins className="h-5 w-5 text-primary mr-2" />
            <div>
              <p className="text-sm font-medium">Potential Savings</p>
              <p className="text-xl font-bold text-primary">{formatCurrency(totalPotentialSavings)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {totalPotentialSavings > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Implementation Progress</span>
            <span>{Math.round((savings / totalPotentialSavings) * 100)}%</span>
          </div>
          <Progress value={(savings / totalPotentialSavings) * 100} className="h-2" />
        </div>
      )}
    </div>
  );
};
