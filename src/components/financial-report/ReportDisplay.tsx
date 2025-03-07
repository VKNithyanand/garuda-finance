
import { Button } from "@/components/ui/button";
import { Download, Share2, Printer, PieChart, BarChart3, TrendingUp } from "lucide-react";
import { GeneratedReport, formatDate } from "@/utils/reportDisplayUtils";

interface ReportDisplayProps {
  report: GeneratedReport;
  onDownload: () => void;
  onShare: () => void;
  onPrint: () => void;
}

export const ReportDisplay = ({
  report,
  onDownload,
  onShare,
  onPrint
}: ReportDisplayProps) => {
  return (
    <div className="border rounded-md p-4 border-primary/10 bg-gradient-to-br from-background to-secondary/5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-medium flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-full">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
            </div>
            {report.title} - {formatDate(report.date)}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Based on {report.source || "imported"} financial data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/5" onClick={onDownload}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/5" onClick={onShare}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/5" onClick={onPrint}>
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {report.charts.includes('pie-chart') && (
          <div className="h-32 bg-muted/20 rounded-md flex items-center justify-center border border-border/50 hover:border-primary/20 transition-colors">
            <PieChart className="h-16 w-16 text-primary/30" />
          </div>
        )}
        {report.charts.includes('bar-chart') && (
          <div className="h-20 bg-muted/20 rounded-md flex items-center justify-center border border-border/50 hover:border-primary/20 transition-colors">
            <BarChart3 className="h-10 w-10 text-primary/30" />
          </div>
        )}
        {report.charts.includes('line-chart') && (
          <div className="grid grid-cols-2 gap-2">
            <div className="h-16 bg-muted/20 rounded-md border border-border/50 hover:border-primary/20 transition-colors"></div>
            <div className="h-16 bg-muted/20 rounded-md border border-border/50 hover:border-primary/20 transition-colors"></div>
          </div>
        )}
        <div className="mt-4 pt-3 border-t">
          <h4 className="text-sm font-medium mb-2">Key Findings</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {report.data.insights.map((insight: string, i: number) => (
              <li key={i} className="flex items-start p-2 hover:bg-muted/20 rounded-md transition-colors">
                <span className="mr-2 text-primary">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
