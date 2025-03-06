
import { Button } from "@/components/ui/button";
import { Download, Share2, Printer, PieChart, BarChart3 } from "lucide-react";
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
    <div className="border rounded-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">{report.title} - {formatDate(report.date)}</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onShare}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onPrint}>
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {report.charts.includes('pie-chart') && (
          <div className="h-32 bg-muted/40 rounded-md flex items-center justify-center">
            <PieChart className="h-16 w-16 text-muted-foreground/50" />
          </div>
        )}
        {report.charts.includes('bar-chart') && (
          <div className="h-20 bg-muted/40 rounded-md flex items-center justify-center">
            <BarChart3 className="h-10 w-10 text-muted-foreground/50" />
          </div>
        )}
        {report.charts.includes('line-chart') && (
          <div className="grid grid-cols-2 gap-2">
            <div className="h-16 bg-muted/40 rounded-md"></div>
            <div className="h-16 bg-muted/40 rounded-md"></div>
          </div>
        )}
        <div className="mt-4 pt-3 border-t">
          <h4 className="text-sm font-medium mb-2">Key Findings</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {report.data.insights.map((insight: string, i: number) => (
              <li key={i} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
