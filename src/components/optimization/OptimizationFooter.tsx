
import { Button } from "@/components/ui/button";
import { BarChart3, Download, ArrowRight, Sparkles } from "lucide-react";

interface OptimizationFooterProps {
  implementedCount: number;
  totalCount: number;
  isGeneratingReport: boolean;
  onGenerateReport: () => void;
  onDownloadReport: () => void;
}

export const OptimizationFooter = ({ 
  implementedCount,
  totalCount,
  isGeneratingReport,
  onGenerateReport,
  onDownloadReport,
}: OptimizationFooterProps) => {
  return (
    <div className="mt-6 flex justify-between items-center">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <BarChart3 className="h-4 w-4" />
        <span>{implementedCount} of {totalCount} optimizations implemented</span>
      </div>
      <div className="flex items-center gap-2">
        {implementedCount > 0 && (
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={onDownloadReport}
          >
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        )}
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={onGenerateReport}
          disabled={isGeneratingReport}
        >
          {isGeneratingReport ? (
            <>Generating... <Sparkles className="h-4 w-4 animate-pulse" /></>
          ) : (
            <>Generate Optimization Report <ArrowRight className="h-4 w-4" /></>
          )}
        </Button>
      </div>
    </div>
  );
};
